import { useState } from "react";
import RegistrationField from "../../shared/components/FormField";

function EventDetails({ config, form, errors, onChange, onValueChange }) {
  const [categoryDraft, setCategoryDraft] = useState({
    name: "",
    pricePerPerson: "",
    capacity: "",
  });
  const [categoryDraftError, setCategoryDraftError] = useState("");

  const updateCategoryDraft = (event) => {
    const { name, value } = event.target;
    setCategoryDraft((current) => ({ ...current, [name]: value }));
    setCategoryDraftError("");
  };

  const addCategory = () => {
    const name = categoryDraft.name.trim();
    const price = categoryDraft.pricePerPerson.trim();
    const priceAmount = Number(price);
    const capacity = Number(categoryDraft.capacity);
    const categories = form[config.customCategoryEntriesField] || [];
    const allocatedCapacity = categories.reduce(
      (total, category) => total + Number(category.capacity),
      0,
    );
    const totalCapacity = Number(form[config.capacityField]);
    if (
      name.length < 2 ||
      name.length > 100 ||
      !/^\d+(?:\.\d{1,2})?$/.test(price) ||
      !Number.isFinite(priceAmount) ||
      priceAmount < 0 ||
      !Number.isInteger(capacity) ||
      capacity < 1 ||
      capacity > 10000
    ) {
      setCategoryDraftError(
        "Enter a category name, a valid price, and a capacity from 1 to 10000.",
      );
      return;
    }
    if (
      !Number.isInteger(totalCapacity) ||
      totalCapacity < 1 ||
      allocatedCapacity + capacity > totalCapacity
    ) {
      setCategoryDraftError(
        !Number.isInteger(totalCapacity) || totalCapacity < 1
          ? "Enter the total event capacity before adding categories."
          : `Category capacities cannot exceed the remaining capacity of ${totalCapacity - allocatedCapacity}.`,
      );
      return;
    }

    onValueChange(config.customCategoryEntriesField, [
      ...categories,
      { name, pricePerPerson: price, capacity: String(capacity) },
    ]);
    setCategoryDraft({ name: "", pricePerPerson: "", capacity: "" });
    setCategoryDraftError("");
  };

  const removeCategory = (index) => {
    onValueChange(
      config.customCategoryEntriesField,
      form[config.customCategoryEntriesField].filter(
        (_, categoryIndex) => categoryIndex !== index,
      ),
    );
  };

  return (
    <>
      <div className="sr-fields-grid event-details-grid">
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
          <small>
            {config.capacityHelp}
          </small>
        </RegistrationField>
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
          rows={4}
          placeholder="Describe your event"
          aria-invalid={Boolean(errors[config.descriptionField])}
          required
        />
      </RegistrationField>
      <fieldset
        className="event-category-options"
        aria-invalid={Boolean(errors[config.customCategoryEntriesField])}
        aria-describedby={
          errors[config.customCategoryEntriesField]
            ? `${config.customCategoryEntriesField}-error`
            : undefined
        }
      >
        <legend>Event categories *</legend>
        <div className="sr-fields-grid event-category-fields-grid">
          <RegistrationField label="Category *" name="event-category-draft">
            <input
              id="event-category-draft"
              name="name"
              value={categoryDraft.name}
              onChange={updateCategoryDraft}
              maxLength={100}
              placeholder="For example: VIP"
              required
            />
          </RegistrationField>
          <RegistrationField
            label="Price per person (₹) *"
            name="event-category-price-draft"
          >
            <input
              id="event-category-price-draft"
              name="pricePerPerson"
              type="number"
              min="0"
              step="0.01"
              value={categoryDraft.pricePerPerson}
              onChange={updateCategoryDraft}
              placeholder="0.00"
              required
            />
          </RegistrationField>
          <RegistrationField
            label="Capacity *"
            name="event-category-capacity-draft"
          >
            <input
              id="event-category-capacity-draft"
              name="capacity"
              type="number"
              min="1"
              max={Math.min(
                10000,
                Math.max(
                  0,
                  Number(form[config.capacityField] || 0) -
                    (form[config.customCategoryEntriesField] || []).reduce(
                      (total, category) => total + Number(category.capacity),
                      0,
                    ),
                ),
              )}
              step="1"
              value={categoryDraft.capacity}
              onChange={updateCategoryDraft}
              required
            />
          </RegistrationField>
        </div>
        {categoryDraftError && (
          <p className="sr-field-error" role="alert">
            {categoryDraftError}
          </p>
        )}
        <button
          className="event-category-add"
          type="button"
          onClick={addCategory}
        >
          Add category
        </button>
        {errors[config.customCategoryEntriesField] && (
          <p
            className="sr-field-error"
            id={`${config.customCategoryEntriesField}-error`}
            role="alert"
          >
            {errors[config.customCategoryEntriesField]}
          </p>
        )}
        <ol className="event-category-list">
          {(form[config.customCategoryEntriesField] || []).map(
            (category, index) => (
              <li className="event-category-item" key={`${category.name}-${index}`}>
                <div>
                  <strong>{category.name}</strong>
                  <span>₹{category.pricePerPerson} per person</span>
                  <span>Capacity: {category.capacity}</span>
                </div>
                <button
                  type="button"
                  className="event-category-remove"
                  onClick={() => removeCategory(index)}
                  aria-label={`Remove ${category.name} category`}
                >
                  Remove
                </button>
              </li>
            ),
          )}
        </ol>
      </fieldset>
    </>
  );
}

export default EventDetails;
