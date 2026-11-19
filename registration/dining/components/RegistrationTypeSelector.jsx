const registrationTypes = ["Dining", "Events", "Stores", "Activities", "Play"];

function RegistrationTypeSelector({ value, onChange, error }) {
  return (
    <label className="dr-field dr-field-full dr-type-selector">
      <span>What would you like to register? <b>*</b></span>
      <select
        name="registrationType"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? "dr-error-registration-type" : undefined}
        required
      >
        <option value="">Choose a category</option>
        {registrationTypes.map((name) => (
          <option key={name} value={name}>{name}</option>
        ))}
      </select>
      {error && (
        <span className="dr-field-error" id="dr-error-registration-type" role="alert">
          {error}
        </span>
      )}
    </label>
  );
}

export default RegistrationTypeSelector;
