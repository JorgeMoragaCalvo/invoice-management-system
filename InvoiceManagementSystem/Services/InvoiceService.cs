using InvoiceManagementSystem.Data;
using InvoiceManagementSystem.DTOs;
using InvoiceManagementSystem.Entities;
using Microsoft.EntityFrameworkCore;

namespace InvoiceManagementSystem.Services;

public class InvoiceService
{
    private static readonly HashSet<string> ValidStatuses = new() { "Issued", "Partial", "Cancelled" };
    private static readonly HashSet<string> ValidPaymentStatuses = new() { "Pending", "Paid", "Overdue" };

    private readonly AppDbContext _context;

    public InvoiceService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<InvoiceEntity> CreateInvoice(InvoiceEntity invoiceEntity)
    {
        _context.Invoices.Add(invoiceEntity);
        await _context.SaveChangesAsync();
        return invoiceEntity;
    }

    public async Task<InvoiceEntity?> GetInvoiceByNumber(int number)
    {
        if (number < 1 || number > 50)
        {
            throw new ArgumentException("Invoice number must be between 1 and 50");
        }

        return await _context.Invoices
            .Include(i => i.Customer)
            .Include(i => i.Details)
            .Include(i => i.Payment)
            .Include(i => i.CreditNotes)
            .FirstOrDefaultAsync(i => i.Number == number && i.Consistent);
    }

    public async Task<List<InvoiceSummaryDTO>> GetInvoiceByStatus(string status)
    {
        var normalized = char.ToUpper(status[0]) + status[1..].ToLower();
        if (!ValidStatuses.Contains(normalized))
        {
            throw new ArgumentException(
                $"Invalid status: {status}. Must be one of: {string.Join(", ", ValidStatuses)}");
        }

        var invoices = await _context.Invoices
            .Where(i => i.Status == normalized && i.Consistent)
            .ToListAsync();

        return invoices.Select(InvoiceSummaryDTO.FromEntity).ToList();
    }

    public async Task<List<InvoiceSummaryDTO>> GetInvoiceByPayment(string payment)
    {
        var normalized = char.ToUpper(payment[0]) + payment[1..].ToLower();
        if (!ValidPaymentStatuses.Contains(normalized))
        {
            throw new ArgumentException(
                $"Invalid payment status: {payment}. Must be one of: {string.Join(", ", ValidPaymentStatuses)}");
        }

        var invoices = await _context.Invoices
            .Where(i => i.PaymentStatus == normalized && i.Consistent)
            .ToListAsync();

        return invoices.Select(InvoiceSummaryDTO.FromEntity).ToList();
    }

    public async Task<List<InvoiceSummaryDTO>> GetAllInvoices()
    {
        var invoices = await _context.Invoices
            .Where(i => i.Consistent)
            .ToListAsync();

        return invoices.Select(InvoiceSummaryDTO.FromEntity).ToList();
    }
}