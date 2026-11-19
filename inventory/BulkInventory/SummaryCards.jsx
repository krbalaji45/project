import React from "react";

function SummaryCards({ selectedCount, totalQuantityChange, priceUpdates }) {
  const summaries = [
    {
      className: "bi-blue",
      label: "Selected Products",
      value: selectedCount,
      detail: "Ready to update",
    },
    {
      className: "bi-green",
      label: "Quantity Change",
      value:
        totalQuantityChange > 0
          ? `+${totalQuantityChange}`
          : totalQuantityChange,
      detail: "Across selection",
    },
    {
      className: "bi-yellow",
      label: "Price Updates",
      value: priceUpdates,
      detail: "Pending review",
    },
    {
      className: "bi-validation",
      label: "Validation",
      value: "Passed",
      detail: "No errors",
    },
  ];

  return (
    <div className="bi-summary">
      {summaries.map((summary) => (
        <div className="bi-summary-card" key={summary.label}>
          <div className={`bi-circle ${summary.className}`} />
          <div>
            <span>{summary.label}</span>
            <strong>{summary.value}</strong>
            <small>{summary.detail}</small>
          </div>
        </div>
      ))}
    </div>
  );
}

export default SummaryCards;
