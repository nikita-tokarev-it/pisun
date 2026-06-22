import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Header.css';
import { getMapData } from '../../api/map';
import { russiaMapPaths } from './RussiaMapPaths';
import { russiaMapRegions } from './RussiaMapRegions';
import { getSettings } from '../../api/settings';

const Header = () => {
  const [dfoRegions, setDfoRegions] = useState({});
  const [selectedRegion, setSelectedRegion] = useState(null);
  const [isPressModalOpen, setIsPressModalOpen] = useState(false);
  const [tooltipData, setTooltipData] = useState({ show: false, name: '', x: 0, y: 0 });
  const [hoveredRegion, setHoveredRegion] = useState(null);
  const [settings, setSettings] = useState(null);

  // DFO region codes for highlighting
  const dfoRegionCodes = ['RU-SA', 'RU-KHA', 'RU-PRI', 'RU-AMU', 'RU-KAM', 'RU-SAK', 'RU-MAG', 'RU-CHU', 'RU-YEV', 'RU-ZAB'];

  useEffect(() => {
    const loadData = async () => {
      try {
        const [mapData, settingsData] = await Promise.all([
          getMapData(),
          getSettings()
        ]);
        const regionsMap = mapData.reduce((acc, region) => {
          acc[region.id] = region;
          return acc;
        }, {});
        setDfoRegions(regionsMap);
        setSettings(settingsData);
      } catch (err) {
        console.error('Ошибка загрузки данных:', err);
      }
    };
    loadData();
  }, []);

  const handleRegionClick = (regionCode) => {
    const region = dfoRegions[regionCode];
    if (region) {
      setSelectedRegion({ code: regionCode, ...region });
    }
  };

  const handleRegionKeyDown = (event, regionCode) => {
    if (!dfoRegions[regionCode]) return;
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleRegionClick(regionCode);
    }
  };

  const closeModal = () => setSelectedRegion(null);
  const closePressModal = () => setIsPressModalOpen(false);

  const getRegionName = (code) => {
    if (dfoRegions[code]?.name) return dfoRegions[code].name;
    if (russiaMapRegions[code]?.name) return russiaMapRegions[code].name;
    return code;
  };

  const parseInlineStyle = (styleString = '') =>
    styleString
      .split(';')
      .map((rule) => rule.trim())
      .filter(Boolean)
      .reduce((acc, rule) => {
        const [property, value] = rule.split(':').map((part) => part.trim());
        if (property && value) {
          const camelProperty = property.replace(/-([a-z])/g, (_, char) => char.toUpperCase());
          acc[camelProperty] = value;
        }
        return acc;
      }, {});

  const updateTooltipPosition = (event, name) => {
    const svgElement = event.currentTarget.ownerSVGElement || event.currentTarget;
    const svgRect = svgElement.getBoundingClientRect();
    const { clientX, clientY } = event.nativeEvent;

    setTooltipData({
      show: true,
      name,
      x: clientX - svgRect.left,
      y: clientY - svgRect.top
    });
  };

  const handleRegionMouseEnter = (event, code) => {
    const regionName = getRegionName(code);
    setHoveredRegion(code);
    updateTooltipPosition(event, regionName);
  };

  const handleRegionMouseMove = (event, code) => {
    if (hoveredRegion === code) {
      updateTooltipPosition(event, getRegionName(code));
    }
  };

  const handleRegionMouseLeave = () => {
    setHoveredRegion(null);
    setTooltipData({ show: false, name: '', x: 0, y: 0 });
  };

  const renderMapPaths = () =>
    russiaMapPaths.map((pathData) => {
      const code = pathData.id;
      const isDFO = dfoRegionCodes.includes(code);
      const isSelected = selectedRegion?.code === code;
      const isHovered = hoveredRegion === code;

      // Strict Red for DFO active zones as requested
      const baseFill = isDFO ? '#C12A2A' : '#D7DEE9';
      const hoverFill = isDFO ? '#E33434' : '#E3B04B';
      const fill = isSelected ? '#991B1B' : isHovered ? hoverFill : baseFill;

      const inlineStyle = pathData.style ? parseInlineStyle(pathData.style) : {};
      const stroke = pathData.stroke || '#1A3A5F';
      const strokeWidth = pathData['stroke-width'] || (isDFO ? '1' : '0.5');

      const pathProps = {
        key: code,
        id: code,
        d: pathData.d,
        stroke,
        strokeWidth,
        fill,
        className: `map-region${isDFO ? ' map-region--dfo' : ''}`,
        style: {
          ...inlineStyle,
          transition: 'fill 0.2s ease',
          cursor: isDFO ? 'pointer' : 'inherit'
        },
        onMouseEnter: (event) => handleRegionMouseEnter(event, code),
        onMouseMove: (event) => handleRegionMouseMove(event, code),
        onMouseLeave: handleRegionMouseLeave,
        role: isDFO ? 'button' : 'presentation'
      };

      if (pathData['stroke-linejoin']) pathProps.strokeLinejoin = pathData['stroke-linejoin'];
      if (pathData['stroke-linecap']) pathProps.strokeLinecap = pathData['stroke-linecap'];
      if (pathData['stroke-miterlimit']) pathProps.strokeMiterlimit = pathData['stroke-miterlimit'];

      if (isDFO) {
        pathProps.onClick = () => handleRegionClick(code);
        pathProps.onKeyDown = (event) => handleRegionKeyDown(event, code);
        pathProps.tabIndex = 0;
        pathProps['aria-label'] = getRegionName(code);
      }

      return <path {...pathProps} />;
    });

  return (
    <header className="header">
      <div className="top-bar">
        <div className="top-bar-content">
          <a 
            href={settings?.header?.rsrUrl || "https://www.rsr-online.ru/"} 
            target="_blank" 
            rel="noopener noreferrer"
            className="rsr-link"
          >
            {settings?.header?.rsrText || "РОССИЙСКИЙ СОЮЗ РЕКТОРОВ"}
          </a>

          <nav className="main-nav">
            {settings?.navigation ? settings.navigation.map((item, idx) => (
              item.path === '/press' ? (
                <button 
                  key={idx} 
                  className="nav-link nav-button" 
                  onClick={() => setIsPressModalOpen(true)}
                >
                  {item.title}
                </button>
              ) : (
                <Link key={idx} to={item.path} className="nav-link">{item.title}</Link>
              )
            )) : (
              <>
                <Link to="/" className="nav-link">ГЛАВНАЯ</Link>
                <Link to="/about" className="nav-link">О СОВЕТЕ</Link>
                <Link to="/documents" className="nav-link">ДОКУМЕНТЫ</Link>
                <Link to="/events" className="nav-link">МЕРОПРИЯТИЯ И НОВОСТИ</Link>
                <button 
                  className="nav-link nav-button" 
                  onClick={() => setIsPressModalOpen(true)}
                >
                  ДЛЯ ПРЕССЫ
                </button>
                <Link to="/contacts" className="nav-link">КОНТАКТЫ</Link>
              </>
            )}
          </nav>
        </div>
      </div>

      <div className="header-content">
        <div className="header-left">
          <h1 className="header-title" dangerouslySetInnerHTML={{ 
            __html: settings?.header?.title ? settings.header.title.replace(/\n/g, '<br />') : 'СОВЕТ РЕКТОРОВ ВУЗОВ<br />ДАЛЬНЕВОСТОЧНОГО<br />ФЕДЕРАЛЬНОГО ОКРУГА' 
          }} />
        </div>
        
        <div className="header-right">
          <div className="map-container">
            <div className="rf-map">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 1090 620"
                className="russia-map"
                role="img"
                aria-label="Карта Российской Федерации"
              >
                <g id="russia-map">
                  {renderMapPaths()}
                </g>
              </svg>

              {tooltipData.show && (
                <div
                  className="map-tooltip"
                  style={{ left: `${tooltipData.x}px`, top: `${tooltipData.y}px` }}
                >
                  {tooltipData.name}
                </div>
              )}
            </div>

            {selectedRegion && (
              <div className="region-modal-overlay" onClick={closeModal}>
                <div className="region-modal" onClick={(e) => e.stopPropagation()}>
                  <button className="region-modal-close" onClick={closeModal}>×</button>
                  <h2>{selectedRegion.name}</h2>
                  <div className="region-modal-content">
                    <p className="region-info">{selectedRegion.info}</p>

                    {selectedRegion.universities && (
                      <div className="region-universities">
                        <h3>Высшие учебные заведения:</h3>
                        <ul>
                          {selectedRegion.universities.map((uni, index) => (
                            <li key={index}>{uni}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {selectedRegion.website && (
                      <a
                        href={selectedRegion.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="region-website-link"
                      >
                        Официальный сайт региона →
                      </a>
                    )}
                  </div>
                </div>
              </div>
            )}

            {isPressModalOpen && (
              <div className="region-modal-overlay" onClick={closePressModal}>
                <div className="region-modal press-modal" onClick={(e) => e.stopPropagation()}>
                  <button className="region-modal-close" onClick={closePressModal}>×</button>
                  <h2>Контакты для СМИ</h2>
                  <div className="region-modal-content">
                    <div className="press-contact-card">
                      <h3>Пресс-служба Совета ректоров вузов ДФО</h3>
                      <div className="press-contact-item">
                        <strong>Ответственный:</strong>
                        <p>Подтергера Ольга Александровна</p>
                      </div>
                      <div className="press-contact-item">
                        <strong>Телефон:</strong>
                        <p>+7 (908) 450-85-25</p>
                      </div>
                      <div className="press-contact-item">
                        <strong>Email:</strong>
                        <p>press@dvfu-rectorat.ru</p>
                      </div>
                      <div className="press-contact-item">
                        <strong>Время работы:</strong>
                        <p>Пн-Пт: 9:00 - 18:00</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
