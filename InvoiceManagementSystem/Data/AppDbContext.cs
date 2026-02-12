using InvoiceManagementSystem.Entities;
using Microsoft.EntityFrameworkCore;

namespace InvoiceManagementSystem.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<UserEntity> Users => Set<UserEntity>();
    public DbSet<CustomerEntity> Customers => Set<CustomerEntity>();
    public DbSet<InvoiceEntity> Invoices => Set<InvoiceEntity>();
    public DbSet<InvoiceDetailEntity> InvoiceDetails => Set<InvoiceDetailEntity>();
    public DbSet<InvoicePaymentEntity> InvoicePayments => Set<InvoicePaymentEntity>();
    public DbSet<InvoiceCreditNoteEntity> CreditNotes => Set<InvoiceCreditNoteEntity>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // UserEntity
        modelBuilder.Entity<UserEntity>(entity =>
        {
            entity.HasIndex(e => e.Username).IsUnique();
        });

        // InvoiceEntity relationships
        modelBuilder.Entity<InvoiceEntity>(entity =>
        {
            entity.HasOne(e => e.Customer)
                  .WithMany()
                  .HasForeignKey(e => e.CustomerRun)
                  .OnDelete(DeleteBehavior.Restrict);

            entity.HasMany(e => e.Details)
                  .WithOne(d => d.Invoice)
                  .HasForeignKey(d => d.InvoiceNumber)
                  .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(e => e.Payment)
                  .WithOne(p => p.Invoice)
                  .HasForeignKey<InvoicePaymentEntity>(p => p.InvoiceNumber)
                  .OnDelete(DeleteBehavior.Cascade);

            entity.HasMany(e => e.CreditNotes)
                  .WithOne(cn => cn.Invoice)
                  .HasForeignKey(cn => cn.InvoiceNumber)
                  .OnDelete(DeleteBehavior.Cascade);
        });
    }
}