import RegistrationField from "../../shared/components/FormField";
import SubcategoryMultiSelect from "../../shared/components/SubcategoryMultiSelect";

function ActivityCategory({ config, form, errors, onChange }) {
  const categories = Object.keys(config.categories);
  const categoryMap = config.categories[form[config.categoryField]];
  const mainCategories = categoryMap
    ? ["All", ...Object.keys(categoryMap)]
    : [];
  const subcategories =
    form[config.mainCategoryField] === "All"
      ? [...new Set(Object.values(categoryMap || {}).flat())]
      : categoryMap?.[form[config.mainCategoryField]] || [];

  if (config.categoryHierarchy) {
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
            <option value="">Select an activity category</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </RegistrationField>
        <RegistrationField
          label="Main category *"
          name={config.mainCategoryField}
          error={errors[config.mainCategoryField]}
        >
          <select
            id={config.mainCategoryField}
            name={config.mainCategoryField}
            value={form[config.mainCategoryField]}
            onChange={onChange}
            aria-invalid={Boolean(errors[config.mainCategoryField])}
            disabled={!form[config.categoryField]}
            required
          >
            <option value="">Select a main category</option>
            {mainCategories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </RegistrationField>
        <SubcategoryMultiSelect
          label="Activity subcategory *"
          name={config.subcategoryField}
          error={errors[config.subcategoryField]}
          options={subcategories}
          selectedOptions={form[config.subcategoryField]}
          disabled={!form[config.mainCategoryField]}
          onChange={onChange}
        />
        <RegistrationField
          label="Provider type *"
          name={config.providerTypeField}
          error={errors[config.providerTypeField]}
        >
          <select
            id={config.providerTypeField}
            name={config.providerTypeField}
            value={form[config.providerTypeField]}
            onChange={onChange}
            aria-invalid={Boolean(errors[config.providerTypeField])}
            required
          >
            <option value="">Select a provider type</option>
            {config.providerTypes.map((providerType) => (
              <option key={providerType} value={providerType}>
                {providerType}
              </option>
            ))}
          </select>
        </RegistrationField>
        {form[config.providerTypeField] === "Other" && (
          <RegistrationField
            label="Specify provider type *"
            name={config.providerTypeOtherField}
            error={errors[config.providerTypeOtherField]}
          >
            <input
              id={config.providerTypeOtherField}
              name={config.providerTypeOtherField}
              value={form[config.providerTypeOtherField]}
              onChange={onChange}
              maxLength={100}
              aria-invalid={Boolean(errors[config.providerTypeOtherField])}
              required
            />
          </RegistrationField>
        )}
      </>
    );
  }

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

export default ActivityCategory;
