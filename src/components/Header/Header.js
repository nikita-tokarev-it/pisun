import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Header.css';
import { getMapData } from '../../api/map';
import { russiaMapPaths } from './RussiaMapPaths';
import { russiaMapRegions } from './RussiaMapRegions';

const Header = () => {
  const [dfoRegions, setDfoRegions] = useState({});
  const [selectedRegion, setSelectedRegion] = useState(null);
  const [tooltipData, setTooltipData] = useState({ show: false, name: '', x: 0, y: 0 });
  const [hoveredRegion, setHoveredRegion] = useState(null);

  // DFO region codes for highlighting
  const dfoRegionCodes = ['RU-SA', 'RU-KHA', 'RU-PRI', 'RU-AMU', 'RU-KAM', 'RU-SAK', 'RU-MAG', 'RU-CHU', 'RU-YEV', 'RU-ZAB'];

  useEffect(() => {
    const loadMapData = async () => {
      try {
        const data = await getMapData();
        const regionsMap = data.reduce((acc, region) => {
          acc[region.id] = region;
          return acc;
        }, {});
        setDfoRegions(regionsMap);
      } catch (err) {
        console.error('Ошибка загрузки данных карты:', err);
      }
    };
    loadMapData();
  }, []);

  const handleRegionClick = (regionCode) => {
    const region = dfoRegions[regionCode];
    if (region) {
      setSelectedRegion({ code: regionCode, ...region });
    }
  };

  const handleRegionKeyDown = (event, regionCode) => {
    if (!dfoRegions[regionCode]) {
      return;
    }
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleRegionClick(regionCode);
    }
  };

  const closeModal = () => {
    setSelectedRegion(null);
  };

  const getRegionName = (code) => {
    if (dfoRegions[code]?.name) {
      return dfoRegions[code].name;
    }
    if (russiaMapRegions[code]?.name) {
      return russiaMapRegions[code].name;
    }
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

      const baseFill = isDFO ? '#2B5A8E' : '#D7DEE9';
      const hoverFill = isDFO ? '#1f6ac1' : '#f6e72d';
      const fill = isSelected ? '#153a5b' : isHovered ? hoverFill : baseFill;

      const inlineStyle = pathData.style ? parseInlineStyle(pathData.style) : {};
      const stroke = pathData.stroke || '#666666';
      const strokeWidth = pathData['stroke-width'] || '0.6';

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
          transition: 'fill 0.3s ease, opacity 0.3s ease',
          cursor: isDFO ? 'pointer' : 'default'
        },
        onMouseEnter: (event) => handleRegionMouseEnter(event, code),
        onMouseMove: (event) => handleRegionMouseMove(event, code),
        onMouseLeave: handleRegionMouseLeave,
        role: isDFO ? 'button' : 'presentation'
      };

      if (pathData['stroke-linejoin']) {
        pathProps.strokeLinejoin = pathData['stroke-linejoin'];
      }
      if (pathData['stroke-linecap']) {
        pathProps.strokeLinecap = pathData['stroke-linecap'];
      }
      if (pathData['stroke-miterlimit']) {
        pathProps.strokeMiterlimit = pathData['stroke-miterlimit'];
      }

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
      <div className="header-content">
        <div className="header-left">
          <a 
            href="https://www.rsr-online.ru/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="rsr-link"
          >
            РОССИЙСКИЙ СОЮЗ РЕКТОРОВ
          </a>
          
          <h1 className="header-title">
            СОВЕТ РЕКТОРОВ ВУЗОВ<br />
            ДАЛЬНЕВОСТОЧНОГО<br />
            ФЕДЕРАЛЬНОГО ОКРУГА
          </h1>
          
          <p className="header-description">
            Совет ректоров вузов Дальневосточного федерального округа создан 
            для содействия развитию образования, науки и культуры Дальневосточного 
            региона России и координации действий высших учебных заведений Дальневосточного федерального округа.
          </p>
        </div>
        
        <div className="header-right">
          <nav className="main-nav">
            <Link to="/" className="nav-link">ГЛАВНАЯ</Link>
            <Link to="/about" className="nav-link">О СОВЕТЕ</Link>
            <Link to="/documents" className="nav-link">ДОКУМЕНТЫ</Link>
            <Link to="/events" className="nav-link">МЕРОПРИЯТИЯ И НОВОСТИ</Link>
            <Link to="/press" className="nav-link">ДЛЯ ПРЕССЫ</Link>
            <Link to="/contacts" className="nav-link">КОНТАКТЫ</Link>
          </nav>
          
          <div className="map-container">
            <div className="rf-map">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 1090 620"
                className="russia-map"
                role="img"
                aria-label="Карта Российской Федерации"
              >
                <g id="russia-map">{renderMapPaths()}</g>
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
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
