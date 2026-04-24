import React, { useState, useEffect } from 'react';
import { getAdminDocuments, createDocument, updateDocument, deleteDocument } from '../../../api/documents';
import { formatDate } from '../../../utils/formatters';
import '../EventsManager/EventsManager.css';

const CATEGORIES = ['История', 'Учредительные документы', 'Решения Совета'];

const DocumentsManager = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [form, setForm] = useState({
    category: CATEGORIES[0],
    title: '',
    file: '',
    date: '',
    published: true,
  });

  const loadDocuments = async () => {
    try {
      const data = await getAdminDocuments();
      setDocuments(data);
    } catch (err) {
      console.error('Ошибка загрузки:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadDocuments(); }, []);

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Удалить "${title}"?`)) return;
    try {
      await deleteDocument(id);
      setDocuments(documents.filter(d => d.id !== id));
    } catch (err) {
      alert('Ошибка удаления');
    }
  };

  const openCreate = () => {
    setEditItem(null);
    setForm({ category: CATEGORIES[0], title: '', file: '', date: '', published: true });
    setShowForm(true);
  };

  const openEdit = (item) => {
    setEditItem(item);
    setForm({
      category: item.category,
      title: item.title,
      file: item.file,
      date: item.date,
      published: item.published,
    });
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
        const updated = await updateDocument(editItem.id, form);
        setDocuments(documents.map(d => d.id === editItem.id ? updated : d));
      } else {
        const created = await createDocument(form);
        setDocuments([...documents, created]);
      }
      setShowForm(false);
      setEditItem(null);
    } catch (err) {
      alert('Ошибка сохранения');
    }
  };

  if (loading) return <div className="admin-loading">Загрузка...</div>;

  return (
    <div className="documents-manager">
      <div className="manager-header">
        <h1 className="admin-page-title">Документы</h1>
        <button className="add-btn" onClick={openCreate}>+ Добавить</button>
      </div>

      {showForm && (
        <div className="inline-form-wrapper">
          <form onSubmit={handleSubmit} className="admin-form">
            <h3>{editItem ? 'Редактировать документ' : 'Добавить документ'}</h3>
            <div className="form-group">
              <label>Категория</label>
              <select name="category" value={form.category} onChange={handleChange}>
                {CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Название</label>
              <input type="text" name="title" value={form.title} onChange={handleChange} required />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Файл</label>
                <input type="text" name="file" value={form.file} onChange={handleChange} placeholder="document.pdf" />
              </div>
              <div className="form-group">
                <label>Дата</label>
                <input type="date" name="date" value={form.date} onChange={handleChange} />
              </div>
            </div>
            <div className="form-group checkbox-group">
              <label>
                <input type="checkbox" name="published" checked={form.published} onChange={handleChange} />
                Опубликовано
              </label>
            </div>
            <div className="form-actions">
              <button type="submit" className="save-btn">Сохранить</button>
              <button type="button" className="cancel-btn" onClick={() => setShowForm(false)}>Отмена</button>
            </div>
          </form>
        </div>
      )}

      <div className="admin-table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Название</th>
              <th>Категория</th>
              <th>Дата</th>
              <th>Статус</th>
              <th>Действия</th>
            </tr>
          </thead>
          <tbody>
            {documents.map(doc => (
              <tr key={doc.id}>
                <td className="title-cell">{doc.title}</td>
                <td>{doc.category}</td>
                <td>{formatDate(doc.date)}</td>
                <td>
                  <span className={`status-badge ${doc.published ? 'published' : 'draft'}`}>
                    {doc.published ? 'Опубликовано' : 'Черновик'}
                  </span>
                </td>
                <td className="actions-cell">
                  <button className="edit-btn" onClick={() => openEdit(doc)}>Изменить</button>
                  <button className="delete-btn" onClick={() => handleDelete(doc.id, doc.title)}>Удалить</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {documents.length === 0 && <p className="empty-message">Нет документов</p>}
      </div>
    </div>
  );
};

export default DocumentsManager;
