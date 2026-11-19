function EventReview({ config, form }) {
  return (
    <dl className="sr-review-grid">
      <div>
        <dt>{config.nameLabel}</dt>
        <dd>{form[config.nameField]}</dd>
      </div>
      <div>
        <dt>{config.capacityLabel}</dt>
        <dd>{form[config.capacityField]}</dd>
      </div>
      <div className="sr-review-full">
        <dt>Event categories</dt>
        <dd>
          <ul className="event-category-review-list">
            {form[config.customCategoryEntriesField].map((category, index) => (
              <li key={`${category.name}-${index}`}>
                <strong>{category.name}</strong>: ₹{category.pricePerPerson} per
                person, capacity {category.capacity}
              </li>
            ))}
          </ul>
        </dd>
      </div>
      <div className="sr-review-full">
        <dt>{config.descriptionLabel}</dt>
        <dd>{form[config.descriptionField]}</dd>
      </div>
      <div className="sr-review-full">
        <dt>Event location</dt>
        <dd>
          {[form[config.addressField], form.city, form.region, form.postalCode]
            .filter(Boolean)
            .join(", ")}
        </dd>
      </div>
      <div>
        <dt>Start date</dt>
        <dd>{form.scheduleStartDate}</dd>
      </div>
      <div>
        <dt>End date</dt>
        <dd>{form.scheduleEndDate}</dd>
      </div>
      <div>
        <dt>Total days</dt>
        <dd>{form.totalDays}</dd>
      </div>
      <div>
        <dt>Event start time</dt>
        <dd>{form.startTime}</dd>
      </div>
      <div>
        <dt>Event end time</dt>
        <dd>{form.endTime}</dd>
      </div>
    </dl>
  );
}

export default EventReview;
