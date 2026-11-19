import RegistrationField from "../../shared/components/FormField";

function EventSchedule({ form, errors, onChange }) {
  return (
    <section className="sr-form-section" aria-label="Event schedule">
      <div className="sr-section-heading">
        <div>
          <h3>Event schedule</h3>
          <p>Set the dates and times your event will run.</p>
        </div>
      </div>
      <div className="sr-fields-grid event-schedule-grid">
        <RegistrationField
          label="Start date *"
          name="scheduleStartDate"
          error={errors.scheduleStartDate}
        >
          <input
            id="scheduleStartDate"
            name="scheduleStartDate"
            type="date"
            className="event-schedule-date-input"
            value={form.scheduleStartDate}
            onChange={onChange}
            aria-invalid={Boolean(errors.scheduleStartDate)}
            required
          />
        </RegistrationField>
        <RegistrationField
          label="End date *"
          name="scheduleEndDate"
          error={errors.scheduleEndDate}
        >
          <input
            id="scheduleEndDate"
            name="scheduleEndDate"
            type="date"
            className="event-schedule-date-input"
            value={form.scheduleEndDate}
            readOnly
            aria-invalid={Boolean(errors.scheduleEndDate)}
            required
          />
          <small>Calculated from the start date and total days.</small>
        </RegistrationField>
        <RegistrationField
          label="Total days"
          name="totalDays"
          error={errors.totalDays}
        >
          <input
            id="totalDays"
            name="totalDays"
            type="number"
            min="1"
            value={form.totalDays}
            onChange={onChange}
            aria-invalid={Boolean(errors.totalDays)}
            required
          />
        </RegistrationField>
        <RegistrationField
          label="Event start time *"
          name="startTime"
          error={errors.startTime}
        >
          <input
            id="startTime"
            name="startTime"
            type="time"
            value={form.startTime}
            onChange={onChange}
            aria-invalid={Boolean(errors.startTime)}
            required
          />
        </RegistrationField>
        <RegistrationField
          label="Event end time *"
          name="endTime"
          error={errors.endTime}
        >
          <input
            id="endTime"
            name="endTime"
            type="time"
            value={form.endTime}
            onChange={onChange}
            aria-invalid={Boolean(errors.endTime)}
            required
          />
        </RegistrationField>
      </div>
    </section>
  );
}

export default EventSchedule;
