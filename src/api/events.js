import client from './client';

export async function getEvents() {
  const response = await client.get('/events');
  return response.data;
}

export async function getEventById(id) {
  const response = await client.get(`/events/${id}`);
  return response.data;
}

export async function getAdminEvents() {
  const response = await client.get('/admin/events');
  return response.data;
}

export async function createEvent(data) {
  const response = await client.post('/admin/events', data);
  return response.data;
}

export async function updateEvent(id, data) {
  const response = await client.put(`/admin/events/${id}`, data);
  return response.data;
}

export async function deleteEvent(id) {
  const response = await client.delete(`/admin/events/${id}`);
  return response.data;
}
