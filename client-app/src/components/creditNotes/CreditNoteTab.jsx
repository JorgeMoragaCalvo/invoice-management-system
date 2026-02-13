import { useState, useEffect } from 'react';
import { getAllInvoices, getInvoiceByNumber, createCreditNote } from '../../api/invoices';
import { formatCLP } from '../../utils/format';
import Badge from '../shared/Badge';
import LoadingSpinner from '../shared/LoadingSpinner';

export default function CreditNoteTab() {
  const [invoices, setInvoices] = useState([]);
  const [selectedNumber, setSelectedNumber] = useState('');
  const [full, setFull] = useState(null);
  const [amount, setAmount] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loadingFull, setLoadingFull] = useState(false);

  useEffect(() => {
    getAllInvoices().then(setInvoices).catch(() => {});
  }, []);

  useEffect(() => {
    if (!selectedNumber) { setFull(null); return; }
    setLoadingFull(true);
    getInvoiceByNumber(parseInt(selectedNumber))
      .then(setFull)
      .catch(() => setFull(null))
      .finally(() => setLoadingFull(false));
  }, [selectedNumber]);

  const existingCredit = full?.creditNotes?.reduce((sum, cn) => sum + cn.amount, 0) || 0;
  const outstanding = (full?.totalAmount || 0) - existingCredit;
  const parsedAmount = parseInt(amount) || 0;
  const amountExceeds = parsedAmount > outstanding;

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setSubmitting(true);
    try {
      await createCreditNote(parseInt(selectedNumber), parsedAmount);
      setSuccess('Nota de credito registrada exitosamente');
      setAmount('');
      setSelectedNumber('');
      setFull(null);
      const updated = await getAllInvoices();
      setInvoices(updated);
    } catch (err) {
      setError(err.response?.data?.error || 'Error al crear la nota de credito');
    } finally {
      setSubmitting(false);
    }
  }

  const available = invoices.filter((i) => i.status !== 'Cancelled');

  return (
    <div>
      <h2 className="text-lg font-bold text-slate-800 mb-1">Agregar Nota de Credito</h2>
      <p className="text-slate-500 text-sm mb-5">
        Selecciona una factura y registra la nota de credito correspondiente.
      </p>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-slate-200 p-6 max-w-lg">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-2 mb-4">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm rounded-lg px-4 py-2 mb-4">
            {success}
          </div>
        )}

        <div className="mb-4">
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">Factura</label>
          <select
            value={selectedNumber}
            onChange={(e) => setSelectedNumber(e.target.value)}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm bg-white outline-none"
          >
            <option value="">Seleccionar factura...</option>
            {available.map((i) => (
              <option key={i.number} value={i.number}>
                #{i.number} - {formatCLP(i.totalAmount)}
              </option>
            ))}
          </select>
        </div>

        {loadingFull && <LoadingSpinner />}

        {full && !loadingFull && (
          <>
            <div className="bg-slate-50 rounded-lg p-3 mb-4 text-sm flex items-center gap-2 flex-wrap">
              <strong>Monto total:</strong> {formatCLP(full.totalAmount)} &nbsp;|&nbsp;
              <strong>Saldo:</strong> {formatCLP(outstanding)} &nbsp;|&nbsp;
              <Badge label={full.status} type="status" /> &nbsp;
              <Badge label={full.paymentStatus} type="payment" />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Monto NC ($)</label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Ej: 500000"
                min="1"
                required
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500"
              />
              {amountExceeds && (
                <p className="text-red-600 text-xs mt-1">
                  El monto no puede superar el saldo pendiente ({formatCLP(outstanding)})
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={submitting || !amount || parsedAmount <= 0 || amountExceeds}
              className="w-full py-2.5 bg-blue-800 text-white rounded-lg text-sm font-semibold hover:bg-blue-900 disabled:opacity-50"
            >
              {submitting ? 'Registrando...' : 'Registrar Nota de Credito'}
            </button>
          </>
        )}
      </form>
    </div>
  );
}
