import { TABLE_LOCATIONS, TABLE_SEAT_OPTIONS } from "../diningConfig";
import RegistrationTypeSelector from "./RegistrationTypeSelector";
import DiningLocation from "./DiningLocation";
import DiningHours from "./DiningHours";

function FieldError({ id, children }) {
  return (
    <span className="dr-field-error" id={id}>
      {children}
    </span>
  );
}

function RestaurantDetails({
  activeStep,
  form,
  registrationType,
  onRegistrationTypeChange,
  fieldErrors,
  onChange,
  onLocationChange,
  onPostalLocationFound,
  onCuisineTypesChange,
  onDiningServicesChange,
  onOpeningHoursChange,
  onOpeningDayPresetChange,
  onCustomTableCountChange,
  onAddTableSize,
  onRemoveTableSize,
  onSaveTable,
  onEditTable,
}) {
  return (
    <>
      {activeStep === 0 && (
        <div className="dr-fields-grid dr-fields-single-column">
        <label className="dr-field">
          <span>First name <b>*</b></span>
          <input
            name="firstName"
            value={form.firstName}
            onChange={onChange}
            placeholder="Enter first name"
            autoComplete="given-name"
            maxLength={50}
            aria-invalid={Boolean(fieldErrors.firstName)}
            aria-describedby={fieldErrors.firstName ? "dr-error-first-name" : undefined}
            required
          />
          {fieldErrors.firstName && (
            <FieldError id="dr-error-first-name">{fieldErrors.firstName}</FieldError>
          )}
        </label>
        <label className="dr-field">
          <span>Last name <b>*</b></span>
          <input
            name="lastName"
            value={form.lastName}
            onChange={onChange}
            placeholder="Enter last name"
            autoComplete="family-name"
            maxLength={50}
            aria-invalid={Boolean(fieldErrors.lastName)}
            aria-describedby={fieldErrors.lastName ? "dr-error-last-name" : undefined}
            required
          />
          {fieldErrors.lastName && (
            <FieldError id="dr-error-last-name">{fieldErrors.lastName}</FieldError>
          )}
        </label>

        <label className="dr-field">
          <span>Phone number <b>*</b></span>
          <input
            name="phone"
            type="tel"
            value={form.phone}
            onChange={onChange}
            placeholder="Enter phone number"
            autoComplete="tel"
            inputMode="tel"
            maxLength={16}
            aria-invalid={Boolean(fieldErrors.phone)}
            aria-describedby={fieldErrors.phone ? "dr-error-phone" : undefined}
            required
          />
          {fieldErrors.phone && (
            <FieldError id="dr-error-phone">{fieldErrors.phone}</FieldError>
          )}
        </label>

        <label className="dr-field">
          <span>Email address <b>*</b></span>
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={onChange}
            placeholder="Enter your email address"
            autoComplete="email"
            maxLength={254}
            aria-invalid={Boolean(fieldErrors.email)}
            aria-describedby={fieldErrors.email ? "dr-error-email" : undefined}
            required
          />
          {fieldErrors.email && (
            <FieldError id="dr-error-email">{fieldErrors.email}</FieldError>
          )}
        </label>

        <RegistrationTypeSelector
          value={registrationType}
          onChange={onRegistrationTypeChange}
          error={fieldErrors.registrationType}
        />

        </div>
      )}

      {activeStep === 1 && (
        <div className="dr-fields-grid">
        <label className="dr-field dr-field-full">
          <span>Restaurant name <b>*</b></span>
          <input
            name="restaurantName"
            value={form.restaurantName}
            onChange={onChange}
            placeholder="Enter your restaurant name"
            autoComplete="organization"
            maxLength={100}
            aria-invalid={Boolean(fieldErrors.restaurantName)}
            aria-describedby={
              fieldErrors.restaurantName ? "dr-error-restaurant-name" : undefined
            }
            required
          />
          {fieldErrors.restaurantName && (
            <FieldError id="dr-error-restaurant-name">
              {fieldErrors.restaurantName}
            </FieldError>
          )}
        </label>
        <label className="dr-field">
          <span>Restaurant type <b>*</b></span>
          <select
            name="restaurantType"
            value={form.restaurantType}
            onChange={onChange}
            aria-invalid={Boolean(fieldErrors.restaurantType)}
            aria-describedby={
              fieldErrors.restaurantType ? "dr-error-restaurant-type" : undefined
            }
            required
          >
            <option>Casual Dining</option>
            <option>Fine Dining</option>
            <option>Cafe</option>
            <option>Bakery</option>
            <option>Fast Casual</option>
            <option>Food Truck</option>
            <option>Other</option>
          </select>
          {fieldErrors.restaurantType && (
            <FieldError id="dr-error-restaurant-type">
              {fieldErrors.restaurantType}
            </FieldError>
          )}
        </label>
        {form.restaurantType === "Other" && (
          <label className="dr-field">
            <span>Specify restaurant type <b>*</b></span>
            <input
              name="restaurantTypeOther"
              value={form.restaurantTypeOther}
              onChange={onChange}
              placeholder="Enter your restaurant type"
              maxLength={100}
              aria-invalid={Boolean(fieldErrors.restaurantTypeOther)}
              aria-describedby={
                fieldErrors.restaurantTypeOther
                  ? "dr-error-restaurant-type-other"
                  : undefined
              }
              required
            />
            {fieldErrors.restaurantTypeOther && (
              <FieldError id="dr-error-restaurant-type-other">
                {fieldErrors.restaurantTypeOther}
              </FieldError>
            )}
          </label>
        )}
        <label className="dr-field dr-field-aligned-label">
          <span>Air conditioning <b>*</b></span>
          <select
            name="airConditioning"
            value={form.airConditioning}
            onChange={onChange}
            aria-invalid={Boolean(fieldErrors.airConditioning)}
            aria-describedby={
              fieldErrors.airConditioning
                ? "dr-error-air-conditioning"
                : undefined
            }
            required
          >
            <option value="">Choose an option</option>
            <option value="AC">AC</option>
            <option value="Non-AC">Non-AC</option>
            <option value="Both">Both</option>
          </select>
          {fieldErrors.airConditioning && (
            <FieldError id="dr-error-air-conditioning">
              {fieldErrors.airConditioning}
            </FieldError>
          )}
        </label>
        <label className="dr-field dr-field-aligned-label">
          <span>Table booking charges (non-refundable) * (₹)</span>
          <input
            name="tableBookingCharge"
            type="number"
            min="0"
            step="0.01"
            value={form.tableBookingCharge}
            onChange={onChange}
            aria-invalid={Boolean(fieldErrors.tableBookingCharge)}
            aria-describedby={
              fieldErrors.tableBookingCharge
                ? "dr-error-table-booking-charge"
                : undefined
            }
            required
          />
          {fieldErrors.tableBookingCharge && (
            <FieldError id="dr-error-table-booking-charge">
              {fieldErrors.tableBookingCharge}
            </FieldError>
          )}
        </label>

        <label className="dr-field dr-field-full">
          <span>Business description</span>
          <textarea
            name="businessDescription"
            value={form.businessDescription}
            onChange={onChange}
            placeholder="Tell customers what makes your restaurant special"
            maxLength={500}
            rows={3}
            aria-invalid={Boolean(fieldErrors.businessDescription)}
            aria-describedby={
              fieldErrors.businessDescription
                ? "dr-error-business-description"
                : undefined
            }
          />
          {fieldErrors.businessDescription && (
            <FieldError id="dr-error-business-description">
              {fieldErrors.businessDescription}
            </FieldError>
          )}
        </label>

        <fieldset
          className="dr-checkbox-group dr-field-full"
          aria-invalid={Boolean(fieldErrors.cuisineTypes)}
          aria-describedby={
            fieldErrors.cuisineTypes ? "dr-error-cuisine-types" : undefined
          }
        >
          <legend>Cuisine types <b>*</b></legend>
          <div className="dr-checkbox-options">
            {[
              "South Indian",
              "North Indian",
              "Chinese",
              "Continental",
              "Italian",
              "Mexican",
              "Multi-cuisine",
              "Other",
            ].map((cuisine) => (
              <label key={cuisine}>
                <input
                  type="checkbox"
                  name="cuisineTypes"
                  value={cuisine}
                  checked={form.cuisineTypes.includes(cuisine)}
                  onChange={onCuisineTypesChange}
                />
                <span>{cuisine}</span>
              </label>
            ))}
          </div>
          {fieldErrors.cuisineTypes && (
            <FieldError id="dr-error-cuisine-types">
              {fieldErrors.cuisineTypes}
            </FieldError>
          )}
        </fieldset>
        {form.cuisineTypes.includes("Other") && (
          <label className="dr-field dr-field-full">
            <span>Specify cuisine type <b>*</b></span>
            <input
              name="cuisineTypeOther"
              value={form.cuisineTypeOther}
              onChange={onChange}
              maxLength={100}
              aria-invalid={Boolean(fieldErrors.cuisineTypeOther)}
              aria-describedby={
                fieldErrors.cuisineTypeOther
                  ? "dr-error-cuisine-type-other"
                  : undefined
              }
              required
            />
            {fieldErrors.cuisineTypeOther && (
              <FieldError id="dr-error-cuisine-type-other">
                {fieldErrors.cuisineTypeOther}
              </FieldError>
            )}
          </label>
        )}

        <label className="dr-field">
          <span>Food preference <b>*</b></span>
          <select
            name="foodPreference"
            value={form.foodPreference}
            onChange={onChange}
            aria-invalid={Boolean(fieldErrors.foodPreference)}
            aria-describedby={
              fieldErrors.foodPreference
                ? "dr-error-food-preference"
                : undefined
            }
            required
          >
            <option value="">Choose food preference</option>
            <option>Veg</option>
            <option>Non-Veg</option>
            <option>Both</option>
          </select>
          {fieldErrors.foodPreference && (
            <FieldError id="dr-error-food-preference">
              {fieldErrors.foodPreference}
            </FieldError>
          )}
        </label>

        <fieldset
          className="dr-checkbox-group dr-field-full"
          aria-invalid={Boolean(fieldErrors.diningServices)}
          aria-describedby={
            fieldErrors.diningServices ? "dr-error-dining-services" : undefined
          }
        >
          <legend>Available dining services <b>*</b></legend>
          <div className="dr-checkbox-options">
            {["Dine-in", "Takeaway", "Catering"].map((service) => (
              <label key={service}>
                <input
                  type="checkbox"
                  name="diningServices"
                  value={service}
                  checked={form.diningServices.includes(service)}
                  onChange={onDiningServicesChange}
                />
                <span>{service}</span>
              </label>
            ))}
          </div>
          {fieldErrors.diningServices && (
            <FieldError id="dr-error-dining-services">
              {fieldErrors.diningServices}
            </FieldError>
          )}
        </fieldset>

        <DiningLocation
          form={form}
          fieldErrors={fieldErrors}
          onChange={onChange}
          onLocationChange={onLocationChange}
          onPostalLocationFound={onPostalLocationFound}
        />
        <fieldset
          className="dr-checkbox-group dr-table-configuration dr-field-full"
          aria-invalid={Boolean(fieldErrors.tableCounts)}
          aria-describedby={
            fieldErrors.tableCounts ? "dr-error-table-counts" : undefined
          }
        >
          <legend>Table Configuration <b>*</b></legend>
          <p className="dr-table-description">
            Add the table sizes available at your dining venue.
          </p>
          <div className="dr-table-size-list">
            {form.customTableCounts.map((table, index) => (
              table.saved ? (
                <div className="dr-saved-table" key={`custom-table-${index}`}>
                  <div>
                    <h3>Table {index + 1}</h3>
                    <p>
                      {table.seats === "Other"
                        ? table.customSeats
                        : table.seats} seats · {table.count} table
                      {Number(table.count) === 1 ? "" : "s"} · {table.location}
                    </p>
                  </div>
                  <div className="dr-saved-table-actions">
                    <button type="button" onClick={() => onEditTable(index)}>
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => onRemoveTableSize(index)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ) : (
                <div className="dr-custom-table-row" key={`custom-table-${index}`}>
                  <h3 className="dr-table-number dr-field-full">
                    Table {index + 1}
                  </h3>
                  <label className="dr-field">
                    <span>Seats per table <b>*</b></span>
                    <select
                      name={`customTableSeats${index}`}
                      value={table.seats}
                      onChange={(event) =>
                        onCustomTableCountChange(index, "seats", event.target.value)
                      }
                      required
                      aria-invalid={Boolean(fieldErrors.tableCounts)}
                      aria-describedby={fieldErrors.tableCounts ? "dr-error-table-counts" : undefined}
                    >
                      <option value="">Choose seats</option>
                      {TABLE_SEAT_OPTIONS.map((seats) => (
                        <option key={seats} value={seats}>
                          {seats === "Other" ? "Other" : `${seats} seats`}
                        </option>
                      ))}
                    </select>
                  </label>
                  {table.seats === "Other" && (
                    <label className="dr-field">
                      <span>Custom seats per table <b>*</b></span>
                      <input
                        name={`customTableSeatCount${index}`}
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        value={table.customSeats}
                        onChange={(event) =>
                          onCustomTableCountChange(index, "customSeats", event.target.value)
                        }
                        placeholder="Enter number of seats"
                        maxLength={4}
                        required
                        aria-invalid={Boolean(fieldErrors.tableCounts)}
                        aria-describedby={fieldErrors.tableCounts ? "dr-error-table-counts" : undefined}
                      />
                    </label>
                  )}
                  <label className="dr-field">
                    <span>Number of tables <b>*</b></span>
                    <input
                      name={`customTableCount${index}`}
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      value={table.count}
                      onChange={(event) =>
                        onCustomTableCountChange(index, "count", event.target.value)
                      }
                      placeholder="Enter number of tables"
                      maxLength={4}
                      required
                      aria-invalid={Boolean(fieldErrors.tableCounts)}
                      aria-describedby={fieldErrors.tableCounts ? "dr-error-table-counts" : undefined}
                    />
                  </label>
                  <label className="dr-field dr-table-location-field">
                    <span>Table location <b>*</b></span>
                    <select
                      name={`customTableLocation${index}`}
                      value={table.location}
                      onChange={(event) =>
                        onCustomTableCountChange(index, "location", event.target.value)
                      }
                      required
                      aria-invalid={Boolean(fieldErrors.tableCounts)}
                      aria-describedby={fieldErrors.tableCounts ? "dr-error-table-counts" : undefined}
                    >
                      <option value="">Choose a location</option>
                      {TABLE_LOCATIONS.map((location) => (
                        <option key={location} value={location}>{location}</option>
                      ))}
                    </select>
                  </label>
                  <div className="dr-table-editor-actions">
                    <button
                      className="dr-save-table"
                      type="button"
                      onClick={() => onSaveTable(index)}
                    >
                      Save table
                    </button>
                    <button
                      className="dr-remove-table"
                      type="button"
                      onClick={() => onRemoveTableSize(index)}
                      aria-label={`Remove table ${index + 1}`}
                    >
                      Remove table
                    </button>
                  </div>
                </div>
              )
            ))}
          </div>
          <button
            className="dr-add-table"
            type="button"
            onClick={onAddTableSize}
          >
            + Add table
          </button>
          {fieldErrors.tableCounts && (
            <FieldError id="dr-error-table-counts">
              {fieldErrors.tableCounts}
            </FieldError>
          )}
        </fieldset>
        <DiningHours
          form={form}
          fieldErrors={fieldErrors}
          onOpeningHoursChange={onOpeningHoursChange}
          onOpeningDayPresetChange={onOpeningDayPresetChange}
        />
        </div>
      )}
    </>
  );
}

export default RestaurantDetails;
