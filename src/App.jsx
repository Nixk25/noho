import { useState, useRef, useEffect } from "react";
import { ReactPhotoSphereViewer } from "react-photo-sphere-viewer";
import "./App.css";

const BASE_URL = "https://noho.b-cdn.net/vizualizace%20fotky";

// Generování URL pro fotky
const getPhotoUrls = (id) => ({
  normal: `${BASE_URL}/x0${id}_S_final.jpg`,
  xray: `${BASE_URL}/x0${id}_final.jpg`,
});

// Konfigurace 8 pozic kolečel na ground view - DESKTOP (400px card)
// top/left jsou v procentech, defaultRotation je výchozí úhel výseče
const POSITIONS_DESKTOP = [
  { id: 1, top: "49%", left: "6%", defaultRotation: 120 },
  { id: 2, top: "53%", left: "10%", defaultRotation: 110 },
  { id: 3, top: "42%", left: "13%", defaultRotation: 130 },
  { id: 4, top: "40%", left: "19%", defaultRotation: 80 },
  { id: 5, top: "5%", left: "30%", defaultRotation: 170 },
  { id: 6, top: "3%", left: "61%", defaultRotation: 200 },
  { id: 7, top: "54%", left: "62%", defaultRotation: 120 },
  { id: 8, top: "67%", left: "71%", defaultRotation: 300 },
];

// Konfigurace 8 pozic kolečel na ground view - MOBIL (320-425px)
// Uprav tyto hodnoty podle toho, jak se cropuje obrázek na mobilu
const POSITIONS_MOBILE = [
  { id: 1, top: "46%", left: "2%", defaultRotation: 120 },
  { id: 2, top: "52%", left: "9%", defaultRotation: 110 },
  { id: 3, top: "40%", left: "9%", defaultRotation: 130 },
  { id: 4, top: "38%", left: "16%", defaultRotation: 80 },
  { id: 5, top: "2%", left: "28%", defaultRotation: 170 },
  { id: 6, top: "2%", left: "61%", defaultRotation: 200 },
  { id: 7, top: "51%", left: "65%", defaultRotation: 120 },
  { id: 8, top: "64%", left: "80%", defaultRotation: 300 },
];

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
function Marker({ rotation = 0, top, left, isActive, onClick }) {
  return (
    <div className="marker-wrapper" style={{ top, left }}>
      <div
        className="marker-inner"
        style={{ transform: `rotate(${rotation}deg)` }}
      >
        <div
          className={`marker-dot ${isActive ? "marker-dot-active" : ""}`}
          onClick={onClick}
        />
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
  const POSITIONS = isMobile ? POSITIONS_MOBILE : POSITIONS_DESKTOP;

  const [xrayMode, setXrayMode] = useState(false);
  const [activeMarker, setActiveMarker] = useState(1);
  const [rotation, setRotation] = useState(
    POSITIONS_DESKTOP[0].defaultRotation,
  );

  // Sledujeme předchozí úhel a kumulativní rotaci
  const prevAngle = useRef(0);
  const cumulativeRotation = useRef(POSITIONS[0].defaultRotation);

  // Reference na viewer pro zachování pozice
  const viewerRef = useRef(null);
  const currentYaw = useRef(0);

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

  // Callback když se viewer načte
  const handleReady = (instance) => {
    viewerRef.current = instance;
    // Nastav pozici na uloženou hodnotu
    if (currentYaw.current !== 0) {
      instance.rotate({ yaw: currentYaw.current, pitch: 0 });
    }
  };

  return (
    <div className="page-wrapper">
      <div className="card">
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
            defaultYaw={currentYaw.current}
            navbar={false}
          />
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

          <div className="view-mode-label">
            <span>360°</span>
            <svg
              className="eye-icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
          </div>

          <span className="bottom-label">Pohled z centra obce</span>
        </div>

        {/* Spodní část - ground view s 8 kolečky */}
        <div className="div-bottom">
          {POSITIONS.map((pos) => (
            <Marker
              key={pos.id}
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
