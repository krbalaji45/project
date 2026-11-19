function RegistrationReview({
  businessTitle,
  businessReview,
  form,
  logo,
  photos,
  agreedToTerms,
  errors,
  onTermsChange,
  photosTitle,
}) {
  return (
    <>
      <section className="sr-form-section sr-review-section">
        <div className="sr-section-heading">
          <div>
            <h3>{businessTitle}</h3>
            <p>Review the information customers will see.</p>
          </div>
        </div>
        {businessReview}
      </section>

      <section className="sr-form-section sr-review-section">
        <div className="sr-section-heading">
          <div>
            <h3>Primary contact</h3>
            <p>Contact details for this registration.</p>
          </div>
        </div>
        <dl className="sr-review-grid">
          <div><dt>Name</dt><dd>{form.ownerName}</dd></div>
          <div><dt>Email</dt><dd>{form.email}</dd></div>
          <div><dt>Phone</dt><dd>{form.phone}</dd></div>
        </dl>
      </section>

      <section className="sr-form-section sr-review-section">
        <div className="sr-section-heading">
          <div>
            <h3>{photosTitle || "Photos and logo"}</h3>
            <p>Images included with this registration.</p>
          </div>
        </div>
        {logo || photos.length ? (
          <div className="sr-review-images">
            {logo && (
              <figure>
                <img src={logo.dataUrl} alt="Registration logo" />
                <figcaption>Logo</figcaption>
              </figure>
            )}
            {photos.map((photo) => (
              <figure key={photo.id}>
                <img src={photo.dataUrl} alt={photo.name} />
                <figcaption>{photo.name}</figcaption>
              </figure>
            ))}
          </div>
        ) : (
          <p className="sr-no-images">No logo or photos added.</p>
        )}
      </section>

      <label className="sr-terms">
        <input
          id="terms"
          type="checkbox"
          checked={agreedToTerms}
          onChange={onTermsChange}
          aria-invalid={Boolean(errors.terms)}
          required
        />
        <span>
          I agree to the <strong>Terms &amp; Conditions</strong> and{" "}
          <strong>Privacy Policy</strong>.
        </span>
      </label>
      {errors.terms && (
        <p className="sr-field-error" role="alert">{errors.terms}</p>
      )}
    </>
  );
}

export default RegistrationReview;
