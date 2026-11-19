import RegistrationField from "../../shared/components/FormField";

function PlayPricing({ config, form, errors, onChange }) {
  return (
    <>
      <section
        className="sr-form-section sr-age-range-section"
        aria-label="Suitable age range"
      >
        <div className="sr-section-heading">
          <div>
            <h3>Suitable age range *</h3>
          </div>
        </div>
        <div className="sr-fields-grid">
          <RegistrationField
            label="Minimum age *"
            name={config.minimumAgeField}
            error={errors[config.minimumAgeField]}
          >
            <input
              id={config.minimumAgeField}
              name={config.minimumAgeField}
              type="number"
              min="0"
              max="120"
              value={form[config.minimumAgeField]}
              onChange={onChange}
              aria-invalid={Boolean(errors[config.minimumAgeField])}
              required
            />
          </RegistrationField>
          <RegistrationField
            label="Maximum age (optional)"
            name={config.maximumAgeField}
            error={errors[config.maximumAgeField]}
          >
            <input
              id={config.maximumAgeField}
              name={config.maximumAgeField}
              type="number"
              min={form[config.minimumAgeField] || "0"}
              max="120"
              value={form[config.maximumAgeField]}
              onChange={onChange}
              aria-invalid={Boolean(errors[config.maximumAgeField])}
            />
          </RegistrationField>
        </div>
      </section>
      <div className="sr-fields-grid sr-play-capacity-grid">
        <RegistrationField
          label={`${config.capacityLabel} *`}
          name={config.capacityField}
          error={errors[config.capacityField]}
        >
          <input
            id={config.capacityField}
            name={config.capacityField}
            type="number"
            min="1"
            max="10000"
            value={form[config.capacityField]}
            onChange={onChange}
            aria-invalid={Boolean(errors[config.capacityField])}
            required
          />
          <small>{config.capacityHelp}</small>
        </RegistrationField>
        <RegistrationField
          label="Indoor / outdoor type *"
          name={config.indoorOutdoorField}
          error={errors[config.indoorOutdoorField]}
        >
          <select
            id={config.indoorOutdoorField}
            name={config.indoorOutdoorField}
            value={form[config.indoorOutdoorField]}
            onChange={onChange}
            aria-invalid={Boolean(errors[config.indoorOutdoorField])}
            required
          >
            <option value="">Select a type</option>
            {config.indoorOutdoorOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </RegistrationField>
      </div>
    </>
  );
}

export default PlayPricing;
