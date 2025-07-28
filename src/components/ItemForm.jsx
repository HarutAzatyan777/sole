import React from "react";

export default function ItemForm({
  menu = [],
  selectedCatId,
  setSelectedCatId,
  itemNameHy,
  setItemNameHy,
  itemNameEn,
  setItemNameEn,
  itemPrice,
  setItemPrice,
  imageUrls = [],
  setImageUrls,
  newImageUrl,
  setNewImageUrl,
  videoUrls = [],
  setVideoUrls,
  newVideoUrl,
  setNewVideoUrl,
  itemParams = {},
  setItemParams,
  addItem,
  editingItem,
  editItem,
  cancelItemEdit,
}) {
  const addImage = () => {
    if (newImageUrl.trim() !== "") {
      setImageUrls([...imageUrls, newImageUrl.trim()]);
      setNewImageUrl("");
    }
  };

  const removeImage = (index) => {
    const updated = [...imageUrls];
    updated.splice(index, 1);
    setImageUrls(updated);
  };

  const addVideo = () => {
    if (newVideoUrl.trim() !== "") {
      setVideoUrls([...videoUrls, newVideoUrl.trim()]);
      setNewVideoUrl("");
    }
  };

  const removeVideo = (index) => {
    const updated = [...videoUrls];
    updated.splice(index, 1);
    setVideoUrls(updated);
  };

  const extractYouTubeId = (url) => {
    const regex = /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([^\s&?/]+)/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  const handleParamChange = (key, value) => {
    setItemParams({
      ...itemParams,
      [key]: value,
    });
  };

  return (
    <div style={{ marginBottom: 30 }}>
      <h3>{editingItem ? "Խմբագրել զարդը" : "Ավելացնել նոր զարդ"}</h3>

      {/* Category Select */}
      <select value={selectedCatId} onChange={(e) => setSelectedCatId(e.target.value)}>
        <option value="">Ընտրել բաժինը</option>
        {menu.map((cat) => (
          <option key={cat.id} value={cat.id}>
            {cat.category}
          </option>
        ))}
      </select>

      {/* Armenian & English Names */}
      <input
        type="text"
        placeholder="Անուն (Հայերեն)"
        value={itemNameHy}
        onChange={(e) => setItemNameHy(e.target.value)}
      />
      <input
        type="text"
        placeholder="Name (English)"
        value={itemNameEn}
        onChange={(e) => setItemNameEn(e.target.value)}
      />

      {/* Price */}
      <input
        type="number"
        placeholder="Գին ($)"
        value={itemPrice}
        onChange={(e) => setItemPrice(e.target.value)}
      />

      {/* Image Block */}
      <div style={{ marginTop: 20 }}>
        <input
          type="text"
          placeholder="Նոր Նկարի URL"
          value={newImageUrl}
          onChange={(e) => setNewImageUrl(e.target.value)}
        />
        <button onClick={addImage}>➕ Ավելացնել նկար</button>
        <div style={{ marginTop: 10, display: "flex", flexWrap: "wrap", gap: 10 }}>
          {imageUrls.map((url, idx) => (
            <div key={idx} style={{ position: "relative" }}>
              <img
                src={url}
                alt={`img-${idx}`}
                style={{ width: 60, height: 60, objectFit: "cover", borderRadius: 6 }}
              />
              <button
                onClick={() => removeImage(idx)}
                style={{
                  position: "absolute",
                  top: -5,
                  right: -5,
                  background: "red",
                  color: "white",
                  border: "none",
                  borderRadius: "50%",
                  width: 20,
                  height: 20,
                  cursor: "pointer",
                  fontSize: 12
                }}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Video Block */}
   {/* Video Block */}
<div style={{ marginTop: 20 }}>
  <h4>🎬 Վիդեոներ</h4>
  <input
    type="text"
    placeholder="Նոր Վիդեո URL"
    value={newVideoUrl}
    onChange={(e) => setNewVideoUrl(e.target.value)}
    style={{
      marginRight: 10,
      padding: "0.5rem",
      width: "60%",
      border: "1px solid #ccc",
      borderRadius: 4,
    }}
  />
  <button onClick={addVideo}>➕ Ավելացնել վիդեո</button>

  <div style={{ marginTop: 10, display: "flex", flexWrap: "wrap", gap: 10 }}>
    {videoUrls.map((url, idx) => {
      const videoId = extractYouTubeId(url);
      const isYouTube = videoId !== null;
      const embedUrl = isYouTube
        ? `https://www.youtube.com/embed/${videoId}`
        : null;

      return (
        <div
          key={idx}
          style={{
            position: "relative",
            width: 120,
            height: 70,
            borderRadius: 6,
            overflow: "hidden",
          }}
        >
          {isYouTube && embedUrl ? (
    <iframe
    width="120"
    height="70"
    src={`https://www.youtube.com/embed/${videoId}?autoplay=1&loop=1&controls=0&playlist=${videoId}&mute=1`}
    title={`video-${idx}`}
    frameBorder="0"
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
    allowFullScreen
  />
          ) : (
            <video
              width="120"
              height="70"
              controls
              style={{ objectFit: "cover" }}
            >
              <source src={url} type="video/mp4" />
            </video>
          )}
          <button
            onClick={() => removeVideo(idx)}
            style={{
              position: "absolute",
              top: -5,
              right: -5,
              background: "red",
              color: "white",
              border: "none",
              borderRadius: "50%",
              width: 20,
              height: 20,
              cursor: "pointer",
              fontSize: 12,
              lineHeight: "20px",
            }}
          >
            ×
          </button>
        </div>
      );
    })}
  </div>
</div>


      {/* Parameters */}
      <div style={{ marginTop: 20 }}>
        <input
          type="text"
          placeholder="Քաշ (գր.)"
          value={itemParams.weight || ""}
          onChange={(e) => handleParamChange("weight", e.target.value)}
        />
        <input
          type="text"
          placeholder="Քար"
          value={itemParams.stone || ""}
          onChange={(e) => handleParamChange("stone", e.target.value)}
        />
        <input
          type="text"
          placeholder="Մետաղ (օր.՝ ոսկի)"
          value={itemParams.metal || ""}
          onChange={(e) => handleParamChange("metal", e.target.value)}
        />
        <input
          type="text"
          placeholder="Արտադրանքի կոդ"
          value={itemParams.code || ""}
          onChange={(e) => handleParamChange("code", e.target.value)}
        />
      </div>

      {/* Action Buttons */}
      <div style={{ marginTop: 20 }}>
        {editingItem ? (
          <>
            <button onClick={editItem}>✔ Պահպանել</button>
            <button onClick={cancelItemEdit} style={{ marginLeft: "8px" }}>
              ❌ Չեղարկել
            </button>
          </>
        ) : (
          <button onClick={addItem}>➕ Ավելացնել</button>
        )}
      </div>
    </div>
  );
}
