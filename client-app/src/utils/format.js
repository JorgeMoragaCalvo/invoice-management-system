export function formatDate(value) {
    if(!value) return '-';
    const date = new Date(value + 'T00:00:00');
    return date.toLocaleDateString('es-CL');
}

export function formatCLP(amount) {
  if (amount == null) return '-';
  return '$' + amount.toLocaleString('es-CL');
}