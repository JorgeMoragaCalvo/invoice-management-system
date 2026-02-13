import { useState } from 'react';
import { useAuth } from '../auth/AuthContext';
import Header from '../components/layout/Header';
import TabNav from '../components/layout/TabNav';
import InvoiceTab from '../components/invoices/InvoiceTab';
import CreditNoteTab from '../components/creditNotes/CreditNoteTab';
import ReportsTab from '../components/reports/ReportsTab';

export default function DashboardPage() {
  const { logout } = useAuth();
  const [activeTab, setActiveTab] = useState('invoices');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-50 to-blue-50">
      <Header onLogout={logout} />
      <TabNav activeTab={activeTab} onTabChange={setActiveTab} />
      <div className="px-6 py-8 max-w-7xl mx-auto">
        {activeTab === 'invoices' && <InvoiceTab />}
        {activeTab === 'credit' && <CreditNoteTab />}
        {activeTab === 'reports' && <ReportsTab />}
      </div>
    </div>
  );
}
