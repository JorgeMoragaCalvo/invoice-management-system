using System.Text.Json.Serialization;

namespace InvoiceManagementSystem.DTOs;

public class InvoiceFileDTO
{
    [JsonPropertyName("invoices")]
    public List<InvoiceDTO> Invoices { get; set; } = new();
}