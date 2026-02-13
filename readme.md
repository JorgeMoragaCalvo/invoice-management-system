# Invoice Management System

Aplicación integral de gestión de facturas desarrollada con **ASP.NET Core 8** (backend) y **React + Vite** (frontend). Este sistema permite a los usuarios gestionar facturas, crear notas de crédito y generar informes con autenticación JWT.

## 🏗️ Architecture & Design Patterns
La aplicación sigue una **arquitectura en capas** limpia con una clara separación de preocupaciones:
### **Controller Layer**
RESTful API controllers handle HTTP requests and responses:
- `AuthController` - Authentication and authorization
- `InvoiceController` - Invoice management operations
- `ReportController` - Report generation endpoints

### **Service Layer**
Business logic is encapsulated in dedicated service classes:
- `InvoiceService` - Invoice CRUD operations
- `InvoiceLoadService` - Bulk invoice loading from JSON files
- `CreditNoteService` - Credit note management
- `ReportService` - Report generation and analytics
- `JwtService` - JWT token generation and validation

### **Data Access Layer**
Entity Framework Core provides ORM capabilities:
- **`AppDbContext`** - Database context managing all entities
- **Entities** - Domain models (`InvoiceEntity`, `UserEntity`, `CreditNoteEntity`, etc.)
- **Database Views** - Optimized views for reporting

### **Dependency Injection**
Todos los servicios están registrados en el contenedor DI para un acoplamiento flexible y capacidad de prueba:
```csharp
builder.Services.AddSingleton<JwtService>();
builder.Services.AddScoped<InvoiceService>();
builder.Services.AddScoped<InvoiceLoadService>();
builder.Services.AddScoped<CreditNoteService>();
builder.Services.AddScoped<ReportService>();
```

### **Security**
JWT-based authentication with Bearer token authorization:
- Token-based API authentication
- BCrypt password hashing
- Protected endpoints with `[Authorize]` attribute

### **Configuration Management**
Application settings managed through `appsettings.json`:
- Database connection strings
- JWT configuration
- Logging levels

### **Data Seeding**
Automatic database initialization on startup:
- Database schema creation
- Admin user seeding
- Database views for reporting

---

## 🛠️ Technology Stack

### **Backend**
- **ASP.NET Core 8** – Web API framework
- **Entity Framework Core** - ORM with SQLite
- **JWT Authentication** – Secure API access
- **BCrypt.Net** – Password hashing
- **Swagger/OpenAPI** - API documentation

### **Frontend**
- **React 19** – UI library
- **Vite** – Fast build tool and dev server
- **React Router** - Client-side routing
- **Axios** - HTTP client with interceptors
- **Tailwind CSS** - Utility-first CSS framework

---

## 📋 Prerrequisitos

- **.NET 8 SDK** - [Download here](https://dotnet.microsoft.com/download/dotnet/8.0)
- **Node.js 18+** - [Download here](https://nodejs.org/)
- **npm** or **yarn** - Package manager

---


## 🚀 Instalación & Setup

### **1. Clone the Repository**

```bash
git clone https://github.com/JorgeMoragaCalvo/invoice-management-system.git
cd invoice-management-system
```

### **2. Backend Setup (ASP.NET Core)**

Navegar hasta el directorio backend y restaurar las dependencias:

```bash
cd InvoiceManagementSystem
dotnet restore
```

Ejecutar la aplicación:

```bash
dotnet run
```

The backend API will start at **`http://localhost:5165`**

#### What happens on first run:
- SQLite database (`invoices.db`) is automatically created
- Database tables and views are initialized
- Admin user is seeded with default credentials

### **3. Frontend Setup (React)**

Navigate to the frontend directory:

```bash
cd client-app
```

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

The frontend will start at **`http://localhost:5173`**

---

## 🔐 Credenciales

Para acceder, usar las siguientes credenciales:

```
Username: admin
Password: admin123
```

Luego, acceder al `dashboard` e ingresar el archivo `.json`.

---

## 📡 API Endpoints

### **Authentication**
- `POST /auth/login` - Login and receive JWT token
- `GET /auth/validate` - Validate current JWT token

### **Invoices**
- `GET /invoices/` - Get all invoices
- `GET /invoices/{number}` - Get invoice by number
- `GET /invoices/status/{status}` - Filter by status (Issued, Partial, Cancelled)
- `GET /invoices/payment/{payment}` - Filter by payment status (Pending, Paid, Overdue)
- `POST /invoices` - Create a new invoice
- `POST /invoices/load` - Bulk load invoices from JSON file
- `POST /invoices/{number}/credit-notes` - Create credit note for an invoice

### **Reports**
- `GET /invoices/reports/overdue` - Invoices overdue by more than 30 days
- `GET /invoices/reports/payment-summary` - Payment status statistics
- `GET /invoices/reports/inconsistent` - Invoices with data inconsistencies

**Interactive API Documentation:** Visit `http://localhost:5165/swagger` for Swagger UI

---

## 🗂️ Project Structure

```diagram
invoice-management-system/
├── InvoiceManagementSystem/          # Backend (ASP.NET Core)
│   ├── Controllers/                   # API endpoints
│   ├── Services/                      # Business logic
│   ├── Data/                          # Database context and seeding
│   ├── Entities/                      # Database models
│   ├── DTOs/                          # Data Transfer Objects
│   ├── Security/                      # Authentication & authorization
│   ├── Program.cs                     # Application entry point
│   └── appsettings.json               # Configuration settings
│
├── client-app/                        # Frontend (React + Vite)
│   ├── src/
│   │   ├── components/                # Reusable React components
│   │   ├── pages/                     # Page components
│   │   ├── api/                       # API client services
│   │   ├── auth/                      # Authentication context
│   │   └── utils/                     # Utility functions
│   ├── package.json                   # Dependencies
│   └── vite.config.js                 # Vite configuration
│
└── README.md
```

---

## 💻 Development

### **Backend Development**

```bash
cd InvoiceManagementSystem

# Run with hot reload
dotnet watch run

# Build the project
dotnet build

# Run in production mode
dotnet run --configuration Release
```

### **Frontend Development**

```bash
cd client-app

# Start development server with hot reload
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linter
npm run lint
```

---

## 🗄️ Database

- **Type:** SQLite
- **File:** `invoices.db` (auto-created in backend directory)
- **Initialization:** Automatic on first startup via `DataSeeder`
- **Views:** Optimized database views for reporting:
    - `v_invoices_by_status` - Consistent invoices grouped by status
    - `v_invoices_by_payment` - Invoices grouped by payment status
    - `v_overdue_report` - Overdue invoices without payment/credit notes
    - `v_inconsistent_invoices` - Invoices with data inconsistencies
    - `v_payment_status_summary` - Payment statistics with percentages

---

## 🎯 Features

- ✅ **User Authentication** – Secure JWT-based login
- ✅ **Invoice Management** – Create, view, and filter invoices
- ✅ **Bulk Import** – Load multiple invoices from JSON files
- ✅ **Credit Notes** – Create credit notes for invoices
- ✅ **Reports & Analytics** – Payment summaries and overdue reports
- ✅ **Data Validation** - Automatic consistency checks
- ✅ **Responsive UI** - Modern, mobile-friendly interface
- ✅ **API Documentation** – Interactive Swagger/OpenAPI docs

---

