import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import "./JewelleryCard.css";

function JewelleryCard({ item, onOpenGallery }) {
  // Միայն նկարներն ենք օգտագործում այստեղ
  const media = useMemo(() => {
    const images = item.imageUrls || [];
    return images;
  }, [item.imageUrls]);

  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  const [isScaling, setIsScaling] = useState(false);

  const touchStartX = useRef(0);
  const touchEndX = useRef(0);
  const intervalRef = useRef(null);

  const animateMediaChange = useCallback(() => {
    setIsScaling(true);
    setTimeout(() => {
      setCurrentMediaIndex((prev) => (prev + 1) % media.length);
      setIsScaling(false);
    }, 300);
  }, [media.length]);

  useEffect(() => {
    if (media.length <= 1) return;

    const randomInterval = Math.floor(Math.random() * 3000) + 3000;

    intervalRef.current = setInterval(() => {
      animateMediaChange();
    }, randomInterval);

    return () => clearInterval(intervalRef.current);
  }, [media, animateMediaChange]);

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
      if (delta > 0) nextMedia();
      else prevMedia();
    }
  };

  const nextMedia = () => animateMediaChange();

  const prevMedia = () => {
    setIsScaling(true);
    setTimeout(() => {
      setCurrentMediaIndex((prev) =>
        prev === 0 ? media.length - 1 : prev - 1
      );
      setIsScaling(false);
    }, 300);
  };

  return (
    <div
      className="jewellery-card"
      tabIndex={0}
      role="button"
      onClick={() =>
        onOpenGallery([
          ...(item.imageUrls || []),
          ...(item.videoUrls || []),
        ])
      }
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ")
          onOpenGallery([
            ...(item.imageUrls || []),
            ...(item.videoUrls || []),
          ]);
      }}
      aria-label={`${item.nameEn || item.nameHy} - ${item.price} $`}
    >
      <div
        className="image-wrapper"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {(() => {
          const current = media[currentMediaIndex];
          return (
            <img
              src={current || ""}
              alt={item.nameEn || item.nameHy || "Նկար"}
              className={`jewellery-image ${isScaling ? "scale-effect" : ""}`}
              loading="lazy"
            />
          );
        })()}

        {media.length > 1 && (
          <>
            <button
              className="arrow prev"
              onClick={(e) => {
                e.stopPropagation();
                prevMedia();
              }}
            >
              ‹
            </button>

            <button
              className="arrow next"
              onClick={(e) => {
                e.stopPropagation();
                nextMedia();
              }}
            >
              ›
            </button>

            <div className="image-dots">
              {media.map((_, idx) => (
                <div
                  key={idx}
                  className={`image-dot ${idx === currentMediaIndex ? "active" : ""}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentMediaIndex(idx);
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
