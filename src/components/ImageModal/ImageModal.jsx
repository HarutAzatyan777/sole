import React, { useState, useEffect, useRef } from "react";
import "./ImageModal.css";

export default function ImageModal({ images, currentIndex, onClose, onNext, onPrev, item }) {
  const overlayRef = useRef(null);
  const imageRef = useRef(null);
  const [isZoomed, setIsZoomed] = useState(false);
  const [transformOrigin, setTransformOrigin] = useState("center center");
  const [showTouchIcon, setShowTouchIcon] = useState(true);
  const [dragPos, setDragPos] = useState({ x: 0, y: 0 });
  const [dragStart, setDragStart] = useState(null);

  let touchStartX = 0;
  let touchEndX = 0;

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") onNext();
      if (e.key === "ArrowLeft") onPrev();
    };

    const handleTouchStart = (e) => {
      touchStartX = e.changedTouches[0].screenX;
    };

    const handleTouchEnd = (e) => {
      touchEndX = e.changedTouches[0].screenX;
      handleGesture();
    };

    const handleGesture = () => {
      const diff = touchStartX - touchEndX;
      const threshold = 50;
      if (Math.abs(diff) > threshold) {
        diff > 0 ? onNext() : onPrev();
      }
    };

    const overlay = overlayRef.current;
    overlay.addEventListener("touchstart", handleTouchStart);
    overlay.addEventListener("touchend", handleTouchEnd);
    window.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      overlay.removeEventListener("touchstart", handleTouchStart);
      overlay.removeEventListener("touchend", handleTouchEnd);
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "auto";
    };
  }, [onClose, onNext, onPrev]);

  const handleImageClick = (e) => {
    if (!isZoomed) {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      setTransformOrigin(`${x}% ${y}%`);
      setIsZoomed(true);
    } else {
      setIsZoomed(false);
      setDragPos({ x: 0, y: 0 });
      setTransformOrigin("center center");
    }
    setShowTouchIcon(false);
  };

  const handleMouseDown = (e) => {
    if (!isZoomed) return;
    setDragStart({ x: e.clientX - dragPos.x, y: e.clientY - dragPos.y });
  };

  const handleMouseMove = (e) => {
    if (isZoomed && dragStart) {
      const x = e.clientX - dragStart.x;
      const y = e.clientY - dragStart.y;
      setDragPos({ x, y });
    }
  };

  const handleMouseUp = () => {
    if (isZoomed) setDragStart(null);
  };

  if (!images || images.length === 0) return null;

  return (
    <div className="image-modal-overlay" ref={overlayRef}>
      <div className="image-modal-content">
        <button className="close-button" onClick={onClose} aria-label="Փակել">✕</button>

        <div className="image-container modal-image-container">
          <button className="nav-button prev" onClick={onPrev} aria-label="Նախորդ" disabled={isZoomed}>←</button>

          <img
            ref={imageRef}
            src={images[currentIndex]}
            alt={`Նկար ${currentIndex + 1}`}
            className={`modal-image ${isZoomed ? "zoomed" : ""}`}
            style={{
              transformOrigin,
              transform: isZoomed
                ? `scale(2) translate(${dragPos.x / 2}px, ${dragPos.y / 2}px)`
                : "scale(1)",
              cursor: isZoomed
                ? "grab"
                : 'url("/zoom-in.png") 24 24, zoom-in'
            }}
            loading="lazy"
            onClick={handleImageClick}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            draggable={false}
          />

          {showTouchIcon && !isZoomed && (
            <img src="/zoom-in.png" alt="Zoom icon" className="zoom-hint-icon" />
          )}

          <button className="nav-button next" onClick={onNext} aria-label="Հաջորդ" disabled={isZoomed}>→</button>
        </div>

        {item && (
          <div className="modal-info">
            <h2>{item.nameEn || item.nameHy}</h2>
            <p><strong>Գին:</strong> {item.price} AMD</p>
            {item.params?.weight && <p><strong>Քաշ:</strong> {item.params.weight} գ</p>}
            {item.params?.size && <p><strong>Չափս:</strong> {item.params.size}</p>}
            {item.params?.type && <p><strong>Տեսակ:</strong> {item.params.type}</p>}
            {item.params?.metal && <p><strong>Մետաղ:</strong> {item.params.metal}</p>}
            {item.params?.stone && <p><strong>Քար:</strong> {item.params.stone}</p>}
          </div>
        )}

        <div className="image-index">
          {currentIndex + 1} / {images.length}
        </div>
      </div>
    </div>
  );
}
