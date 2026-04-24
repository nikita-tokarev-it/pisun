import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getEventById } from '../../api/events';
import { formatDate } from '../../utils/formatters';
import './EventDetail.css';

const EventDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const data = await getEventById(id);
        setEvent(data);
      } catch (err) {
        console.error('Ошибка при загрузке мероприятия:', err);
        setError('Не удалось загрузить мероприятие');
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

  if (loading) {
    return (
      <div className="event-detail">
        <div className="loading">Загрузка...</div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="event-detail">
        <button className="back-btn" onClick={() => navigate('/events')}>
          ← Вернуться к списку
        </button>
        <div className="error">{error || 'Мероприятие не найдено'}</div>
      </div>
    );
  }

  return (
    <div className="event-detail">
      <button className="back-btn" onClick={() => navigate('/events')}>
        ← Назад к списку
      </button>
      
      <article className="event-full-content">
        <header className="event-detail-header">
          <p className="event-date">{formatDate(event.date)}</p>
          <h1 className="event-title">{event.title}</h1>
        </header>

        {event.image && (
          <div className="event-detail-image">
            <img src={event.image} alt={event.title} />
          </div>
        )}

        <div className="event-detail-body">
          {event.description && (
            <section className="event-description-section">
              <p className="description-lead">{event.description}</p>
              <hr className="content-divider" />
            </section>
          )}
          
          <div className="full-content-body">
            {event.fullContent && event.fullContent.split('\n').map((paragraph, index) => (
              paragraph.trim() && <p key={index}>{paragraph}</p>
            ))}
          </div>
        </div>
      </article>
    </div>
  );
};

export default EventDetail;
