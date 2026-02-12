using System.Text.Json.Serialization;

namespace InvoiceManagementSystem.DTOs;

public class CustomerDTO
{
    [JsonPropertyName("customer_run")]
    public string CustomerRun { get; set; } = string.Empty;

    [JsonPropertyName("customer_name")]
    public string CustomerName { get; set; } = string.Empty;

    [JsonPropertyName("customer_email")]
    public string CustomerEmail { get; set; } = string.Empty;
}