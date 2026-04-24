import React, { useState, useEffect } from 'react';
import { getCouncils } from '../../api/councils';
import './About.css';

const About = () => {
  const [activeTab, setActiveTab] = useState('structure');
  const [councilMembers, setCouncilMembers] = useState([]);
  const [regionalCouncils, setRegionalCouncils] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await getCouncils();
        setCouncilMembers(data.councils || []);
        setRegionalCouncils(data.regionalCouncils || []);
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
    <div className="about">
      <h1 className="page-title">О совете</h1>

      <div className="tabs">
        <button
          className={`tab-button ${activeTab === 'structure' ? 'active' : ''}`}
          onClick={() => setActiveTab('structure')}
        >
          Структура Совета
        </button>
        <button
          className={`tab-button ${activeTab === 'composition' ? 'active' : ''}`}
          onClick={() => setActiveTab('composition')}
        >
          Состав Совета
        </button>
        <button
          className={`tab-button ${activeTab === 'regional' ? 'active' : ''}`}
          onClick={() => setActiveTab('regional')}
        >
          Региональные советы
        </button>
      </div>

      <div className="tab-content">
        {activeTab === 'structure' && (
          <div className="structure-content">
            <h2>Структура Совета ректоров вузов Дальневосточного федерального округа</h2>
            <div className="structure-diagram">
              <div className="structure-level">
                <div className="structure-item chairman">
                  <h3>Председатель Совета</h3>
                  <p>Координирует работу Совета и представляет его интересы</p>
                </div>
              </div>

              <div className="structure-level">
                <div className="structure-item">
                  <h3>Заместители председателя</h3>
                  <p>Помощь в организации и координации работы</p>
                </div>
                <div className="structure-item">
                  <h3>Секретариат</h3>
                  <p>Организационное обеспечение деятельности Совета</p>
                </div>
                <div className="structure-item">
                  <h3>Президиум</h3>
                  <p>Ректоры высших учебных заведений ДФО</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'composition' && (
          <div className="table-container">
            <h2>Состав Совета ректоров вузов Дальневосточного федерального округа</h2>
            {(() => {
              const groups = [];
              councilMembers.forEach(item => {
                let group = groups.find(g => g.council === item.council);
                if (!group) {
                  group = { council: item.council, members: [] };
                  groups.push(group);
                }
                group.members.push(item);
              });

              return groups.map((group, groupIndex) => (
                <div key={groupIndex} className="council-group">
                  <h3 className="council-group-title">{group.council}</h3>
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Председатель</th>
                        <th>Ученый секретарь</th>
                        <th>Сайт</th>
                        <th>Университеты</th>
                      </tr>
                    </thead>
                    <tbody>
                      {group.members.map((item, index) => (
                        <tr key={index}>
                          <td>{item.chairman}</td>
                          <td>{item.secretary}</td>
                          <td>
                            {item.website ? (
                              <a href={item.website} target="_blank" rel="noopener noreferrer">
                                Перейти на сайт
                              </a>
                            ) : '—'}
                          </td>
                          <td>{item.university}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ));
            })()}
          </div>
        )}

        {activeTab === 'regional' && (
          <div className="table-container">
            <h2>Региональные советы ректоров вузов Дальневосточного федерального округа</h2>
            {(() => {
              const groups = [];
              regionalCouncils.forEach(item => {
                let group = groups.find(g => g.region === item.region);
                if (!group) {
                  group = { region: item.region, members: [] };
                  groups.push(group);
                }
                group.members.push(item);
              });

              return groups.map((group, groupIndex) => (
                <div key={groupIndex} className="council-group">
                  <h3 className="council-group-title">{group.region}</h3>
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Университет</th>
                        <th>Электронный адрес</th>
                        <th>Должность</th>
                        <th>ФИО</th>
                        <th>Телефон приемной</th>
                        <th>Подведомственность</th>
                      </tr>
                    </thead>
                    <tbody>
                      {group.members.map((council, index) => (
                        <tr key={index}>
                          <td>{council.organization}</td>
                          <td>{council.email}</td>
                          <td>{council.position}</td>
                          <td>{council.chairman}</td>
                          <td>{council.phone}</td>
                          <td>{council.subordination}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ));
            })()}
          </div>
        )}
      </div>
    </div>
  );
};

export default About;
