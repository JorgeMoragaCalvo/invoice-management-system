using ManagementSystem.DTOs;
using InvoiceManagementSystem.Entities;
using InvoiceManagementSystem.Data;
using Microsoft.EntityFrameworkCore;

namespace InvoiceManagementSystem.Services;

public class CreditNoteService
{
    private readonly AppDbContext _context;

    public CreditNoteService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<InvoiceCreditNoteEntity> AddCreditNote(int invoiceNumber, CreditNoteCreateDTO dto)
    {
        var invoice = await _context.Invoices
            .FirstOrDefaultAsync(i => i.Number == invoiceNumber && i.Consistent);

        if (invoice == null)
        {
            throw new ArgumentException($"Invoice not found: {invoiceNumber}");
        }

        if (dto.Amount == null || dto.Amount <= 0)
        {
            throw new ArgumentException("Credit note amount must be positive");
        }

        int existingCreditSum = await _context.CreditNotes
            .Where(cn => cn.InvoiceNumber == invoiceNumber)
            .SumAsync(cn => (int?)cn.Amount) ?? 0;

        int outstandingBalance = invoice.TotalAmount - existingCreditSum;

        if (dto.Amount > outstandingBalance)
        {
            throw new ArgumentException(
                $"Credit note amount ({dto.Amount}) exceeds outstanding balance ({outstandingBalance})");
        }

        int maxNumber = await _context.CreditNotes.MaxAsync(cn => (int?)cn.Number) ?? 0;
        int newNumber = maxNumber + 1;

        var creditNote = new InvoiceCreditNoteEntity
        {
            Number = newNumber,
            Date = DateOnly.FromDateTime(DateTime.Today),
            Amount = dto.Amount.Value,
            InvoiceNumber = invoiceNumber,
            Invoice = invoice
        };

        _context.CreditNotes.Add(creditNote);

        // Recalculate invoice status
        int newTotalCredit = existingCreditSum + dto.Amount.Value;
        invoice.Status = newTotalCredit >= invoice.TotalAmount ? "Cancelled" : "Partial";

        await _context.SaveChangesAsync();

        return creditNote;
    }
}