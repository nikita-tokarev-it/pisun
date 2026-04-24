import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { getPressReleaseById, getAnnouncementById } from '../../api/press';
import { formatDate } from '../../utils/formatters';
import './PressDetail.css';

const PressDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const isAnnouncement = location.pathname.includes('/announcement/');
  const typeLabel = isAnnouncement ? 'Анонс' : 'Пресс-релиз';

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const data = isAnnouncement 
          ? await getAnnouncementById(id)
          : await getPressReleaseById(id);
        setItem(data);
      } catch (err) {
        console.error(`Ошибка при загрузке ${typeLabel.toLowerCase()}:`, err);
        setError(`Не удалось загрузить ${typeLabel.toLowerCase()}`);
      } finally {
        setLoading(false);
      }
    };

    fetchItem();
  }, [id, isAnnouncement, typeLabel]);

  if (loading) {
    return (
      <div className="press-detail">
        <div className="loading">Загрузка...</div>
      </div>
    );
  }

  if (error || !item) {
    return (
      <div className="press-detail">
        <button className="back-btn" onClick={() => navigate('/press')}>
          ← Вернуться в раздел для прессы
        </button>
        <div className="error">{error || `${typeLabel} не найден`}</div>
      </div>
    );
  }

  return (
    <div className="press-detail">
      <button className="back-btn" onClick={() => navigate('/press')}>
        ← Назад в раздел для прессы
      </button>
      
      <article className="press-full-content">
        <header className="press-detail-header">
          <p className="press-date">{formatDate(item.date)}</p>
          <h1 className="press-title">{item.title}</h1>
        </header>

        <div className="press-detail-body">
          {item.description && (
            <section className="press-description-section">
              <p className="description-lead">{item.description}</p>
              <hr className="content-divider" />
            </section>
          )}
          
          <div className="full-content-body">
            {item.fullContent && item.fullContent.split('\n').map((paragraph, index) => (
              paragraph.trim() && <p key={index}>{paragraph}</p>
            ))}
          </div>
        </div>
      </article>
    </div>
  );
};

export default PressDetail;
