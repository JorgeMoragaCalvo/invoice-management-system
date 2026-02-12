using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace InvoiceManagementSystem.Entities;

[Table("invoice_detail")]
public class InvoiceDetailEntity
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public long Id { get; set; }

    [Required]
    [MaxLength(100)]
    public string ProductName { get; set; } = string.Empty;

    [Required]
    public int UnitPrice { get; set; }

    [Required]
    public int Quantity { get; set; }

    [Required]
    public int SubTotal { get; set; }

    // Foreign key
    [Required]
    public int InvoiceNumber { get; set; }

    [ForeignKey("InvoiceNumber")]
    [JsonIgnore]
    public InvoiceEntity Invoice { get; set; } = null!;
}