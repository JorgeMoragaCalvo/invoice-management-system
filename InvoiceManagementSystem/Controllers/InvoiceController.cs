using InvoiceManagementSystem.DTOs;
using InvoiceManagementSystem.Entities;
using InvoiceManagementSystem.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace InvoiceManagementSystem.Controllers;

[ApiController]
[Route("invoices")]
[Authorize]
[Tags("Invoices")]
public class InvoiceController : ControllerBase
{
    private readonly InvoiceService _invoiceService;
    private readonly InvoiceLoadService _invoiceLoadService;
    private readonly CreditNoteService _creditNoteService;

    public InvoiceController(
        InvoiceService invoiceService,
        InvoiceLoadService invoiceLoadService,
        CreditNoteService creditNoteService)
    {
        _invoiceService = invoiceService;
        _invoiceLoadService = invoiceLoadService;
        _creditNoteService = creditNoteService;
    }

    /// <summary>
    /// Load invoices from JSON file
    /// </summary>
    /// <remarks>
    /// Uploads a JSON file containing invoices, validates them, and populates the database.
    /// Performs consistency checks, calculates invoice status and payment status automatically.
    /// </remarks>
    /// <response code="200">Invoices loaded successfully</response>
    /// <response code="400">Invalid file or JSON parsing error</response>
    [HttpPost("load")]
    [ProducesResponseType(typeof(LoadResultDTO), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> LoadInvoices(IFormFile file)
    {
        if (file == null || file.Length == 0)
        {
            return BadRequest();
        }

        try
        {
            using var stream = file.OpenReadStream();
            var result = await _invoiceLoadService.LoadFromFile(stream);
            return Ok(result);
        }
        catch (Exception)
        {
            return BadRequest();
        }
    }

    /// <summary>
    /// Create a single invoice
    /// </summary>
    /// <remarks>Creates a new invoice in the database</remarks>
    /// <response code="200">Invoice created successfully</response>
    [HttpPost]
    [ProducesResponseType(typeof(InvoiceEntity), StatusCodes.Status200OK)]
    public async Task<IActionResult> CreateInvoice([FromBody] InvoiceEntity invoiceEntity)
    {
        var created = await _invoiceService.CreateInvoice(invoiceEntity);
        return Ok(created);
    }

    /// <summary>
    /// Get an invoice by number
    /// </summary>
    /// <remarks>Get an invoice from database</remarks>
    /// <response code="200">Return invoice successfully</response>
    [HttpGet("{number:int}")]
    [ProducesResponseType(typeof(InvoiceEntity), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetInvoice(int number)
    {
        var invoice = await _invoiceService.GetInvoiceByNumber(number);
        return Ok(invoice);
    }

    /// <summary>
    /// Get an invoices by status (Issued, Partial, Cancelled)
    /// </summary>
    /// <remarks>Get an invoice by status from database</remarks>
    /// <param name="status">Invoice status (Issued, Partial, Cancelled)</param>
    /// <response code="200">Return invoice successfully</response>
    [HttpGet("status/{status}")]
    [ProducesResponseType(typeof(List<InvoiceSummaryDTO>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetInvoiceByStatus(string status)
    {
        var invoices = await _invoiceService.GetInvoiceByStatus(status);
        return Ok(invoices);
    }

    /// <summary>
    /// Get an invoices by payment status (Pending, Paid, Overdue)
    /// </summary>
    /// <remarks>Get an invoice by payment status from database</remarks>
    /// <param name="payment">Payment status (Pending, Paid, Overdue)</param>
    /// <response code="200">Return invoice successfully</response>
    [HttpGet("payment/{payment}")]
    [ProducesResponseType(typeof(List<InvoiceSummaryDTO>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetInvoiceByPayment(string payment)
    {
        var invoices = await _invoiceService.GetInvoiceByPayment(payment);
        return Ok(invoices);
    }

    /// <summary>
    /// Add a credit note to an invoice
    /// </summary>
    /// <remarks>
    /// Creates a credit note for the specified invoice.
    /// The CN number is auto-generated and the date is set to today.
    /// </remarks>
    /// <response code="201">Credit note created successfully</response>
    /// <response code="400">Invalid request or amount exceeds balance</response>
    [HttpPost("{invoiceNumber:int}/credit-notes")]
    [ProducesResponseType(typeof(InvoiceCreditNoteEntity), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> AddCreditNote(int invoiceNumber, [FromBody] CreditNoteCreateDTO dto)
    {
        var created = await _creditNoteService.AddCreditNote(invoiceNumber, dto);
        return StatusCode(StatusCodes.Status201Created, created);
    }

    /// <summary>
    /// Get all consistent invoices
    /// </summary>
    [HttpGet("")]
    [ProducesResponseType(typeof(List<InvoiceSummaryDTO>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetAllInvoices()
    {
        var invoices = await _invoiceService.GetAllInvoices();
        return Ok(invoices);
    }
}