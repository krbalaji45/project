function PlayReview({ config, form }) {
  return (
    <dl className="sr-review-grid">
      <div>
        <dt>{config.nameLabel}</dt>
        <dd>{form[config.nameField]}</dd>
      </div>
      <div>
        <dt>{config.categoryLabel}</dt>
        <dd>
          {[
            form[config.categoryField],
            form[config.categoryField] === "Other"
              ? form[config.categoryOtherField]
              : "",
          ]
            .filter(Boolean)
            .join(" / ")}
        </dd>
      </div>
      <div>
        <dt>Suitable age range</dt>
        <dd>
          {form[config.maximumAgeField]
            ? `${form[config.minimumAgeField]}–${form[config.maximumAgeField]} years`
            : `${form[config.minimumAgeField]} years and up`}
        </dd>
      </div>
      <div>
        <dt>{config.capacityLabel}</dt>
        <dd>{form[config.capacityField]}</dd>
      </div>
      <div><dt>Indoor / outdoor type</dt><dd>{form[config.indoorOutdoorField]}</dd></div>
      <div><dt>Adult supervision required</dt><dd>{form[config.adultSupervisionField]}</dd></div>
      <div><dt>First-aid facility available</dt><dd>{form[config.firstAidField]}</dd></div>
      <div className="sr-review-full">
        <dt>Safety equipment available</dt>
        <dd>
          {form[config.safetyEquipmentField]
            .map((equipment) =>
              equipment === "Other"
                ? form[config.safetyEquipmentOtherField]
                : equipment,
            )
            .filter(Boolean)
            .join(", ") || "Not specified"}
        </dd>
      </div>
      <div><dt>Trained staff available</dt><dd>{form.trainedStaffAvailable || "Not specified"}</dd></div>
      <div><dt>Safety instructions provided</dt><dd>{form.safetyInstructionsProvided || "Not specified"}</dd></div>
      <div><dt>Parking available</dt><dd>{form[config.parkingField] || "Not specified"}</dd></div>
      <div><dt>Restrooms available</dt><dd>{form.restroomsAvailable || "Not specified"}</dd></div>
      <div><dt>Food and beverages available</dt><dd>{form.foodAndBeveragesAvailable || "Not specified"}</dd></div>
      <div><dt>Seating / waiting area</dt><dd>{form.seatingAreaAvailable || "Not specified"}</dd></div>
      <div><dt>Birthday party bookings</dt><dd>{form.birthdayBookingsAvailable || "Not specified"}</dd></div>
      <div><dt>Locker facility</dt><dd>{form.lockersAvailable || "Not specified"}</dd></div>
      <div className="sr-review-full">
        <dt>Accessibility information</dt>
        <dd>
          {[
            form[config.accessibilityField],
            form[config.accessibilityOtherField],
          ]
            .filter(Boolean)
            .join(": ") || "Not specified"}
        </dd>
      </div>
      <div className="sr-review-full">
        <dt>{config.descriptionLabel}</dt>
        <dd>{form[config.descriptionField]}</dd>
      </div>
      <div className="sr-review-full">
        <dt>Address</dt>
        <dd>
          {[form.address, form.city, form.area, form.region, form.postalCode].join(", ")}
        </dd>
      </div>
      <div className="sr-review-full">
        <dt>Working days and hours</dt>
        <dd>
          {form.openingHours
            .map((hours) =>
              `${hours.day}: ${hours.isOpen ? `${hours.open}–${hours.close}` : "Closed"}`,
            )
            .join(", ")}
        </dd>
      </div>
    </dl>
  );
}

export default PlayReview;
