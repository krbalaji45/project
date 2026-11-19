import React from "react";

function AddProductModal({
  product,
  productError,
  isAddingProduct,
  onChange,
  onImageUpload,
  onClose,
  onSubmit,
}) {
  return (
    <div className="lsa-modal-backdrop" onClick={onClose}>
      <div
        className="lsa-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="lsa-add-title"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="lsa-modal-header">
          <div>
            <h2 id="lsa-add-title">Add New Product</h2>
            <p>Enter the product details below.</p>
          </div>
          <button
            type="button"
            className="lsa-modal-close"
            onClick={onClose}
            aria-label="Close"
          >
            ×
          </button>
        </div>
        <form className="lsa-add-form" onSubmit={onSubmit}>
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
            className="lsa-image-input"
            type="file"
            accept="image/*"
            onChange={onImageUpload}
          />
          {product.image && (
            <div className="lsa-image-preview">
              <img src={product.image} alt="Product preview" />
            </div>
          )}
          <div className="lsa-form-row">
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
          {productError && (
            <div className="lsa-form-error" role="alert">
              {productError}
            </div>
          )}
          <div className="lsa-modal-actions">
            <button type="button" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" disabled={isAddingProduct}>
              {isAddingProduct ? "Adding..." : "Add Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddProductModal;
