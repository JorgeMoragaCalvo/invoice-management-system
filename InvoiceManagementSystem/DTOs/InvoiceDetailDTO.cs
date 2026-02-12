using System.Text.Json.Serialization;

namespace InvoiceManagementSystem.DTOs;

public class InvoiceDetailDTO
{
    [JsonPropertyName("product_name")]
    public string ProductName { get; set; } = string.Empty;

    [JsonPropertyName("unit_price")]
    public int UnitPrice { get; set; }

    [JsonPropertyName("quantity")]
    public int Quantity { get; set; }

    [JsonPropertyName("subtotal")]
    public int Subtotal { get; set; }
}