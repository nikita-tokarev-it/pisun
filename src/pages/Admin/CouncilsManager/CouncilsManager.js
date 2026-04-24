import React, { useState, useEffect } from 'react';
import { 
  getAdminMainCouncils, createMainCouncil, updateMainCouncil, deleteMainCouncil,
  getAdminRegionalCouncils, createRegionalCouncil, updateRegionalCouncil, deleteRegionalCouncil
} from '../../../api/councils';
import './CouncilsManager.css';

const CouncilsManager = () => {
  const [mainCouncils, setMainCouncils] = useState([]);
  const [regionalCouncils, setRegionalCouncils] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('main');
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [main, regional] = await Promise.all([
        getAdminMainCouncils(),
        getAdminRegionalCouncils()
      ]);
      setMainCouncils(main);
      setRegionalCouncils(regional);
    } catch (err) {
      console.error('Ошибка загрузки данных:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData(item);
  };

  const handleCancel = () => {
    setEditingItem(null);
    setFormData({});
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (activeTab === 'main') {
        if (editingItem?.id) {
          await updateMainCouncil(editingItem.id, formData);
        } else {
          await createMainCouncil(formData);
        }
      } else {
        if (editingItem?.id) {
          await updateRegionalCouncil(editingItem.id, formData);
        } else {
          await createRegionalCouncil(formData);
        }
      }
      handleCancel();
      loadData();
    } catch (err) {
      console.error('Ошибка сохранения:', err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Вы уверены?')) return;
    try {
      if (activeTab === 'main') {
        await deleteMainCouncil(id);
      } else {
        await deleteRegionalCouncil(id);
      }
      loadData();
    } catch (err) {
      console.error('Ошибка удаления:', err);
    }
  };

  if (loading) return <div className="admin-loading">Загрузка...</div>;

  return (
    <div className="councils-manager">
      <h1>Управление советами</h1>

      <div className="admin-tabs">
        <button 
          className={activeTab === 'main' ? 'active' : ''} 
          onClick={() => { setActiveTab('main'); handleCancel(); }}
        >
          Состав Совета (основной)
        </button>
        <button 
          className={activeTab === 'regional' ? 'active' : ''} 
          onClick={() => { setActiveTab('regional'); handleCancel(); }}
        >
          Региональные советы
        </button>
      </div>

      <div className="manager-content">
        <div className="form-container">
          <h2>{editingItem?.id ? 'Редактировать' : 'Добавить'} запись</h2>
          <form onSubmit={handleSubmit} className="admin-form">
            {activeTab === 'main' ? (
              <>
                <div className="form-group">
                  <label>Совет (регион)</label>
                  <input name="council" value={formData.council || ''} onChange={handleInputChange} required />
                </div>
                <div className="form-group">
                  <label>Председатель</label>
                  <input name="chairman" value={formData.chairman || ''} onChange={handleInputChange} required />
                </div>
                <div className="form-group">
                  <label>Секретарь</label>
                  <input name="secretary" value={formData.secretary || ''} onChange={handleInputChange} />
                </div>
                <div className="form-group">
                  <label>Сайт</label>
                  <input name="website" value={formData.website || ''} onChange={handleInputChange} />
                </div>
                <div className="form-group">
                  <label>Университет</label>
                  <input name="university" value={formData.university || ''} onChange={handleInputChange} required />
                </div>
              </>
            ) : (
              <>
                <div className="form-group">
                  <label>Регион</label>
                  <input name="region" value={formData.region || ''} onChange={handleInputChange} required />
                </div>
                <div className="form-group">
                  <label>Организация</label>
                  <input name="organization" value={formData.organization || ''} onChange={handleInputChange} required />
                </div>
                <div className="form-group">
                  <label>Должность</label>
                  <input name="position" value={formData.position || ''} onChange={handleInputChange} />
                </div>
                <div className="form-group">
                  <label>ФИО</label>
                  <input name="chairman" value={formData.chairman || ''} onChange={handleInputChange} required />
                </div>
                <div className="form-group">
                  <label>Телефон</label>
                  <input name="phone" value={formData.phone || ''} onChange={handleInputChange} />
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input name="email" value={formData.email || ''} onChange={handleInputChange} />
                </div>
                <div className="form-group">
                  <label>Подведомственность</label>
                  <input name="subordination" value={formData.subordination || ''} onChange={handleInputChange} />
                </div>
              </>
            )}
            <div className="form-actions">
              <button type="submit" className="btn-save">Сохранить</button>
              {editingItem?.id && <button type="button" className="btn-cancel" onClick={handleCancel}>Отмена</button>}
            </div>
          </form>
        </div>

        <div className="table-container">
          <table className="admin-table">
            <thead>
              {activeTab === 'main' ? (
                <tr>
                  <th>Совет</th>
                  <th>Председатель</th>
                  <th>Университет</th>
                  <th>Действия</th>
                </tr>
              ) : (
                <tr>
                  <th>Регион</th>
                  <th>Организация</th>
                  <th>ФИО</th>
                  <th>Действия</th>
                </tr>
              )}
            </thead>
            <tbody>
              {(activeTab === 'main' ? mainCouncils : regionalCouncils).map(item => (
                <tr key={item.id}>
                  <td>{activeTab === 'main' ? item.council : item.region}</td>
                  <td>{activeTab === 'main' ? item.chairman : item.organization}</td>
                  <td>{activeTab === 'main' ? item.university : item.chairman}</td>
                  <td>
                    <button className="btn-edit" onClick={() => handleEdit(item)}>Ред.</button>
                    <button className="btn-delete" onClick={() => handleDelete(item.id)}>Удалить</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CouncilsManager;
