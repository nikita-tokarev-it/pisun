import client from './client';

export const getMapData = async () => {
  const response = await client.get('/map');
  return response.data;
};

export const getAdminMapData = async () => {
  const response = await client.get('/admin/map', { params: { collection: 'mapData' } });
  return response.data;
};

export const updateMapRegion = async (id, data) => {
  const response = await client.put(`/admin/map/${id}`, data, { params: { collection: 'mapData', id } });
  return response.data;
};
