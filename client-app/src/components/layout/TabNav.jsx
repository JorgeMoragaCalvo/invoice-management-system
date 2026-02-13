const tabs = [
  { key: 'invoices', label: 'Facturas' },
  { key: 'credit', label: 'Notas de Crédito' },
  { key: 'reports', label: 'Reportes' },
];

export default function TabNav({ activeTab, onTabChange }) {
  return (
    <div className="flex border-b border-slate-200 px-8 bg-white shadow-sm sticky top-0 z-40">
      {tabs.map((t) => (
        <button
          key={t.key}
          onClick={() => onTabChange(t.key)}
          className={`px-6 py-4 text-sm font-medium transition-all border-b-2 ${
            activeTab === t.key
              ? 'text-blue-600 border-blue-600'
              : 'text-slate-600 border-transparent hover:text-slate-900 hover:border-slate-300'
          }`}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}
