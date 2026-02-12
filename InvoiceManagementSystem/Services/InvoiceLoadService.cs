using System.Text.Json;
using InvoiceManagementSystem.Data;
using InvoiceManagementSystem.DTOs;
using InvoiceManagementSystem.Entities;
using Microsoft.EntityFrameworkCore;

namespace InvoiceManagementSystem.Services;

public class InvoiceLoadService
{
    private readonly AppDbContext _context;

    public InvoiceLoadService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<LoadResultDTO> LoadFromFile(Stream inputStream)
    {
        var fileDto = await JsonSerializer.DeserializeAsync<InvoiceFileDTO>(inputStream);
        if (fileDto?.Invoices == null)
        {
            throw new JsonException("Invalid JSON file format");
        }

        int totalProcessed = 0;
        int loaded = 0;
        int duplicatesSkipped = 0;
        int inconsistentCount = 0;

        using var transaction = await _context.Database.BeginTransactionAsync();

        foreach (var dto in fileDto.Invoices)
        {
            totalProcessed++;

            // Skip duplicates already in DB
            if (await _context.Invoices.AnyAsync(i => i.Number == dto.InvoiceNumber))
            {
                duplicatesSkipped++;
                continue;
            }

            // Map customer (save or reuse existing)
            var customer = await MapCustomer(dto.Customer);

            // Create invoice entity
            var invoice = new InvoiceEntity
            {
                Number = dto.InvoiceNumber,
                Date = DateOnly.Parse(dto.InvoiceDate),
                TotalAmount = dto.TotalAmount,
                DaysToDue = dto.DaysToDue,
                PaymentDueDate = DateOnly.Parse(dto.PaymentDueDate),
                CustomerRun = customer.Run,
                Customer = customer
            };

            // Consistency check
            bool isConsistent = CheckConsistency(dto);
            invoice.Consistent = isConsistent;
            if (!isConsistent)
            {
                inconsistentCount++;
            }

            // Calculate invoice status from credit notes
            invoice.Status = CalculateInvoiceStatus(dto);

            // Calculate payment status
            invoice.PaymentStatus = CalculatePaymentStatus(dto);

            // Map details
            invoice.Details = MapDetails(dto.InvoiceDetail, invoice);

            // Map payment
            invoice.Payment = MapPayment(dto.InvoicePayment, invoice);

            // Map credit notes
            invoice.CreditNotes = MapCreditNotes(dto.InvoiceCreditNote, invoice);

            _context.Invoices.Add(invoice);
            await _context.SaveChangesAsync();
            loaded++;
        }

        await transaction.CommitAsync();

        return new LoadResultDTO(totalProcessed, loaded, duplicatesSkipped, inconsistentCount);
    }

    private async Task<CustomerEntity> MapCustomer(CustomerDTO dto)
    {
        var existing = await _context.Customers.FindAsync(dto.CustomerRun);
        if (existing != null)
        {
            return existing;
        }

        var customer = new CustomerEntity
        {
            Run = dto.CustomerRun,
            Name = dto.CustomerName,
            Email = dto.CustomerEmail
        };
        _context.Customers.Add(customer);
        await _context.SaveChangesAsync();
        return customer;
    }

    private static bool CheckConsistency(InvoiceDTO dto)
    {
        int sumSubtotals = 0;
        if (dto.InvoiceDetail != null)
        {
            foreach (var detail in dto.InvoiceDetail)
            {
                sumSubtotals += detail.Subtotal;
            }
        }
        return sumSubtotals == dto.TotalAmount;
    }

    private static string CalculateInvoiceStatus(InvoiceDTO dto)
    {
        var creditNotes = dto.InvoiceCreditNote;
        if (creditNotes == null || creditNotes.Count == 0)
        {
            return "Issued";
        }

        int totalCreditNoteAmount = 0;
        foreach (var cn in creditNotes)
        {
            totalCreditNoteAmount += cn.CreditNoteAmount;
        }

        if (totalCreditNoteAmount >= dto.TotalAmount)
        {
            return "Cancelled";
        }
        return "Partial";
    }

    private static string CalculatePaymentStatus(InvoiceDTO dto)
    {
        // If the payment date exists -> Paid
        if (dto.InvoicePayment?.PaymentDate != null)
        {
            return "Paid";
        }

        // If payment_due_date is before today -> Overdue
        var dueDate = DateOnly.Parse(dto.PaymentDueDate);
        if (dueDate < DateOnly.FromDateTime(DateTime.Today))
        {
            return "Overdue";
        }

        return "Pending";
    }

    private static List<InvoiceDetailEntity> MapDetails(List<InvoiceDetailDTO>? dtos, InvoiceEntity invoice)
    {
        var entities = new List<InvoiceDetailEntity>();
        if (dtos != null)
        {
            foreach (var dto in dtos)
            {
                entities.Add(new InvoiceDetailEntity
                {
                    ProductName = dto.ProductName,
                    UnitPrice = dto.UnitPrice,
                    Quantity = dto.Quantity,
                    SubTotal = dto.Subtotal,
                    Invoice = invoice
                });
            }
        }
        return entities;
    }

    private static InvoicePaymentEntity MapPayment(InvoicePaymentDTO? dto, InvoiceEntity invoice)
    {
        var entity = new InvoicePaymentEntity { Invoice = invoice };
        if (dto != null)
        {
            entity.PaymentMethod = dto.PaymentMethod;
            if (dto.PaymentDate != null)
            {
                entity.PaymentDate = DateOnly.Parse(dto.PaymentDate);
            }
        }
        return entity;
    }

    private static List<InvoiceCreditNoteEntity> MapCreditNotes(List<InvoiceCreditNoteDTO>? dtos, InvoiceEntity invoice)
    {
        var entities = new List<InvoiceCreditNoteEntity>();
        if (dtos != null)
        {
            foreach (var dto in dtos)
            {
                entities.Add(new InvoiceCreditNoteEntity
                {
                    Number = dto.CreditNoteNumber,
                    Date = DateOnly.Parse(dto.CreditNoteDate),
                    Amount = dto.CreditNoteAmount,
                    Invoice = invoice
                });
            }
        }
        return entities;
    }
}