import React from "react";

const ResultPreview = ({ results, sortBy, error, loading, onApply }) => (
  <aside className="preview-card" aria-label="Result preview">
    <div className="preview-header">
      <div>
        <span className="preview-label">RESULT PREVIEW</span>
        <h2>Your matches</h2>
      </div>
      <div className="preview-icon" aria-hidden="true">
        ✦
      </div>
    </div>

    <div className="music-box">
      {results.length > 0 && results[0].image ? (
        <img src={results[0].image} alt={results[0].category} />
      ) : (
        <div className="empty-preview">
          <div className="empty-icon" aria-hidden="true">
            ✦
          </div>
          <span>No preview available</span>
        </div>
      )}
    </div>

    <div className="match-count">{results.length}</div>
    <div className="match-text">
      {results.length === 1 ? "experience found" : "experiences found"}
    </div>

    <div className="sorted">
      <span>Sorted by</span>
      <strong>{sortBy}</strong>
    </div>

    {error && <p className="filter-error">{error}</p>}

    <button className="apply-button" type="button" onClick={onApply} disabled={loading}>
      {loading ? "Applying..." : "Apply filters"}
      {!loading && <span aria-hidden="true">→</span>}
    </button>
  </aside>
);

export default ResultPreview;
