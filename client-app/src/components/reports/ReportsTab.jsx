import { useState, useEffect } from 'react';
import { getPaymentSummary, getOverdueReport, getInconsistentReport } from '../../api/report';
import SummaryCards from './SummaryCards';
import OverdueTable from './OverdueTable';
import InconsistentTable from './InconsistentTable';
import LoadingSpinner from '../shared/LoadingSpinner';
import ErrorAlert from '../shared/ErrorAlert';

export default function ReportsTab() {
  const [paymentSummary, setPaymentSummary] = useState([]);
  const [overdueInvoices, setOverdueInvoices] = useState([]);
  const [inconsistentInvoices, setInconsistentInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchReports() {
      setLoading(true);
      try {
        const [summary, overdue, inconsistent] = await Promise.all([
          getPaymentSummary(),
          getOverdueReport(),
          getInconsistentReport(),
        ]);
        setPaymentSummary(summary);
        setOverdueInvoices(overdue);
        setInconsistentInvoices(inconsistent);
      } catch {
        setError('Error al cargar los reportes');
      } finally {
        setLoading(false);
      }
    }
    fetchReports();
  }, []);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorAlert message={error} />;

  return (
    <div>
      <h2 className="text-lg font-bold text-slate-800 mb-5">Reportes</h2>
      <SummaryCards paymentSummary={paymentSummary} />
      <OverdueTable invoices={overdueInvoices} />
      <InconsistentTable invoices={inconsistentInvoices} />
    </div>
  );
}
