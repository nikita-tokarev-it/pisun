import React, { useState, useEffect } from 'react';
import {
  getAdminPressReleases, createPressRelease, updatePressRelease, deletePressRelease,
  getAdminAnnouncements, createAnnouncement, updateAnnouncement, deleteAnnouncement,
  getAdminPhotos, createPhoto, updatePhoto, deletePhoto,
  getAdminVideos, createVideo, updateVideo, deleteVideo,
} from '../../../api/press';
import { formatDate } from '../../../utils/formatters';
import '../EventsManager/EventsManager.css';
import './PressManager.css';

const PressManager = () => {
  const [activeTab, setActiveTab] = useState('releases');
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [form, setForm] = useState({});

  const tabConfig = {
    releases: {
      label: 'Пресс-релизы',
      fetch: getAdminPressReleases,
      create: createPressRelease,
      update: updatePressRelease,
      remove: deletePressRelease,
      fields: ['title', 'date', 'content', 'published'],
    },
    announcements: {
      label: 'Анонсы',
      fetch: getAdminAnnouncements,
      create: createAnnouncement,
      update: updateAnnouncement,
      remove: deleteAnnouncement,
      fields: ['title', 'date', 'content', 'published'],
    },
    photos: {
      label: 'Фотоматериалы',
      fetch: getAdminPhotos,
      create: createPhoto,
      update: updatePhoto,
      remove: deletePhoto,
      fields: ['title', 'date', 'image', 'published'],
    },
    videos: {
      label: 'Видеоматериалы',
      fetch: getAdminVideos,
      create: createVideo,
      update: updateVideo,
      remove: deleteVideo,
      fields: ['title', 'date', 'thumbnail', 'videoUrl', 'published'],
    },
  };

  const config = tabConfig[activeTab];

  const loadItems = async () => {
    setLoading(true);
    try {
      const data = await config.fetch();
      setItems(data);
    } catch (err) {
      console.error('Ошибка загрузки:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadItems();
    setShowForm(false);
    setEditItem(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Удалить "${title}"?`)) return;
    try {
      await config.remove(id);
      setItems(items.filter(i => i.id !== id));
    } catch (err) {
      alert('Ошибка удаления');
    }
  };

  const openCreate = () => {
    setEditItem(null);
    const newForm = { published: true };
    config.fields.forEach(f => { if (f !== 'published') newForm[f] = ''; });
    setForm(newForm);
    setShowForm(true);
  };

  const openEdit = (item) => {
    setEditItem(item);
    const editForm = {};
    config.fields.forEach(f => { editForm[f] = item[f] ?? ''; });
    setForm(editForm);
    setShowForm(true);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editItem) {
        const updated = await config.update(editItem.id, form);
        setItems(items.map(i => i.id === editItem.id ? updated : i));
      } else {
        const created = await config.create(form);
        setItems([...items, created]);
      }
      setShowForm(false);
      setEditItem(null);
    } catch (err) {
      alert('Ошибка сохранения');
    }
  };

  const fieldLabels = {
    title: 'Название',
    date: 'Дата',
    content: 'Содержание',
    image: 'URL изображения',
    thumbnail: 'URL превью',
    videoUrl: 'URL видео',
    published: 'Опубликовано',
  };

  return (
    <div className="press-manager">
      <div className="manager-header">
        <h1 className="admin-page-title">Пресс-материалы</h1>
        <button className="add-btn" onClick={openCreate}>+ Добавить</button>
      </div>

      <div className="manager-tabs">
        {Object.entries(tabConfig).map(([key, cfg]) => (
          <button
            key={key}
            className={`manager-tab ${activeTab === key ? 'active' : ''}`}
            onClick={() => setActiveTab(key)}
          >
            {cfg.label}
          </button>
        ))}
      </div>

      {showForm && (
        <div className="inline-form-wrapper">
          <form onSubmit={handleSubmit} className="admin-form">
            <h3>{editItem ? 'Редактировать' : 'Добавить'} — {config.label}</h3>
            {config.fields.map(field => (
              field === 'published' ? (
                <div key={field} className="form-group checkbox-group">
                  <label>
                    <input type="checkbox" name="published" checked={form.published} onChange={handleChange} />
                    Опубликовано
                  </label>
                </div>
              ) : (field === 'description' || field === 'fullContent') ? (
                <div key={field} className="form-group">
                  <label>{fieldLabels[field]}</label>
                  <textarea 
                    name={field} 
                    value={form[field] || ''} 
                    onChange={handleChange} 
                    rows={field === 'fullContent' ? 8 : 3} 
                  />
                </div>
              ) : (
                <div key={field} className="form-group">
                  <label>{fieldLabels[field]}</label>
                  <input 
                    type={field === 'date' ? 'date' : 'text'} 
                    name={field} 
                    value={form[field] || ''} 
                    onChange={handleChange} 
                  />
                </div>
              )
            ))}
            <div className="form-actions">
              <button type="submit" className="save-btn">Сохранить</button>
              <button type="button" className="cancel-btn" onClick={() => setShowForm(false)}>Отмена</button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <div className="admin-loading">Загрузка...</div>
      ) : (
        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Название</th>
                <th>Дата</th>
                <th>Статус</th>
                <th>Действия</th>
              </tr>
            </thead>
            <tbody>
              {items.map(item => (
                <tr key={item.id}>
                  <td className="title-cell">{item.title}</td>
                  <td>{formatDate(item.date)}</td>
                  <td>
                    <span className={`status-badge ${item.published ? 'published' : 'draft'}`}>
                      {item.published ? 'Опубликовано' : 'Черновик'}
                    </span>
                  </td>
                  <td className="actions-cell">
                    <button className="edit-btn" onClick={() => openEdit(item)}>Изменить</button>
                    <button className="delete-btn" onClick={() => handleDelete(item.id, item.title)}>Удалить</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {items.length === 0 && <p className="empty-message">Нет записей</p>}
        </div>
      )}
    </div>
  );
};

export default PressManager;
