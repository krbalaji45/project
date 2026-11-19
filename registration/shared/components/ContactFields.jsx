import RegistrationField from "./FormField";

function ContactFields({ form, errors, onChange }) {
  return (
    <section className="sr-form-section" aria-label="Primary contact">
      <div className="sr-section-heading">
        <div>
          <h3>Primary contact</h3>
          <p>We’ll use these details to reach you about your registration.</p>
        </div>
      </div>
      <div className="sr-fields-grid">
        <RegistrationField
          label="Contact person's name *"
          name="ownerName"
          error={errors.ownerName}
        >
          <input
            id="ownerName"
            name="ownerName"
            value={form.ownerName}
            onChange={onChange}
            maxLength={100}
            autoComplete="name"
            aria-invalid={Boolean(errors.ownerName)}
            required
          />
        </RegistrationField>
        <RegistrationField label="Email address *" name="email" error={errors.email}>
          <input
            id="email"
            name="email"
            type="email"
            value={form.email}
            onChange={onChange}
            maxLength={254}
            autoComplete="email"
            aria-invalid={Boolean(errors.email)}
            required
          />
        </RegistrationField>
        <RegistrationField label="Phone number *" name="phone" error={errors.phone}>
          <input
            id="phone"
            name="phone"
            type="tel"
            value={form.phone}
            onChange={onChange}
            maxLength={20}
            autoComplete="tel"
            aria-invalid={Boolean(errors.phone)}
            required
          />
        </RegistrationField>
      </div>
    </section>
  );
}

export default ContactFields;
