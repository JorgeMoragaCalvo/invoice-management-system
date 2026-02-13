import { useState, useEffect } from 'react';
import { getAllInvoices } from '../../api/invoices';
import InvoiceFilters from './InvoiceFilters';
import InvoiceTable from './InvoiceTable';
import InvoiceDetailModal from './InvoiceDetailModal';
import CreditNoteModal from '../creditNotes/CreditNoteModal';
import FileUploadButton from './FileUploadButton';
import FileUploadResultModal from './FileUploadResultModal';
import LoadingSpinner from '../shared/LoadingSpinner';
import ErrorAlert from '../shared/ErrorAlert';

export default function InvoiceTab() {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters
  const [searchNumber, setSearchNumber] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterPayment, setFilterPayment] = useState('');

  // Modals
  const [detailNumber, setDetailNumber] = useState(null);
  const [cnInvoice, setCnInvoice] = useState(null);
  const [uploadResult, setUploadResult] = useState(null);

  async function fetchInvoices() {
    setLoading(true);
    setError(null);
    try {
      const data = await getAllInvoices();
      setInvoices(data);
    } catch {
      setError('Error al cargar las facturas');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { fetchInvoices(); }, []);

  const filtered = invoices.filter((inv) => {
    if (searchNumber && !String(inv.number).includes(searchNumber)) return false;
    if (filterStatus && inv.status !== filterStatus) return false;
    if (filterPayment && inv.paymentStatus !== filterPayment) return false;
    return true;
  });

  function handleUploadSuccess(result) {
    setUploadResult(result);
    fetchInvoices();
  }

  function handleCreditNoteSuccess() {
    setCnInvoice(null);
    fetchInvoices();
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-4 card p-4 bg-gradient-to-r from-slate-50 to-blue-50">
        <InvoiceFilters
          searchNumber={searchNumber} onSearchChange={setSearchNumber}
          filterStatus={filterStatus} onStatusChange={setFilterStatus}
          filterPayment={filterPayment} onPaymentChange={setFilterPayment}
          onClear={() => { setSearchNumber(''); setFilterStatus(''); setFilterPayment(''); }}
          resultCount={filtered.length}
        />
        <FileUploadButton
          onUploadSuccess={handleUploadSuccess}
          onError={(msg) => setError(msg)}
        />
      </div>

      {error && <div className="mb-4"><ErrorAlert message={error} onDismiss={() => setError(null)} /></div>}

      {loading ? (
        <LoadingSpinner />
      ) : (
        <InvoiceTable
          invoices={filtered}
          onViewDetail={(num) => setDetailNumber(num)}
          onCreateCreditNote={(inv) => setCnInvoice(inv)}
        />
      )}

      {detailNumber && (
        <InvoiceDetailModal
          invoiceNumber={detailNumber}
          onClose={() => setDetailNumber(null)}
        />
      )}

      {cnInvoice && (
        <CreditNoteModal
          invoice={cnInvoice}
          onClose={() => setCnInvoice(null)}
          onSuccess={handleCreditNoteSuccess}
        />
      )}

      {uploadResult && (
        <FileUploadResultModal
          result={uploadResult}
          onClose={() => setUploadResult(null)}
        />
      )}
    </div>
  );
}
