import { useState, useEffect } from 'react';
import { getInvoiceByNumber } from '../../api/invoices';
import { formatCLP, formatDate } from '../../utils/format';
import Modal from '../shared/Modal';
import Badge from '../shared/Badge';
import LoadingSpinner from '../shared/LoadingSpinner';

export default function InvoiceDetailModal({ invoiceNumber, onClose }) {
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetch() {
      try {
        const data = await getInvoiceByNumber(invoiceNumber);
        setInvoice(data);
      } catch {
        setInvoice(null);
      } finally {
        setLoading(false);
      }
    }
    fetch();
  }, [invoiceNumber]);

  if (loading) {
    return (
      <Modal title="Detalle de Factura" onClose={onClose}>
        <LoadingSpinner />
      </Modal>
    );
  }

  if (!invoice) {
    return (
      <Modal title="Detalle de Factura" onClose={onClose}>
        <p className="text-slate-500 text-sm">Factura no encontrada.</p>
      </Modal>
    );
  }

  return (
    <Modal title={`Factura #${invoice.number}`} subtitle={invoice.customer?.name} onClose={onClose}>
      {/* Summary */}
      <div className="grid grid-cols-2 gap-3 mb-5 text-sm">
        <div>
          <span className="text-slate-500">Fecha:</span>{' '}
          <span className="font-medium">{formatDate(invoice.date)}</span>
        </div>
        <div>
          <span className="text-slate-500">Total:</span>{' '}
          <span className="font-mono font-semibold">{formatCLP(invoice.totalAmount)}</span>
        </div>
        <div>
          <span className="text-slate-500">Estado:</span>{' '}
          <Badge label={invoice.status} type="status" />
        </div>
        <div>
          <span className="text-slate-500">Pago:</span>{' '}
          <Badge label={invoice.paymentStatus} type="payment" />
        </div>
        <div>
          <span className="text-slate-500">Vencimiento:</span>{' '}
          <span className="font-medium">{formatDate(invoice.paymentDueDate)}</span>
        </div>
        <div>
          <span className="text-slate-500">Dias:</span>{' '}
          <span className="font-medium">{invoice.daysToDue}</span>
        </div>
      </div>

      {/* Customer */}
      {invoice.customer && (
        <div className="bg-slate-50 rounded-lg p-3 mb-4 text-sm">
          <p className="font-semibold text-slate-700 mb-1">Cliente</p>
          <p className="text-slate-600">{invoice.customer.name} ({invoice.customer.run})</p>
          <p className="text-slate-500">{invoice.customer.email}</p>
        </div>
      )}

      {/* Details */}
      {invoice.details && invoice.details.length > 0 && (
        <div className="mb-4">
          <p className="font-semibold text-sm text-slate-700 mb-2">Productos</p>
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-slate-50">
                <th className="px-2 py-1.5 text-left text-slate-500">Producto</th>
                <th className="px-2 py-1.5 text-right text-slate-500">P. Unit.</th>
                <th className="px-2 py-1.5 text-right text-slate-500">Cant.</th>
                <th className="px-2 py-1.5 text-right text-slate-500">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {invoice.details.map((d, i) => (
                <tr key={i} className="border-b border-slate-100">
                  <td className="px-2 py-1.5">{d.productName}</td>
                  <td className="px-2 py-1.5 text-right font-mono">{formatCLP(d.unitPrice)}</td>
                  <td className="px-2 py-1.5 text-right">{d.quantity}</td>
                  <td className="px-2 py-1.5 text-right font-mono">{formatCLP(d.subTotal)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Payment */}
      {invoice.payment && (invoice.payment.paymentMethod || invoice.payment.paymentDate) && (
        <div className="bg-emerald-50 rounded-lg p-3 mb-4 text-sm">
          <p className="font-semibold text-emerald-800 mb-1">Pago</p>
          {invoice.payment.paymentMethod && <p className="text-emerald-700">Metodo: {invoice.payment.paymentMethod}</p>}
          {invoice.payment.paymentDate && <p className="text-emerald-700">Fecha: {formatDate(invoice.payment.paymentDate)}</p>}
        </div>
      )}

      {/* Credit Notes */}
      {invoice.creditNotes && invoice.creditNotes.length > 0 && (
        <div className="mb-4">
          <p className="font-semibold text-sm text-slate-700 mb-2">Notas de Credito</p>
          {invoice.creditNotes.map((cn) => (
            <div key={cn.number} className="flex justify-between text-sm bg-amber-50 rounded-lg px-3 py-2 mb-1">
              <span className="text-amber-800">NC #{cn.number} - {formatDate(cn.date)}</span>
              <span className="font-mono font-semibold text-amber-800">{formatCLP(cn.amount)}</span>
            </div>
          ))}
        </div>
      )}

      <button onClick={onClose} className="w-full py-2 border border-gray-300 rounded-lg text-sm hover:bg-slate-50 mt-2">
        Cerrar
      </button>
    </Modal>
  );
}
