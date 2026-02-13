import Modal from '../shared/Modal';

export default function FileUploadResultModal({ result, onClose }) {
  return (
    <Modal title="Resultado de la carga" onClose={onClose}>
      <div className="space-y-3 mb-5">
        <div className="flex justify-between text-sm">
          <span className="text-slate-600">Total procesadas</span>
          <span className="font-semibold">{result.totalProcessed}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-emerald-700">Cargadas exitosamente</span>
          <span className="font-semibold text-emerald-700">{result.loaded}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-amber-700">Duplicadas omitidas</span>
          <span className="font-semibold text-amber-700">{result.duplicatesSkipped}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-red-700">Inconsistentes</span>
          <span className="font-semibold text-red-700">{result.inconsistentCount}</span>
        </div>
      </div>
      <button
        onClick={onClose}
        className="w-full py-2 bg-blue-800 text-white rounded-lg text-sm font-semibold hover:bg-blue-900"
      >
        Cerrar
      </button>
    </Modal>
  );
}
