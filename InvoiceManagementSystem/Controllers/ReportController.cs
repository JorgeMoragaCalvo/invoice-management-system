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
    /// Get overdue invoices report (30+ days overdue, no payment, no credit notes)
    /// </summary>
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
    [HttpGet("inconsistent")]
    [ProducesResponseType(typeof(List<InvoiceEntity>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetInconsistentReport()
    {
        var result = await _reportService.GetInconsistentReport();
        return Ok(result);
    }
}