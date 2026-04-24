import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getEvents } from '../../api/events';
import { getSettings } from '../../api/settings';
import { formatDate } from '../../utils/formatters';
import './Home.css';

const Home = () => {
  const [news, setNews] = useState([]);
  const [greeting, setGreeting] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadData = async () => {
      try {
        const [newsData, settingsData] = await Promise.all([
          getEvents(),
          getSettings()
        ]);
        setNews(newsData.slice(0, 3));
        setGreeting(settingsData.rectorGreeting);
      } catch (err) {
        console.error('Ошибка загрузки данных:', err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  if (loading) return <div className="loading">Загрузка...</div>;

  return (
    <div className="home">
      {greeting && (
        <section className="greeting-section">
          <div className="greeting-content">
            <div className="rector-photo">
              <img
                src={greeting.photo}
                alt="Председатель Совета"
              />
            </div>

            <div className="greeting-text">
              <h2 className="greeting-title">{greeting.title}</h2>

              {greeting.paragraphs.map((p, idx) => (
                <p key={idx} className="greeting-paragraph">{p}</p>
              ))}

              <p className="greeting-signature">
                {greeting.signature}
              </p>
            </div>
          </div>
        </section>
      )}

      <section className="news-section">
        <h2 className="section-title">Мероприятия и новости</h2>

        <div className="news-grid">
          {news.map(item => (
            <article key={item.id} className="news-card">
              <div className="news-image">
                <img src={item.image} alt={item.title} />
              </div>
              <div className="news-content">
                <h3>{item.title}</h3>
                <p className="news-date">{formatDate(item.date)}</p>
                <p>{item.description}</p>
                <button
                  className="read-more-btn"
                  onClick={() => navigate(`/events/${item.id}`)}
                >
                  Читать полностью
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
