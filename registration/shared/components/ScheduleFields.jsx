function ScheduleFields({
  config = {},
  form,
  errors,
  onHoursChange,
  onDayPresetChange,
  showDayPresets = false,
}) {
  const dayPresets = [
    { label: "All days", days: form.openingHours.map((hours) => hours.day) },
    {
      label: "Weekdays",
      days: form.openingHours.slice(0, 5).map((hours) => hours.day),
    },
    {
      label: "Weekends",
      days: form.openingHours.slice(5).map((hours) => hours.day),
    },
  ];
  const openDays = new Set(
    form.openingHours.filter((hours) => hours.isOpen).map((hours) => hours.day),
  );

  return (
    <section
      className="sr-form-section"
      aria-label={config.availabilityTitle || "Working days and opening hours"}
    >
      <div className="sr-section-heading">
        <div>
          <h3>{config.availabilityTitle || "Working days and opening hours"}</h3>
          <p>Select when customers can visit or join.</p>
        </div>
      </div>
      {showDayPresets && (
        <div
          className="sr-opening-presets dr-checkbox-options"
          role="group"
          aria-label="Quick select opening days"
        >
          {dayPresets.map((preset) => (
            <label key={preset.label}>
              <input
                type="checkbox"
                checked={
                  preset.days.length > 0 &&
                  preset.days.every((day) => openDays.has(day))
                }
                onChange={(event) =>
                  onDayPresetChange(preset.days, event.target.checked)
                }
              />
              <span>{preset.label}</span>
            </label>
          ))}
        </div>
      )}
      <div className="sr-opening-hours-list">
        {form.openingHours.map((hours, index) => (
          <div className="sr-opening-hours-row" key={hours.day}>
            <label className="sr-opening-day">
              <input
                type="checkbox"
                checked={hours.isOpen}
                onChange={(event) =>
                  onHoursChange(index, { isOpen: event.target.checked })
                }
                aria-label={`${hours.day} open`}
              />
              <span>{hours.day}</span>
            </label>
            {hours.isOpen ? (
              <div className="sr-opening-time-range">
                <label>
                  <span className="sr-sr-only">{hours.day} opening time</span>
                  <input
                    type="time"
                    value={hours.open}
                    onChange={(event) =>
                      onHoursChange(index, { open: event.target.value })
                    }
                    aria-label={`${hours.day} opening time`}
                  />
                </label>
                <span aria-hidden="true">to</span>
                <label>
                  <span className="sr-sr-only">{hours.day} closing time</span>
                  <input
                    type="time"
                    value={hours.close}
                    onChange={(event) =>
                      onHoursChange(index, { close: event.target.value })
                    }
                    aria-label={`${hours.day} closing time`}
                  />
                </label>
              </div>
            ) : (
              <span className="sr-closed-label">Closed</span>
            )}
          </div>
        ))}
      </div>
      {errors.openingHours && (
        <p className="sr-field-error" role="alert">
          {errors.openingHours}
        </p>
      )}
    </section>
  );
}

export default ScheduleFields;
