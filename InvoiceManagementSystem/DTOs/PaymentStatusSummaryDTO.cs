namespace InvoiceManagementSystem.DTOs;

public class PaymentStatusSummaryDTO
{
    public string PaymentStatus { get; set; } = string.Empty;
    public long Count { get; set; }
    public double Percentage { get; set; }

    public PaymentStatusSummaryDTO(string paymentStatus, long count, double percentage)
    {
        PaymentStatus = paymentStatus;
        Count = count;
        Percentage = percentage;
    }
}