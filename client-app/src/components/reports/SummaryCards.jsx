export default function SummaryCards({ paymentSummary }) {
  const totalConsistent = paymentSummary.reduce((sum, s) => sum + s.count, 0);
  const paid = paymentSummary.find((s) => s.paymentStatus === 'Paid');
  const pending = paymentSummary.find((s) => s.paymentStatus === 'Pending');
  const overdue = paymentSummary.find((s) => s.paymentStatus === 'Overdue');

  const cards = [
    { label: 'Total Consistentes', value: totalConsistent, color: 'text-blue-700', bg: 'bg-blue-50', border: 'border-blue-200', icon: '📊' },
    { label: 'Pagadas (Paid)', value: `${paid?.count || 0} (${paid?.percentage || 0}%)`, color: 'text-emerald-700', bg: 'bg-emerald-50', border: 'border-emerald-200', icon: '✓' },
    { label: 'Pendientes (Pending)', value: `${pending?.count || 0} (${pending?.percentage || 0}%)`, color: 'text-yellow-700', bg: 'bg-yellow-50', border: 'border-yellow-200', icon: '⏳' },
    { label: 'Vencidas (Overdue)', value: `${overdue?.count || 0} (${overdue?.percentage || 0}%)`, color: 'text-red-700', bg: 'bg-red-50', border: 'border-red-200', icon: '⚠' },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-7">
      {cards.map((card) => (
        <div key={card.label} className={`bg-white rounded-xl border ${card.border} shadow-sm hover:shadow-lg transition-all p-6`}>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-xs text-slate-600 uppercase tracking-widest font-semibold mb-2">{card.label}</p>
              <p className={`text-3xl font-bold ${card.color}`}>{card.value}</p>
            </div>
            <span className="text-3xl opacity-60">{card.icon}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
