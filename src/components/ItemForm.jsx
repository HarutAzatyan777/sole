import React from "react";

export default function ItemForm({
  menu,
  selectedCatId,
  setSelectedCatId,
  itemNameHy,
  setItemNameHy,
  itemNameEn,
  setItemNameEn,
  itemPrice,
  setItemPrice,
  imageUrls,
  setImageUrls,
  newImageUrl,
  setNewImageUrl,
  itemParams,
  setItemParams,
  addItem,
  editingItem,
  editItem,
  cancelItemEdit,
}) {
  const addImage = () => {
    if (newImageUrl.trim() !== "") {
      setImageUrls([...imageUrls, newImageUrl]);
      setNewImageUrl("");
    }
  };

  const removeImage = (index) => {
    const updatedImages = [...imageUrls];
    updatedImages.splice(index, 1);
    setImageUrls(updatedImages);
  };

  const handleParamChange = (param, value) => {
    setItemParams({ ...itemParams, [param]: value });
  };

  return (
    <div style={{ marginBottom: 20 }}>
      <h3>{editingItem ? "Խմբագրել զարդը" : "Ավելացնել նոր զարդ"}</h3>

      {/* Կատեգորիայի ընտրություն */}
      <select
        value={selectedCatId}
        onChange={(e) => setSelectedCatId(e.target.value)}
      >
        <option value="">Ընտրել բաժինը</option>
        {menu.map((cat) => (
          <option key={cat.id} value={cat.id}>
            {cat.category}
          </option>
        ))}
      </select>

      {/* Անուններ */}
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

      {/* Գին */}
      <input
        type="number"
        placeholder="Գին (AMD)"
        value={itemPrice}
        onChange={(e) => setItemPrice(e.target.value)}
      />

      {/* Նկարների բլոկ */}
      <div>
        <input
          type="text"
          placeholder="Նոր Նկարի URL"
          value={newImageUrl}
          onChange={(e) => setNewImageUrl(e.target.value)}
        />
        <button onClick={addImage}>Ավելացնել նկար</button>
        <div style={{ marginTop: 10 }}>
          {imageUrls.map((url, idx) => (
            <div key={idx} style={{ display: "flex", alignItems: "center" }}>
              <img src={url} alt="item" style={{ width: 60, height: 60, objectFit: "cover", marginRight: 10 }} />
              <button onClick={() => removeImage(idx)}>❌</button>
            </div>
          ))}
        </div>
      </div>

      {/* Պարամետրեր */}
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

      {/* Կոճակներ */}
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