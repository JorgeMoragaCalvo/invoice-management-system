import Badge from '../shared/Badge';
import { formatCLP, formatDate } from '../../utils/format';

export default function InvoiceTable({ invoices, onViewDetail, onCreateCreditNote }) {
  if (invoices.length === 0) {
    return (
      <p className="text-slate-400 text-sm italic py-8 text-center">
        No se encontraron facturas.
      </p>
    );
  }

  return (
    <div className="card overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200">
            {['Numero', 'Fecha', 'Monto Total', 'Estado', 'Estado Pago', 'Vencimiento', 'Acciones'].map((h) => (
              <th key={h} className="px-4 py-4 text-left font-semibold text-slate-700 text-xs uppercase tracking-wide">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {invoices.map((inv) => (
            <tr key={inv.number} className="border-b border-slate-100 hover:bg-slate-50/70 transition-colors">
              <td className="px-4 py-4">
                <button
                  onClick={() => onViewDetail(inv.number)}
                  className="font-semibold text-blue-600 hover:text-blue-800 hover:underline transition-colors"
                >
                  {inv.number}
                </button>
              </td>
              <td className="px-4 py-4 text-slate-700">{formatDate(inv.date)}</td>
              <td className="px-4 py-4 text-slate-900 font-semibold font-mono">{formatCLP(inv.totalAmount)}</td>
              <td className="px-4 py-4"><Badge label={inv.status} type="status" /></td>
              <td className="px-4 py-4"><Badge label={inv.paymentStatus} type="payment" /></td>
              <td className="px-4 py-4 text-slate-700">{formatDate(inv.paymentDueDate)}</td>
              <td className="px-4 py-4">
                <button
                  onClick={() => onCreateCreditNote(inv)}
                  disabled={inv.status === 'Cancelled'}
                  className="px-3 py-1.5 rounded-lg border border-blue-300 text-xs font-medium text-blue-600 hover:bg-blue-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:border-slate-300 disabled:text-slate-500"
                >
                  + Nota Crédito
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
