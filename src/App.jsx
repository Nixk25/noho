import { useState, useRef, useEffect } from "react";
import { ReactPhotoSphereViewer } from "react-photo-sphere-viewer";
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
// Pozice větrníků na mapě - PEVNĚ 3 větrníky
const WINDMILL_POSITIONS = {
  desktop: [
    { id: 1, top: "34%", left: "18%" },
    { id: 2, top: "30%", left: "40%" },
    { id: 3, top: "28%", left: "75%" },
  ],
  mobile: [
    { id: 1, top: "33%", left: "21%" },
    { id: 2, top: "27%", left: "41%" },
    { id: 3, top: "23%", left: "73%" },
  ],
};

// Base markery - desktop pozice
const BASE_MARKERS_DESKTOP = [
  {
    id: 1,
    top: "61%",
    left: "35%",
    defaultRotation: -50,
    name: "1. Pohled z vesnice Lokalita A",
  },
  {
    id: 2,
    top: "49%",
    left: "65%",
    defaultRotation: -40,
    name: "2. Pohled z vesnice Lokalita B",
  },
  {
    id: 3,
    top: "47%",
    left: "70%",
    defaultRotation: -40,
    name: "3. Pohled z vesnice Lokalita C",
  },
  {
    id: 4,
    top: "40%",
    left: "85%",
    defaultRotation: 0,
    name: "4. Pohled z vesnice Lokalita D",
  },
];

// Base markery - mobile pozice
const BASE_MARKERS_MOBILE = [
  {
    id: 1,
    top: "65%",
    left: "37%",
    defaultRotation: -50,
    name: "1. Pohled z vesnice Lokalita A",
  },
  {
    id: 2,
    top: "46%",
    left: "62%",
    defaultRotation: -40,
    name: "2. Pohled z vesnice Lokalita B",
  },
  {
    id: 3,
    top: "45%",
    left: "67%",
    defaultRotation: -40,
    name: "3. Pohled z vesnice Lokalita C",
  },
  {
    id: 4,
    top: "40%",
    left: "90%",
    defaultRotation: 0,
    name: "4. Pohled z vesnice Lokalita D",
  },
];

// Přídavný pátý marker
const ADDITIONAL_MARKER_DESKTOP = {
  id: 5,
  top: "70%",
  left: "40%",
  defaultRotation: 0,
  name: "5. Pohled z vesnice Lokalita E",
};

const ADDITIONAL_MARKER_MOBILE = {
  id: 5,
  top: "70%",
  left: "35%",
  defaultRotation: 0,
  name: "5. Pohled z vesnice Lokalita E",
};

// Funkce pro získání markerů podle počtu
const getMarkers = (count, isMobile) => {
  const base = isMobile ? BASE_MARKERS_MOBILE : BASE_MARKERS_DESKTOP;
  const additional = isMobile
    ? ADDITIONAL_MARKER_MOBILE
    : ADDITIONAL_MARKER_DESKTOP;

  if (count === 3) return base.slice(0, 3);
  if (count === 4) return base;
  if (count === 5) return [...base, additional];
  return base;
};

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

// Komponenta pro kolečko s výsečí - bez transition na mobilu
function Marker({ id, rotation = 0, top, left, isActive, onClick }) {
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

  const [windmillCount, setWindmillCount] = useState(3);
  const POSITIONS = getMarkers(windmillCount, isMobile);

  const WINDMILLS = isMobile
    ? WINDMILL_POSITIONS.mobile
    : WINDMILL_POSITIONS.desktop;

  const [xrayMode, setXrayMode] = useState(false);
  const [activeMarker, setActiveMarker] = useState(1);
  const [rotation, setRotation] = useState(POSITIONS[0].defaultRotation);

  // Získání aktuálního markeru pro zobrazení názvu
  const currentMarker =
    POSITIONS.find((p) => p.id === activeMarker) || POSITIONS[0];

  // Sledujeme předchozí úhel a kumulativní rotaci
  const prevAngle = useRef(0);
  const cumulativeRotation = useRef(POSITIONS[0].defaultRotation);

  // Reference na viewer pro zachování pozice
  const viewerRef = useRef(null);
  const currentYaw = useRef(0);
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

  // Funkce volaná při otáčení - lng je horizontální úhel (yaw)
  const handlePositionChange = (lat, lng) => {
    const degrees = lng * (180 / Math.PI);
    currentYaw.current = lng; // Uložíme aktuální yaw v radiánech

    let delta = degrees - prevAngle.current;

    if (delta > 180) delta -= 360;
    if (delta < -180) delta += 360;

    cumulativeRotation.current += delta;
    prevAngle.current = degrees;

    setRotation(cumulativeRotation.current);
  };

  // Přepnutí aktivního markeru
  const handleMarkerClick = (id) => {
    setActiveMarker(id);
    const position = POSITIONS.find((p) => p.id === id);
    cumulativeRotation.current = position.defaultRotation;
    prevAngle.current = 0;
    currentYaw.current = 0;
    setRotation(position.defaultRotation);
  };

  // Plynulá rotace při držení šipky
  const rotationInterval = useRef(null);

  const startRotation = (direction) => {
    if (rotationInterval.current) return;
    const rotateStep = () => {
      if (!viewerRef.current) return;
      const pos = viewerRef.current.getPosition();
      const step = direction === "left" ? -0.015 : 0.015;
      viewerRef.current.rotate({ yaw: pos.yaw + step, pitch: pos.pitch });
    };
    rotateStep();
    rotationInterval.current = setInterval(rotateStep, 16);
  };

  const stopRotation = () => {
    if (rotationInterval.current) {
      clearInterval(rotationInterval.current);
      rotationInterval.current = null;
    }
  };

  // Callback když se viewer načte
  const handleReady = (instance) => {
    viewerRef.current = instance;
    // Nastav pozici na uloženou hodnotu
    if (currentYaw.current !== 0) {
      instance.rotate({ yaw: currentYaw.current, pitch: 0 });
    }

    // Rychlý náznak rotace na obě strany - jen při prvním načtení
    if (!hasShownHint.current) {
      hasShownHint.current = true;
      setTimeout(() => {
        const startYaw = instance.getPosition().yaw;
        instance
          .animate({
            yaw: startYaw - Math.PI / 20,
            pitch: 0,
            speed: "4rpm",
          })
          .then(() => {
            return instance.animate({
              yaw: startYaw + Math.PI / 20,
              pitch: 0,
              speed: "4rpm",
            });
          })
          .then(() => {
            instance.animate({
              yaw: startYaw,
              pitch: 0,
              speed: "4rpm",
            });
          });
      }, 300);
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
                const newPositions = getMarkers(count, isMobile);
                setRotation(newPositions[0].defaultRotation);
                cumulativeRotation.current = newPositions[0].defaultRotation;
                prevAngle.current = 0;
                currentYaw.current = 0;
              }}
            >
              <span>{count}</span>
              <img src="/vetrnik.webp" alt="" className="windmill-icon" />
            </button>
          ))}
        </div>
        {/* Horní část - 3D sphere viewer */}
        <div className="div-top">
          <ReactPhotoSphereViewer
            key={`${activeMarker}-${displayImage}`}
            src={displayImage}
            height={"100%"}
            width={"100%"}
            containerClass="viewer-container"
            onPositionChange={handlePositionChange}
            onReady={handleReady}
            navbar={false}
          />

          {/* Navigační šipky */}
          <button
            className="nav-arrow nav-arrow-left"
            onMouseDown={() => startRotation("left")}
            onMouseUp={stopRotation}
            onMouseLeave={stopRotation}
            onTouchStart={(e) => {
              e.preventDefault();
              startRotation("left");
            }}
            onTouchMove={(e) => e.preventDefault()}
            onTouchEnd={stopRotation}
            onTouchCancel={stopRotation}
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
            onMouseDown={() => startRotation("right")}
            onMouseUp={stopRotation}
            onMouseLeave={stopRotation}
            onTouchStart={(e) => {
              e.preventDefault();
              startRotation("right");
            }}
            onTouchMove={(e) => e.preventDefault()}
            onTouchEnd={stopRotation}
            onTouchCancel={stopRotation}
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
        <div className="div-bottom">
          {/* Ikony větrníků na mapě - PEVNĚ 3 větrníky */}
          {WINDMILLS.map((windmill) => (
            <img
              key={`windmill-${windmill.id}`}
              src="/novyVetrnik.webp"
              alt=""
              className="windmill-map-icon"
              style={{
                top: windmill.top,
                left: windmill.left,
              }}
            />
          ))}

          {/* Kolečka s čísly */}
          {POSITIONS.map((pos, index) => (
            <Marker
              key={pos.id}
              id={index + 1}
              rotation={
                activeMarker === pos.id ? rotation : pos.defaultRotation
              }
              top={pos.top}
              left={pos.left}
              isActive={activeMarker === pos.id}
              onClick={() => handleMarkerClick(pos.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
