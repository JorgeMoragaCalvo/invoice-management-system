using System.Text;
using System.Text.Json.Serialization;
using InvoiceManagementSystem.Data;
using InvoiceManagementSystem.Security;
using InvoiceManagementSystem.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;

var builder = WebApplication.CreateBuilder(args);

// --- Database (SQLite) ---
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection")));

// --- Services (DI registration) ---
builder.Services.AddSingleton<JwtService>();
builder.Services.AddScoped<InvoiceService>();
builder.Services.AddScoped<InvoiceLoadService>();
builder.Services.AddScoped<CreditNoteService>();
builder.Services.AddScoped<ReportService>();

// --- Data Seeder (runs on startup) ---
builder.Services.AddHostedService<DataSeeder>();

var jwtSecret = builder.Configuration["Jwt:Secret"]!;
var keyBytes = Convert.FromBase64String(jwtSecret);

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = false,
        ValidateAudience = false,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(keyBytes),
        ClockSkew = TimeSpan.Zero
    };
});

builder.Services.AddAuthorization();

// --- Controllers + JSON ---
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
        options.JsonSerializerOptions.DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull;
    });

// --- Swagger with JWT support ---
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "Invoice Management System API",
        Version = "1.0"
    });

    // Include XML comments in Swagger (reads /// <summary>, <remarks>, <response> tags)
    var xmlFilename = $"{System.Reflection.Assembly.GetExecutingAssembly().GetName().Name}.xml";
    options.IncludeXmlComments(Path.Combine(AppContext.BaseDirectory, xmlFilename));

    options.AddSecurityDefinition("bearerAuth", new OpenApiSecurityScheme
    {
        Type = SecuritySchemeType.Http,
        Scheme = "bearer",
        BearerFormat = "JWT",
        Description = "Enter your JWT token"
    });

    options.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "bearerAuth"
                }
            },
            Array.Empty<string>()
        }
    });
});

// --- File upload size limit (10MB) ---
builder.WebHost.ConfigureKestrel(options =>
{
    options.Limits.MaxRequestBodySize = 10 * 1024 * 1024;
});

var app = builder.Build();

// --- Middleware pipeline ---
app.UseSwagger();
app.UseSwaggerUI();

app.UseAuthentication();
app.UseAuthorization();

// --- Global exception handler for ArgumentException (like Java @ExceptionHandler) ---
app.Use(async (context, next) =>
{
    try
    {
        await next();
    }
    catch (ArgumentException ex)
    {
        context.Response.StatusCode = StatusCodes.Status400BadRequest;
        context.Response.ContentType = "application/json";
        await context.Response.WriteAsJsonAsync(new { error = ex.Message });
    }
});

app.MapControllers();

app.Run();