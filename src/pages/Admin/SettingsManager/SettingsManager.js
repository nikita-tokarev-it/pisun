import React, { useState, useEffect } from 'react';
import { getSettings, updateSettings } from '../../../api/settings';
import './SettingsManager.css';

const SettingsManager = () => {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [activeTab, setActiveTab] = useState('general');

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const data = await getSettings();
        // Enforce all required fields for maximum freedom
        const enrichedData = {
          header: { 
            rsrText: 'РОССИЙСКИЙ СОЮЗ РЕКТОРОВ', 
            rsrUrl: 'https://www.rsr-online.ru/',
            title: 'СОВЕТ РЕКТОРОВ ВУЗОВ\nДАЛЬНЕВОСТОЧНОГО\nФЕДЕРАЛЬНОГО ОКРУГА',
            description: 'Совет ректоров вузов Дальневосточного федерального округа создан...',
            ...data.header 
          },
          navigation: data.navigation || [],
          social: { telegram: '', vk: '', ...data.social },
          rectorGreeting: { title: '', paragraphs: [], signature: '', photo: '', ...data.rectorGreeting },
          secretariat: { title: '', address: '', phone: '', email: '', workingHours: '', ...data.secretariat },
          footer: { email: '', phone: '', copyright: '', ...data.footer },
          aboutStructure: {
            zam: data.aboutStructure?.zam || [],
            secretariatMembers: data.aboutStructure?.secretariatMembers || [],
            prezidium: data.aboutStructure?.prezidium || []
          },
          ...data
        };
        setSettings(enrichedData);
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
      [section]: { ...prev[section], [field]: value }
    }));
  };

  const handleListChange = (section, listField, index, field, value) => {
    const newList = [...settings[section][listField]];
    if (field === null) {
      newList[index] = value;
    } else {
      newList[index] = { ...newList[index], [field]: value };
    }
    setSettings(prev => ({
      ...prev,
      [section]: { ...prev[section], [listField]: newList }
    }));
  };

  const addListItem = (section, listField, defaultValue) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [listField]: [...prev[section][listField], defaultValue]
      }
    }));
  };

  const removeListItem = (section, listField, index) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [listField]: prev[section][listField].filter((_, i) => i !== index)
      }
    }));
  };

  const handleSave = async () => {
    try {
      await updateSettings(settings);
      setMessage('СИСТЕМА ОБНОВЛЕНА: Настройки сохранены успешно.');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setMessage('ОШИБКА СИСТЕМЫ: Сохранение не удалось.');
    }
  };

  if (loading) return <div className="admin-loading">ACCESSING CORE DATA...</div>;

  return (
    <div className="settings-manager">
      <h1 className="admin-page-title">Управление Контентом (CMS)</h1>
      
      {message && <div className={`alert ${message.includes('ОШИБКА') ? 'alert-error' : 'alert-success'}`}>{message}</div>}

      <div className="admin-tabs">
        <button className={activeTab === 'general' ? 'active' : ''} onClick={() => setActiveTab('general')}>ОСНОВНОЕ</button>
        <button className={activeTab === 'home' ? 'active' : ''} onClick={() => setActiveTab('home')}>ГЛАВНАЯ</button>
        <button className={activeTab === 'about' ? 'active' : ''} onClick={() => setActiveTab('about')}>О СОВЕТЕ</button>
        <button className={activeTab === 'contacts' ? 'active' : ''} onClick={() => setActiveTab('contacts')}>КОНТАКТЫ/ФУТЕР</button>
      </div>

      <div className="settings-tab-content">
        {activeTab === 'general' && (
          <>
            <div className="settings-section">
              <h2>ШАПКА И БРЕНДИНГ</h2>
              <div className="form-group">
                <label>Верхняя ссылка (РСР)</label>
                <div className="input-group">
                  <input placeholder="Текст" value={settings.header.rsrText} onChange={(e) => handleInputChange('header', 'rsrText', e.target.value)} />
                  <input placeholder="URL" value={settings.header.rsrUrl} onChange={(e) => handleInputChange('header', 'rsrUrl', e.target.value)} />
                </div>
              </div>
              <div className="form-group">
                <label>Основной заголовок (Council Name)</label>
                <textarea rows={3} value={settings.header.title} onChange={(e) => handleInputChange('header', 'title', e.target.value)} />
              </div>
              <div className="form-group">
                <label>Краткое описание</label>
                <textarea rows={4} value={settings.header.description} onChange={(e) => handleInputChange('header', 'description', e.target.value)} />
              </div>
            </div>

            <div className="settings-section">
              <h2>НАВИГАЦИОННОЕ МЕНЮ</h2>
              {settings.navigation.map((item, idx) => (
                <div key={idx} className="list-item-edit">
                  <input placeholder="Название" value={item.title} onChange={(e) => {
                    const newNav = [...settings.navigation];
                    newNav[idx].title = e.target.value;
                    setSettings({ ...settings, navigation: newNav });
                  }} />
                  <input placeholder="Путь" value={item.path} onChange={(e) => {
                    const newNav = [...settings.navigation];
                    newNav[idx].path = e.target.value;
                    setSettings({ ...settings, navigation: newNav });
                  }} />
                  <button className="btn-remove" onClick={() => {
                    const newNav = settings.navigation.filter((_, i) => i !== idx);
                    setSettings({ ...settings, navigation: newNav });
                  }}>×</button>
                </div>
              ))}
              <button className="btn-add" onClick={() => setSettings({ ...settings, navigation: [...settings.navigation, { title: '', path: '' }] })}>+ ДОБАВИТЬ ПУНКТ</button>
            </div>
          </>
        )}

        {activeTab === 'home' && (
          <div className="settings-section">
            <h2>ПРИВЕТСТВИЕ ПРЕДСЕДАТЕЛЯ</h2>
            <div className="form-group">
              <label>Заголовок приветствия</label>
              <input value={settings.rectorGreeting.title} onChange={(e) => handleInputChange('rectorGreeting', 'title', e.target.value)} />
            </div>
            <div className="form-group">
              <label>Текст (абзацы)</label>
              {settings.rectorGreeting.paragraphs.map((p, idx) => (
                <div key={idx} className="list-item-edit">
                  <textarea rows={3} value={p} onChange={(e) => handleListChange('rectorGreeting', 'paragraphs', idx, null, e.target.value)} />
                  <button className="btn-remove" onClick={() => removeListItem('rectorGreeting', 'paragraphs', idx)}>×</button>
                </div>
              ))}
              <button className="btn-add" onClick={() => addListItem('rectorGreeting', 'paragraphs', '')}>+ ДОБАВИТЬ АБЗАЦ</button>
            </div>
            <div className="form-group">
              <label>Подпись</label>
              <input value={settings.rectorGreeting.signature} onChange={(e) => handleInputChange('rectorGreeting', 'signature', e.target.value)} />
            </div>
            <div className="form-group">
              <label>URL Фотографии</label>
              <input value={settings.rectorGreeting.photo} onChange={(e) => handleInputChange('rectorGreeting', 'photo', e.target.value)} />
            </div>
          </div>
        )}

        {activeTab === 'about' && (
          <>
            <div className="settings-section">
              <h2>СТРУКТУРА: ЗАМЕСТИТЕЛИ</h2>
              {settings.aboutStructure.zam.map((item, idx) => (
                <div key={idx} className="list-item-edit-large">
                  <textarea rows={2} placeholder="ФИО и Регалии" value={item} onChange={(e) => handleListChange('aboutStructure', 'zam', idx, null, e.target.value)} />
                  <button className="btn-remove" onClick={() => removeListItem('aboutStructure', 'zam', idx)}>×</button>
                </div>
              ))}
              <button className="btn-add" onClick={() => addListItem('aboutStructure', 'zam', '')}>+ ДОБАВИТЬ ЗАМЕСТИТЕЛЯ</button>
            </div>

            <div className="settings-section">
              <h2>СТРУКТУРА: ПРЕЗИДИУМ</h2>
              {settings.aboutStructure.prezidium.map((item, idx) => (
                <div key={idx} className="list-item-edit-large">
                  <textarea rows={2} placeholder="ФИО и описание" value={item} onChange={(e) => handleListChange('aboutStructure', 'prezidium', idx, null, e.target.value)} />
                  <button className="btn-remove" onClick={() => removeListItem('aboutStructure', 'prezidium', idx)}>×</button>
                </div>
              ))}
              <button className="btn-add" onClick={() => addListItem('aboutStructure', 'prezidium', '')}>+ ДОБАВИТЬ ЧЛЕНА ПРЕЗИДИУМА</button>
            </div>

            <div className="settings-section">
              <h2>СТРУКТУРА: СЕКРЕТАРИАТ</h2>
              {settings.aboutStructure.secretariatMembers.map((item, idx) => (
                <div key={idx} className="list-item-edit-group">
                  <input placeholder="ФИО" value={item.name} onChange={(e) => handleListChange('aboutStructure', 'secretariatMembers', idx, 'name', e.target.value)} />
                  <input placeholder="Должность" value={item.role} onChange={(e) => handleListChange('aboutStructure', 'secretariatMembers', idx, 'role', e.target.value)} />
                  <input placeholder="Email" value={item.email} onChange={(e) => handleListChange('aboutStructure', 'secretariatMembers', idx, 'email', e.target.value)} />
                  <input placeholder="Телефон" value={item.phone} onChange={(e) => handleListChange('aboutStructure', 'secretariatMembers', idx, 'phone', e.target.value)} />
                  <button className="btn-remove" onClick={() => removeListItem('aboutStructure', 'secretariatMembers', idx)}>×</button>
                </div>
              ))}
              <button className="btn-add" onClick={() => addListItem('aboutStructure', 'secretariatMembers', { name: '', role: '', email: '', phone: '' })}>+ ДОБАВИТЬ ЧЛЕНА СЕКРЕТАРИАТА</button>
            </div>
          </>
        )}

        {activeTab === 'contacts' && (
          <>
            <div className="settings-section">
              <h2>КОНТАКТЫ СЕКРЕТАРИАТА</h2>
              <div className="form-group">
                <label>Заголовок блока</label>
                <input value={settings.secretariat.title} onChange={(e) => handleInputChange('secretariat', 'title', e.target.value)} />
              </div>
              <div className="form-group">
                <label>Адрес</label>
                <input value={settings.secretariat.address} onChange={(e) => handleInputChange('secretariat', 'address', e.target.value)} />
              </div>
              <div className="form-group">
                <label>Телефоны</label>
                <input value={settings.secretariat.phone} onChange={(e) => handleInputChange('secretariat', 'phone', e.target.value)} />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input value={settings.secretariat.email} onChange={(e) => handleInputChange('secretariat', 'email', e.target.value)} />
              </div>
              <div className="form-group">
                <label>Часы работы</label>
                <input value={settings.secretariat.workingHours} onChange={(e) => handleInputChange('secretariat', 'workingHours', e.target.value)} />
              </div>
            </div>

            <div className="settings-section">
              <h2>СОЦИАЛЬНЫЕ СЕТИ</h2>
              <div className="input-group">
                <div className="form-group">
                  <label>Telegram URL</label>
                  <input value={settings.social.telegram} onChange={(e) => handleInputChange('social', 'telegram', e.target.value)} />
                </div>
                <div className="form-group">
                  <label>VK URL</label>
                  <input value={settings.social.vk} onChange={(e) => handleInputChange('social', 'vk', e.target.value)} />
                </div>
              </div>
            </div>

            <div className="settings-section">
              <h2>ФУТЕР</h2>
              <div className="form-group">
                <label>Текст копирайта</label>
                <input value={settings.footer.copyright} onChange={(e) => handleInputChange('footer', 'copyright', e.target.value)} />
              </div>
              <div className="input-group">
                <div className="form-group">
                  <label>Email в футере</label>
                  <input value={settings.footer.email} onChange={(e) => handleInputChange('footer', 'email', e.target.value)} />
                </div>
                <div className="form-group">
                  <label>Телефон в футере</label>
                  <input value={settings.footer.phone} onChange={(e) => handleInputChange('footer', 'phone', e.target.value)} />
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      <button className="btn-save sticky-save" onClick={handleSave}>ЗАФИКСИРОВАТЬ ВСЕ ИЗМЕНЕНИЯ</button>
    </div>
  );
};

export default SettingsManager;
