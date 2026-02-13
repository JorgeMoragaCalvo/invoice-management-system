export default function Modal({ children, onClose, title, subtitle }) {
  return (
    <div
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl p-7 w-[440px] max-w-[90vw] max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {title && <h3 className="text-base font-bold text-slate-800 mb-1">{title}</h3>}
        {subtitle && <p className="text-sm text-slate-500 mb-4">{subtitle}</p>}
        {children}
      </div>
    </div>
  );
}
