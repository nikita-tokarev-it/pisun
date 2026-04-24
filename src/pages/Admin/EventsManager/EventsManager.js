import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAdminEvents, deleteEvent } from '../../../api/events';
import { formatDate } from '../../../utils/formatters';
import './EventsManager.css';

const EventsManager = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const loadEvents = async () => {
    try {
      const data = await getAdminEvents();
      setEvents(data);
    } catch (err) {
      console.error('Ошибка загрузки:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadEvents(); }, []);

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Удалить "${title}"?`)) return;
    try {
      await deleteEvent(id);
      setEvents(events.filter(e => e.id !== id));
    } catch (err) {
      alert('Ошибка удаления');
    }
  };

  if (loading) return <div className="admin-loading">Загрузка...</div>;

  return (
    <div className="events-manager">
      <div className="manager-header">
        <h1 className="admin-page-title">Мероприятия и новости</h1>
        <button className="add-btn" onClick={() => navigate('/admin/events/new')}>
          + Добавить
        </button>
      </div>

      <div className="admin-table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Название</th>
              <th>Тип</th>
              <th>Дата</th>
              <th>Статус</th>
              <th>Действия</th>
            </tr>
          </thead>
          <tbody>
            {events.map(event => (
              <tr key={event.id}>
                <td className="title-cell">{event.title}</td>
                <td>
                  <span className={`type-badge ${event.type}`}>
                    {event.type === 'event' ? 'Мероприятие' : 'Новость'}
                  </span>
                </td>
                <td>{formatDate(event.date)}</td>
                <td>
                  <span className={`status-badge ${event.published ? 'published' : 'draft'}`}>
                    {event.published ? 'Опубликовано' : 'Черновик'}
                  </span>
                </td>
                <td className="actions-cell">
                  <button className="edit-btn" onClick={() => navigate(`/admin/events/${event.id}/edit`)}>
                    Изменить
                  </button>
                  <button className="delete-btn" onClick={() => handleDelete(event.id, event.title)}>
                    Удалить
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {events.length === 0 && (
          <p className="empty-message">Нет записей</p>
        )}
      </div>
    </div>
  );
};

export default EventsManager;
