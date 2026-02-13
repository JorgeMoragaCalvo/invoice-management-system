const tabs = [
  { key: 'invoices', label: 'Facturas' },
  { key: 'credit', label: 'Notas de Crédito' },
  { key: 'reports', label: 'Reportes' },
];

export default function TabNav({ activeTab, onTabChange }) {
  return (
    <div className="flex border-b-2 border-slate-200 px-8 bg-white">
      {tabs.map((t) => (
        <button
          key={t.key}
          onClick={() => onTabChange(t.key)}
          className={`px-5 py-3.5 text-sm transition-all -mb-[2px] ${
            activeTab === t.key
              ? 'font-bold text-blue-800 border-b-2 border-blue-800'
              : 'text-slate-500 border-b-2 border-transparent hover:text-slate-700'
          }`}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}
