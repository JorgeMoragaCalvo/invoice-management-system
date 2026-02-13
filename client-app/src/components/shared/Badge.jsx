const statusColors = {
  Issued: 'bg-blue-100 text-blue-800',
  Partial: 'bg-amber-100 text-amber-800',
  Cancelled: 'bg-red-100 text-red-800',
};

const paymentColors = {
  Pending: 'bg-indigo-100 text-indigo-800',
  Overdue: 'bg-red-100 text-red-800',
  Paid: 'bg-emerald-100 text-emerald-800',
};

export default function Badge({ label, type = 'status' }) {
  const colorMap = type === 'payment' ? paymentColors : statusColors;
  const classes = colorMap[label] || 'bg-gray-100 text-gray-700';
  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${classes}`}>
      {label}
    </span>
  );
}
