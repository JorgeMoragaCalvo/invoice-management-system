using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace InvoiceManagementSystem.Entities;

[Table("credit_note")]
public class InvoiceCreditNoteEntity
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.None)]
    public int Number { get; set; }

    [Required]
    public DateOnly Date { get; set; }

    [Required]
    public int Amount { get; set; }

    // Foreign key
    [Required]
    public int InvoiceNumber { get; set; }

    [ForeignKey("InvoiceNumber")]
    [JsonIgnore]
    public InvoiceEntity Invoice { get; set; } = null!;
}