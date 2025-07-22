import React, { useState, useEffect, useRef, useCallback } from "react";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "../firebase";
import Nav from "../components/Nav";
import ScrollToTop from "../components/ScrollToTop";

import "../styles/JewelleryMenuPage.css";

function trapFocus(element) {
  const focusableSelectors = [
    'a[href]',
    'area[href]',
    'input:not([disabled])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    'button:not([disabled])',
    '[tabindex]:not([tabindex="-1"])',
  ];

  const focusableEls = element.querySelectorAll(focusableSelectors.join(','));
  const firstEl = focusableEls[0];
  const lastEl = focusableEls[focusableEls.length - 1];

  function handleKeyDown(e) {
    if (e.key !== 'Tab') return;

    if (e.shiftKey) {
      if (document.activeElement === firstEl) {
        e.preventDefault();
        lastEl.focus();
      }
    } else {
      if (document.activeElement === lastEl) {
        e.preventDefault();
        firstEl.focus();
      }
    }
  }

  element.addEventListener('keydown', handleKeyDown);
  return () => element.removeEventListener('keydown', handleKeyDown);
}

function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-") // Բոլոր բացատները փոխում ենք -
    .replace(/[^\p{L}\p{N}-]+/gu, "") // Թույլատրում ենք միայն տառեր (L), թվեր (N), և - նշանը
    .replace(/--+/g, "-"); // Երկուից ավել - վերացնում ենք
}

// Modal կոմպոնենտ նկարների դիտման համար
function ImageModal({ images, currentIndex, onClose, onNext, onPrev }) {
  const modalRef = useRef(null);

  useEffect(() => {
    const deactivate = trapFocus(modalRef.current);
    return () => deactivate();
  }, []);

  useEffect(() => {
    function onKeyDown(e) {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowRight") onNext();
      else if (e.key === "ArrowLeft") onPrev();
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose, onNext, onPrev]);

  if (!images || images.length === 0) return null;

  return (
    <div
      className="modal-backdrop"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      tabIndex={-1}
    >
      <div
        ref={modalRef}
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="modal-close-btn"
          onClick={onClose}
          aria-label="Փակել նկարի պատուհանը"
          autoFocus
        >
          ✕
        </button>

        <img
          src={images[currentIndex]}
          alt={`Նկար ${currentIndex + 1} - ընդհանուր ${images.length}`}
          className="modal-image"
          loading="lazy"
        />

        {images.length > 1 && (
          <>
            <button
              className="modal-nav-btn left"
              onClick={onPrev}
              aria-label="Նախորդ նկար"
            />
            <button
              className="modal-nav-btn right"
              onClick={onNext}
              aria-label="Հաջորդ նկար"
            />
          </>
        )}
      </div>
    </div>
  );
}

// Բաժին + grid կոմպոնենտ
function JewelleryMenuSection({ section, onOpenGallery }) {
  return (
    <section className="jewellery-section" aria-labelledby={slugify(section.category)}>
      <h3 className="jewellery-title" id={slugify(section.category)}>
        {section.category}
      </h3>

      <div className="jewellery-grid">
        {section.items?.map((item) => (
          <div
            key={item.id}
            className="jewellery-card"
            tabIndex={0}
            role="button"
            onClick={() => onOpenGallery(item.imageUrls)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") onOpenGallery(item.imageUrls);
            }}
            aria-label={`${item.nameEn || item.nameHy} - ${item.price} AMD`}
          >
            <img
              src={item.imageUrls?.[0] || ""}
              alt={item.nameEn || item.nameHy || "Նկար"}
              className="jewellery-image"
              loading="lazy"
              width={320}
              height={220}
            />
            <div className="jewellery-info">
              <h3>{item.nameEn || item.nameHy}</h3>
              <div className="jewellery-params">
                {item.params?.code && <p>Կոդ՝ {item.params.code}</p>}
                {item.params?.weight && <p>Քաշ՝ {item.params.weight} գ</p>}
                {item.params?.size && <p>Չափս՝ {item.params.size}</p>}
                {item.params?.type && <p>Տեսակ՝ {item.params.type}</p>}
                {item.params?.metal && <p>Մետաղ՝ {item.params.metal}</p>}
                {item.params?.stone && <p>Քար՝ {item.params.stone}</p>}
              </div>
              <div className="jewellery-price">{item.price} AMD</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// Գլխավոր էջի կոմպոնենտ
export default function JewelleryMenuPage() {
  const [menu, setMenu] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeGallery, setActiveGallery] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const categorySlugs = React.useMemo(() => {
    const cats = [...new Set(menu.map((s) => s.category))];
    return cats.map((cat) => ({ name: cat, slug: slugify(cat) }));
  }, [menu]);

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const q = query(collection(db, "menu"), orderBy("order"));
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setMenu(data);
      } catch (error) {
        console.error("Չհաջողվեց բեռնարկել մենյուն։", error);
      } finally {
        setLoading(false);
      }
    };
    fetchMenu();
  }, []);

  // Նախաբեռնում հաջորդ և նախորդ նկարները
  useEffect(() => {
    if (!activeGallery) return;

    const nextIndex = (activeIndex + 1) % activeGallery.length;
    const prevIndex = (activeIndex - 1 + activeGallery.length) % activeGallery.length;

    const preloadNext = new Image();
    preloadNext.src = activeGallery[nextIndex];

    const preloadPrev = new Image();
    preloadPrev.src = activeGallery[prevIndex];
  }, [activeIndex, activeGallery]);

  const openGallery = useCallback((images) => {
    setActiveGallery(images);
    setActiveIndex(0);
  }, []);

  const closeGallery = useCallback(() => {
    setActiveGallery(null);
    setActiveIndex(0);
  }, []);

  const nextImage = useCallback(() => {
    if (!activeGallery) return;
    setActiveIndex((prev) => (prev + 1) % activeGallery.length);
  }, [activeGallery]);

  const prevImage = useCallback(() => {
    if (!activeGallery) return;
    setActiveIndex((prev) => (prev - 1 + activeGallery.length) % activeGallery.length);
  }, [activeGallery]);

  return (
    <div className="jewellery-menu-page">
      <h2 className="menu-title">
        <img src="/logo.jpg" alt="sole_jewelry_ Logo" className="menu-logo" />
      </h2>

      <Nav categories={categorySlugs} />

      {loading ? (
        <div className="loader" aria-label="Մենյուն բեռնվում է...">
          <span>Մենյուն բեռնվում է...</span>
        </div>
      ) : menu.length === 0 ? (
        <p className="empty-state">
          Մենյուն դեռ դատարկ է։ Խնդրում ենք փորձել ավելի ուշ կամ կապվել մեզ հետ։
        </p>
      ) : (
        menu.map((section) => (
          <JewelleryMenuSection
            key={section.id}
            section={section}
            onOpenGallery={openGallery}
          />
        ))
      )}

      {activeGallery && (
        <ImageModal
          images={activeGallery}
          currentIndex={activeIndex}
          onClose={closeGallery}
          onNext={nextImage}
          onPrev={prevImage}
        />
      )}

      <div className="jewellery-menu-info">
        <p>📍 Moskovyan 28</p>
        <p>
          <em>Once upon a time Harutyun Pascali opened the 1st coffee place in France…</em>
        </p>
        <p>
          <strong>Official distributor of Malongo</strong>
        </p>
        <ScrollToTop />
      </div>
    </div>
  );
}
