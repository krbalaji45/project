import React from "react";

function StockLevelTable({ products, loading }) {
  if (loading) {
    return <div className="sl-empty">Loading products...</div>;
  }

  if (products.length === 0) {
    return <div className="sl-empty">No products match the current filters.</div>;
  }

  return (
    <table className="sl-table">
      <thead>
        <tr>
          <th>Product</th>
          <th>SKU</th>
          <th>Available</th>
          <th>Reserved</th>
          <th>Reorder level</th>
          <th>Status</th>
          <th>Action</th>
        </tr>
      </thead>

      <tbody>
        {products.map((product) => (
          <tr key={product.id}>
            <td>
              <div className="sl-product-cell">
                <div
                  className="sl-product-thumb"
                  style={{
                    background: product.image.startsWith("linear-gradient")
                      ? product.image
                      : `url(${product.image}) center/cover no-repeat`,
                  }}
                />
                <div className="sl-product-copy">
                  <strong>{product.name}</strong>
                  <span>{product.category}</span>
                </div>
              </div>
            </td>

            <td className="sl-sku">{product.sku}</td>
            <td>{product.available}</td>
            <td>{product.reserved}</td>
            <td>{product.reorderLevel}</td>
            <td>
              <span className={`sl-status ${product.status.toLowerCase().replace(/\s+/g, "-")}`}>
                {product.status}
              </span>
            </td>
            <td>
              <button
                type="button"
                className="sl-menu-btn"
                aria-label={`Action for ${product.name}`}
              >
                •••
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default StockLevelTable;
