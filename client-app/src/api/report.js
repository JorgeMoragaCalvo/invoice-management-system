import client from './client';

export async function getOverdueReport() {
  const response = await client.get('/invoices/reports/overdue');
  return response.data;
}

export async function getPaymentSummary() {
  const response = await client.get('/invoices/reports/payment-summary');
  return response.data;
}

export async function getInconsistentReport() {
  const response = await client.get('/invoices/reports/inconsistent');
  return response.data;
}