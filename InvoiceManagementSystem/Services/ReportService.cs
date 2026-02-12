using InvoiceManagementSystem.DTOs;
using InvoiceManagementSystem.Entities;
using InvoiceManagementSystem.Data;
using Microsoft.EntityFrameworkCore;

namespace InvoiceManagementSystem.Services;

public class ReportService
{
    private readonly AppDbContext _context;

    public ReportService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<List<InvoiceEntity>> GetOverdueReport()
    {
        var thresholdDate = DateOnly.FromDateTime(DateTime.Today.AddDays(-30));

        return await _context.Invoices
            .Include(i => i.Customer)
            .Include(i => i.Details)
            .Include(i => i.Payment)
            .Include(i => i.CreditNotes)
            .Where(i => i.Consistent
                && i.PaymentDueDate < thresholdDate
                && (i.Payment == null || i.Payment.PaymentDate == null)
                && !i.CreditNotes.Any())
            .ToListAsync();
    }

    public async Task<List<PaymentStatusSummaryDTO>> GetPaymentStatusSummary()
    {
        // Pure LINQ implementation (no raw SQL needed, works with any DB including SQLite)
        var consistentInvoices = await _context.Invoices
            .Where(i => i.Consistent)
            .ToListAsync();

        int totalCount = consistentInvoices.Count;
        if (totalCount == 0)
        {
            return new List<PaymentStatusSummaryDTO>();
        }

        return consistentInvoices
            .GroupBy(i => i.PaymentStatus)
            .Select(g => new PaymentStatusSummaryDTO(
                g.Key,
                g.Count(),
                Math.Round(g.Count() * 100.0 / totalCount, 2)))
            .ToList();
    }

    public async Task<List<InvoiceEntity>> GetInconsistentReport()
    {
        return await _context.Invoices
            .Include(i => i.Customer)
            .Include(i => i.Details)
            .Include(i => i.Payment)
            .Include(i => i.CreditNotes)
            .Where(i => !i.Consistent)
            .ToListAsync();
    }
}