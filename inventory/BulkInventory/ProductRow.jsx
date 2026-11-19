import React from "react";

function getStatusClass(status) {
  return status.toLowerCase().replace(/\s+/g, "-");
}

function ProductRow({
  product,
  selected,
  onSelect,
  onQuantityChange,
  onQuantityInput,
  onPriceChange,
  onStatusChange,
  getNewStock,
  getProductStatus,
}) {
  const status = getProductStatus(product);

  return (
    <tr>
      <td className="bi-check-column">
        <input
          type="checkbox"
          checked={selected}
          onChange={() => onSelect(product.id)}
        />
      </td>
      <td>
        <div className="bi-product">
          <strong>{product.name}</strong>
          <span>{product.sku}</span>
        </div>
      </td>
      <td>
        <strong className="bi-stock">{product.currentStock}</strong>
      </td>
      <td>
        <div className="bi-quantity">
          <button
            type="button"
            onClick={() => onQuantityChange(product.id, -1)}
            aria-label={`Decrease ${product.name} quantity`}
          >
            −
          </button>
          <input
            type="number"
            value={product.change || 0}
            onChange={(event) =>
              onQuantityInput(product.id, event.target.value)
            }
          />
          <button
            type="button"
            onClick={() => onQuantityChange(product.id, 1)}
            aria-label={`Increase ${product.name} quantity`}
          >
            +
          </button>
        </div>
      </td>
      <td>
        <strong className="bi-new-stock">{getNewStock(product)}</strong>
      </td>
      <td>
        <div className="bi-price">
          <span>₹</span>
          <input
            type="number"
            min="0"
            value={product.price || ""}
            onChange={(event) =>
              onPriceChange(product.id, event.target.value)
            }
          />
        </div>
      </td>
      <td>
        <select
          className={`bi-status-select ${getStatusClass(status)}`}
          value={status}
          onChange={(event) =>
            onStatusChange(product.id, event.target.value)
          }
        >
          <option value="Ready">Ready</option>
          <option value="Not Ready">Not Ready</option>
          <option value="Low Stock">Low Stock</option>
          <option value="Out of Stock">Out of Stock</option>
        </select>
      </td>
    </tr>
  );
}

export default ProductRow;
