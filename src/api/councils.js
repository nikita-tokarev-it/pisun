import client from './client';

// Public
export const getCouncils = async () => {
  const response = await client.get('/councils');
  return response.data;
};

// Admin: Main Council
export const getAdminMainCouncils = async () => {
  const response = await client.get('/admin/councils/main');
  return response.data;
};

export const createMainCouncil = async (data) => {
  const response = await client.post('/admin/councils/main', data);
  return response.data;
};

export const updateMainCouncil = async (id, data) => {
  const response = await client.put(`/admin/councils/main/${id}`, data);
  return response.data;
};

export const deleteMainCouncil = async (id) => {
  const response = await client.delete(`/admin/councils/main/${id}`);
  return response.data;
};

// Admin: Regional Councils
export const getAdminRegionalCouncils = async () => {
  const response = await client.get('/admin/councils/regional');
  return response.data;
};

export const createRegionalCouncil = async (data) => {
  const response = await client.post('/admin/councils/regional', data);
  return response.data;
};

export const updateRegionalCouncil = async (id, data) => {
  const response = await client.put(`/admin/councils/regional/${id}`, data);
  return response.data;
};

export const deleteRegionalCouncil = async (id) => {
  const response = await client.delete(`/admin/councils/regional/${id}`);
  return response.data;
};
