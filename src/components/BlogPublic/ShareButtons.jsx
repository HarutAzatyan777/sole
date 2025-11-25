import React from "react";
import "./ShareButtons.css";

export default function ShareButtons({ title }) {
  const url = window.location.href;

  const shareLinks = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
    telegram: `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
    whatsapp: `https://api.whatsapp.com/send?text=${encodeURIComponent(title + " " + url)}`
  };

  return (
    <div className="floating-share">
      <a href={shareLinks.facebook} target="_blank" rel="noopener noreferrer" className="share-btn fb">F</a>
      <a href={shareLinks.twitter} target="_blank" rel="noopener noreferrer" className="share-btn tw">X</a>
      <a href={shareLinks.telegram} target="_blank" rel="noopener noreferrer" className="share-btn tg">T</a>
      <a href={shareLinks.whatsapp} target="_blank" rel="noopener noreferrer" className="share-btn wa">W</a>
    </div>
  );
}
