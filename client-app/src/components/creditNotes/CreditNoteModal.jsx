import { useState, useEffect } from 'react';
import { getInvoiceByNumber, createCreditNote } from '../../api/invoices';
import { formatCLP } from '../../utils/format';
import Modal from '../shared/Modal';
import LoadingSpinner from '../shared/LoadingSpinner';

export default function CreditNoteModal({ invoice, onClose, onSuccess }) {
  const [full, setFull] = useState(null);
  const [loading, setLoading] = useState(true);
  const [amount, setAmount] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetch() {
      try {
        const data = await getInvoiceByNumber(invoice.number);
        setFull(data);
      } catch {
        setError('Error al cargar la factura');
      } finally {
        setLoading(false);
      }
    }
    fetch();
  }, [invoice.number]);

  const existingCredit = full?.creditNotes?.reduce((sum, cn) => sum + cn.amount, 0) || 0;
  const outstanding = (full?.totalAmount || 0) - existingCredit;

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await createCreditNote(invoice.number, parseInt(amount));
      onSuccess();
    } catch (err) {
      setError(err.response?.data?.error || 'Error al crear la nota de credito');
    } finally {
      setSubmitting(false);
    }
  }

  const parsedAmount = parseInt(amount) || 0;
  const amountExceeds = parsedAmount > outstanding;

  return (
    <Modal
      title="Nueva Nota de Credito"
      subtitle={`Factura #${invoice.number}`}
      onClose={onClose}
    >
      {loading ? (
        <LoadingSpinner />
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="bg-slate-50 rounded-lg p-3 mb-4 text-sm">
            <strong>Monto factura:</strong> {formatCLP(full?.totalAmount)} &nbsp;|&nbsp;
            <strong>Saldo:</strong> {formatCLP(outstanding)}
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-2 mb-4">
              {error}
            </div>
          )}

          <div className="mb-4">
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Monto ($)</label>
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

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 border border-gray-300 rounded-lg text-sm hover:bg-slate-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={submitting || !amount || parsedAmount <= 0 || amountExceeds}
              className="flex-1 py-2.5 bg-blue-800 text-white rounded-lg text-sm font-semibold hover:bg-blue-900 disabled:opacity-50"
            >
              {submitting ? 'Registrando...' : 'Registrar'}
            </button>
          </div>
        </form>
      )}
    </Modal>
  );
}
