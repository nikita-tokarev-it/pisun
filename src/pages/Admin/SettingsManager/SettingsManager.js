import React, { useState, useEffect } from 'react';
import { getSettings, updateSettings } from '../../../api/settings';
import './SettingsManager.css';

const SettingsManager = () => {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const data = await getSettings();
        setSettings(data);
      } catch (err) {
        console.error('Ошибка загрузки настроек:', err);
      } finally {
        setLoading(false);
      }
    };
    loadSettings();
  }, []);

  const handleInputChange = (section, field, value) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleParagraphChange = (index, value) => {
    const newParagraphs = [...settings.rectorGreeting.paragraphs];
    newParagraphs[index] = value;
    handleInputChange('rectorGreeting', 'paragraphs', newParagraphs);
  };

  const addParagraph = () => {
    const newParagraphs = [...settings.rectorGreeting.paragraphs, ''];
    handleInputChange('rectorGreeting', 'paragraphs', newParagraphs);
  };

  const removeParagraph = (index) => {
    const newParagraphs = settings.rectorGreeting.paragraphs.filter((_, i) => i !== index);
    handleInputChange('rectorGreeting', 'paragraphs', newParagraphs);
  };

  const handleSave = async () => {
    try {
      await updateSettings(settings);
      setMessage('Настройки успешно сохранены!');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      console.error('Ошибка сохранения:', err);
      setMessage('Ошибка при сохранении');
    }
  };

  if (loading) return <div className="admin-loading">Загрузка...</div>;
  if (!settings) return <div>Ошибка загрузки настроек</div>;

  return (
    <div className="settings-manager">
      <h1>Настройки сайта</h1>
      
      {message && <div className={`alert ${message.includes('Ошибка') ? 'alert-error' : 'alert-success'}`}>{message}</div>}

      <div className="settings-section">
        <h2>Приветствие ректора</h2>
        <div className="form-group">
          <label>Заголовок</label>
          <input 
            type="text" 
            value={settings.rectorGreeting.title} 
            onChange={(e) => handleInputChange('rectorGreeting', 'title', e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Текст приветствия (абзацы)</label>
          {settings.rectorGreeting.paragraphs.map((p, idx) => (
            <div key={idx} className="paragraph-item">
              <textarea 
                value={p} 
                onChange={(e) => handleParagraphChange(idx, e.target.value)}
                rows={3}
              />
              <button className="btn-remove" onClick={() => removeParagraph(idx)}>×</button>
            </div>
          ))}
          <button className="btn-add" onClick={addParagraph}>+ Добавить абзац</button>
        </div>
        <div className="form-group">
          <label>Подпись</label>
          <input 
            type="text" 
            value={settings.rectorGreeting.signature} 
            onChange={(e) => handleInputChange('rectorGreeting', 'signature', e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>URL фото ректора</label>
          <input 
            type="text" 
            value={settings.rectorGreeting.photo} 
            onChange={(e) => handleInputChange('rectorGreeting', 'photo', e.target.value)}
          />
        </div>
      </div>

      <div className="settings-section">
        <h2>Секретариат (Контакты)</h2>
        <div className="form-group">
          <label>Название</label>
          <input 
            type="text" 
            value={settings.secretariat.title} 
            onChange={(e) => handleInputChange('secretariat', 'title', e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Адрес</label>
          <input 
            type="text" 
            value={settings.secretariat.address} 
            onChange={(e) => handleInputChange('secretariat', 'address', e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Телефон</label>
          <input 
            type="text" 
            value={settings.secretariat.phone} 
            onChange={(e) => handleInputChange('secretariat', 'phone', e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Email</label>
          <input 
            type="text" 
            value={settings.secretariat.email} 
            onChange={(e) => handleInputChange('secretariat', 'email', e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Часы работы</label>
          <input 
            type="text" 
            value={settings.secretariat.workingHours} 
            onChange={(e) => handleInputChange('secretariat', 'workingHours', e.target.value)}
          />
        </div>
      </div>

      <div className="settings-section">
        <h2>Футер</h2>
        <div className="form-group">
          <label>Email в футере</label>
          <input 
            type="text" 
            value={settings.footer.email} 
            onChange={(e) => handleInputChange('footer', 'email', e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Телефон в футере</label>
          <input 
            type="text" 
            value={settings.footer.phone} 
            onChange={(e) => handleInputChange('footer', 'phone', e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Копирайт</label>
          <input 
            type="text" 
            value={settings.footer.copyright} 
            onChange={(e) => handleInputChange('footer', 'copyright', e.target.value)}
          />
        </div>
      </div>

      <button className="btn-save" onClick={handleSave}>Сохранить все изменения</button>
    </div>
  );
};

export default SettingsManager;
