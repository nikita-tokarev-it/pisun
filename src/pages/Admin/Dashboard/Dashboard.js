import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAdminEvents } from '../../../api/events';
import { getAdminPressReleases, getAdminAnnouncements, getAdminPhotos, getAdminVideos } from '../../../api/press';
import { getAdminDocuments } from '../../../api/documents';
import { useAuth } from '../../../context/AuthContext';
import './Dashboard.css';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    events: 0,
    pressReleases: 0,
    announcements: 0,
    photos: 0,
    videos: 0,
    documents: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const [events, press, annc, photos, videos, docs] = await Promise.all([
          getAdminEvents(),
          getAdminPressReleases(),
          getAdminAnnouncements(),
          getAdminPhotos(),
          getAdminVideos(),
          getAdminDocuments(),
        ]);
        setStats({
          events: events.length,
          pressReleases: press.length,
          announcements: annc.length,
          photos: photos.length,
          videos: videos.length,
          documents: docs.length,
        });
      } catch (err) {
        console.error('Ошибка загрузки статистики:', err);
      } finally {
        setLoading(false);
      }
    };
    loadStats();
  }, []);

  if (loading) return <div className="admin-loading">Загрузка...</div>;

  return (
    <div className="dashboard">
      <h1 className="admin-page-title">
        Добро пожаловать, {user?.username}!
      </h1>

      <div className="stats-grid">
        <Link to="/admin/events" className="stat-card">
          <div className="stat-number">{stats.events}</div>
          <div className="stat-label">Мероприятия и новости</div>
        </Link>
        <Link to="/admin/press" className="stat-card">
          <div className="stat-number">{stats.pressReleases}</div>
          <div className="stat-label">Пресс-релизы</div>
        </Link>
        <Link to="/admin/press" className="stat-card">
          <div className="stat-number">{stats.announcements}</div>
          <div className="stat-label">Анонсы</div>
        </Link>
        <Link to="/admin/press" className="stat-card">
          <div className="stat-number">{stats.photos}</div>
          <div className="stat-label">Фотоматериалы</div>
        </Link>
        <Link to="/admin/press" className="stat-card">
          <div className="stat-number">{stats.videos}</div>
          <div className="stat-label">Видеоматериалы</div>
        </Link>
        <Link to="/admin/documents" className="stat-card">
          <div className="stat-number">{stats.documents}</div>
          <div className="stat-label">Документы</div>
        </Link>
        <Link to="/admin/councils" className="stat-card">
          <div className="stat-number">Управление</div>
          <div className="stat-label">Составы советов</div>
        </Link>
        <Link to="/admin/settings" className="stat-card">
          <div className="stat-number">CMS</div>
          <div className="stat-label">Настройки контента</div>
        </Link>
      </div>
    </div>
  );
};

export default Dashboard;
