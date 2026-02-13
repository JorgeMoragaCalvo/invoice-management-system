export default function ErrorAlert({ message, onDismiss }) {
  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center justify-between">
      <span className="text-red-700 text-sm">{message}</span>
      {onDismiss && (
        <button onClick={onDismiss} className="text-red-400 hover:text-red-600 ml-4 text-lg leading-none">
          &times;
        </button>
      )}
    </div>
  );
}
