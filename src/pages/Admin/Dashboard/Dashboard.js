import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAdminEvents } from '../../../api/events';
import { getAdminDocuments } from '../../../api/documents';
import { getAdminMainCouncils, getAdminRegionalCouncils } from '../../../api/councils';
import { useAuth } from '../../../context/AuthContext';
import './Dashboard.css';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    events: 0,
    documents: 0,
    councils: 0,
    regCouncils: 0
  });
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    const loadStats = async () => {
      try {
        const [events, docs, mainC, regC] = await Promise.all([
          getAdminEvents(),
          getAdminDocuments(),
          getAdminMainCouncils(),
          getAdminRegionalCouncils()
        ]);
        setStats({
          events: events.length,
          documents: docs.length,
          councils: mainC.length,
          regCouncils: regC.length
        });
      } catch (err) {
        console.error('Ошибка загрузки статистики:', err);
      } finally {
        setLoading(false);
      }
    };
    loadStats();
    return () => clearInterval(timer);
  }, []);

  if (loading) return <div className="admin-loading">Загрузка данных...</div>;

  return (
    <div className="dashboard">
      <div className="dashboard-info-bar">
        <div className="info-block">
          <span className="info-label">Текущий пользователь</span>
          <span className="info-value">{user?.username} ({user?.role === 'admin' ? 'Администратор' : 'Редактор'})</span>
        </div>
        <div className="info-block">
          <span className="info-label">Статус системы</span>
          <span className="info-value status-active">Штатный режим</span>
        </div>
        <div className="info-block">
          <span className="info-label">Локальное время</span>
          <span className="info-value">{currentTime.toLocaleTimeString()}</span>
        </div>
      </div>

      <h1 className="admin-page-title">
        Панель управления
      </h1>

      <div className="admin-stats-grid">
        <Link to="/admin/events" className="stat-card">
          <div className="stat-number">{stats.events}</div>
          <div className="stat-label">Мероприятия / Новости</div>
        </Link>
        <Link to="/admin/documents" className="stat-card">
          <div className="stat-number">{stats.documents}</div>
          <div className="stat-label">Документы</div>
        </Link>
        <Link to="/admin/councils" className="stat-card">
          <div className="stat-number">{stats.councils + stats.regCouncils}</div>
          <div className="stat-label">Составы советов</div>
        </Link>
        <Link to="/admin/map" className="stat-card">
          <div className="stat-number">карта</div>
          <div className="stat-label">Интерактивная карта</div>
        </Link>
        <Link to="/admin/settings" className="stat-card">
          <div className="stat-number">CMS</div>
          <div className="stat-label">Настройки контента</div>
        </Link>
      </div>

      <div className="dashboard-footer-info">
        <p>Для изменения структуры меню или контактной информации перейдите в раздел "Настройки контента".</p>
        <p>Все изменения применяются мгновенно после сохранения.</p>
      </div>
    </div>
  );
};

export default Dashboard;
