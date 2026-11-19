import React from "react";

function SettingsPanel({
  threshold,
  emailNotifications,
  stockHealthPercent,
  healthyCount,
  saveStatus,
  onThresholdChange,
  onToggleNotifications,
  onSaveSettings,
}) {
  return (
    <aside className="lsa-settings-panel">
      <h3>Alert Settings</h3>
      <label className="lsa-field-label">Default reorder threshold</label>
      <input
        className="lsa-input"
        type="number"
        min="1"
        value={threshold}
        onChange={(event) => onThresholdChange(event.target.value)}
      />

      <label className="lsa-field-label">Email notifications</label>
      <div className="lsa-toggle-row">
        <span>Enabled</span>
        <button
          type="button"
          className={`lsa-toggle ${emailNotifications ? "on" : ""}`}
          onClick={onToggleNotifications}
          aria-label="Toggle email notifications"
        >
          <span className="lsa-toggle-knob" />
        </button>
      </div>

      <label className="lsa-field-label">Daily alert summary</label>
      <div className="lsa-summary-time">9:00 AM</div>

      <button className="lsa-save-btn" type="button" onClick={onSaveSettings}>
        Save Settings
      </button>
      {saveStatus && <div className="lsa-save-status">{saveStatus}</div>}

      <div className="lsa-health-box">
        <div className="lsa-health-head">
          <span>Stock Health</span>
          <strong>{stockHealthPercent}%</strong>
        </div>
        <div className="lsa-progress-bar">
          <span style={{ width: `${stockHealthPercent}%` }} />
        </div>
        <p className="lsa-health-note">
          {healthyCount} products currently healthy.
        </p>
      </div>
    </aside>
  );
}

export default SettingsPanel;
