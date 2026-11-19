import React from "react";
import ProductRow from "./ProductRow";

function ProductTable({
  products,
  selectedProducts,
  loading,
  allSelected,
  onSelectAll,
  onSelect,
  onQuantityChange,
  onQuantityInput,
  onPriceChange,
  onStatusChange,
  getNewStock,
  getProductStatus,
}) {
  if (loading) {
    return <div className="bi-empty">Loading products...</div>;
  }

  if (products.length === 0) {
    return <div className="bi-empty">No products found.</div>;
  }

  return (
    <div className="bi-table-wrapper">
      <table className="bi-table">
        <thead>
          <tr>
            <th className="bi-check-column">
              <input
                type="checkbox"
                checked={allSelected}
                onChange={onSelectAll}
              />
            </th>
            <th>PRODUCT</th>
            <th>CURRENT STOCK</th>
            <th>CHANGE</th>
            <th>NEW STOCK</th>
            <th>PRICE</th>
            <th>STATUS</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <ProductRow
              key={product.id}
              product={product}
              selected={selectedProducts.includes(product.id)}
              onSelect={onSelect}
              onQuantityChange={onQuantityChange}
              onQuantityInput={onQuantityInput}
              onPriceChange={onPriceChange}
              onStatusChange={onStatusChange}
              getNewStock={getNewStock}
              getProductStatus={getProductStatus}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ProductTable;
