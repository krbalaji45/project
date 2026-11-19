import FormField from "../../shared/components/FormField";
import { BUSINESS_TYPES } from "../storesConfig";
import StoreCategory from "./StoreCategory";
import StorePolicies from "./StorePolicies";

function StoreDetails({ form, errors, onChange }) {
  return (
    <>
      <section className="sr-form-section" aria-labelledby="sr-business">
        <div className="sr-section-heading">
          <div>
            <h3 id="sr-business">Business details</h3>
            <p>What customers will see about your business.</p>
          </div>
        </div>
        <div className="sr-fields-grid">
          <FormField
            label="Store name *"
            name="storeName"
            error={errors.storeName}
          >
            <input
              id="storeName"
              name="storeName"
              value={form.storeName}
              onChange={onChange}
              maxLength={100}
              autoComplete="organization"
              aria-invalid={Boolean(errors.storeName)}
              required
            />
          </FormField>
          <FormField
            label="Business type *"
            name="businessType"
            error={errors.businessType}
          >
            <select
              id="businessType"
              name="businessType"
              value={form.businessType}
              onChange={onChange}
              aria-invalid={Boolean(errors.businessType)}
              required
            >
              <option value="">Select a business type</option>
              {BUSINESS_TYPES.map((businessType) => (
                <option key={businessType} value={businessType}>
                  {businessType}
                </option>
              ))}
            </select>
          </FormField>
          {form.businessType === "Other" && (
            <FormField
              label="Specify business type *"
              name="otherBusinessType"
              error={errors.otherBusinessType}
            >
              <input
                id="otherBusinessType"
                name="otherBusinessType"
                value={form.otherBusinessType}
                onChange={onChange}
                maxLength={100}
                aria-invalid={Boolean(errors.otherBusinessType)}
                required
              />
            </FormField>
          )}
        </div>
        <FormField
          label="Store description (optional)"
          name="description"
          error={errors.description}
        >
          <textarea
            id="description"
            name="description"
            value={form.description}
            onChange={onChange}
            maxLength={500}
            rows={3}
            placeholder="Share what makes your store special."
            aria-invalid={Boolean(errors.description)}
          />
        </FormField>
      </section>
      <StoreCategory form={form} errors={errors} onChange={onChange} />
      <StorePolicies form={form} errors={errors} onChange={onChange} />
    </>
  );
}

export default StoreDetails;
