import RegistrationField from "../../shared/components/FormField";
import PlayCategory from "./PlayCategory";
import PlayPricing from "./PlayPricing";
import PlaySafetyAndFacilities from "./PlaySafetyAndFacilities";

function PlayDetailsFields({ config, form, errors, onChange }) {
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
        <PlayCategory
          config={config}
          form={form}
          errors={errors}
          onChange={onChange}
        />
      </div>
      <PlayPricing
        config={config}
        form={form}
        errors={errors}
        onChange={onChange}
      />
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
          placeholder="Describe your play offering"
          aria-invalid={Boolean(errors[config.descriptionField])}
          required
        />
      </RegistrationField>
      <PlaySafetyAndFacilities
        config={config}
        form={form}
        errors={errors}
        onChange={onChange}
      />
    </>
  );
}

export default PlayDetailsFields;
