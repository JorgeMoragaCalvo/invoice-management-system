import client from './client';

export async function getAllInvoices() {
  const response = await client.get('/invoices/');
  return response.data;
}

export async function getInvoiceByNumber(number) {
  const response = await client.get(`/invoices/${number}`);
  return response.data;
}

export async function getInvoicesByStatus(status) {
  const response = await client.get(`/invoices/status/${status}`);
  return response.data;
}

export async function getInvoicesByPayment(payment) {
  const response = await client.get(`/invoices/payment/${payment}`);
  return response.data;
}

export async function loadInvoicesFile(file) {
  const formData = new FormData();
  formData.append('file', file);
  const response = await client.post('/invoices/load', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
}

export async function createCreditNote(invoiceNumber, amount) {
  const response = await client.post(
    `/invoices/${invoiceNumber}/credit-notes`,
    { amount }
  );
  return response.data;
}