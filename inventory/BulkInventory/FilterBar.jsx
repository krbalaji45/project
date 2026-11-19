import React from "react";

function FilterBar({
  search,
  category,
  categories,
  selectedCount,
  saving,
  onSearchChange,
  onCategoryChange,
  onApplyUpdates,
}) {
  return (
    <div className="bi-filter-bar">
      <div className="bi-search">
        <span>⌕</span>
        <input
          type="text"
          placeholder="Search products or SKU..."
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
        />
      </div>
      <select
        className="bi-category"
        value={category}
        onChange={(event) => onCategoryChange(event.target.value)}
      >
        {categories.map((item) => (
          <option key={item} value={item}>
            Category: {item}
          </option>
        ))}
      </select>
      <div className="bi-selected-count">
        {selectedCount} products selected
      </div>
      <button
        type="button"
        className="bi-apply-button"
        disabled={saving || selectedCount === 0}
        onClick={onApplyUpdates}
      >
        {saving ? "Saving..." : "Apply Updates"}
      </button>
    </div>
  );
}

export default FilterBar;
