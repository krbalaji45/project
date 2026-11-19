
import "./ProfileForm.css";

export default function ProfileForm({
  values = {},
  onChange,
  onSubmit,
  onLogin,
}) {
  return (
    <div className="form-panel profile-form">
      <div className="step-label">STEP 1 OF 3</div>
      <h2>Create your profile</h2>
      <p className="form-subtitle">
        Add your contact details to get started.
      </p>

      <form onSubmit={onSubmit}>
        <div className="field-row">
          <div className="field">
            <label htmlFor="firstName">First name *</label>
            <input
              id="firstName"
              name="firstName"
              value={values.firstName ?? ""}
              onChange={onChange}
              required
            />
          </div>

          <div className="field">
            <label htmlFor="lastName">Last name *</label>
            <input
              id="lastName"
              name="lastName"
              value={values.lastName ?? ""}
              onChange={onChange}
              required
            />
          </div>
        </div>

        <div className="field">
          <label htmlFor="phone">Phone number *</label>
          <input
            id="phone"
            name="phone"
            type="tel"
            value={values.phone ?? ""}
            onChange={onChange}
            required
          />
        </div>

        <div className="field">
          <label htmlFor="email">Email address *</label>
          <input
            id="email"
            name="email"
            type="email"
            value={values.email ?? ""}
            onChange={onChange}
            required
          />
        </div>

        <div className="field">
          <label htmlFor="registerType">Register type *</label>
          <select
            id="registerType"
            name="registerType"
            value={values.registerType ?? ""}
            onChange={onChange}
            required
          >
            <option value="">Choose a category</option>
            <option value="Dining">Dining</option>
            <option value="Events">Events</option>
            <option value="Stores">Stores</option>
            <option value="Activities">Activities</option>
            <option value="Play">Play</option>
          </select>
        </div>

        <button className="primary-button" type="submit">
          Save and Continue →
        </button>
      </form>

      <p className="login-footer">
        Already registered?{" "}
        <button
          className="text-button"
          type="button"
          onClick={onLogin}
        >
          Log in
        </button>
      </p>
    </div>
  );
}
