import React from "react";

function StockLevelHeader({ onAddProduct }) {
  return (
    <div className="sl-topbar">
      <div>
        <h1 className="sl-title">Stock Levels</h1>
        <p className="sl-subtitle">
          Track available, reserved and reorder quantities across your catalogue.
        </p>
      </div>

      <button
        type="button"
        className="sl-add-button"
        onClick={onAddProduct}
      >
        + Add New Product
      </button>
    </div>
  );
}

export default StockLevelHeader;
