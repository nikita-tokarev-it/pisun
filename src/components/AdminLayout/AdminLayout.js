import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './AdminLayout.css';

const AdminLayout = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="admin-sidebar-header">
          <h2>Панель управления</h2>
          <p className="admin-role">
            {user?.role === 'admin' ? 'Администратор' : 'Редактор'}
          </p>
        </div>

        <nav className="admin-nav">
          <NavLink to="/admin" end className={({ isActive }) => isActive ? 'admin-nav-link active' : 'admin-nav-link'}>
            Главная
          </NavLink>
          <NavLink to="/admin/events" className={({ isActive }) => isActive ? 'admin-nav-link active' : 'admin-nav-link'}>
            Мероприятия и новости
          </NavLink>
          <NavLink to="/admin/press" className={({ isActive }) => isActive ? 'admin-nav-link active' : 'admin-nav-link'}>
            Пресс-материалы
          </NavLink>
          <NavLink to="/admin/documents" className={({ isActive }) => isActive ? 'admin-nav-link active' : 'admin-nav-link'}>
            Документы
          </NavLink>
          <NavLink to="/admin/councils" className={({ isActive }) => isActive ? 'admin-nav-link active' : 'admin-nav-link'}>
            Управление Советами
          </NavLink>
          {user?.role === 'admin' && (
            <>
              <NavLink to="/admin/users" className={({ isActive }) => isActive ? 'admin-nav-link active' : 'admin-nav-link'}>
                Пользователи
              </NavLink>
              <NavLink to="/admin/settings" className={({ isActive }) => isActive ? 'admin-nav-link active' : 'admin-nav-link'}>
                Настройки сайта
              </NavLink>
            </>
          )}
        </nav>

        <div className="admin-sidebar-footer">
          <NavLink to="/" className="admin-nav-link back-link">
            На сайт
          </NavLink>
          <button onClick={handleLogout} className="admin-logout-btn">
            Выйти ({user?.username})
          </button>
        </div>
      </aside>

      <main className="admin-main">
        {children}
      </main>
    </div>
  );
};

export default AdminLayout;
