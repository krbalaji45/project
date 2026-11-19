import React from "react";

function AddProductModal({
  product,
  onChange,
  onImageUpload,
  onClose,
  onSubmit,
}) {
  return (
    <div className="sl-modal-backdrop" onClick={onClose}>
      <div className="sl-modal" onClick={(event) => event.stopPropagation()}>
        <div className="sl-modal-header">
          <div>
            <h2>Add New Product</h2>
            <p>Enter product details below.</p>
          </div>
          <button type="button" className="sl-close-btn" onClick={onClose}>
            ×
          </button>
        </div>

        <form onSubmit={onSubmit} className="sl-form">
          <label>Product Name *</label>
          <input
            name="name"
            value={product.name}
            onChange={onChange}
            placeholder="Enter product name"
            required
          />

          <label>SKU *</label>
          <input
            name="sku"
            value={product.sku}
            onChange={onChange}
            placeholder="Enter SKU"
            required
          />

          <label>Category *</label>
          <input
            name="category"
            value={product.category}
            onChange={onChange}
            placeholder="Enter category"
            required
          />

          <label>Product Image</label>
          <input
            className="sl-image-input"
            type="file"
            accept="image/*"
            onChange={onImageUpload}
          />

          {product.image && (
            <div className="sl-image-preview">
              <img src={product.image} alt="Product preview" />
            </div>
          )}

          <div className="sl-form-row">
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

          <div className="sl-modal-actions">
            <button type="button" className="sl-cancel-btn" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="sl-save-btn">Add Product</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddProductModal;
