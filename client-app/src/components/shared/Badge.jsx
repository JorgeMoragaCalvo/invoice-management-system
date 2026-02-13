const statusColors = {
  Issued: 'bg-blue-100 text-blue-800 border border-blue-300',
  Partial: 'bg-amber-100 text-amber-800 border border-amber-300',
  Cancelled: 'bg-red-100 text-red-800 border border-red-300',
};

const paymentColors = {
  Pending: 'bg-yellow-100 text-yellow-800 border border-yellow-300',
  Overdue: 'bg-red-100 text-red-800 border border-red-300',
  Paid: 'bg-emerald-100 text-emerald-800 border border-emerald-300',
};

export default function Badge({ label, type = 'status' }) {
  const colorMap = type === 'payment' ? paymentColors : statusColors;
  const classes = colorMap[label] || 'bg-slate-100 text-slate-700 border border-slate-300';
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${classes}`}>
      {label}
    </span>
  );
}
