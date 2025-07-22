import React, { useEffect, useRef, useCallback } from "react";
import "./ImageModal.css";

function slugify(text) {
  return text
    .toString()
    .normalize("NFD") // normalize for diacritics
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-");
}

function trapFocus(container) {
  const focusableElements = container.querySelectorAll(
    'a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, [tabindex="0"], [contenteditable]'
  );

  if (!focusableElements.length) return () => {};

  const firstEl = focusableElements[0];
  const lastEl = focusableElements[focusableElements.length - 1];

  function handleKeyDown(e) {
    if (e.key === "Tab") {
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
  }

  container.addEventListener("keydown", handleKeyDown);
  return () => container.removeEventListener("keydown", handleKeyDown);
}

function ImageModal({ image, closeModal, imageList }) {
  const modalRef = useRef(null);

  const currentIndex = imageList.findIndex((img) => img.id === image.id);
  const nextImage = imageList[(currentIndex + 1) % imageList.length];
  const prevImage = imageList[(currentIndex - 1 + imageList.length) % imageList.length];

  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === "Escape") closeModal();
      if (e.key === "ArrowRight") {
        const next = imageList[(currentIndex + 1) % imageList.length];
        if (next) window.location.hash = slugify(next.title);
      }
      if (e.key === "ArrowLeft") {
        const prev = imageList[(currentIndex - 1 + imageList.length) % imageList.length];
        if (prev) window.location.hash = slugify(prev.title);
      }
    },
    [closeModal, imageList, currentIndex]
  );

  useEffect(() => {
    if (modalRef.current) {
      const deactivate = trapFocus(modalRef.current);
      document.addEventListener("keydown", handleKeyDown);
      return () => {
        deactivate();
        document.removeEventListener("keydown", handleKeyDown);
      };
    }
  }, [handleKeyDown]);

  // Preload images
  useEffect(() => {
    const preload = (src) => {
      const img = new Image();
      img.src = src;
    };
    preload(nextImage?.src);
    preload(prevImage?.src);
  }, [nextImage, prevImage]);

  return (
    <div className="image-modal-overlay">
      <div className="image-modal" ref={modalRef}>
        <button onClick={closeModal} autoFocus className="close-btn">
          ✕
        </button>
        <div className="image-content">
          <img src={image.src} alt={image.title} />
          <h2>{image.title}</h2>
          <p>{image.description}</p>
        </div>
        <div className="image-navigation">
          <a href={`#${slugify(prevImage.title)}`} className="nav-button">← Prev</a>
          <a href={`#${slugify(nextImage.title)}`} className="nav-button">Next →</a>
        </div>
      </div>
    </div>
  );
}

export default ImageModal;
