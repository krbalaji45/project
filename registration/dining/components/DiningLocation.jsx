import StateSearchSelect from "../../shared/components/StateSearchSelect";
import LocationPicker from "../../shared/components/LocationPicker";
import PostalCodeLookup from "../../shared/components/PostalCodeLookup";

function DiningLocation({
  form,
  fieldErrors,
  onChange,
  onLocationChange,
  onPostalLocationFound,
}) {
  return (
    <>
      <label className="dr-field dr-field-full">
        <span>Restaurant address <b>*</b></span>
        <input
          name="address"
          value={form.address}
          onChange={onChange}
          placeholder="Street address, building, or area"
          autoComplete="street-address"
          maxLength={200}
          aria-invalid={Boolean(fieldErrors.address)}
          aria-describedby={fieldErrors.address ? "dr-error-address" : undefined}
          required
        />
        {fieldErrors.address && (
          <span className="dr-field-error" id="dr-error-address">
            {fieldErrors.address}
          </span>
        )}
      </label>
      <label className="dr-field dr-field-full">
        <span>City <b>*</b></span>
        <input
          name="city"
          value={form.city}
          onChange={onChange}
          placeholder="Enter your city"
          autoComplete="address-level2"
          maxLength={80}
          aria-invalid={Boolean(fieldErrors.city)}
          aria-describedby={fieldErrors.city ? "dr-error-city" : undefined}
          required
        />
        {fieldErrors.city && (
          <span className="dr-field-error" id="dr-error-city">
            {fieldErrors.city}
          </span>
        )}
      </label>
      <label className="dr-field">
        <span>Area <b>*</b></span>
        <input
          name="area"
          value={form.area}
          onChange={onChange}
          placeholder="Enter your area"
          maxLength={80}
          aria-invalid={Boolean(fieldErrors.area)}
          aria-describedby={fieldErrors.area ? "dr-error-area" : undefined}
          required
        />
        {fieldErrors.area && (
          <span className="dr-field-error" id="dr-error-area">
            {fieldErrors.area}
          </span>
        )}
      </label>
      <label className="dr-field">
        <span>State <b>*</b></span>
        <StateSearchSelect
          name="region"
          value={form.region}
          onChange={onChange}
          invalid={Boolean(fieldErrors.region)}
          describedBy={fieldErrors.region ? "dr-error-region" : undefined}
        />
        {fieldErrors.region && (
          <span className="dr-field-error" id="dr-error-region">
            {fieldErrors.region}
          </span>
        )}
      </label>
      <label className="dr-field">
        <span>PIN code <b>*</b></span>
        <input
          name="postalCode"
          value={form.postalCode}
          onChange={onChange}
          type="text"
          inputMode="numeric"
          pattern="[0-9]{6}"
          autoComplete="postal-code"
          aria-invalid={Boolean(fieldErrors.postalCode)}
          aria-describedby={
            fieldErrors.postalCode
              ? "dr-error-postal-code"
              : "dr-postal-code-lookup"
          }
          required
        />
        <PostalCodeLookup
          postalCode={form.postalCode}
          onLocationFound={onPostalLocationFound}
          statusId="dr-postal-code-lookup"
        />
        {fieldErrors.postalCode && (
          <span className="dr-field-error" id="dr-error-postal-code">
            {fieldErrors.postalCode}
          </span>
        )}
      </label>
      <div className="dr-field dr-field-full">
        <span>Restaurant location *</span>
        <LocationPicker
          latitude={form.latitude}
          longitude={form.longitude}
          error={fieldErrors.latitude}
          onLocationChange={onLocationChange}
        />
      </div>
    </>
  );
}

export default DiningLocation;
