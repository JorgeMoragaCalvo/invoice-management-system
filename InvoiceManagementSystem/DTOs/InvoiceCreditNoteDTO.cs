using System.Text.Json.Serialization;

namespace InvoiceManagementSystem.DTOs;

public class InvoiceCreditNoteDTO
{
    [JsonPropertyName("credit_note_number")]
    public int CreditNoteNumber { get; set; }

    [JsonPropertyName("credit_note_date")]
    public string CreditNoteDate { get; set; } = string.Empty;

    [JsonPropertyName("credit_note_amount")]
    public int CreditNoteAmount { get; set; }
}