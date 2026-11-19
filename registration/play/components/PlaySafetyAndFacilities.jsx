import RegistrationField from "../../shared/components/FormField";

function PlaySafetyAndFacilities({ config, form, errors, onChange }) {
  const yesNoSelect = (field, label, required = false, options = config.yesNoOptions) => (
    <RegistrationField
      label={`${label}${required ? " *" : ""}`}
      name={field}
      error={errors[field]}
    >
      <select
        id={field}
        name={field}
        value={form[field]}
        onChange={onChange}
        aria-invalid={Boolean(errors[field])}
        required={required}
      >
        <option value="">Select an option</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </RegistrationField>
  );

  return (
    <>
      <section className="sr-form-section" aria-labelledby="play-safety-heading">
        <div className="sr-section-heading">
          <div>
            <h3 id="play-safety-heading">Safety information</h3>
            <p>Tell families about supervision and safety resources.</p>
          </div>
        </div>
        <div className="sr-fields-grid play-safety-grid">
          {yesNoSelect(
            config.adultSupervisionField,
            "Adult supervision required?",
            true,
            config.adultSupervisionOptions,
          )}
          {yesNoSelect(config.firstAidField, "First-aid facility available", true)}
          {yesNoSelect(
            "trainedStaffAvailable",
            "Trained staff available (recommended)",
          )}
          {yesNoSelect(
            "safetyInstructionsProvided",
            "Safety instructions provided (recommended)",
          )}
        </div>
        <fieldset className="sr-choice-fieldset">
          <legend>Safety equipment available (recommended)</legend>
          <div className="play-checkbox-grid">
            {config.safetyEquipmentOptions.map((equipment) => (
              <label className="play-checkbox-option" key={equipment}>
                <input
                  type="checkbox"
                  checked={form[config.safetyEquipmentField].includes(equipment)}
                  onChange={(event) => {
                    const selected = event.target.checked
                      ? [...form[config.safetyEquipmentField], equipment]
                      : form[config.safetyEquipmentField].filter(
                          (item) => item !== equipment,
                        );
                    onChange({
                      target: {
                        name: config.safetyEquipmentField,
                        value: selected,
                      },
                    });
                  }}
                />
                <span>{equipment}</span>
              </label>
            ))}
          </div>
          {errors[config.safetyEquipmentField] && (
            <span className="sr-field-error" role="alert">
              {errors[config.safetyEquipmentField]}
            </span>
          )}
        </fieldset>
        {form[config.safetyEquipmentField].includes("Other") && (
          <RegistrationField
            label="Specify safety equipment *"
            name={config.safetyEquipmentOtherField}
            error={errors[config.safetyEquipmentOtherField]}
          >
            <input
              id={config.safetyEquipmentOtherField}
              name={config.safetyEquipmentOtherField}
              value={form[config.safetyEquipmentOtherField]}
              onChange={onChange}
              maxLength={100}
              aria-invalid={Boolean(errors[config.safetyEquipmentOtherField])}
              required
            />
          </RegistrationField>
        )}
      </section>

      <section
        className="sr-form-section"
        aria-labelledby="play-facilities-heading"
      >
        <div className="sr-section-heading">
          <div>
            <h3 id="play-facilities-heading">Additional facilities</h3>
            <p>Optional information about facilities for visitors.</p>
          </div>
        </div>
        <div className="sr-fields-grid">
          {yesNoSelect(
            config.parkingField,
            "Parking available",
            false,
            config.parkingOptions,
          )}
          {yesNoSelect(
            "restroomsAvailable",
            "Restrooms available (recommended)",
          )}
          {yesNoSelect(
            "foodAndBeveragesAvailable",
            "Food and beverages available",
          )}
          {yesNoSelect("seatingAreaAvailable", "Seating / waiting area")}
          {yesNoSelect(
            "birthdayBookingsAvailable",
            "Birthday party bookings available",
          )}
          {yesNoSelect("lockersAvailable", "Locker facility available")}
          <RegistrationField
            label="Accessibility information"
            name={config.accessibilityField}
            error={errors[config.accessibilityField]}
          >
            <select
              id={config.accessibilityField}
              name={config.accessibilityField}
              value={form[config.accessibilityField]}
              onChange={onChange}
              aria-invalid={Boolean(errors[config.accessibilityField])}
            >
              <option value="">Select an option (optional)</option>
              {config.accessibilityOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </RegistrationField>
          {form[config.accessibilityField] === "Other" && (
            <RegistrationField
              label="Accessibility details *"
              name={config.accessibilityOtherField}
              error={errors[config.accessibilityOtherField]}
            >
              <textarea
                id={config.accessibilityOtherField}
                name={config.accessibilityOtherField}
                value={form[config.accessibilityOtherField]}
                onChange={onChange}
                maxLength={300}
                rows={2}
                aria-invalid={Boolean(errors[config.accessibilityOtherField])}
                required
              />
            </RegistrationField>
          )}
        </div>
      </section>
    </>
  );
}

export default PlaySafetyAndFacilities;
