import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getPressReleases, getAnnouncements, getPhotos, getVideos } from '../../api/press';
import { formatDate } from '../../utils/formatters';
import './Press.css';

const Press = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('releases');
  const [pressReleases, setPressReleases] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [photos, setPhotos] = useState([]);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [pr, an, ph, vi] = await Promise.all([
          getPressReleases(),
          getAnnouncements(),
          getPhotos(),
          getVideos(),
        ]);
        setPressReleases(pr);
        setAnnouncements(an);
        setPhotos(ph);
        setVideos(vi);
      } catch (err) {
        console.error('Ошибка загрузки:', err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="press">
        <h1 className="page-title">Для прессы</h1>
        <p style={{ textAlign: 'center', padding: '40px', color: '#666' }}>Загрузка...</p>
      </div>
    );
  }

  return (
    <div className="press">
      <h1 className="page-title">Для прессы</h1>

      <div className="tabs">
        <button
          className={`tab-button ${activeTab === 'releases' ? 'active' : ''}`}
          onClick={() => setActiveTab('releases')}
        >
          Пресс-релизы
        </button>
        <button
          className={`tab-button ${activeTab === 'announcements' ? 'active' : ''}`}
          onClick={() => setActiveTab('announcements')}
        >
          Анонсы
        </button>
        <button
          className={`tab-button ${activeTab === 'photos' ? 'active' : ''}`}
          onClick={() => setActiveTab('photos')}
        >
          Фотоматериалы
        </button>
        <button
          className={`tab-button ${activeTab === 'videos' ? 'active' : ''}`}
          onClick={() => setActiveTab('videos')}
        >
          Видеоматериалы
        </button>
        <button
          className={`tab-button ${activeTab === 'contacts' ? 'active' : ''}`}
          onClick={() => setActiveTab('contacts')}
        >
          Контакты для СМИ
        </button>
      </div>

      <div className="tab-content">
        {activeTab === 'releases' && (
          <div className="press-list">
            {pressReleases.map(item => (
              <article key={item.id} className="press-item">
                <div className="press-item-header">
                  <h3>{item.title}</h3>
                  <span className="press-date">{formatDate(item.date)}</span>
                </div>
                <p>{item.description}</p>
                <button 
                  className="read-more-btn"
                  onClick={() => navigate(`/press/release/${item.id}`)}
                >
                  Читать полностью
                </button>
                </article>            ))}
          </div>
        )}

        {activeTab === 'announcements' && (
          <div className="press-list">
            {announcements.map(item => (
              <article key={item.id} className="press-item announcement">
                <div className="press-item-header">
                  <h3>{item.title}</h3>
                  <span className="press-date">{formatDate(item.date)}</span>
                </div>
                <p>{item.description}</p>
                <button 
                  className="read-more-btn"
                  onClick={() => navigate(`/press/announcement/${item.id}`)}
                >
                  Подробнее
                </button>
                </article>            ))}
          </div>
        )}

        {activeTab === 'photos' && (
          <div className="media-grid">
            {photos.map(photo => (
              <div 
                key={photo.id} 
                className="media-item clickable"
                onClick={() => setSelectedPhoto(photo)}
              >
                <img src={photo.image} alt={photo.title} />
                <div className="media-info">
                  <h4>{photo.title}</h4>
                  <span>{formatDate(photo.date)}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'videos' && (
          <div className="media-grid">
            {videos.map(video => (
              <div 
                key={video.id} 
                className="media-item video"
                onClick={() => setSelectedVideo(video)}
              >
                <div className="video-thumbnail">
                  <img src={video.thumbnail} alt={video.title} />
                  <div className="play-icon">▶</div>
                </div>
                <div className="media-info">
                  <h4>{video.title}</h4>
                  <span>{formatDate(video.date)}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'contacts' && (
          <div className="press-contacts">
            <h2>Контактная информация для СМИ</h2>
            <div className="contact-cards">
              <div className="contact-card">
                <h3>Пресс-служба Совета ректоров вузов ДФО</h3>
                <div className="contact-item">
                  <strong>Ответственный:</strong>
                  <p>Иванова Мария Петровна</p>
                </div>
                <div className="contact-item">
                  <strong>Телефон:</strong>
                  <p>+7 (423) 123-45-67</p>
                </div>
                <div className="contact-item">
                  <strong>Email:</strong>
                  <p>press@dvfu-rectorat.ru</p>
                </div>
                <div className="contact-item">
                  <strong>Время работы:</strong>
                  <p>Пн-Пт: 9:00 - 18:00</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {selectedVideo && (
        <div className="video-modal-overlay" onClick={() => setSelectedVideo(null)}>
          <div className="video-modal" onClick={(e) => e.stopPropagation()}>
            <button className="close-modal" onClick={() => setSelectedVideo(null)}>×</button>
            <div className="video-player-container">
              {selectedVideo.videoUrl ? (
                (() => {
                  const url = selectedVideo.videoUrl;
                  const isYouTube = url.includes('youtube.com') || url.includes('youtu.be');
                  
                  if (isYouTube) {
                    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
                    const match = url.match(regExp);
                    const videoId = (match && match[2].length === 11) ? match[2] : null;
                    
                    if (videoId) {
                      return (
                        <iframe
                          width="100%"
                          height="450"
                          src={`https://www.youtube.com/embed/${videoId}`}
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                          title={selectedVideo.title}
                        ></iframe>
                      );
                    }
                  }
                  
                  return (
                    <video width="100%" controls autoPlay>
                      <source src={url} type="video/mp4" />
                      Ваш браузер не поддерживает видео.
                    </video>
                  );
                })()
              ) : (
                <div className="no-video">Видео временно недоступно</div>
              )}
            </div>
            <div className="video-modal-info">
              <h3>{selectedVideo.title}</h3>
              <p>{formatDate(selectedVideo.date)}</p>
            </div>
          </div>
        </div>
      )}

      {selectedPhoto && (
        <div className="video-modal-overlay" onClick={() => setSelectedPhoto(null)}>
          <div className="video-modal photo-modal" onClick={(e) => e.stopPropagation()}>
            <button className="close-modal" onClick={() => setSelectedPhoto(null)}>×</button>
            <div className="photo-container">
              <img src={selectedPhoto.image} alt={selectedPhoto.title} />
            </div>
            <div className="video-modal-info">
              <h3>{selectedPhoto.title}</h3>
              <p>{formatDate(selectedPhoto.date)}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Press;
