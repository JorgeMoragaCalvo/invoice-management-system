using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace InvoiceManagementSystem.Entities;

[Table("invoice_payment")]
public class InvoicePaymentEntity
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public long Id { get; set; }

    [MaxLength(50)]
    public string? PaymentMethod { get; set; }

    public DateOnly? PaymentDate { get; set; }

    // Foreign key
    [Required]
    public int InvoiceNumber { get; set; }

    [ForeignKey("InvoiceNumber")]
    [JsonIgnore]
    public InvoiceEntity Invoice { get; set; } = null!;
}