import RegistrationField from "./FormField";
import StateSearchSelect from "./StateSearchSelect";
import LocationPicker from "./LocationPicker";
import PostalCodeLookup from "./PostalCodeLookup";

function AddressFields({
  config,
  form,
  errors,
  onChange,
  onLocationChange,
  onPostalLocationFound,
}) {
  const addressField = config.addressField || "address";

  return (
    <section
      className="sr-form-section"
      aria-label={config.locationTitle || "Location"}
    >
      <div className="sr-section-heading">
        <div>
          <h3>{config.locationTitle || "Location"}</h3>
          <p>Where customers can find you.</p>
        </div>
      </div>
      {config.locationTypeField && (
        <RegistrationField
          label="Location type *"
          name={config.locationTypeField}
          error={errors[config.locationTypeField]}
        >
          <select
            id={config.locationTypeField}
            name={config.locationTypeField}
            value={form[config.locationTypeField]}
            onChange={onChange}
            aria-invalid={Boolean(errors[config.locationTypeField])}
            required
          >
            <option value="">Select a location type</option>
            {config.locationTypes.map((locationType) => (
              <option key={locationType} value={locationType}>
                {locationType}
              </option>
            ))}
          </select>
        </RegistrationField>
      )}
      {config.locationTypeField &&
        config.locationTypeOtherField &&
        form[config.locationTypeField] === "Other" && (
          <RegistrationField
            label="Specify location type *"
            name={config.locationTypeOtherField}
            error={errors[config.locationTypeOtherField]}
          >
            <input
              id={config.locationTypeOtherField}
              name={config.locationTypeOtherField}
              value={form[config.locationTypeOtherField]}
              onChange={onChange}
              maxLength={100}
              aria-invalid={Boolean(errors[config.locationTypeOtherField])}
              required
            />
          </RegistrationField>
        )}
      <RegistrationField
        label={`${config.addressLabel || "Street address"} *`}
        name={addressField}
        error={errors[addressField]}
      >
        <input
          id={addressField}
          name={addressField}
          value={form[addressField]}
          onChange={onChange}
          maxLength={200}
          autoComplete="street-address"
          aria-invalid={Boolean(errors[addressField])}
          required
        />
      </RegistrationField>
      <div className="sr-fields-grid sr-location-grid">
        <RegistrationField label="City *" name="city" error={errors.city}>
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
        </RegistrationField>
        <RegistrationField label="Area *" name="area" error={errors.area}>
          <input
            id="area"
            name="area"
            value={form.area}
            onChange={onChange}
            maxLength={80}
            aria-invalid={Boolean(errors.area)}
            required
          />
        </RegistrationField>
        <RegistrationField
          label={`${config.regionLabel || "State"} *`}
          name="region"
          error={errors.region}
        >
          <StateSearchSelect
            id="region"
            name="region"
            value={form.region}
            onChange={onChange}
            invalid={Boolean(errors.region)}
            describedBy={errors.region ? "region-error" : undefined}
          />
        </RegistrationField>
        <RegistrationField
          label={`${config.postalCodeLabel || "Postal / ZIP code"} *`}
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
        </RegistrationField>
      </div>
      {config.locationTypeField && (
        <RegistrationField
          label="Meeting point / landmark"
          name="meetingPoint"
          error={errors.meetingPoint}
        >
          <input
            id="meetingPoint"
            name="meetingPoint"
            value={form.meetingPoint}
            onChange={onChange}
            maxLength={200}
            aria-invalid={Boolean(errors.meetingPoint)}
          />
        </RegistrationField>
      )}
      <LocationPicker
        latitude={form.latitude}
        longitude={form.longitude}
        error={errors.latitude}
        onLocationChange={onLocationChange}
      />
    </section>
  );
}

export default AddressFields;
