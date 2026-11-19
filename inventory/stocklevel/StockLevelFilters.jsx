import React from "react";

function StockLevelFilters({
  search,
  categoryFilter,
  statusFilter,
  categories,
  message,
  onSearchChange,
  onCategoryChange,
  onStatusChange,
  onExport,
}) {
  return (
    <>
      <div className="sl-header-row">
        <div className="sl-search-wrap">
          <span className="sl-search-icon">⌕</span>
          <input
            type="text"
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search products or SKU..."
          />
        </div>

        <div className="sl-controls">
          <select
            value={categoryFilter}
            onChange={(event) => onCategoryChange(event.target.value)}
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category === "All Categories" ? "All Categories" : category}
              </option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(event) => onStatusChange(event.target.value)}
          >
            <option value="All Status">All Status</option>
            <option value="In Stock">In Stock</option>
            <option value="Low Stock">Low Stock</option>
            <option value="Out of Stock">Out of Stock</option>
          </select>

          <button type="button" className="sl-export-btn" onClick={onExport}>
            Export CSV
          </button>
        </div>
      </div>

      {message && <div className="sl-message">{message}</div>}
    </>
  );
}

export default StockLevelFilters;
