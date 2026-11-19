
import "./BusinessDetailsForm.css";

export default function BusinessDetailsForm({
  values,
  onChange,
  onBack,
  onSubmit,
}) {
  return (
    <div className="form-panel">
      <h2>Add Your Event Details</h2>
      <p className="form-subtitle">
        Enter your event  information.
      </p>

      <form onSubmit={onSubmit}>
        <div className="form-group">
          <label htmlFor="businessName">Event Name</label>
          <input
            id="businessName"
            type="text"
            name="businessName"
            value={values.businessName}
            onChange={onChange}
            placeholder="Enter business name"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="location">Location</label>
          <input
            id="location"
            type="text"
            name="location"
            value={values.location}
            onChange={onChange}
            placeholder="Enter event location"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            value={values.description}
            onChange={onChange}
            placeholder="Describe your event space"
            rows="4"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="capacity">Capacity</label>
          <input
            id="capacity"
            type="number"
            name="capacity"
            value={values.capacity}
            onChange={onChange}
            placeholder="Enter maximum capacity"
            min="1"
            required
          />
        </div>

   

<div className="form-group">
  <label htmlFor="ticketPrice">Ticket Price</label>

  <div className="price-input-wrapper">
    <span className="currency-symbol">₹</span>
    <input
      id="ticketPrice"
      type="number"
      name="ticketPrice"
      value={values.ticketPrice}
      onChange={onChange}
      placeholder="0.00"
      min="0"
      step="0.01"
      required
    />
    <span className="currency-suffix">INR</span>
  </div>
</div>



<div className="form-group">
  <label>Start Date</label>
  <input
    type="date"
    name="scheduleStartDate"
    value={values.scheduleStartDate}
    onChange={onChange}
    required
  />
</div>

<div className="form-group">
  <label>End Date</label>
  <input
    type="date"
    name="scheduleEndDate"
    value={values.scheduleEndDate}
    onChange={onChange}
    required
  />
</div>

<div className="form-group">
  <label>Event Start Time</label>
  <input
    type="time"
    name="scheduleStartTime"
    value={values.scheduleStartTime}
    onChange={onChange}
    required
  />
</div>

<div className="form-group">
  <label>Event End Time</label>
  <input
    type="time"
    name="scheduleEndTime"
    value={values.scheduleEndTime}
    onChange={onChange}
    required
  />
</div>


        <div className="form-group">
          <label htmlFor="timeline">Timeline</label>
          <input
            id="timeline"
            type="text"
            name="timeline"
            value={values.timeline}
            onChange={onChange}
            placeholder="Example: One day / Weekend"
            required
          />
        </div>

        {/* Event Category Selection */}
        <div className="event-category-section">
          <h3>Select Your Event Category</h3>
          <p className="category-subtitle">
            Choose a package for your event.
          </p>

          <div className="event-category-options">
            <label className="event-category-card platinum">
              <input
                type="radio"
                name="eventCategory"
                value="Platinum"
                checked={values.eventCategory === "Platinum"}
                onChange={onChange}
                required
              />

              <span className="category-badge">
                PLATINUM
              </span>

              <strong>Platinum</strong>

              <span className="category-description">
                Premium event package
              </span>
            </label>

            <label className="event-category-card gold">
              <input
                type="radio"
                name="eventCategory"
                value="Gold"
                checked={values.eventCategory === "Gold"}
                onChange={onChange}
                required
              />

              <span className="category-badge">
                GOLD
              </span>

              <strong>Gold</strong>

              <span className="category-description">
                Enhanced event package
              </span>
            </label>

            <label className="event-category-card silver">
              <input
                type="radio"
                name="eventCategory"
                value="Silver"
                checked={values.eventCategory === "Silver"}
                onChange={onChange}
                required
              />

              <span className="category-badge">
                SILVER
              </span>

              <strong>Silver</strong>

              <span className="category-description">
                Essential event package
              </span>
            </label>
          </div>
        </div>

        <div className="form-actions">
          <button
            type="button"
            className="secondary-button"
            onClick={onBack}
          >
            Back
          </button>

          <button
            type="submit"
            className="primary-button"
          >
            Continue
          </button>
        </div>
      </form>
    </div>
  );
}
