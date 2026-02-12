using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace InvoiceManagementSystem.Entities;

[Table("invoice")]
public class InvoiceEntity
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.None)]
    public int Number { get; set; }

    [Required]
    public DateOnly Date { get; set; }

    [Required]
    [MaxLength(20)]
    public string Status { get; set; } = string.Empty;

    [Required]
    public int TotalAmount { get; set; }

    [Required]
    public int DaysToDue { get; set; }

    [Required]
    public DateOnly PaymentDueDate { get; set; }

    [Required]
    [MaxLength(20)]
    public string PaymentStatus { get; set; } = string.Empty;

    [Required]
    public bool Consistent { get; set; } = true;

    // Foreign key
    [Required]
    public string CustomerRun { get; set; } = string.Empty;

    // Navigation properties
    [ForeignKey("CustomerRun")]
    public CustomerEntity Customer { get; set; } = null!;

    public List<InvoiceDetailEntity> Details { get; set; } = new();

    public InvoicePaymentEntity? Payment { get; set; }

    public List<InvoiceCreditNoteEntity> CreditNotes { get; set; } = new();
}