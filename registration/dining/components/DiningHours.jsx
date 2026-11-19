import { OPENING_DAYS } from "../diningConfig";

const DAY_PRESETS = [
  { label: "All days", days: OPENING_DAYS },
  { label: "Weekdays", days: OPENING_DAYS.slice(0, 5) },
  { label: "Weekends", days: OPENING_DAYS.slice(5) },
];

function DiningHours({
  form,
  fieldErrors,
  onOpeningHoursChange,
  onOpeningDayPresetChange,
}) {
  const openDays = new Set(
    form.openingHours.filter((hours) => hours.isOpen).map((hours) => hours.day),
  );

  return (
    <fieldset
      className="dr-opening-hours dr-field-full"
      aria-describedby={
        fieldErrors.openingHours ? "dr-error-opening-hours" : undefined
      }
    >
      <legend>Opening days and hours <b>*</b></legend>
      <div
        className="dr-checkbox-options dr-opening-presets"
        role="group"
        aria-label="Quick select opening days"
      >
        {DAY_PRESETS.map((preset) => (
          <label key={preset.label}>
            <input
              type="checkbox"
              name="openingDayPreset"
              checked={
                openDays.size === preset.days.length &&
                preset.days.every((day) => openDays.has(day))
              }
              onChange={(event) =>
                onOpeningDayPresetChange(preset.days, event.target.checked)
              }
            />
            <span>{preset.label}</span>
          </label>
        ))}
      </div>
      <div className="dr-opening-hours-list">
        {form.openingHours.map((hours, index) => (
          <div className="dr-opening-hours-row" key={hours.day}>
            <label className="dr-opening-day">
              <input
                type="checkbox"
                name={index === 0 ? "openingHours" : undefined}
                checked={hours.isOpen}
                onChange={(event) =>
                  onOpeningHoursChange(index, { isOpen: event.target.checked })
                }
                aria-label={`${hours.day} open`}
              />
              <span>{hours.day}</span>
            </label>
            {hours.isOpen ? (
              <div className="dr-opening-time-range">
                <label>
                  <span className="dr-sr-only">{hours.day} opening time</span>
                  <input
                    type="time"
                    value={hours.open}
                    onChange={(event) =>
                      onOpeningHoursChange(index, { open: event.target.value })
                    }
                    aria-label={`${hours.day} opening time`}
                  />
                </label>
                <span aria-hidden="true">to</span>
                <label>
                  <span className="dr-sr-only">{hours.day} closing time</span>
                  <input
                    type="time"
                    value={hours.close}
                    onChange={(event) =>
                      onOpeningHoursChange(index, { close: event.target.value })
                    }
                    aria-label={`${hours.day} closing time`}
                  />
                </label>
              </div>
            ) : (
              <span className="dr-closed-label">Closed</span>
            )}
          </div>
        ))}
      </div>
      {fieldErrors.openingHours && (
        <span className="dr-field-error" id="dr-error-opening-hours">
          {fieldErrors.openingHours}
        </span>
      )}
    </fieldset>
  );
}

export default DiningHours;
