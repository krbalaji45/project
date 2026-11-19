import RegistrationField from "../../shared/components/FormField";
import ActivityCategory from "./ActivityCategory";
import ActivityPricing from "./ActivityPricing";

function ActivityDetailsFields({ config, form, errors, onChange }) {
  return (
    <>
      <div className="sr-fields-grid">
        <RegistrationField
          label={`${config.nameLabel} *`}
          name={config.nameField}
          error={errors[config.nameField]}
        >
          <input
            id={config.nameField}
            name={config.nameField}
            value={form[config.nameField]}
            onChange={onChange}
            maxLength={100}
            aria-invalid={Boolean(errors[config.nameField])}
            required
          />
        </RegistrationField>
        <ActivityCategory
          config={config}
          form={form}
          errors={errors}
          onChange={onChange}
        />
        <ActivityPricing
          config={config}
          form={form}
          errors={errors}
          onChange={onChange}
        />
      </div>
      <RegistrationField
        label={`${config.descriptionLabel} *`}
        name={config.descriptionField}
        error={errors[config.descriptionField]}
      >
        <textarea
          id={config.descriptionField}
          name={config.descriptionField}
          value={form[config.descriptionField]}
          onChange={onChange}
          maxLength={500}
          rows={3}
          placeholder="Describe your activity offering"
          aria-invalid={Boolean(errors[config.descriptionField])}
          required
        />
      </RegistrationField>
    </>
  );
}

export default ActivityDetailsFields;
