import React from "react";

function LowStockHeader({ onAddProduct }) {
  return (
    <header className="lsa-header-row">
      <div>
        <h1 className="lsa-title">Low-Stock Alerts</h1>
        <p className="lsa-subtitle">
          Review urgent inventory alerts and replenish products before they sell out.
        </p>
      </div>
      <button
        className="lsa-primary-btn"
        type="button"
        onClick={onAddProduct}
      >
        + Add New Product
      </button>
    </header>
  );
}

export default LowStockHeader;
