import React, { useState, useEffect, useRef } from "react";
import "./JewelleryCard.css";

function JewelleryCard({ item, onOpenGallery }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isScaling, setIsScaling] = useState(false);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);
  const intervalRef = useRef(null);

  const images = item.imageUrls || [];

  useEffect(() => {
    if (images.length <= 1) return;

    const randomInterval = Math.floor(Math.random() * 3000) + 3000; // 3s–6s

    intervalRef.current = setInterval(() => {
      animateImageChange();
    }, randomInterval);

    return () => clearInterval(intervalRef.current);
  }, [images]);

  const animateImageChange = () => {
    setIsScaling(true);
    setTimeout(() => {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
      setIsScaling(false);
    }, 300); // Scale before image changes
  };

  const handleTouchStart = (e) => {
    touchStartX.current = e.changedTouches[0].screenX;
  };

  const handleTouchEnd = (e) => {
    touchEndX.current = e.changedTouches[0].screenX;
    handleSwipe();
  };

  const handleSwipe = () => {
    const delta = touchStartX.current - touchEndX.current;
    const threshold = 40;
    if (Math.abs(delta) > threshold) {
      if (delta > 0) nextImage();
      else prevImage();
    }
  };

  const nextImage = () => {
    animateImageChange();
  };

  const prevImage = () => {
    setIsScaling(true);
    setTimeout(() => {
      setCurrentImageIndex((prev) =>
        prev === 0 ? images.length - 1 : prev - 1
      );
      setIsScaling(false);
    }, 300);
  };

  return (
    <div
      className="jewellery-card"
      tabIndex={0}
      role="button"
      onClick={() => onOpenGallery(images)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") onOpenGallery(images);
      }}
      aria-label={`${item.nameEn || item.nameHy} - ${item.price} $`}
    >
      <div
        className="image-wrapper"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <img
          src={images[currentImageIndex] || ""}
          alt={item.nameEn || item.nameHy || "Նկար"}
          className={`jewellery-image ${isScaling ? "scale-effect" : ""}`}
          loading="lazy"
        />

        {images.length > 1 && (
          <>
            <button
              className="arrow prev"
              onClick={(e) => {
                e.stopPropagation();
                prevImage();
              }}
            >
              ‹
            </button>
            <button
              className="arrow next"
              onClick={(e) => {
                e.stopPropagation();
                nextImage();
              }}
            >
              ›
            </button>
            <div className="image-dots">
              {images.map((_, idx) => (
                <div
                  key={idx}
                  className={`image-dot ${
                    idx === currentImageIndex ? "active" : ""
                  }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentImageIndex(idx);
                  }}
                />
              ))}
            </div>
          </>
        )}
      </div>

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
        <div className="jewellery-price">{item.price} $</div>
      </div>
    </div>
  );
}

export default JewelleryCard;
