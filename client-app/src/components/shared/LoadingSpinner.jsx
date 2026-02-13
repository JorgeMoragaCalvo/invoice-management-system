export default function LoadingSpinner({ fullScreen = false }) {
  const wrapper = fullScreen
    ? 'fixed inset-0 flex items-center justify-center bg-slate-50'
    : 'flex items-center justify-center py-12';

  return (
    <div className={wrapper}>
      <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-800 rounded-full animate-spin" />
    </div>
  );
}
