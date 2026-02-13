export default function LoadingSpinner({ fullScreen = false }) {
  const wrapper = fullScreen
    ? 'fixed inset-0 flex items-center justify-center bg-slate-50/80 backdrop-blur-sm'
    : 'flex items-center justify-center py-12';

  return (
    <div className={wrapper}>
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin" />
        <p className="text-sm text-slate-500 font-medium">Cargando...</p>
      </div>
    </div>
  );
}
