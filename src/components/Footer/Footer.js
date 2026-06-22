import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getSettings } from '../../api/settings';
import './Footer.css';

const Footer = () => {
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const data = await getSettings();
        setSettings(data);
      } catch (err) {
        console.error('Ошибка загрузки настроек:', err);
      }
    };
    loadSettings();
  }, []);

  const footerInfo = settings?.footer;
  const social = settings?.social;

  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h3>{settings?.header?.title?.split('\n')[0] || 'Совет ректоров вузов ДФО'}</h3>
          <p>© {new Date().getFullYear()} {footerInfo?.copyright || 'Все права защищены'}</p>
          {social && (
            <div className="footer-social">
              {social.telegram && <a href={social.telegram} target="_blank" rel="noopener noreferrer">Telegram</a>}
              {social.vk && <a href={social.vk} target="_blank" rel="noopener noreferrer">VK</a>}
            </div>
          )}
        </div>

        <div className="footer-section">
          <h4>Контакты</h4>
          <p>Email: {footerInfo?.email || 'info@dvfu-rectorat.ru'}</p>
          <p>Телефон: {footerInfo?.phone || '+7 (423) 000-00-00'}</p>
        </div>

        <div className="footer-section">
          <h4>Полезные ссылки</h4>
          <a href="https://www.rsr-online.ru/" target="_blank" rel="noopener noreferrer">
            Российский союз ректоров
          </a>
          <br />
          <Link to="/login" className="footer-admin-link">
            Вход для администраторов
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
