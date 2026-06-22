import React, { useState, useEffect } from 'react';
import { getAdminMapData, updateMapRegion } from '../../../api/map';
import './MapManager.css';

const MapManager = () => {
  const [regions, setRegions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({});
  const [message, setMessage] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await getAdminMapData();
      setRegions(data);
    } catch (err) {
      console.error('Ошибка загрузки регионов:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (region) => {
    setEditingId(region.id);
    setFormData({
      ...region,
      universities: region.universities ? region.universities.join('\n') : ''
    });
  };

  const handleCancel = () => {
    setEditingId(null);
    setFormData({});
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const updatedData = {
        ...formData,
        universities: formData.universities.split('\n').map(u => u.trim()).filter(Boolean)
      };
      await updateMapRegion(editingId, updatedData);
      setMessage('Данные региона обновлены');
      handleCancel();
      loadData();
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      console.error('Ошибка сохранения:', err);
      setMessage('Ошибка при сохранении');
    }
  };

  if (loading) return <div className="admin-loading">Загрузка...</div>;

  return (
    <div className="map-manager">
      <h1 className="admin-page-title">Управление картой ДФО</h1>
      
      {message && <div className={`alert ${message.includes('Ошибка') ? 'alert-error' : 'alert-success'}`}>{message}</div>}

      <div className="manager-layout">
        <div className="regions-list">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Код</th>
                <th>Регион</th>
                <th>Действия</th>
              </tr>
            </thead>
            <tbody>
              {regions.map(region => (
                <tr key={region.id} className={editingId === region.id ? 'editing' : ''}>
                  <td>{region.id}</td>
                  <td>{region.name}</td>
                  <td>
                    <button className="btn-edit" onClick={() => handleEdit(region)}>Редактировать</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {editingId && (
          <div className="edit-panel">
            <h2>Редактирование: {formData.name}</h2>
            <form onSubmit={handleSubmit} className="admin-form">
              <div className="form-group">
                <label>Название региона</label>
                <input 
                  name="name" 
                  value={formData.name || ''} 
                  onChange={handleInputChange} 
                  required 
                />
              </div>
              
              <div className="form-group">
                <label>Описание / Информация</label>
                <textarea 
                  name="info" 
                  value={formData.info || ''} 
                  onChange={handleInputChange} 
                  rows={4}
                />
              </div>

              <div className="form-group">
                <label>Вузы (каждый с новой строки)</label>
                <textarea 
                  name="universities" 
                  value={formData.universities || ''} 
                  onChange={handleInputChange} 
                  rows={6}
                />
              </div>

              <div className="form-group">
                <label>Ссылка на сайт</label>
                <input 
                  name="website" 
                  value={formData.website || ''} 
                  onChange={handleInputChange} 
                />
              </div>

              <div className="form-group checkbox-group">
                <label>
                  <input 
                    type="checkbox" 
                    name="highlight" 
                    checked={formData.highlight || false} 
                    onChange={handleInputChange} 
                  />
                  Выделить на карте
                </label>
              </div>

              <div className="form-actions">
                <button type="submit" className="btn-save">Сохранить изменения</button>
                <button type="button" className="btn-cancel" onClick={handleCancel}>Отмена</button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default MapManager;
