import React, { useState, useEffect, useCallback } from "react";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "../firebase";
import Nav from "../components/Nav";
import ScrollToTop from "../components/ScrollToTop";
import JewelleryCard from "./JewelleryCard/JewelleryCard";
import "../styles/JewelleryMenuPage.css";
import ImageModal from "./ImageModal/ImageModal";

function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\p{L}\p{N}-]+/gu, "")
    .replace(/--+/g, "-");
}

function JewelleryMenuSection({ section, onOpenGallery }) {
  return (
    <section
      className="jewellery-section"
      aria-labelledby={slugify(section.category)}
    >
      <h3 className="jewellery-title" id={slugify(section.category)}>
        {section.category}
      </h3>

      <div className="jewellery-grid">
        {section.items?.map((item, index) => (
          <JewelleryCard
            key={item.id || index}
            item={item}
            onOpenGallery={() =>
              onOpenGallery(
                [...(item.imageUrls || []), ...(item.videoUrls || [])],
                item
              )
            }
          />
        ))}
      </div>
    </section>
  );
}

export default function JewelleryMenuPage() {
  const [menu, setMenu] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeGallery, setActiveGallery] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [activeItem, setActiveItem] = useState(null);

  const categorySlugs = React.useMemo(() => {
    const cats = [...new Set(menu.map((s) => s.category))];
    return cats.map((cat) => ({ name: cat, slug: slugify(cat) }));
  }, [menu]);

  const loadMenu = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const q = query(collection(db, "menu"), orderBy("order"));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMenu(data);
    } catch (error) {
      console.error("Չհաջողվեց բեռնել մենյուն։", error);
      setError("Չհաջողվեց բեռնել մենյուն։ Խնդրում ենք կրկին փորձել:");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadMenu();
  }, [loadMenu]);

  useEffect(() => {
    const hero = document.getElementById("heroSection");
    if (!hero) return;

    const onScroll = () => {
      if (window.scrollY > 250) {
        hero.classList.add("shrink");
      } else {
        hero.classList.remove("shrink");
      }
    };

    window.addEventListener("scroll", onScroll);
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!activeGallery || activeGallery.length <= 1) return;
    const nextIndex = (activeIndex + 1) % activeGallery.length;
    const prevIndex =
      (activeIndex - 1 + activeGallery.length) % activeGallery.length;

    const preloadNext = new Image();
    preloadNext.src = activeGallery[nextIndex];

    const preloadPrev = new Image();
    preloadPrev.src = activeGallery[prevIndex];
  }, [activeIndex, activeGallery]);

  const openGallery = useCallback((images, item) => {
    setActiveGallery(images);
    setActiveItem(item);
    setActiveIndex(0);
  }, []);

  const closeGallery = useCallback(() => {
    setActiveGallery(null);
    setActiveIndex(0);
    setActiveItem(null);
  }, []);

  const nextImage = useCallback(() => {
    if (!activeGallery) return;
    setActiveIndex((prev) => (prev + 1) % activeGallery.length);
  }, [activeGallery]);

  const prevImage = useCallback(() => {
    if (!activeGallery) return;
    setActiveIndex(
      (prev) => (prev - 1 + activeGallery.length) % activeGallery.length
    );
  }, [activeGallery]);

  return (
    <div className="jewellery-menu-page">
      {/* HERO VIDEO SECTION */}
      <section className="hero-video-section" id="heroSection">
        {/* <video autoPlay muted loop playsInline className="hero-video">
          <source src="/videos/jewelry-bg2.webp" type="video/mp4" />
          Ձեր դիտարկիչը չի աջակցում տեսանյութերին։
        </video> */}
        <img
          src="/videos/jewelry-bg2.webp"
          className="hero-video"
          alt="Jewelry background"
        />

        <div className="hero-overlay">
          <div className="hero-text">
            <h1>Fashion fades, style remains</h1>
            <p>Discover the luxurious world of gold with Sole Jewelry</p>
            <button
              type="button"
              className="scroll-down-indicator"
              onClick={() => {
                window.scrollTo({
                  top: window.innerHeight,
                  behavior: "smooth",
                });
              }}
              aria-label="Scroll to the collection"
            >
              <span className="arrow-down" aria-hidden="true"></span>
              <span className="sr-only">Scroll to the collection</span>
            </button>
          </div>
        </div>
      </section>
      {/* <GoldPrice /> */}

      {/* MENU CONTENT */}
      <div className="jewellery-menu-content">
        <Nav categories={categorySlugs} />

        {loading && (
          <div className="loader" aria-label="Մենյուն բեռնվում է..." role="status">
            <span>Մենյուն բեռնվում է...</span>
          </div>
        )}

        {!loading && error && (
          <div className="status-card error" role="alert">
            <p>{error}</p>
            <button type="button" className="retry-button" onClick={loadMenu}>
              Կրկին փորձել
            </button>
          </div>
        )}

        {!loading && !error && menu.length === 0 && (
          <p className="empty-state">
            Մենյուն դեռ դատարկ է։ Խնդրում ենք փորձել ավելի ուշ կամ կապվել մեզ հետ։
          </p>
        )}

        {!loading &&
          !error &&
          menu.length > 0 &&
          menu.map((section) => (
            <JewelleryMenuSection
              key={section.id}
              section={section}
              onOpenGallery={openGallery}
            />
          ))}

        {activeGallery && (
          <ImageModal
            images={activeGallery}
            currentIndex={activeIndex}
            onClose={closeGallery}
            onNext={nextImage}
            onPrev={prevImage}
            item={activeItem}
          />
        )}

        <ScrollToTop />
      </div>
    </div>
  );
}
