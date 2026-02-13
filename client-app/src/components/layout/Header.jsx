export default function Header({ onLogout }) {
  return (
    <div className="bg-gradient-to-r from-slate-800 to-slate-600 text-white px-8 py-6 flex items-center justify-between">
      <div>
        <h1 className="text-xl font-bold">Sistema de Gestión de Facturas</h1>
        <p className="text-sm text-slate-400 mt-1">
          Administración de facturas, notas de crédito y reportes
        </p>
      </div>
      <button
        onClick={onLogout}
        className="px-4 py-2 text-sm border border-slate-400 rounded-lg hover:bg-slate-700 transition-colors"
      >
        Cerrar Sesión
      </button>
    </div>
  );
}
