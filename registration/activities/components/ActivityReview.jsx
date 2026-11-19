function ActivityReview({ config, form }) {
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
            form[config.mainCategoryField],
            form[config.subcategoryField].join(", "),
          ]
            .filter(Boolean)
            .join(" / ")}
        </dd>
      </div>
      <div>
        <dt>Provider type</dt>
        <dd>
          {[form[config.providerTypeField], form[config.providerTypeOtherField]]
            .filter(Boolean)
            .join(": ") || "Not provided"}
        </dd>
      </div>
      <div><dt>Suitable age range</dt><dd>{form.ageRange}</dd></div>
      <div><dt>Duration</dt><dd>{form[config.durationField]} minutes</dd></div>
      <div>
        <dt>Minimum participants</dt>
        <dd>{form[config.minimumParticipantsField]}</dd>
      </div>
      <div><dt>{config.capacityLabel}</dt><dd>{form[config.capacityField]}</dd></div>
      <div className="sr-review-full">
        <dt>{config.descriptionLabel}</dt>
        <dd>{form[config.descriptionField]}</dd>
      </div>
      <div className="sr-review-full">
        <dt>{config.locationTitle}</dt>
        <dd>
          {[
            form[config.locationTypeField],
            form[config.locationTypeOtherField],
            form.address,
            form.city,
            form.area,
            form.region,
            form.postalCode,
            form.meetingPoint,
          ]
            .filter(Boolean)
            .join(", ")}
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

export default ActivityReview;
