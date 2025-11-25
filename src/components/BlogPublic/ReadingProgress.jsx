import React, { useEffect, useState } from "react";
import "./ReadingProgress.css";

export default function ReadingProgress() {
  const [progress, setProgress] = useState(0);

  const scrollHandler = () => {
    const totalHeight =
      document.documentElement.scrollHeight -
      document.documentElement.clientHeight;
    const scrolled = (window.scrollY / totalHeight) * 100;
    setProgress(scrolled);
  };

  useEffect(() => {
    window.addEventListener("scroll", scrollHandler);
    return () => window.removeEventListener("scroll", scrollHandler);
  }, []);

  return (
    <div
      className="reading-progress-bar"
      style={{ width: `${progress}%` }}
    />
  );
}
