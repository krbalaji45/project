import React from "react";

function MetricsCards({ totals }) {
  const metrics = [
    {
      label: "Active Alerts",
      value: totals.activeAlerts,
      detail: totals.activeAlerts > 0 ? "Needs action" : "All clear",
      className: "pink",
    },
    {
      label: "Low Stock",
      value: totals.lowStock,
      detail: "Below threshold",
      className: "yellow",
    },
    {
      label: "Out of Stock",
      value: totals.outOfStock,
      detail: "Unavailable",
      className: "orange",
    },
    {
      label: "Resolved",
      value: totals.resolved,
      detail: `${totals.resolved} this week`,
      className: "green",
    },
  ];

  return (
    <div className="lsa-metrics">
      {metrics.map((metric) => (
        <div className="lsa-metric-card" key={metric.label}>
          <div className={`lsa-metric-badge ${metric.className}`} />
          <div>
            <span>{metric.label}</span>
            <strong>{metric.value}</strong>
            <small>{metric.detail}</small>
          </div>
        </div>
      ))}
    </div>
  );
}

export default MetricsCards;
