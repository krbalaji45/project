import RegistrationField from "../../shared/components/FormField";

function PlayCategory({ config, form, errors, onChange }) {
  return (
    <>
      <RegistrationField
        label={`${config.categoryLabel} *`}
        name={config.categoryField}
        error={errors[config.categoryField]}
      >
        <select
          id={config.categoryField}
          name={config.categoryField}
          value={form[config.categoryField]}
          onChange={onChange}
          aria-invalid={Boolean(errors[config.categoryField])}
          required
        >
          <option value="">Select a category</option>
          {config.categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </RegistrationField>
      {form[config.categoryField] === "Other" && (
        <RegistrationField
          label="Specify category *"
          name="otherCategory"
          error={errors.otherCategory}
        >
          <input
            id="otherCategory"
            name="otherCategory"
            value={form.otherCategory}
            onChange={onChange}
            maxLength={100}
            aria-invalid={Boolean(errors.otherCategory)}
            required
          />
        </RegistrationField>
      )}
    </>
  );
}

export default PlayCategory;
