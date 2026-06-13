import React, { useState, useEffect } from 'react';
import { getCouncils } from '../../api/councils';
import './About.css';

const About = () => {
  const [activeTab, setActiveTab] = useState('structure');
  const [expandedRegions, setExpandedRegions] = useState([]);
  const [showSecretariat, setShowSecretariat] = useState(false);
  const [showZam, setShowZam] = useState(false);
  const [showPrezidium, setShowPrezidium] = useState(false);
  const [councilMembers, setCouncilMembers] = useState([]);
  const [regionalCouncils, setRegionalCouncils] = useState([]);
  const [loading, setLoading] = useState(true);

  const toggleRegion = (regionName) => {
    setExpandedRegions(prev =>
      prev.includes(regionName)
        ? prev.filter(r => r !== regionName)
        : [...prev, regionName]
    );
  };

  const regionInfo = {
    "Хабаровский край, Еврейская АО, Магаданская и Сахалинская области": (
      <>
        <p><strong>Председатель:</strong> Буровцев Владимир Викторович, ректор Дальневосточного государственного университета путей и сообщений</p>
        <p><em>8 (421) 240-75-16 &nbsp; rector@festu.khv.ru</em></p>
        <p><strong>Ученый секретарь:</strong> Крюков Иван Анатольевич, помощник ректора Дальневосточного государственного университета путей и сообщений</p>
        <p><strong>Сайт:</strong> <a href="https://sr-dv.ru/" target="_blank" rel="noopener noreferrer">https://sr-dv.ru/</a></p>
      </>
    ),
    "Приморский край": (
      <>
        <p><strong>Председатель:</strong> Стегний Кирилл Владимирович, и.о. ректора Тихоокеанского государственного медицинского университета</p>
        <p><em>8 (423) 242-97-78 &nbsp; mail@tgmu.ru</em></p>
        <p><strong>Ученый секретарь:</strong> Транковская Лидия Викторовна, первый проректор Тихоокеанского государственного медицинского университета</p>
        <p><strong>Сайт:</strong> <a href="https://sovetrektorovpk.ru/" target="_blank" rel="noopener noreferrer">https://sovetrektorovpk.ru/</a></p>
      </>
    ),
    "Республика Саха (Якутия)": (
      <>
        <p><strong>Председатель:</strong> Николаев Анатолий Николаевич, ректор Северо-Восточного федерального университета имени М. К. Аммосова</p>
        <p><em>8 (411) 235-20-90 &nbsp; rector@svfu.ru</em></p>
        <p><strong>Ученый секретарь:</strong> Саввинов Василий Михайлович, проректор по стратегическому развитию Северо-Восточного федерального университета им. М.К. Аммосова</p>
      </>
    ),
    "Забайкальский край": (
      <>
        <p><strong>Председатель:</strong> Мартыненко Оксана Олеговна, ректор Забайкальского государственного университета</p>
        <p><em>8 (302) 241-64-44 &nbsp; martynenko.oo@zabgu.ru</em></p>
        <p><strong>Ученый секретарь:</strong> Левданская Юлия Юрьевна, заведующая кафедры педагогики Забайкальского государственного университета</p>
      </>
    ),
    "Республика Бурятия": (
      <>
        <p><strong>Председатель:</strong> Перова Елена Юрьевна, ректор Восточно-Сибирского государственного института культуры</p>
        <p><em>8 (301) 223-33-22 &nbsp; rector@vsgaki.ru</em></p>
        <p><strong>Ученый секретарь:</strong> Цыремпилова Ирина Семеновна, проректор по научной работе Восточно-Сибирского государственного института культуры</p>
      </>
    ),
    "Камчатский край": (
      <>
        <p><strong>Председатель:</strong> Левков Сергей Андреевич, ректор Камчатского государственного технического университета</p>
        <p><em>8 (415) 230-06-50 &nbsp; kamchatgtu@kamchatgtu.ru</em></p>
        <p><strong>Ученый секретарь:</strong> Дворцова Елена Николаевна, директор Дальневосточного филиала Всероссийской академии внешней торговли Министерства экономического развития Российской Федерации</p>
        <p><em>8 (415) 242-01-47 (вн. 102); 8 (415) 242-34-69 &nbsp; rectordvf@mail.ru</em></p>
      </>
    ),
    "Амурская область": (
      <>
        <p><strong>Председатель:</strong> Тихончук Павел Викторович, ректор Дальневосточного государственного аграрного университета</p>
        <p><em>8 (416) 299-51-15 &nbsp; rector@dalgau.ru</em></p>
        <p><strong>Ученый секретарь:</strong> Резникова Светлана Валерьевна, доцент кафедры физической культуры с курсом лечебной физкультуры Амурской государственной медицинской академии</p>
        
      </>
    )
  };

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
                <div className="structure-item clickable" onClick={() => setShowZam(true)}>
                  <h3>Заместители Председателя</h3>
                  <p>Координация работы Совета по направлениям и задачам</p>
                </div>
                {showZam && (
                  <div className="modal-overlay" onClick={() => setShowZam(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                      <button className="close-button" onClick={() => setShowZam(false)}>&times;</button>
                      <h2>Состав Заместителей Председателя</h2>
                      <li>
                        <strong>Буровцев Владимир Викторович</strong> — заместитель председателя Совета ректоров вузов Дальневосточного федерального округа,<br />
                        председатель Совета ректоров вузов Хабаровского края, Еврейской автономной области, Магаданской и Сахалинской областей,<br />
                        ректор Дальневосточного государственного университета путей сообщения.
                      </li>
                      <li>
                        <strong>Николаев Анатолий Николаевич</strong> — заместитель председателя Совета ректоров вузов Дальневосточного федерального округа,<br />
                        председатель Совета ректоров вузов Республики Саха (Якутия),<br />
                        ректор Северо-Восточного федерального университета им. М.К. Аммосова.
                      </li>
                    </div>
                  </div>
                )}
                <div className="structure-item clickable" onClick={() => setShowSecretariat(true)}>
                  <h3>Секретариат</h3>
                  <p>Организационное обеспечение деятельности Совета</p>
                </div>
                {showSecretariat && (
                  <div className="modal-overlay" onClick={() => setShowSecretariat(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                      <button className="close-button" onClick={() => setShowSecretariat(false)}>&times;</button>
                      <h2>Состав Секретариата</h2>
                      <ul className="secretariat-list">
                        <li>
                          <strong>Гридасов Александр Валентинович</strong> — Ученый секретарь<br />
                          <span className="contact-info"><em>gridasov.av@dvfu.ru +7 (423) 265-24-24 Доб. 2123</em></span>
                        </li>
                        <li>
                          <strong>Юсипов Евгений Ансарович</strong> — Технический секретарь<br />
                          <span className="contact-info"><em>yusipov.ea@dvfu.ru +7 (423) 265-24-24 Доб. 2716</em></span>
                        </li>
                        <li>
                          <strong>Фомен Дарья Андреевна</strong><br />
                          <span className="contact-info"><em>fomen.dan@dvfu.ru +7 (423) 265-24-24 Доб. 2332</em></span>
                        </li>
                      </ul>
                    </div>
                  </div>
                )}
                <div className="structure-item clickable" onClick={() => setShowPrezidium(true)}>
                  <h3>Президиум</h3>
                  <p>Ректоры высших учебных заведений ДФО</p>
                </div>
                {showPrezidium && (
                  <div className="modal-overlay" onClick={() => setShowPrezidium(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                      <button className="close-button" onClick={() => setShowPrezidium(false)}>&times;</button>
                      <h2>Состав Президиума </h2>
                      <ul className="secretariat-list">
                        <li>
                          <strong>Коробец Борис Николаевич</strong><br />
                          председатель Совета ректоров вузов Дальневосточного федерального округа,<br />
                          ректор Дальневосточного федерального университета.
                        </li>
                        <li>
                          <strong>Буровцев Владимир Викторович</strong><br />
                          заместитель председателя Совета ректоров вузов Дальневосточного федерального округа,<br />
                          председатель Совета ректоров вузов Хабаровского края, Еврейской автономной области, Магаданской и Сахалинской областей,<br />
                          ректор Дальневосточного государственного университета путей сообщения.
                        </li>
                        <li>
                          <strong>Николаев Анатолий Николаевич</strong><br />
                          заместитель председателя Совета ректоров вузов Дальневосточного федерального округа,<br />
                          председатель Совета ректоров вузов Республики Саха (Якутия),<br />
                          ректор Северо-Восточного федерального университета им. М.К. Аммосова.
                        </li>
                        <li>
                          <strong>Левков Сергей Андреевич</strong><br />
                          председатель Совета ректоров вузов Камчатского края,<br />
                          ректор Камчатского государственного технического университета.
                        </li>
                        <li>
                          <strong>Мартыненко Оксана Олеговна</strong><br />
                          председатель Совета ректоров вузов Забайкальского края,<br />
                          ректор Забайкальского государственного университета.
                        </li>
                        <li>
                          <strong>Перова Елена Юрьевна</strong><br />
                          председатель Совета ректоров вузов Республики Бурятия,<br />
                          ректор Восточно-Сибирского государственного института культуры.
                        </li>
                        <li>
                          <strong>Тихончук Павел Викторович</strong><br />
                          председатель Совета ректоров вузов Амурской области,<br />
                          ректор Дальневосточного государственного аграрного университета.
                        </li>
                        <li>
                          <strong>Стегний Кирилл Владимирович</strong><br />
                          председатель Совета ректоров вузов Приморского края,<br />
                          и.о. ректора Тихоокеанского государственного медицинского университета.
                        </li>
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'composition' && (
          <div className="table-container">
            <h2>Состав Совета ректоров вузов Дальневосточного федерального округа</h2>
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
                        <th>Руководитель</th>
                        <th>Телефон приёмной</th>
                        <th>Электронный адрес</th>
                        <th>Сайт</th>
                      </tr>
                    </thead>
                    <tbody>
                      {group.members.map((council, index) => (
                        <tr key={index}>
                          <td>{council.organization}</td>
                          <td>
                            {council.chairman}<br /><em>{council.position}</em>
                          </td>
                          <td>{council.phone}</td>
                          <td>{council.email}</td>
                          <td>
                            {council.website ? (
                              <a href={council.website} target="_blank" rel="noopener noreferrer">Перейти на сайт</a>
                            ) : '—'}
                          </td>
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
              const unitedRegions = [
                'Хабаровский край',
                'Еврейская автономная область',
                'Магаданская область',
                'Сахалинская область'
              ];
              const unitedName = 'Хабаровский край, Еврейская АО, Магаданская и Сахалинская области';

              const mergedList = regionalCouncils.map(item => {
                if (unitedRegions.includes(item.region)) {
                  return { ...item, region: unitedName };
                }
                return item;
              });

              const groups = [];
              mergedList.forEach(item => {
                let group = groups.find(g => g.region === item.region);
                if (!group) {
                  group = { region: item.region, members: [] };
                  groups.push(group);
                }
                group.members.push(item);
              });

              return groups.map((group, groupIndex) => {
                const isExpanded = expandedRegions.includes(group.region);

                return (
                  <div key={groupIndex} className="council-group">
                    <h3
                      className={`council-group-title clickable ${isExpanded ? 'active' : ''}`}
                      onClick={() => toggleRegion(group.region)}
                      style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px' }}
                    >
                      <span>{isExpanded ? '▼' : '▶'}</span>
                      {group.region}
                    </h3>

                    {isExpanded && (
                      <>
                        {regionInfo[group.region] && (
                          <div className="region-description">
                            {regionInfo[group.region]}
                          </div>
                        )}
                        <table className="data-table">
                          <thead>
                            <tr>
                              <th>Университет</th>
                              <th>Руководитель</th>
                              <th>Телефон приёмной</th>
                              <th>Электронный адрес</th>
                              <th>Сайт</th>
                            </tr>
                          </thead>
                          <tbody>
                            {group.members.map((council, index) => (
                              <tr key={index}>
                                <td>{council.organization}</td>
                                <td>
                                  {council.chairman}<br /><em>{council.position}</em>
                                </td>
                                <td>{council.phone}</td>
                                <td>{council.email}</td>
                                <td>
                                  {council.website ? (
                                    <a href={council.website} target="_blank" rel="noopener noreferrer">Перейти на сайт</a>
                                  ) : '—'}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </>
                    )}
                  </div>
                );
              });
            })()}
          </div>
        )}
      </div> {/* закрываем tab-content */}
    </div> /* закрываем about */
  );
};

export default About;