import React, { useState, useEffect } from "react";
import "../styles/Nav.css";

export default function Nav({ categories }) {
  const [activeSlug, setActiveSlug] = useState(null);

  const handleScrollToSection = (slug) => {
    const section = document.getElementById(slug);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
      setActiveSlug(slug);
    }
  };

  useEffect(() => {
    function onScroll() {
      const scrollPosition = window.scrollY + window.innerHeight / 2;

      let currentSlug = null;
      for (const { slug } of categories) {
        const section = document.getElementById(slug);
        if (section && section.offsetTop <= scrollPosition) {
          currentSlug = slug;
        }
      }

      if (currentSlug !== activeSlug) {
        setActiveSlug(currentSlug);
      }
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    return () => window.removeEventListener("scroll", onScroll);
  }, [categories, activeSlug]);

  return (
    <nav className="qr-nav" role="navigation" aria-label="Jewellery categories navigation">
      <div className="qr-nav-buttons">
        {categories.map(({ name, slug }) => (
          <button
            key={slug}
            onClick={() => handleScrollToSection(slug)}
            className={`qr-nav-button ${activeSlug === slug ? "active" : ""}`}
            aria-current={activeSlug === slug ? "true" : undefined}
          >
            <span className="text">{name}</span>
            <span className="underline" />
          </button>
        ))}
      </div>
    </nav>
  );
}
