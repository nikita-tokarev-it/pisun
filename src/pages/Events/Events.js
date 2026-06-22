import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getEvents } from '../../api/events';
import { formatDate } from '../../utils/formatters';
import './Events.css';

const Events = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState('all');
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadEvents = async () => {
      try {
        const data = await getEvents();
        setItems(data);
      } catch (err) {
        console.error('Ошибка загрузки:', err);
      } finally {
        setLoading(false);
      }
    };
    loadEvents();
  }, []);

  const filteredItems = filter === 'all'
    ? items
    : items.filter(item => item.type === filter);

  if (loading) {
    return (
      <div className="events">
        <h1 className="page-title">Мероприятия и новости</h1>
        <p style={{ textAlign: 'center', padding: '40px', color: '#666' }}>Загрузка...</p>
      </div>
    );
  }

  return (
    <div className="events container">
      <h1 className="page-title">Мероприятия и новости</h1>

      <div className="filter-buttons">
        <button
          className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
        >
          Все
        </button>
        <button
          className={`filter-btn ${filter === 'event' ? 'active' : ''}`}
          onClick={() => setFilter('event')}
        >
          Мероприятия
        </button>
        <button
          className={`filter-btn ${filter === 'news' ? 'active' : ''}`}
          onClick={() => setFilter('news')}
        >
          Новости
        </button>
      </div>

      <div className="events-grid">
        {filteredItems.map(item => (
          <article key={item.id} className="event-card">
            <div className="event-image">
              <img src={item.image} alt={item.title} />
              <span className={`event-badge ${item.type}`}>
                {item.type === 'event' ? 'Мероприятие' : 'Новость'}
              </span>
            </div>
            <div className="event-content">
              <p className="event-date">{formatDate(item.date)}</p>
              <h2 className="event-title">{item.title}</h2>              <p className="event-description">{item.description}</p>
              <button 
                className="read-more"
                onClick={() => navigate(`/events/${item.id}`)}
              >
                Читать полностью
              </button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};

export default Events;
