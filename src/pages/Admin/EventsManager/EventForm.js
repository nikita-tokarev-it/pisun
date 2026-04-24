import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createEvent, updateEvent, getAdminEvents } from '../../../api/events';
import './EventsManager.css';

const EventForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [form, setForm] = useState({
    title: '',
    type: 'news',
    date: '',
    image: '',
    description: '',
    published: true,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isEdit) {
      const loadEvent = async () => {
        try {
          const events = await getAdminEvents();
          const event = events.find(e => e.id === id);
          if (event) {
            setForm({
              title: event.title,
              type: event.type,
              date: event.date,
              image: event.image,
              description: event.description,
              published: event.published,
            });
          }
        } catch (err) {
          setError('Ошибка загрузки');
        }
      };
      loadEvent();
    }
  }, [id, isEdit]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isEdit) {
        await updateEvent(id, form);
      } else {
        await createEvent(form);
      }
      navigate('/admin/events');
    } catch (err) {
      setError(err.response?.data?.error || 'Ошибка сохранения');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="event-form-page">
      <h1 className="admin-page-title">
        {isEdit ? 'Редактировать запись' : 'Новая запись'}
      </h1>

      {error && <div className="form-error">{error}</div>}

      <form onSubmit={handleSubmit} className="admin-form">
        <div className="form-group">
          <label>Название</label>
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Тип</label>
            <select name="type" value={form.type} onChange={handleChange}>
              <option value="news">Новость</option>
              <option value="event">Мероприятие</option>
            </select>
          </div>

          <div className="form-group">
            <label>Дата</label>
            <input
              type="date"
              name="date"
              value={form.date}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label>URL изображения</label>
          <input
            type="text"
            name="image"
            value={form.image}
            onChange={handleChange}
            placeholder="https://..."
          />
        </div>

        <div className="form-group">
          <label>Краткое описание</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={3}
          />
        </div>

        <div className="form-group">
          <label>Полный текст</label>
          <textarea
            name="fullContent"
            value={form.fullContent}
            onChange={handleChange}
            rows={10}
          />
        </div>

        <div className="form-group checkbox-group">
          <label>
            <input
              type="checkbox"
              name="published"
              checked={form.published}
              onChange={handleChange}
            />
            Опубликовано
          </label>
        </div>

        <div className="form-actions">
          <button type="submit" className="save-btn" disabled={loading}>
            {loading ? 'Сохранение...' : 'Сохранить'}
          </button>
          <button type="button" className="cancel-btn" onClick={() => navigate('/admin/events')}>
            Отмена
          </button>
        </div>
      </form>
    </div>
  );
};

export default EventForm;
