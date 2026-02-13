export default function Header({ onLogout }) {
  return (
    <div className="bg-gradient-to-r from-blue-700 to-blue-600 text-white px-8 py-6 flex items-center justify-between shadow-lg">
      <div className="flex-1">
        <h1 className="text-2xl font-bold text-white">Sistema de Gestión de Facturas</h1>
        <p className="text-sm text-blue-100 mt-2">
          Administración de facturas, notas de crédito y reportes
        </p>
      </div>
      <button
        onClick={onLogout}
        style={{
          backgroundColor: '#1f2937',
          color: 'white',
          padding: '8px 16px',
          borderRadius: '8px',
          fontWeight: '500',
          fontSize: '14px',
          border: '1px solid #374151',
          cursor: 'pointer',
          marginLeft: '24px',
          transition: 'background-color 0.2s',
        }}
        onMouseEnter={(e) => (e.target.style.backgroundColor = '#111827')}
        onMouseLeave={(e) => (e.target.style.backgroundColor = '#1f2937')}
      >
        Cerrar Sesión
      </button>
    </div>
  );
}
