import React from "react";

function AddProductModal({
  product,
  saving,
  onChange,
  onImageUpload,
  onClose,
  onSubmit,
}) {
  return (
    <div className="bi-modal-background">
      <div className="bi-modal" role="dialog" aria-modal="true">
        <div className="bi-modal-header">
          <div>
            <h2>Add New Product</h2>
            <p>Enter the product details below.</p>
          </div>
          <button className="bi-close" type="button" onClick={onClose} aria-label="Close">
            ×
          </button>
        </div>
        <form onSubmit={onSubmit}>
          <label>Product Name *</label>
          <input
            name="name"
            value={product.name}
            onChange={onChange}
            placeholder="Enter product name"
          />
          <label>SKU *</label>
          <input
            name="sku"
            value={product.sku}
            onChange={onChange}
            placeholder="Enter SKU"
          />
          <label>Category *</label>
          <input
            name="category"
            value={product.category}
            onChange={onChange}
            placeholder="Enter category"
          />
          <label>Product Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={onImageUpload}
          />
          {product.image && (
            <div style={{ marginTop: 12 }}>
              <img
                src={product.image}
                alt="Product preview"
                style={{
                  width: 120,
                  height: 120,
                  objectFit: "cover",
                  borderRadius: 12,
                  border: "1px solid #d7dfe9",
                }}
              />
            </div>
          )}
          <div className="bi-form-row">
            <div>
              <label>Current Stock</label>
              <input
                type="number"
                min="0"
                name="currentStock"
                value={product.currentStock}
                onChange={onChange}
              />
            </div>
            <div>
              <label>Price</label>
              <input
                type="number"
                min="0"
                name="price"
                value={product.price}
                onChange={onChange}
              />
            </div>
          </div>
          <label>Status</label>
          <select name="status" value={product.status} onChange={onChange}>
            <option value="Ready">Ready</option>
            <option value="Not Ready">Not Ready</option>
            <option value="Low Stock">Low Stock</option>
            <option value="Out of Stock">Out of Stock</option>
          </select>
          <div className="bi-modal-actions">
            <button type="button" className="bi-cancel" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="bi-save" disabled={saving}>
              {saving ? "Adding..." : "Add Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddProductModal;
