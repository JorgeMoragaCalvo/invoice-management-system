import { formatCLP } from '../../utils/format';

export default function InconsistentTable({ invoices }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5">
      <h3 className="text-sm font-bold text-slate-800 mb-1">Facturas inconsistentes</h3>
      <p className="text-xs text-slate-500 mb-3">
        Total declarado no coincide con la suma de productos.
      </p>

      {invoices.length === 0 ? (
        <p className="text-slate-400 text-sm italic">No hay facturas inconsistentes.</p>
      ) : (
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-amber-50">
              {['Numero', 'Cliente', 'Monto Declarado'].map((h) => (
                <th key={h} className="px-3 py-2 text-left font-semibold text-amber-800 text-xs">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {invoices.map((inv) => (
              <tr key={inv.number} className="border-b border-amber-100">
                <td className="px-3 py-2 font-semibold">{inv.number}</td>
                <td className="px-3 py-2 text-slate-600">{inv.customer?.name || '-'}</td>
                <td className="px-3 py-2 font-mono">{formatCLP(inv.totalAmount)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}