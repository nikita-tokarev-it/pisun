import client from './client';

export async function getDocuments() {
  const response = await client.get('/documents');
  return response.data;
}

export async function getAdminDocuments() {
  const response = await client.get('/admin/documents');
  return response.data;
}

export async function createDocument(data) {
  const response = await client.post('/admin/documents', data);
  return response.data;
}

export async function updateDocument(id, data) {
  const response = await client.put(`/admin/documents/${id}`, data);
  return response.data;
}

export async function deleteDocument(id) {
  const response = await client.delete(`/admin/documents/${id}`);
  return response.data;
}
