import RegistrationField from "../../shared/components/FormField";

function ActivityPricing({ config, form, errors, onChange }) {
  return (
    <>
      <RegistrationField
        label="Suitable age range *"
        name="ageRange"
        error={errors.ageRange}
      >
        <input
          id="ageRange"
          name="ageRange"
          value={form.ageRange}
          onChange={onChange}
          maxLength={50}
          placeholder="e.g. Ages 8 and up"
          aria-invalid={Boolean(errors.ageRange)}
          required
        />
      </RegistrationField>
      <RegistrationField
        label="Minimum participants *"
        name={config.minimumParticipantsField}
        error={errors[config.minimumParticipantsField]}
      >
        <input
          id={config.minimumParticipantsField}
          name={config.minimumParticipantsField}
          type="number"
          min="1"
          max={form[config.capacityField] || 10000}
          value={form[config.minimumParticipantsField]}
          onChange={onChange}
          aria-invalid={Boolean(errors[config.minimumParticipantsField])}
          required
        />
      </RegistrationField>
      <RegistrationField
        label="Duration in minutes *"
        name={config.durationField}
        error={errors[config.durationField]}
      >
        <input
          id={config.durationField}
          name={config.durationField}
          type="number"
          min="1"
          max="1440"
          value={form[config.durationField]}
          onChange={onChange}
          aria-invalid={Boolean(errors[config.durationField])}
          required
        />
      </RegistrationField>
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
    </>
  );
}

export default ActivityPricing;
