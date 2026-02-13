export default function InvoiceFilters({
  searchNumber, onSearchChange,
  filterStatus, onStatusChange,
  filterPayment, onPaymentChange,
  onClear, resultCount,
}) {
  const hasFilters = searchNumber || filterStatus || filterPayment;

  return (
    <div className="flex gap-3 flex-wrap items-center">
      <input
        type="text"
        placeholder="Buscar por numero..."
        value={searchNumber}
        onChange={(e) => onSearchChange(e.target.value)}
        className="w-52 px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
      />
      <select
        value={filterStatus}
        onChange={(e) => onStatusChange(e.target.value)}
        className="px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-700 bg-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
      >
        <option value="">Estado factura</option>
        <option value="Issued">Issued</option>
        <option value="Partial">Partial</option>
        <option value="Cancelled">Cancelled</option>
      </select>
      <select
        value={filterPayment}
        onChange={(e) => onPaymentChange(e.target.value)}
        className="px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-700 bg-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
      >
        <option value="">Estado de pago</option>
        <option value="Pending">Pending</option>
        <option value="Overdue">Overdue</option>
        <option value="Paid">Paid</option>
      </select>
      {hasFilters && (
        <button
          onClick={onClear}
          className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors"
        >
          Limpiar filtros
        </button>
      )}
      <span className="text-xs text-slate-500 font-medium ml-auto">{resultCount} resultado(s)</span>
    </div>
  );
}
