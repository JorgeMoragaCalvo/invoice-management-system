using InvoiceManagementSystem.DTOs;
using InvoiceManagementSystem.Entities;
using InvoiceManagementSystem.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace InvoiceManagementSystem.Controllers;

[ApiController]
[Route("invoices/reports")]
[Authorize]
[Tags("Reports")]
public class ReportController : ControllerBase
{
    private readonly ReportService _reportService;

    public ReportController(ReportService reportService)
    {
        _reportService = reportService;
    }

    /// <summary>
    /// Get overdue invoices report
    /// </summary>
    /// <remarks>
    /// Returns consistent invoices more than 30 days overdue without payment or credit notes
    /// </remarks>
    /// <response code="200">Report generated successfully</response>
    [HttpGet("overdue")]
    [ProducesResponseType(typeof(List<InvoiceEntity>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetOverdueReport()
    {
        var result = await _reportService.GetOverdueReport();
        return Ok(result);
    }

    /// <summary>
    /// Get payment status summary (count and percentage by status)
    /// </summary>
    /// <remarks>
    /// Returns count and percentage of invoices grouped by payment status (Paid, Pending, Overdue)
    /// </remarks>
    /// <response code="200">Summary generated successfully</response>
    [HttpGet("payment-summary")]
    [ProducesResponseType(typeof(List<PaymentStatusSummaryDTO>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetPaymentStatusSummary()
    {
        var result = await _reportService.GetPaymentStatusSummary();
        return Ok(result);
    }

    /// <summary>
    /// Get inconsistent invoices report
    /// </summary>
    /// <remarks>
    /// Returns all invoices where the total amount does not match the sum of product subtotals
    /// </remarks>
    /// <response code="200">Report generated successfully</response>
    [HttpGet("inconsistent")]
    [ProducesResponseType(typeof(List<InvoiceEntity>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetInconsistentReport()
    {
        var result = await _reportService.GetInconsistentReport();
        return Ok(result);
    }
}