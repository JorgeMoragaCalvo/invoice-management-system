export default function Modal({ children, onClose, title, subtitle }) {
  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl p-8 w-[480px] max-w-[90vw] max-h-[90vh] overflow-y-auto shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {title && <h3 className="text-xl font-bold text-slate-900 mb-1">{title}</h3>}
        {subtitle && <p className="text-sm text-slate-600 mb-5">{subtitle}</p>}
        {children}
      </div>
    </div>
  );
}
