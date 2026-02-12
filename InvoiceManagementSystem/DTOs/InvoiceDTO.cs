using System.Text.Json.Serialization;

namespace InvoiceManagementSystem.DTOs;

public class InvoiceDTO
{
    [JsonPropertyName("invoice_number")]
    public int InvoiceNumber { get; set; }

    [JsonPropertyName("invoice_date")]
    public string InvoiceDate { get; set; } = string.Empty;

    [JsonPropertyName("invoice_status")]
    public string? InvoiceStatus { get; set; }

    [JsonPropertyName("total_amount")]
    public int TotalAmount { get; set; }

    [JsonPropertyName("days_to_due")]
    public int DaysToDue { get; set; }

    [JsonPropertyName("payment_due_date")]
    public string PaymentDueDate { get; set; } = string.Empty;

    [JsonPropertyName("payment_status")]
    public string? PaymentStatus { get; set; }

    [JsonPropertyName("invoice_detail")]
    public List<InvoiceDetailDTO>? InvoiceDetail { get; set; }

    [JsonPropertyName("invoice_payment")]
    public InvoicePaymentDTO? InvoicePayment { get; set; }

    [JsonPropertyName("invoice_credit_note")]
    public List<InvoiceCreditNoteDTO>? InvoiceCreditNote { get; set; }

    [JsonPropertyName("customer")]
    public CustomerDTO Customer { get; set; } = null!;
}