import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getSettings } from '../../api/settings';
import './Footer.css';

const Footer = () => {
  const [footerInfo, setFooterInfo] = useState(null);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const data = await getSettings();
        setFooterInfo(data.footer);
      } catch (err) {
        console.error('Ошибка загрузки футера:', err);
      }
    };
    loadSettings();
  }, []);

  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h3>Совет ректоров вузов ДФО</h3>
          <p>© {new Date().getFullYear()} {footerInfo?.copyright || 'Все права защищены'}</p>
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
