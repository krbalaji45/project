import React from "react";

function StockLevelMetrics({ metrics }) {
  const healthyPercentage = Math.round(
    (metrics.inStock / Math.max(metrics.totalProducts, 1)) * 100
  );

  const metricCards = [
    {
      label: "Total Products",
      value: metrics.totalProducts,
      note: metrics.totalProducts > 0 ? "Across catalog" : "No items",
      className: "soft-green",
    },
    {
      label: "In Stock",
      value: metrics.inStock,
      note: `${healthyPercentage}% healthy`,
      className: "soft-cream",
    },
    {
      label: "Low Stock",
      value: metrics.lowStock,
      note: "Needs attention",
      className: "soft-yellow",
    },
    {
      label: "Out of Stock",
      value: metrics.outOfStock,
      note: "Restock now",
      className: "soft-pink",
    },
  ];

  return (
    <div className="sl-metrics">
      {metricCards.map((metric) => (
        <div className={`sl-metric-card ${metric.className}`} key={metric.label}>
          <div className="sl-metric-text">
            <span>{metric.label}</span>
            <strong>{metric.value}</strong>
            <small>{metric.note}</small>
          </div>
        </div>
      ))}
    </div>
  );
}

export default StockLevelMetrics;
