import React, { useState, useEffect } from 'react';
import { 
  getAdminMainCouncils, createMainCouncil, updateMainCouncil, deleteMainCouncil,
  getAdminRegionalCouncils, createRegionalCouncil, updateRegionalCouncil, deleteRegionalCouncil
} from '../../../api/councils';
import './CouncilsManager.css';

const CouncilsManager = () => {
  const [mainCouncils, setMainCouncils] = useState([]);
  const [regionalCouncils, setRegionalCouncils] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('main');
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [main, regional] = await Promise.all([
        getAdminMainCouncils(),
        getAdminRegionalCouncils()
      ]);
      // Sort by position initially
      setMainCouncils(main.sort((a, b) => (a.position || 0) - (b.position || 0)));
      setRegionalCouncils(regional.sort((a, b) => (a.position || 0) - (b.position || 0)));
    } catch (err) {
      console.error('Ошибка загрузки данных:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData(item);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancel = () => {
    setEditingItem(null);
    setFormData({});
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (activeTab === 'main') {
        if (editingItem?.id) {
          await updateMainCouncil(editingItem.id, formData);
        } else {
          // New item gets last position
          const maxPos = mainCouncils.reduce((max, c) => Math.max(max, c.position || 0), 0);
          await createMainCouncil({ ...formData, position: maxPos + 1 });
        }
      } else {
        if (editingItem?.id) {
          await updateRegionalCouncil(editingItem.id, formData);
        } else {
          const maxPos = regionalCouncils.reduce((max, c) => Math.max(max, c.position || 0), 0);
          await createRegionalCouncil({ ...formData, position: maxPos + 1 });
        }
      }
      handleCancel();
      loadData();
    } catch (err) {
      console.error('Ошибка сохранения:', err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Вы уверены?')) return;
    try {
      if (activeTab === 'main') {
        await deleteMainCouncil(id);
      } else {
        await deleteRegionalCouncil(id);
      }
      loadData();
    } catch (err) {
      console.error('Ошибка удаления:', err);
    }
  };

  const moveItem = async (index, direction) => {
    const list = activeTab === 'main' ? [...mainCouncils] : [...regionalCouncils];
    const targetIndex = index + direction;
    
    if (targetIndex < 0 || targetIndex >= list.length) return;
    
    const currentItem = list[index];
    const otherItem = list[targetIndex];
    
    // Swap positions
    const currentPos = currentItem.position || 0;
    const otherPos = otherItem.position || 0;
    
    setLoading(true);
    try {
      if (activeTab === 'main') {
        await Promise.all([
          updateMainCouncil(currentItem.id, { ...currentItem, position: otherPos }),
          updateMainCouncil(otherItem.id, { ...otherItem, position: currentPos })
        ]);
      } else {
        await Promise.all([
          updateRegionalCouncil(currentItem.id, { ...currentItem, position: otherPos }),
          updateRegionalCouncil(otherItem.id, { ...otherItem, position: currentPos })
        ]);
      }
      loadData();
    } catch (err) {
      console.error('Ошибка при перемещении:', err);
      setLoading(false);
    }
  };

  const moveGroup = async (groupIndex, direction) => {
    const targetIndex = groupIndex + direction;
    if (targetIndex < 0 || targetIndex >= groupedList.length) return;

    const newGroups = [...groupedList];
    // Swap groups in the array
    [newGroups[groupIndex], newGroups[targetIndex]] = [newGroups[targetIndex], newGroups[groupIndex]];

    setLoading(true);
    try {
      const promises = [];
      newGroups.forEach((group, index) => {
        group.items.forEach(item => {
          // If group_position has changed, update the DB
          if (item.group_position !== index) {
            const updateFn = activeTab === 'main' ? updateMainCouncil : updateRegionalCouncil;
            promises.push(updateFn(item.id, { ...item, group_position: index }));
          }
        });
      });
      await Promise.all(promises);
      loadData();
    } catch (err) {
      console.error('Ошибка перемещения группы:', err);
      setLoading(false);
    }
  };

  const groupData = (data, key) => {
    const groupsMap = {};
    data.forEach(item => {
      const groupName = item[key] || 'Без названия';
      if (!groupsMap[groupName]) {
        groupsMap[groupName] = { 
          name: groupName, 
          group_position: item.group_position !== undefined ? item.group_position : 999, 
          items: [] 
        };
      }
      // Set group position to the minimum found among items in the group to auto-heal
      if (item.group_position !== undefined && item.group_position < groupsMap[groupName].group_position) {
        groupsMap[groupName].group_position = item.group_position;
      }
      groupsMap[groupName].items.push(item);
    });

    return Object.values(groupsMap).sort((a, b) => a.group_position - b.group_position);
  };

  if (loading) return <div className="admin-loading">Загрузка данных...</div>;

  const currentList = activeTab === 'main' ? mainCouncils : regionalCouncils;
  const groupedList = groupData(currentList, activeTab === 'main' ? 'council' : 'region');

  return (
    <div className="councils-manager">
      <h1 className="admin-page-title">Управление Советами</h1>

      <div className="admin-tabs">
        <button 
          className={activeTab === 'main' ? 'active' : ''} 
          onClick={() => { setActiveTab('main'); handleCancel(); }}
        >
          Президиум и Секретариат
        </button>
        <button 
          className={activeTab === 'regional' ? 'active' : ''} 
          onClick={() => { setActiveTab('regional'); handleCancel(); }}
        >
          Региональные Советы
        </button>
      </div>

      <div className="manager-grid">
        <div className="form-section">
          <div className="admin-card">
            <h2>{editingItem?.id ? 'Редактировать' : 'Добавить'} запись</h2>
            <form onSubmit={handleSubmit} className="admin-form">
              {activeTab === 'main' ? (
                <>
                  <div className="form-group">
                    <label>Название совета (Группа)</label>
                    <input list="councils-list" name="council" value={formData.council || ''} onChange={handleInputChange} required />
                    <datalist id="councils-list">
                      {groupedList.map(g => <option key={g.name} value={g.name} />)}
                    </datalist>
                  </div>
                  <div className="form-group">
                    <label>ФИО руководителя</label>
                    <input name="chairman" value={formData.chairman || ''} onChange={handleInputChange} required />
                  </div>
                  <div className="form-group">
                    <label>Университет / Должность</label>
                    <input name="university" value={formData.university || ''} onChange={handleInputChange} required />
                  </div>
                  <div className="form-group">
                    <label>Секретарь</label>
                    <input name="secretary" value={formData.secretary || ''} onChange={handleInputChange} />
                  </div>
                  <div className="form-group">
                    <label>Сайт</label>
                    <input name="website" value={formData.website || ''} onChange={handleInputChange} />
                  </div>
                </>
              ) : (
                <>
                  <div className="form-group">
                    <label>Регион (Группа)</label>
                    <input list="regions-list" name="region" value={formData.region || ''} onChange={handleInputChange} required />
                    <datalist id="regions-list">
                      {groupedList.map(g => <option key={g.name} value={g.name} />)}
                    </datalist>
                  </div>
                  <div className="form-group">
                    <label>Организация / Вуз</label>
                    <input name="organization" value={formData.organization || ''} onChange={handleInputChange} required />
                  </div>
                  <div className="form-group">
                    <label>Должность</label>
                    <input name="position_name" value={formData.position_name || ''} onChange={handleInputChange} />
                  </div>
                  <div className="form-group">
                    <label>ФИО руководителя</label>
                    <input name="chairman" value={formData.chairman || ''} onChange={handleInputChange} required />
                  </div>
                  <div className="form-group">
                    <label>Телефон</label>
                    <input name="phone" value={formData.phone || ''} onChange={handleInputChange} />
                  </div>
                  <div className="form-group">
                    <label>Email</label>
                    <input name="email" value={formData.email || ''} onChange={handleInputChange} />
                  </div>
                  <div className="form-group">
                    <label>Подведомственность</label>
                    <input name="subordination" value={formData.subordination || ''} onChange={handleInputChange} />
                  </div>
                  <div className="form-group">
                    <label>Сайт</label>
                    <input name="website" value={formData.website || ''} onChange={handleInputChange} />
                  </div>
                </>
              )}
              <div className="form-actions">
                <button type="submit" className="btn-save">{editingItem?.id ? 'Обновить' : 'Создать'}</button>
                {editingItem?.id && <button type="button" className="btn-edit" onClick={handleCancel}>Отмена</button>}
              </div>
            </form>
          </div>
        </div>

        <div className="list-section">
          {groupedList.map((group, groupIndex) => (
            <div key={group.name} className="council-group-card">
              <div className="group-header-container">
                <h3 className="group-header">{group.name}</h3>
                <div className="group-order-controls">
                  <button onClick={() => moveGroup(groupIndex, -1)} disabled={groupIndex === 0} title="Переместить группу выше">↑</button>
                  <button onClick={() => moveGroup(groupIndex, 1)} disabled={groupIndex === groupedList.length - 1} title="Переместить группу ниже">↓</button>
                </div>
              </div>
              <table className="admin-table">
                <thead>
                  {activeTab === 'main' ? (
                    <tr>
                      <th width="30%">ФИО</th>
                      <th>Университет</th>
                      <th width="100px">Порядок</th>
                      <th width="140px">Действия</th>
                    </tr>
                  ) : (
                    <tr>
                      <th width="30%">Организация</th>
                      <th>Руководитель</th>
                      <th width="100px">Порядок</th>
                      <th width="140px">Действия</th>
                    </tr>
                  )}
                </thead>
                <tbody>
                  {group.items.map((item) => {
                    const globalIndex = currentList.findIndex(i => i.id === item.id);
                    return (
                      <tr key={item.id}>
                        <td>{activeTab === 'main' ? item.chairman : item.organization}</td>
                        <td>{activeTab === 'main' ? item.university : item.chairman}</td>
                        <td className="order-cells">
                          <button className="order-btn" onClick={() => moveItem(globalIndex, -1)} disabled={globalIndex === 0}>↑</button>
                          <button className="order-btn" onClick={() => moveItem(globalIndex, 1)} disabled={globalIndex === currentList.length - 1}>↓</button>
                        </td>
                        <td className="action-cells">
                          <button className="btn-edit" onClick={() => handleEdit(item)}>Ред.</button>
                          <button className="btn-delete" onClick={() => handleDelete(item.id)}>Удалить</button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CouncilsManager;
