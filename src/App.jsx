import { useState, useRef, useEffect, useCallback } from "react";
import "./App.css";

const BASE_URL = "https://noho.b-cdn.net/vizualizace%20fotky";

// Generování URL pro fotky
const getPhotoUrls = (id) => ({
  normal: `${BASE_URL}/x0${id}_krakov.webp`,
  xray: `${BASE_URL}/x0${id}_krakov_S.webp`,
});
// ============ STARÁ VERZE - ZAKOMENTOVÁNO ============
// const MARKER_CONFIGS = {
//   3: {
//     desktop: [
//       { id: 1, top: "49%", left: "6%", defaultRotation: 120, name: "1. Pohled z vesnice Náměstí" },
//       { id: 2, top: "5%", left: "30%", defaultRotation: 170, name: "2. Pohled z vesnice Kostel" },
//       { id: 3, top: "67%", left: "71%", defaultRotation: 300, name: "3. Pohled z vesnice Rybník" },
//     ],
//     mobile: [
//       { id: 1, top: "46%", left: "2%", defaultRotation: 120, name: "1. Pohled z vesnice Náměstí" },
//       { id: 2, top: "2%", left: "28%", defaultRotation: 170, name: "2. Pohled z vesnice Kostel" },
//       { id: 3, top: "64%", left: "80%", defaultRotation: 300, name: "3. Pohled z vesnice Rybník" },
//     ],
//   },
//   4: {
//     desktop: [
//       { id: 1, top: "49%", left: "6%", defaultRotation: 120, name: "1. Pohled z vesnice Náměstí" },
//       { id: 2, top: "42%", left: "13%", defaultRotation: 130, name: "2. Pohled z vesnice Ulice" },
//       { id: 3, top: "5%", left: "30%", defaultRotation: 170, name: "3. Pohled z vesnice Kostel" },
//       { id: 4, top: "67%", left: "71%", defaultRotation: 300, name: "4. Pohled z vesnice Rybník" },
//     ],
//     mobile: [
//       { id: 1, top: "46%", left: "2%", defaultRotation: 120, name: "1. Pohled z vesnice Náměstí" },
//       { id: 2, top: "40%", left: "9%", defaultRotation: 130, name: "2. Pohled z vesnice Ulice" },
//       { id: 3, top: "2%", left: "28%", defaultRotation: 170, name: "3. Pohled z vesnice Kostel" },
//       { id: 4, top: "64%", left: "80%", defaultRotation: 300, name: "4. Pohled z vesnice Rybník" },
//     ],
//   },
//   5: {
//     desktop: [
//       { id: 1, top: "49%", left: "6%", defaultRotation: 120, name: "1. Pohled z vesnice Náměstí" },
//       { id: 2, top: "42%", left: "13%", defaultRotation: 130, name: "2. Pohled z vesnice Ulice" },
//       { id: 3, top: "40%", left: "19%", defaultRotation: 80, name: "3. Pohled z vesnice Škola" },
//       { id: 4, top: "5%", left: "30%", defaultRotation: 170, name: "4. Pohled z vesnice Kostel" },
//       { id: 5, top: "67%", left: "71%", defaultRotation: 300, name: "5. Pohled z vesnice Rybník" },
//     ],
//     mobile: [
//       { id: 1, top: "46%", left: "2%", defaultRotation: 120, name: "1. Pohled z vesnice Náměstí" },
//       { id: 2, top: "40%", left: "9%", defaultRotation: 130, name: "2. Pohled z vesnice Ulice" },
//       { id: 3, top: "38%", left: "16%", defaultRotation: 80, name: "3. Pohled z vesnice Škola" },
//       { id: 4, top: "2%", left: "28%", defaultRotation: 170, name: "4. Pohled z vesnice Kostel" },
//       { id: 5, top: "64%", left: "80%", defaultRotation: 300, name: "5. Pohled z vesnice Rybník" },
//     ],
//   },
// };

// ============ NOVÁ VERZE - 3 LOKALITY S PANORAMA ============
// URL obrázku mapy
const MAP_URL =
  "https://noho.b-cdn.net/vizualizace%20fotky/groundView_krakov.webp";

// Pozice větrníků na mapě - souřadnice v % obrázku (ne kontejneru)
const WINDMILL_POSITIONS = {
  3: [
    { id: 1, imgTop: 22, imgLeft: 21 },
    { id: 2, imgTop: 10, imgLeft: 40.5 },
    { id: 3, imgTop: 3, imgLeft: 72.5 },
  ],
  4: [
    { id: 1, imgTop: 22, imgLeft: 21 },
    { id: 2, imgTop: 10, imgLeft: 40.5 },
    { id: 3, imgTop: 3, imgLeft: 57 },
    { id: 4, imgTop: 3, imgLeft: 72.5 },
  ],
  5: [
    { id: 1, imgTop: 22, imgLeft: 21 },
    { id: 2, imgTop: 10, imgLeft: 40.5 },
    { id: 3, imgTop: 3, imgLeft: 57 },
    { id: 4, imgTop: 3, imgLeft: 72.5 },
    { id: 5, imgTop: 10, imgLeft: 83 },
  ],
};

// Pozorovatelny - souřadnice v % obrázku
const OBSERVATION_MARKERS = [
  {
    id: 1,
    imgTop: 92,
    imgLeft: 38,
    defaultRotation: -50,
    rotationSpeed: 4,
    name: "1. Pohled z vesnice Lokalita A",
  },
  {
    id: 2,
    imgTop: 62,
    imgLeft: 64.5,
    defaultRotation: -40,
    rotationSpeed: 2,
    name: "2. Pohled z vesnice Lokalita B",
  },
  {
    id: 3,
    imgTop: 57,
    imgLeft: 68.5,
    defaultRotation: -40,
    rotationSpeed: 2,
    name: "3. Pohled z vesnice Lokalita C",
  },
];

// Dostupné počty větrníků
const WINDMILL_COUNTS = [3, 4, 5];

// Hook pro detekci mobilu
function useIsMobile(breakpoint = 425) {
  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined" ? window.innerWidth <= breakpoint : false,
  );

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= breakpoint);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [breakpoint]);

  return isMobile;
}

// Hook pro přepočet souřadnic z obrázku na kontejner (background-size: cover)
function useMapCover(containerRef, imageUrl) {
  const [imgRatio, setImgRatio] = useState(null);
  const [containerSize, setContainerSize] = useState(null);

  // Načíst poměr stran obrázku
  useEffect(() => {
    const img = new Image();
    img.onload = () => setImgRatio(img.naturalWidth / img.naturalHeight);
    img.src = imageUrl;
  }, [imageUrl]);

  // Sledovat velikost kontejneru
  useEffect(() => {
    if (!containerRef.current) return;
    const measure = () => {
      const el = containerRef.current;
      if (el) setContainerSize({ w: el.offsetWidth, h: el.offsetHeight });
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [containerRef]);

  // Funkce pro převod souřadnic obrázku -> kontejneru
  const toContainer = useCallback(
    (imgLeftPct, imgTopPct) => {
      if (!containerSize || !imgRatio) {
        return { top: `${imgTopPct}%`, left: `${imgLeftPct}%` };
      }
      const { w: cw, h: ch } = containerSize;
      const cr = cw / ch;

      let rw, rh, ox, oy;
      if (cr > imgRatio) {
        // Kontejner je širší - obrázek vyplní šířku, přeteče výškou
        rw = cw;
        rh = cw / imgRatio;
        ox = 0;
        oy = (ch - rh) / 2;
      } else {
        // Kontejner je vyšší - obrázek vyplní výšku, přeteče šířkou
        rh = ch;
        rw = ch * imgRatio;
        ox = (cw - rw) / 2;
        oy = 0;
      }

      const x = ox + (imgLeftPct / 100) * rw;
      const y = oy + (imgTopPct / 100) * rh;
      return {
        left: `${(x / cw) * 100}%`,
        top: `${(y / ch) * 100}%`,
      };
    },
    [containerSize, imgRatio],
  );

  return toContainer;
}

// Komponenta pro kolečko s výsečí - bez transition na mobilu
function Marker({
  id,
  rotation = 0,
  top,
  left,
  isActive,
  onClick,
  arcScale = 1,
}) {
  return (
    <div className="marker-wrapper" style={{ top, left }}>
      <div
        className="marker-inner"
        style={{ transform: `rotate(${rotation}deg)` }}
      >
        <div
          className={`marker-dot ${isActive ? "marker-dot-active" : ""}`}
          onClick={onClick}
        >
          <span
            className="marker-number"
            style={{ transform: `rotate(${-rotation}deg)` }}
          >
            {id}
          </span>
        </div>
        {isActive && (
          <svg
            className="marker-arc"
            xmlns="http://www.w3.org/2000/svg"
            width="88"
            height="53"
            viewBox="0 0 88 53"
            fill="none"
            style={{
              transform: `translate(-59%, -100%) scale(${arcScale})`,
              transformOrigin: "59% 100%",
            }}
          >
            <path
              d="M0.594995 41.9266C2.50375 33.0809 6.66539 24.875 12.6832 18.109C18.8118 11.2185 26.6474 6.06367 35.4011 3.16356C44.1549 0.263499 53.5182 -0.279537 62.5486 1.58883C71.4161 3.4235 79.654 7.52168 86.4668 13.4784L51.73 52.4521L0.594995 41.9266Z"
              fill="#cedc00"
              fillOpacity="0.5"
              stroke="#042951"
            />
          </svg>
        )}
      </div>
    </div>
  );
}

function App() {
  const isMobile = useIsMobile(425);
  const mapContainerRef = useRef(null);
  const toMapPos = useMapCover(mapContainerRef, MAP_URL);

  const [windmillCount, setWindmillCount] = useState(3);

  // Větrníky a pozorovatelny - jedna sada, pozice se přepočítají dynamicky
  const WINDMILLS = WINDMILL_POSITIONS[windmillCount];
  const POSITIONS = OBSERVATION_MARKERS;

  const [xrayMode, setXrayMode] = useState(false);
  const [activeMarker, setActiveMarker] = useState(1);
  const [isZoomed, setIsZoomed] = useState(false);
  const [panX, setPanX] = useState(0); // horizontální posun v procentech

  // Limit posunu - stejný pro obě úrovně zoomu
  const PAN_LIMIT = 25;

  // Získání aktuálního markeru pro zobrazení názvu
  const currentMarker =
    POSITIONS.find((p) => p.id === activeMarker) || POSITIONS[0];

  // Rotace výseče na markeru odvozená z posunu (rychlost per marker)
  const rotation =
    currentMarker.defaultRotation - panX * (currentMarker.rotationSpeed || 4);

  // Reference pro drag
  const containerRef = useRef(null);
  const isDragging = useRef(false);
  const dragStartX = useRef(0);
  const panStartX = useRef(0);
  const hasShownHint = useRef(false);

  // Přednačtení obrázků pro aktivní marker
  useEffect(() => {
    const urls = getPhotoUrls(activeMarker);
    const normalImg = new Image();
    const xrayImg = new Image();
    normalImg.src = urls.normal;
    xrayImg.src = urls.xray;
  }, [activeMarker]);

  // Aktuální zobrazovaný obrázek
  const currentUrls = getPhotoUrls(activeMarker);
  const displayImage = xrayMode ? currentUrls.xray : currentUrls.normal;

  // Drag/pan handlery
  const handlePointerDown = useCallback(
    (e) => {
      isDragging.current = true;
      dragStartX.current = e.clientX;
      panStartX.current = panX;
      e.currentTarget.setPointerCapture(e.pointerId);
    },
    [panX],
  );

  const handlePointerMove = useCallback(
    (e) => {
      if (!isDragging.current || !containerRef.current) return;
      const dx = e.clientX - dragStartX.current;
      const containerWidth = containerRef.current.offsetWidth;
      const pct = (dx / containerWidth) * 40;
      const limit = PAN_LIMIT;
      const newPan = Math.max(-limit, Math.min(limit, panStartX.current + pct));
      setPanX(newPan);
    },
    [isZoomed],
  );

  const handlePointerUp = useCallback(() => {
    isDragging.current = false;
  }, []);

  // Plynulý posun při držení šipky
  const panInterval = useRef(null);

  const startPan = (direction) => {
    if (panInterval.current) return;
    const step = direction === "left" ? 0.4 : -0.4;
    const panStep = () => {
      setPanX((prev) => {
        const limit = PAN_LIMIT;
        return Math.max(-limit, Math.min(limit, prev + step));
      });
    };
    panStep();
    panInterval.current = setInterval(panStep, 16);
  };

  const stopPan = () => {
    if (panInterval.current) {
      clearInterval(panInterval.current);
      panInterval.current = null;
    }
  };

  // Přepnutí aktivního markeru
  const handleMarkerClick = (id) => {
    setActiveMarker(id);
    setPanX(0);
    setIsZoomed(false);
  };

  // Náznak posunu při prvním načtení
  useEffect(() => {
    if (hasShownHint.current) return;
    hasShownHint.current = true;
    const timer = setTimeout(() => {
      let start = null;
      const duration = 1000;
      const animate = (timestamp) => {
        if (!start) start = timestamp;
        const p = (timestamp - start) / duration;
        if (p < 0.25) {
          setPanX(-8 * (p / 0.25));
        } else if (p < 0.75) {
          setPanX(-8 + 16 * ((p - 0.25) / 0.5));
        } else if (p < 1) {
          setPanX(8 - 8 * ((p - 0.75) / 0.25));
        } else {
          setPanX(0);
          return;
        }
        requestAnimationFrame(animate);
      };
      requestAnimationFrame(animate);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  // Přepínání zoomu
  const toggleZoom = (zoomIn) => {
    if (zoomIn && !isZoomed) {
      setIsZoomed(true);
    } else if (!zoomIn && isZoomed) {
      setIsZoomed(false);
    }
  };

  return (
    <div className="page-wrapper">
      <div className="card">
        <div className="windmill-switcher">
          {WINDMILL_COUNTS.map((count) => (
            <button
              key={count}
              className={`windmill-btn ${windmillCount === count ? "windmill-btn-active" : ""}`}
              onClick={() => {
                setWindmillCount(count);
                setActiveMarker(1);
                setPanX(0);
                setIsZoomed(false);
              }}
            >
              <span>{count}</span>
              <img src="/vetrnik.webp" alt="" className="windmill-icon" />
            </button>
          ))}
        </div>
        {/* Horní část - prohlížeč obrázků */}
        <div className="div-top">
          <div
            ref={containerRef}
            className="image-viewer"
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerLeave={handlePointerUp}
          >
            <img
              src={displayImage}
              alt="Vizualizace"
              className="viewer-image"
              draggable={false}
              style={{
                objectPosition: `${50 - panX}% 50%`,
                transform: isZoomed ? "scale(1.5)" : "scale(1)",
                transformOrigin: `${50 - panX}% 50%`,
              }}
            />
          </div>

          {/* Ikony zoomu - lupičky */}
          <div className="zoom-controls">
            <button
              className={`zoom-btn zoom-btn-large ${isZoomed ? "zoom-btn-active" : ""}`}
              onClick={() => toggleZoom(true)}
              title="Přiblížit"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                width="26"
                height="26"
              >
                <circle cx="10" cy="10" r="7" />
                <line x1="15" y1="15" x2="21" y2="21" />
                <line x1="7" y1="10" x2="13" y2="10" />
                <line x1="10" y1="7" x2="10" y2="13" />
              </svg>
            </button>
            <button
              className={`zoom-btn zoom-btn-small ${!isZoomed ? "zoom-btn-active" : ""}`}
              onClick={() => toggleZoom(false)}
              title="Oddálit"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                width="18"
                height="18"
              >
                <circle cx="10" cy="10" r="7" />
                <line x1="15" y1="15" x2="21" y2="21" />
                <line x1="7" y1="10" x2="13" y2="10" />
              </svg>
            </button>
          </div>

          {/* Navigační šipky */}
          <button
            className="nav-arrow nav-arrow-left"
            onMouseDown={() => startPan("left")}
            onMouseUp={stopPan}
            onMouseLeave={stopPan}
            onTouchStart={(e) => {
              e.preventDefault();
              startPan("left");
            }}
            onTouchMove={(e) => e.preventDefault()}
            onTouchEnd={stopPan}
            onTouchCancel={stopPan}
            onContextMenu={(e) => e.preventDefault()}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
          <button
            className="nav-arrow nav-arrow-right"
            onMouseDown={() => startPan("right")}
            onMouseUp={stopPan}
            onMouseLeave={stopPan}
            onTouchStart={(e) => {
              e.preventDefault();
              startPan("right");
            }}
            onTouchMove={(e) => e.preventDefault()}
            onTouchEnd={stopPan}
            onTouchCancel={stopPan}
            onContextMenu={(e) => e.preventDefault()}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>

          {/* Skryté přednačtené obrázky */}
          <img src={currentUrls.normal} alt="" className="preload-image" />
          <img src={currentUrls.xray} alt="" className="preload-image" />

          <div className="labels-overlay">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={xrayMode}
                onChange={(e) => setXrayMode(e.target.checked)}
              />
              <span className="checkbox-toggle" />
              <span>Pohled skrz překážky</span>
            </label>
          </div>

          <span className="bottom-label">{currentMarker.name}</span>
        </div>

        {/* Spodní část - ground view s kolečky */}
        <div className="div-bottom" ref={mapContainerRef}>
          {/* Ikony větrníků na mapě - počet dle switche */}
          {WINDMILLS.map((windmill) => {
            const pos = toMapPos(windmill.imgLeft, windmill.imgTop);
            return (
              <img
                key={`windmill-${windmill.id}`}
                src="/novyVetrnik.webp"
                alt=""
                className="windmill-map-icon"
                style={pos}
              />
            );
          })}

          {/* Kolečka s čísly */}
          {POSITIONS.map((marker, index) => {
            const pos = toMapPos(marker.imgLeft, marker.imgTop);
            return (
              <Marker
                key={marker.id}
                id={index + 1}
                rotation={
                  activeMarker === marker.id ? rotation : marker.defaultRotation
                }
                top={pos.top}
                left={pos.left}
                isActive={activeMarker === marker.id}
                onClick={() => handleMarkerClick(marker.id)}
                arcScale={isZoomed ? 0.7 : 1.15}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default App;
