import { useState } from "react";

export default function MediaUrlFinder() {
  const [url, setUrl] = useState("");
  const [isValidImage, setIsValidImage] = useState(null);
  const [isValidVideo, setIsValidVideo] = useState(null);

  const checkMedia = () => {
    const img = new Image();
    img.onload = () => {
      setIsValidImage(true);
      setIsValidVideo(false);
    };
    img.onerror = () => {
      // If it's not image, try video
      const video = document.createElement("video");
      video.onloadeddata = () => {
        setIsValidVideo(true);
        setIsValidImage(false);
      };
      video.onerror = () => {
        setIsValidImage(false);
        setIsValidVideo(false);
      };
      video.src = url;
    };
    img.src = url;
  };

  const extractYouTubeId = (url) => {
    const regex =
      /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  const youtubeId = extractYouTubeId(url);
  const isYouTube = youtubeId !== null;

  return (
    <div
      style={{
        marginTop: "2rem",
        padding: "1rem",
        border: "1px solid #ccc",
        borderRadius: "8px",
      }}
    >
      <h3>📽️ Media URL Finder (Նկար/Վիդեո)</h3>
      <input
        type="text"
        placeholder="Ներմուծիր նկարի կամ վիդեոյի հղումը"
        value={url}
        onChange={(e) => {
          setUrl(e.target.value);
          setIsValidImage(null);
          setIsValidVideo(null);
        }}
        style={{
          width: "100%",
          padding: "0.5rem",
          marginBottom: "0.5rem",
          border: "1px solid #aaa",
          borderRadius: "4px",
        }}
      />
      <button
        onClick={checkMedia}
        style={{ padding: "0.5rem 1rem", cursor: "pointer" }}
      >
        Ստուգել
      </button>

      {/* Image Preview */}
      {isValidImage === true && (
        <div style={{ marginTop: "1rem" }}>
          <p style={{ color: "green" }}>✔️ Նկարը բեռնվում է</p>
          <img
            src={url}
            alt="Preview"
            style={{ width: "200px", borderRadius: "6px" }}
          />
        </div>
      )}

    {/* Video Preview */}
{isValidVideo === true && !isYouTube && (
  <div style={{ marginTop: "1rem" }}>
    <p style={{ color: "green" }}>✔️ Վիդեոն բեռնվում է</p>
    <video
      width="300"
      height="180"
      autoPlay
      loop
      muted
      playsInline
      style={{ objectFit: "cover" }}
    >
      <source src={url} type="video/mp4" />
    </video>
  </div>
)}

{/* YouTube Preview */}
{isYouTube && (
  <div style={{ marginTop: "1rem" }}>
    <p style={{ color: "green" }}>✔️ YouTube վիդեո հայտնաբերվեց</p>
    <iframe
      width="300"
      height="180"
      src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1&loop=1&controls=0&playlist=${youtubeId}&mute=1`}
      title="YouTube Video"
      frameBorder="0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen
      style={{ pointerEvents: "none" }}
    />
  </div>
)}


      {/* Invalid Media */}
      {isValidImage === false && isValidVideo === false && !isYouTube && (
        <p style={{ color: "red", marginTop: "1rem" }}>
          ❌ Չհաջողվեց բեռնել մեդիան
        </p>
      )}
    </div>
  );
}
