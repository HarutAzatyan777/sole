import React from "react";
import ActionButton from "./ActionButton";

export default function CategoryForm({
  category,
  categoryIconUrl,
  setCategory,
  setCategoryIconUrl,
  addCategory,
  editingCategory,
  editingCategoryName,
  editingCategoryIconUrl,
  setEditingCategoryName,
  setEditingCategoryIconUrl,
  editCategory,
  cancelCategoryEdit,
  editingCategoryRef
}) {
  return (
    <div>
      <input
        placeholder="Նոր բաժին"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
      />
      <input
        placeholder="Բաժնի icon նկարի URL"
        value={categoryIconUrl}
        onChange={(e) => setCategoryIconUrl(e.target.value)}
      />
      <ActionButton onAction={addCategory}>➕ Ավելացնել Բաժին</ActionButton>

      {editingCategory && (
        <div ref={editingCategoryRef} style={{ marginTop: "1rem" }}>
          <p style={{ color: "red" }}>
            Խմբագրում ես բաժինը: <strong>{editingCategory.category}</strong>
          </p>
          <input
            placeholder="Բաժնի նոր անուն"
            value={editingCategoryName}
            onChange={(e) => setEditingCategoryName(e.target.value)}
          />
          <input
            placeholder="Icon URL"
            value={editingCategoryIconUrl}
            onChange={(e) => setEditingCategoryIconUrl(e.target.value)}
          />
          <ActionButton onAction={editCategory}>✔ Թարմացնել բաժինը</ActionButton>
          <ActionButton onAction={cancelCategoryEdit}>
            ❌ Չեղարկել
          </ActionButton>
        </div>
      )}
    </div>
  );
}
