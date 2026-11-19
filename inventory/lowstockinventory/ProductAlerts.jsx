import React from "react";

function ProductAlerts({
  products,
  search,
  priorityFilter,
  threshold,
  onSearchChange,
  onPriorityChange,
  onAddStock,
  onResolve,
  onPriorityUpdate,
  stopClick,
}) {
  return (
    <section className="lsa-main-panel">
      <div className="lsa-panel-header">
        <h2>Products Requiring Attention</h2>
        <div className="lsa-filter-row">
          <input
            className="lsa-search"
            type="text"
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search product..."
          />
          <select
            className="lsa-priority-select"
            value={priorityFilter}
            onChange={(event) => onPriorityChange(event.target.value)}
          >
            <option value="All">Priority: All</option>
            <option value="High">Priority: High</option>
            <option value="Medium">Priority: Medium</option>
            <option value="Low">Priority: Low</option>
          </select>
        </div>
      </div>

      <div className="lsa-table-wrap">
        {products.length === 0 ? (
          <div className="lsa-empty">No products match the current filters.</div>
        ) : (
          <table className="lsa-table">
            <tbody>
              {products.map((product) => {
                const productStatus =
                  product.stock === 0
                    ? "Out of stock"
                    : product.stock <= threshold
                      ? "Low stock"
                      : "Healthy";
                const statusClass =
                  product.stock === 0
                    ? "alert"
                    : product.stock <= threshold
                      ? "warning"
                      : "healthy";
                const productImageStyle =
                  product.image &&
                  (product.image.startsWith("http") ||
                    product.image.startsWith("data:image/"))
                    ? {
                        backgroundImage: `url(${product.image})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        backgroundRepeat: "no-repeat",
                      }
                    : { background: product.image };

                return (
                  <tr key={product.id}>
                    <td className="lsa-product-cell">
                      <div
                        className="lsa-product-thumb"
                        style={productImageStyle}
                      />
                      <div className="lsa-product-copy">
                        <div className="lsa-product-name">{product.name}</div>
                        <div className="lsa-product-meta">
                          {product.stock} units
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className={`lsa-status-tag ${statusClass}`}>
                        {productStatus}
                      </span>
                    </td>
                    <td>
                      <button
                        type="button"
                        className="lsa-ghost-btn"
                        onClick={(event) => {
                          stopClick(event);
                          const priorityOrder = ["High", "Medium", "Low"];
                          const nextPriority =
                            priorityOrder[
                              (priorityOrder.indexOf(product.priority) + 1) %
                              priorityOrder.length
                            ];
                          onPriorityUpdate(product.id, nextPriority);
                        }}
                      >
                        {product.priority}
                      </button>
                    </td>
                    <td>
                      <button
                        type="button"
                        className="lsa-action-btn add"
                        onClick={(event) => {
                          stopClick(event);
                          onAddStock(product.id);
                        }}
                      >
                        Add Stock
                      </button>
                    </td>
                    <td>
                      <button
                        type="button"
                        className="lsa-action-btn resolve"
                        onClick={(event) => {
                          stopClick(event);
                          onResolve(product.id);
                        }}
                      >
                        Resolve
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </section>
  );
}

export default ProductAlerts;
