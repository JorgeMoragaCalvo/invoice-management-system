using InvoiceManagementSystem.Data;
using InvoiceManagementSystem.Entities;
using Microsoft.EntityFrameworkCore;

namespace InvoiceManagementSystem.Security;

public class DataSeeder : IHostedService
{
    private readonly IServiceProvider _serviceProvider;

    public DataSeeder(IServiceProvider serviceProvider)
    {
        _serviceProvider = serviceProvider;
    }

    public async Task StartAsync(CancellationToken cancellationToken)
    {
        using var scope = _serviceProvider.CreateScope();
        var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();

        // Create tables (equivalent to create-drop in dev)
        await context.Database.EnsureCreatedAsync(cancellationToken);

        // Create database views (equivalent to data.sql)
        await CreateViews(context);

        // Seed admin user
        await SeedAdminUser(context);
    }

    public Task StopAsync(CancellationToken cancellationToken) => Task.CompletedTask;

    private static async Task CreateViews(AppDbContext context)
    {
        // SQLite uses DROP VIEW IF EXISTS + CREATE VIEW (no CREATE OR REPLACE)
        // SQLite uses date() instead of INTERVAL for date arithmetic
        var statements = new[]
        {
            @"DROP VIEW IF EXISTS v_invoices_by_status",
            @"CREATE VIEW v_invoices_by_status AS
              SELECT number, date, status, total_amount, days_to_due,
                     payment_due_date, payment_status, consistent, customer_run
              FROM invoice
              WHERE consistent = 1",

            @"DROP VIEW IF EXISTS v_invoices_by_payment",
            @"CREATE VIEW v_invoices_by_payment AS
              SELECT number, date, status, total_amount, days_to_due,
                     payment_due_date, payment_status, consistent, customer_run
              FROM invoice
              WHERE consistent = 1",

            @"DROP VIEW IF EXISTS v_overdue_report",
            @"CREATE VIEW v_overdue_report AS
              SELECT i.number, i.date, i.status, i.total_amount, i.days_to_due,
                     i.payment_due_date, i.payment_status, i.customer_run
              FROM invoice i
              LEFT JOIN invoice_payment p ON p.invoice_number = i.number
              LEFT JOIN credit_note cn ON cn.invoice_number = i.number
              WHERE i.consistent = 1
                AND i.payment_due_date < date('now', '-30 days')
                AND p.payment_date IS NULL
                AND cn.invoice_number IS NULL",

            @"DROP VIEW IF EXISTS v_inconsistent_invoices",
            @"CREATE VIEW v_inconsistent_invoices AS
              SELECT number, date, status, total_amount, days_to_due,
                     payment_due_date, payment_status, customer_run
              FROM invoice
              WHERE consistent = 0",

            @"DROP VIEW IF EXISTS v_payment_status_summary",
            @"CREATE VIEW v_payment_status_summary AS
              SELECT payment_status,
                     COUNT(*) AS invoice_count,
                     ROUND(COUNT(*) * 100.0 / MAX((SELECT COUNT(*) FROM invoice WHERE consistent = 1), 1), 2) AS percentage
              FROM invoice
              WHERE consistent = 1
              GROUP BY payment_status"
        };

        foreach (var sql in statements)
        {
            await context.Database.ExecuteSqlRawAsync(sql);
        }
    }

    private static async Task SeedAdminUser(AppDbContext context)
    {
        var adminExists = await context.Users.AnyAsync(u => u.Username == "admin");
        if (!adminExists)
        {
            var admin = new UserEntity
            {
                Username = "admin",
                Password = BCrypt.Net.BCrypt.HashPassword("admin123")
            };
            context.Users.Add(admin);
            await context.SaveChangesAsync();
        }
    }
}