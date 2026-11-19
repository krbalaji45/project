import FormField from "../../shared/components/FormField";
import StateSearchSelect from "../../shared/components/StateSearchSelect";
import LocationPicker from "../../shared/components/LocationPicker";
import PostalCodeLookup from "../../shared/components/PostalCodeLookup";
import { ADDRESS_TYPES } from "../storesConfig";

function StoreLocation({
  form,
  errors,
  onChange,
  onLocationChange,
  onPostalLocationFound,
}) {
  return (
    <section className="sr-form-section" aria-labelledby="sr-location">
      <div className="sr-section-heading">
        <div>
          <h3 id="sr-location">Store location</h3>
          <p>Add the address where customers can find you.</p>
        </div>
      </div>
      <FormField label="Street address *" name="address" error={errors.address}>
        <input
          id="address"
          name="address"
          value={form.address}
          onChange={onChange}
          maxLength={200}
          autoComplete="street-address"
          aria-invalid={Boolean(errors.address)}
          required
        />
      </FormField>
      <FormField
        label="Address type *"
        name="addressType"
        error={errors.addressType}
      >
        <select
          id="addressType"
          name="addressType"
          value={form.addressType}
          onChange={onChange}
          aria-invalid={Boolean(errors.addressType)}
          required
        >
          <option value="">Select an address type</option>
          {ADDRESS_TYPES.map((addressType) => (
            <option key={addressType} value={addressType}>
              {addressType}
            </option>
          ))}
        </select>
      </FormField>
      {form.addressType === "Other" && (
        <FormField
          label="Specify address type *"
          name="otherAddressType"
          error={errors.otherAddressType}
        >
          <input
            id="otherAddressType"
            name="otherAddressType"
            value={form.otherAddressType}
            onChange={onChange}
            maxLength={100}
            aria-invalid={Boolean(errors.otherAddressType)}
            required
          />
        </FormField>
      )}
      <div className="sr-fields-grid sr-location-grid">
        <FormField label="City *" name="city" error={errors.city}>
          <input
            id="city"
            name="city"
            value={form.city}
            onChange={onChange}
            maxLength={80}
            autoComplete="address-level2"
            aria-invalid={Boolean(errors.city)}
            required
          />
        </FormField>
        <FormField label="Area *" name="area" error={errors.area}>
          <input
            id="area"
            name="area"
            value={form.area}
            onChange={onChange}
            maxLength={80}
            aria-invalid={Boolean(errors.area)}
            required
          />
        </FormField>
        <FormField label="State *" name="region" error={errors.region}>
          <StateSearchSelect
            id="region"
            name="region"
            value={form.region}
            onChange={onChange}
            invalid={Boolean(errors.region)}
            describedBy={errors.region ? "region-error" : undefined}
          />
        </FormField>
        <FormField
          label="Postal / ZIP code *"
          name="postalCode"
          error={errors.postalCode}
        >
          <input
            id="postalCode"
            name="postalCode"
            type="text"
            inputMode="numeric"
            pattern="[0-9]{6}"
            value={form.postalCode}
            onChange={onChange}
            autoComplete="postal-code"
            aria-invalid={Boolean(errors.postalCode)}
            aria-describedby="postal-code-lookup-status"
            required
          />
          <PostalCodeLookup
            postalCode={form.postalCode}
            onLocationFound={onPostalLocationFound}
            statusId="postal-code-lookup-status"
          />
        </FormField>
      </div>
      <LocationPicker
        latitude={form.latitude}
        longitude={form.longitude}
        error={errors.latitude}
        onLocationChange={onLocationChange}
      />
    </section>
  );
}

export default StoreLocation;
