import React from "react";

function BulkInventoryHeader({ onAddProduct }) {
  return (
    <header className="bi-header">
      <div>
        <h1>Bulk Inventory Update</h1>
        <p>Select multiple products and update stock values in one action.</p>
      </div>
      <button
        type="button"
        className="bi-add-button"
        onClick={onAddProduct}
      >
        + Add New Product
      </button>
    </header>
  );
}

export default BulkInventoryHeader;
