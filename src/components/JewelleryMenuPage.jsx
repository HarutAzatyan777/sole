import React, { useState, useEffect, useCallback } from "react";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "../firebase";
import Nav from "../components/Nav";
import ScrollToTop from "../components/ScrollToTop";
import JewelleryCard from "./JewelleryCard/JewelleryCard";

import "../styles/JewelleryMenuPage.css";
import ImageModal from "./ImageModal/ImageModal";
import JewelleryMenuInfo from "./JewelleryMenuInfo/JewelleryMenuInfo";
import GoldPrice from "./GoldPrice/GoldPrice";

function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-") // Բոլոր բացատները փոխում ենք -
    .replace(/[^\p{L}\p{N}-]+/gu, "") // Թույլատրում ենք միայն տառեր (L), թվեր (N), և - նշանը
    .replace(/--+/g, "-"); // Երկուից ավել - վերացնում ենք
}

// Բաժին + grid կոմպոնենտ
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
    key={item.id || index} // fallback to index if no id
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

// Գլխավոր էջի կոմպոնենտ
export default function JewelleryMenuPage() {
  const [menu, setMenu] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeGallery, setActiveGallery] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [activeItem, setActiveItem] = useState(null);

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
        console.error("Չհաջողվեց բեռնել մենյուն։", error);
      } finally {
        setLoading(false);
      }
    };
    fetchMenu();
  }, []);

  useEffect(() => {
    if (!activeGallery) return;

    const nextIndex = (activeIndex + 1) % activeGallery.length;
    const prevIndex = (activeIndex - 1 + activeGallery.length) % activeGallery.length;

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
    setActiveIndex((prev) => (prev - 1 + activeGallery.length) % activeGallery.length);
  }, [activeGallery]);

  return (
    <div className="jewellery-menu-page">
      <h2 className="menu-title">
        <img src="/logo.jpg" alt="sole_jewelry_ Logo" className="menu-logo" />
      </h2>
      {/* <GoldPrice /> */}

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
          item={activeItem}
        />
      )}

      <div className="jewellery-menu-info">
  <JewelleryMenuInfo />
      </div>
        <ScrollToTop />
    </div>
  );
}
