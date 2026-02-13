import { formatCLP, formatDate } from '../../utils/format';

export default function OverdueTable({ invoices }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 mb-5">
      <h3 className="text-sm font-bold text-slate-800 mb-1">Facturas vencidas +30 dias sin pago ni NC</h3>
      <p className="text-xs text-slate-500 mb-3">
        Facturas consistentes con mas de 30 dias de vencimiento.
      </p>

      {invoices.length === 0 ? (
        <p className="text-slate-400 text-sm italic">No hay facturas en esta categoria.</p>
      ) : (
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-red-50">
              {['Numero', 'Cliente', 'Monto', 'Vencimiento'].map((h) => (
                <th key={h} className="px-3 py-2 text-left font-semibold text-red-800 text-xs">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {invoices.map((inv) => (
              <tr key={inv.number} className="border-b border-red-100">
                <td className="px-3 py-2 font-semibold">{inv.number}</td>
                <td className="px-3 py-2 text-slate-600">{inv.customer?.name || '-'}</td>
                <td className="px-3 py-2 font-mono">{formatCLP(inv.totalAmount)}</td>
                <td className="px-3 py-2 text-red-800">{formatDate(inv.paymentDueDate)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
