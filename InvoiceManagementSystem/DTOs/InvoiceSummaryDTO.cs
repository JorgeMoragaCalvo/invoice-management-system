using InvoiceManagementSystem.Entities;

namespace InvoiceManagementSystem.DTOs;

public class InvoiceSummaryDTO
{
    public int Number { get; set; }
    public DateOnly Date { get; set; }
    public string Status { get; set; } = string.Empty;
    public int TotalAmount { get; set; }
    public int DaysToDue { get; set; }
    public DateOnly PaymentDueDate { get; set; }
    public string PaymentStatus { get; set; } = string.Empty;

    public static InvoiceSummaryDTO FromEntity(InvoiceEntity entity)
    {
        return new InvoiceSummaryDTO
        {
            Number = entity.Number,
            Date = entity.Date,
            Status = entity.Status,
            TotalAmount = entity.TotalAmount,
            DaysToDue = entity.DaysToDue,
            PaymentDueDate = entity.PaymentDueDate,
            PaymentStatus = entity.PaymentStatus
        };
    }
}