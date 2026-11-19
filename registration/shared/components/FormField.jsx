function RegistrationField({ label, name, error, children }) {
  return (
    <div className="sr-field">
      <label htmlFor={name}>{label}</label>
      {children}
      {error && (
        <span className="sr-field-error" id={`${name}-error`} role="alert">
          {error}
        </span>
      )}
    </div>
  );
}

export default RegistrationField;
