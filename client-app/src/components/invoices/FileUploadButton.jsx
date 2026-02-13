import { useState, useRef } from 'react';
import { loadInvoicesFile } from '../../api/invoices';

export default function FileUploadButton({ onUploadSuccess, onError }) {
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  async function handleFileChange(e) {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.name.endsWith('.json')) {
      onError('Solo se permiten archivos JSON');
      return;
    }

    setUploading(true);
    try {
      const result = await loadInvoicesFile(file);
      onUploadSuccess(result);
    } catch (err) {
      onError(err.response?.data?.error || 'Error al cargar el archivo');
    } finally {
      setUploading(false);
      fileInputRef.current.value = '';
    }
  }

  return (
    <>
      <input type="file" ref={fileInputRef} className="hidden" accept=".json" onChange={handleFileChange} />
      <button
        type="button"
        onClick={() => fileInputRef.current.click()}
        disabled={uploading}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          padding: '8px 16px',
          backgroundColor: '#2563eb',
          color: '#ffffff',
          borderRadius: '8px',
          border: 'none',
          fontWeight: 600,
          fontSize: '14px',
          cursor: uploading ? 'not-allowed' : 'pointer',
          opacity: uploading ? 0.6 : 1,
        }}
      >
        {uploading ? (
          <>
            <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Cargando...
          </>
        ) : (
          <>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Cargar Facturas JSON
          </>
        )}
      </button>
    </>
  );
}
