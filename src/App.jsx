import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import "./App.css";

const BASE_URL = "https://noho.b-cdn.net/vizualizace%20fotky";

// Generování URL pro fotky - Drahouš
const getPhotoUrls = (id) => ({
  normal: `${BASE_URL}/panorama_${id}.webp`,
  xray: `${BASE_URL}/prekazka_${id}.webp`,
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

// ============ DRAHOUŠ - 3 VĚTRNÍKY, 7 POHLEDŮ ============
// URL obrázku mapy
const MAP_URL =
  "https://noho.b-cdn.net/vizualizace%20fotky/groundView_drahous.webp";

// ============ ZAKOMENTOVÁNO - pozice větrníků (Drahouš má větrníky zapečené v ground view) ============
// const WINDMILLS = [
//   { id: 1, imgTop: 50, imgLeft: 43 },
//   { id: 2, imgTop: 56, imgLeft: 41 },
//   { id: 3, imgTop: 60, imgLeft: 39 },
// ];

// ============ ZAKOMENTOVÁNO - varianta s přepínáním 3/4/5 větrníků (Krakov) ============
// Pro jiné lokality se hodí přepínač - zachovat pro budoucí použití
// const WINDMILL_POSITIONS = {
//   3: [
//     { id: 1, imgTop: 40, imgLeft: 21 },
//     { id: 2, imgTop: 34, imgLeft: 41 },
//     { id: 3, imgTop: 32, imgLeft: 73 },
//   ],
//   4: [
//     { id: 1, imgTop: 40, imgLeft: 21 },
//     { id: 2, imgTop: 34, imgLeft: 41 },
//     { id: 3, imgTop: 32, imgLeft: 57 },
//     { id: 4, imgTop: 32, imgLeft: 73 },
//   ],
//   5: [
//     { id: 1, imgTop: 40, imgLeft: 21 },
//     { id: 2, imgTop: 34, imgLeft: 41 },
//     { id: 3, imgTop: 32, imgLeft: 57 },
//     { id: 4, imgTop: 32, imgLeft: 73 },
//     { id: 5, imgTop: 50, imgLeft: 83 },
//   ],
// };
// const WINDMILL_COUNTS = [3, 4, 5];

// 7 pozorovatelen - souřadnice v % obrázku
// TODO: doladit přesné pozice + jména po nahrání fotek na bunny.net
const OBSERVATION_MARKERS = [
  {
    id: 1,
    imgTop: 47,
    imgLeft: 35,
    defaultRotation: 150,
    rotationSpeed: 3,
    name: "1. Drahouš od Hostince",
  },
  {
    id: 2,
    imgTop: 42,
    imgLeft: 35,
    defaultRotation: 170,
    rotationSpeed: 3,
    name: "2. Drahouš od obecního úřadu",
  },
  {
    id: 3,
    imgTop: 54,
    imgLeft: 29,
    defaultRotation: 120,
    rotationSpeed: 3,
    name: "3. Tlesky náves",
  },
  {
    id: 4,
    imgTop: 75,
    imgLeft: 26,
    defaultRotation: 80,
    rotationSpeed: 3,
    name: "4. Ždár náves",
  },
  {
    id: 5,
    imgTop: 25,
    imgLeft: 31,
    defaultRotation: 180,
    rotationSpeed: 3,
    name: "5. Jesenice náměstí",
  },
  {
    id: 6,
    imgTop: 24,
    imgLeft: 57,
    defaultRotation: 210,
    rotationSpeed: 3,
    name: "6. Kosobody náves",
  },
  {
    id: 7,
    imgTop: 67,
    imgLeft: 75,
    defaultRotation: 320,
    rotationSpeed: 3,
    name: "7. Velká Chmelišná náves",
  },
];

// ============ ZAKOMENTOVÁNO - hook pro detekci mobilu (zatím nepoužitý) ============
// function useIsMobile(breakpoint = 425) {
//   const [isMobile, setIsMobile] = useState(
//     typeof window !== "undefined" ? window.innerWidth <= breakpoint : false,
//   );
//
//   useEffect(() => {
//     const handleResize = () => {
//       setIsMobile(window.innerWidth <= breakpoint);
//     };
//
//     window.addEventListener("resize", handleResize);
//     return () => window.removeEventListener("resize", handleResize);
//   }, [breakpoint]);
//
//   return isMobile;
// }

// Hook pro přepočet souřadnic z obrázku na kontejner.
// Počítá "contain" rozložení a navíc umožňuje volitelný `zoom` (>1 = víc přiblížené,
// stále vycentrované; markery i background-size jsou ze stejného výpočtu, takže
// CSS background a marker pozice jsou vždy v sync).
function useMapContain(containerRef, imageUrl, zoom = 1) {
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

  // Vypočítat "contain × zoom" rozložení
  const layout = useMemo(() => {
    if (!containerSize || !imgRatio) return null;
    const { w: cw, h: ch } = containerSize;
    const cr = cw / ch;

    let rw, rh;
    if (cr > imgRatio) {
      // Kontejner širší než obrázek - obrázek vyplní výšku
      rh = ch;
      rw = ch * imgRatio;
    } else {
      // Kontejner užší než obrázek - obrázek vyplní šířku
      rw = cw;
      rh = cw / imgRatio;
    }

    // Aplikovat zoom (stále vycentrované, může lehce přesahovat)
    rw *= zoom;
    rh *= zoom;
    const ox = (cw - rw) / 2;
    const oy = (ch - rh) / 2;
    return { cw, ch, rw, rh, ox, oy };
  }, [containerSize, imgRatio, zoom]);

  // Funkce pro převod souřadnic obrázku -> kontejneru
  const toContainer = useCallback(
    (imgLeftPct, imgTopPct) => {
      if (!layout) {
        return { top: `${imgTopPct}%`, left: `${imgLeftPct}%` };
      }
      const { cw, ch, rw, rh, ox, oy } = layout;
      const x = ox + (imgLeftPct / 100) * rw;
      const y = oy + (imgTopPct / 100) * rh;
      return {
        left: `${(x / cw) * 100}%`,
        top: `${(y / ch) * 100}%`,
      };
    },
    [layout],
  );

  // Style pro inline aplikaci na div s background-image
  const bgStyle = layout
    ? {
        backgroundSize: `${layout.rw}px ${layout.rh}px`,
        backgroundPosition: `${layout.ox}px ${layout.oy}px`,
      }
    : null;

  return { toContainer, bgStyle, mapWidth: layout?.rw ?? null };
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
  const mapContainerRef = useRef(null);

  // Detekce mobilního rozlišení (pro menší zoom na mapě)
  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined" && window.innerWidth <= 425,
  );
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 425px)");
    const handler = (e) => setIsMobile(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  // Mapa: contain × MAP_ZOOM (1.0 = klasický contain, >1 = víc přiblížené)
  // Na mobilu menší zoom aby se vešla celá mapa
  const MAP_ZOOM = isMobile ? 1.0 : 1.5;
  const {
    toContainer: toMapPos,
    bgStyle: mapBgStyle,
    mapWidth,
  } = useMapContain(mapContainerRef, MAP_URL, MAP_ZOOM);

  // ============ ZAKOMENTOVÁNO - state pro switcher (Krakov) ============
  // const [windmillCount, setWindmillCount] = useState(3);
  // const WINDMILLS_DYNAMIC = WINDMILL_POSITIONS[windmillCount];

  // Pozorovatelny
  const POSITIONS = OBSERVATION_MARKERS;

  const [xrayMode, setXrayMode] = useState(false);
  const [activeMarker, setActiveMarker] = useState(1);
  const [isZoomed, setIsZoomed] = useState(false);
  const [panX, setPanX] = useState(0); // horizontální posun v procentech
  const [panY, setPanY] = useState(0); // vertikální posun v procentech

  // Aspect ratio aktuálního normal/xray obrázku (pro detekci, jestli se vůbec dá panovat)
  const [normalAspect, setNormalAspect] = useState(null);
  const [xrayAspect, setXrayAspect] = useState(null);
  // Velikost prohlížeče (pro detekci canPan)
  const [viewerSize, setViewerSize] = useState(null);

  // Limit posunu - 50 = plný rozsah objectPosition 0–100%
  const PAN_LIMIT = 50;

  // Získání aktuálního markeru pro zobrazení názvu
  const currentMarker =
    POSITIONS.find((p) => p.id === activeMarker) || POSITIONS[0];

  // Reference pro drag
  const containerRef = useRef(null);
  const isDragging = useRef(false);
  const dragStartX = useRef(0);
  const dragStartY = useRef(0);
  const panStartX = useRef(0);
  const panStartY = useRef(0);
  const hasShownHint = useRef(false);

  // Přednačtení obrázků + měření aspect ratio pro aktivní marker
  useEffect(() => {
    const urls = getPhotoUrls(activeMarker);
    const normalImg = new Image();
    const xrayImg = new Image();
    normalImg.onload = () =>
      setNormalAspect(normalImg.naturalWidth / normalImg.naturalHeight);
    xrayImg.onload = () =>
      setXrayAspect(xrayImg.naturalWidth / xrayImg.naturalHeight);
    normalImg.src = urls.normal;
    xrayImg.src = urls.xray;
  }, [activeMarker]);

  // Sledovat velikost prohlížeče
  useEffect(() => {
    if (!containerRef.current) return;
    const measure = () => {
      const el = containerRef.current;
      if (el) setViewerSize({ w: el.offsetWidth, h: el.offsetHeight });
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, []);

  // Cílová URL fotky (může být ještě nenahraná)
  const currentUrls = getPhotoUrls(activeMarker);
  const targetImage = xrayMode ? currentUrls.xray : currentUrls.normal;
  const currentAspect = xrayMode ? xrayAspect : normalAspect;

  // "Double-buffering": zobrazenou fotku necháme starou dokud se nová nenahraje.
  // isImageLoading je odvozený stav (target ≠ display), aby se nemuselo
  // setState volat synchronně v efektu.
  const [displayImage, setDisplayImage] = useState(targetImage);
  const isImageLoading = targetImage !== displayImage;

  useEffect(() => {
    if (targetImage === displayImage) return;
    let cancelled = false;
    const img = new Image();
    img.onload = () => {
      if (cancelled) return;
      setDisplayImage(targetImage);
    };
    img.src = targetImage;
    return () => {
      cancelled = true;
    };
  }, [targetImage, displayImage]);

  // Spočítá, jak moc fotka skutečně přetéká (jako podíl šířky/výšky kontejneru).
  // Bere v úvahu object-fit: cover ZÁROVEŇ s transform: scale (zoom), takže výseč se
  // hýbe přesně tak, jak se hýbe fotka — bez ohledu na velikost obrazovky a režim.
  const { horizontalOverflow, verticalOverflow } = useMemo(() => {
    if (!currentAspect || !viewerSize)
      return { horizontalOverflow: 0, verticalOverflow: 0 };
    const { w: cw, h: ch } = viewerSize;
    // Cover mód: image vyplní kratší rozměr, na druhém přetéká
    let renderedW, renderedH;
    if (currentAspect > cw / ch) {
      // Obrázek "širší" než kontejner → vyplní výšku, přetéká vodorovně
      renderedH = ch;
      renderedW = ch * currentAspect;
    } else {
      // Obrázek "užší" → vyplní šířku, přetéká vertikálně
      renderedW = cw;
      renderedH = cw / currentAspect;
    }
    // Zoom (transform: scale 1.5) zvětšuje vizuálně 1.5× v obou osách
    if (isZoomed) {
      renderedW *= 1.5;
      renderedH *= 1.5;
    }
    return {
      horizontalOverflow: Math.max(0, (renderedW - cw) / cw),
      verticalOverflow: Math.max(0, (renderedH - ch) / ch),
    };
  }, [currentAspect, viewerSize, isZoomed]);

  // Pannout jde jen pokud je nějaký smysluplný přesah (>2%)
  const canPanHorizontally = horizontalOverflow > 0.02;
  const canPanVertically = verticalOverflow > 0.02;

  // Když fotka v dané ose pannout nejde, neaplikuj posun (image bude vycentrovaný).
  // Drženo jako derivovaná hodnota místo setState v useEffect.
  const appliedPanX = canPanHorizontally ? panX : 0;
  const appliedPanY = canPanVertically ? panY : 0;

  // Rotace výseče — přímo úměrná skutečnému přesahu fotky.
  // overflow = 0   → výseč stojí
  // overflow = 0.3 → výseč se otočí o ~9° při max posunu
  // overflow = 1.0 → výseč se otočí o ~30° při max posunu
  // ROTATION_DAMPING řídí celkovou citlivost (0.4 = realistická vazba na pohyb fotky).
  const ROTATION_DAMPING = 0.4;
  const rotation = canPanHorizontally
    ? currentMarker.defaultRotation -
      appliedPanX *
        Math.min(horizontalOverflow, 1) *
        (currentMarker.rotationSpeed || 4) *
        ROTATION_DAMPING
    : currentMarker.defaultRotation;

  // Drag/pan handlery (umožní pohyb v ose, kde má fotka přesah)
  const canPanAny = canPanHorizontally || canPanVertically;

  const handlePointerDown = useCallback(
    (e) => {
      if (!canPanAny) return;
      isDragging.current = true;
      dragStartX.current = e.clientX;
      dragStartY.current = e.clientY;
      panStartX.current = panX;
      panStartY.current = panY;
      e.currentTarget.setPointerCapture(e.pointerId);
    },
    [panX, panY, canPanAny],
  );

  const handlePointerMove = useCallback(
    (e) => {
      if (!isDragging.current || !containerRef.current || !canPanAny) return;
      const containerWidth = containerRef.current.offsetWidth;
      const containerHeight = containerRef.current.offsetHeight;
      const limit = PAN_LIMIT;
      if (canPanHorizontally) {
        const dx = e.clientX - dragStartX.current;
        const pct = (dx / containerWidth) * 80;
        setPanX(Math.max(-limit, Math.min(limit, panStartX.current + pct)));
      }
      if (canPanVertically) {
        const dy = e.clientY - dragStartY.current;
        const pct = (dy / containerHeight) * 80;
        setPanY(Math.max(-limit, Math.min(limit, panStartY.current + pct)));
      }
    },
    [canPanAny, canPanHorizontally, canPanVertically],
  );

  const handlePointerUp = useCallback(() => {
    isDragging.current = false;
  }, []);

  // Plynulý posun při držení šipky
  const panInterval = useRef(null);

  const startPan = (direction) => {
    if (!canPanHorizontally || panInterval.current) return;
    const step = direction === "left" ? 0.8 : -0.8;
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
    setPanY(0);
    setIsZoomed(false);
  };

  // Náznak posunu při prvním načtení (pouze když se fotka skutečně dá panovat)
  useEffect(() => {
    if (hasShownHint.current || !canPanHorizontally) return;
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
  }, [canPanHorizontally]);

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
      <div
        className="card"
        style={
          mapWidth && !isMobile
            ? { maxWidth: mapWidth, margin: "0 auto" }
            : undefined
        }
      >
        {/* ============ WINDMILL SWITCHER - ZAKOMENTOVÁNO (Drahouš má napevno 3 větrníky) ============ */}
        {/* <div className="windmill-switcher">
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
        </div> */}
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
                objectPosition: `${50 - appliedPanX}% ${50 - appliedPanY}%`,
                transform: isZoomed ? "scale(1.5)" : "scale(1)",
                transformOrigin: `${50 - appliedPanX}% ${50 - appliedPanY}%`,
              }}
            />
            {isImageLoading && (
              <div className="image-loader" aria-hidden="true">
                <div className="spinner" />
              </div>
            )}
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
        <div
          className="div-bottom"
          ref={mapContainerRef}
          style={mapBgStyle ?? undefined}
        >
          {/* ============ ZAKOMENTOVÁNO - ikony větrníků na mapě (Drahouš má větrníky už zapečené v ground view z Figmy) ============ */}
          {/* {WINDMILLS.map((windmill) => {
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
          })} */}

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
