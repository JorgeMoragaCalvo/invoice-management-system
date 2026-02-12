using System.Text.Json.Serialization;

namespace InvoiceManagementSystem.DTOs;

public class InvoicePaymentDTO
{
    [JsonPropertyName("payment_method")]
    public string? PaymentMethod { get; set; }

    [JsonPropertyName("payment_date")]
    public string? PaymentDate { get; set; }
}