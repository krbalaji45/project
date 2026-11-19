function StoreReview({
  form,
  logo,
  photos,
  agreedToTerms,
  errors,
  onTermsChange,
}) {
  return (
    <>
      <section
        className="sr-form-section sr-review-section"
        aria-labelledby="sr-review-business"
      >
        <div className="sr-section-heading">
          <div>
            <h3 id="sr-review-business">Business details</h3>
            <p>Review the information for your store profile.</p>
          </div>
        </div>
        <dl className="sr-review-grid">
          <div><dt>Store name</dt><dd>{form.storeName}</dd></div>
          <div>
            <dt>Category</dt>
            <dd>
              {[form.category, form.mainCategory, form.subcategory]
                .flatMap((categoryPart) =>
                  Array.isArray(categoryPart) ? categoryPart : [categoryPart],
                )
                .filter(Boolean)
                .join(" / ")}
            </dd>
          </div>
          <div>
            <dt>Business type</dt>
            <dd>
              {form.businessType === "Other"
                ? form.otherBusinessType
                : form.businessType}
            </dd>
          </div>
          <div className="sr-review-full">
            <dt>Description</dt><dd>{form.description || "Not provided"}</dd>
          </div>
          <div className="sr-review-full">
            <dt>Address</dt>
            <dd>
              {[form.address, form.city, form.area, form.region, form.postalCode]
                .filter(Boolean)
                .join(", ")}
              {form.addressType &&
                ` (${form.addressType === "Other" ? form.otherAddressType : form.addressType})`}
            </dd>
          </div>
          <div>
            <dt>Order processing</dt>
            <dd>
              {form.orderProcessingTime === "Custom"
                ? form.customOrderProcessingTime
                : form.orderProcessingTime || "Not provided"}
            </dd>
          </div>
          <div><dt>Return policy</dt><dd>{form.returnPolicy || "Not provided"}</dd></div>
          {form.returnWindow && (
            <div>
              <dt>Return window</dt>
              <dd>
                {form.returnWindow === "Custom"
                  ? form.customReturnWindow
                  : form.returnWindow}
              </dd>
            </div>
          )}
          <div>
            <dt>Cancellation policy</dt>
            <dd>
              {form.cancellationPolicy === "Custom Policy"
                ? form.customCancellationPolicy
                : form.cancellationPolicy || "Not provided"}
            </dd>
          </div>
          <div>
            <dt>Gift wrapping</dt>
            <dd>{form.giftWrapping || "Not provided"}</dd>
          </div>
          <div className="sr-review-full">
            <dt>Working days and hours</dt>
            <dd>
              {form.openingHours
                .map((hours) =>
                  hours.isOpen
                    ? `${hours.day}: ${hours.open}–${hours.close}`
                    : `${hours.day}: Closed`,
                )
                .join(", ")}
            </dd>
          </div>
        </dl>
      </section>
      <section
        className="sr-form-section sr-review-section"
        aria-labelledby="sr-review-contact"
      >
        <div className="sr-section-heading">
          <div>
            <h3 id="sr-review-contact">Primary contact</h3>
            <p>Contact details for this registration.</p>
          </div>
        </div>
        <dl className="sr-review-grid">
          <div><dt>Name</dt><dd>{form.ownerName}</dd></div>
          <div><dt>Email</dt><dd>{form.email}</dd></div>
          <div><dt>Phone</dt><dd>{form.phone}</dd></div>
        </dl>
      </section>
      <section
        className="sr-form-section sr-review-section"
        aria-labelledby="sr-review-photos"
      >
        <div className="sr-section-heading">
          <div>
            <h3 id="sr-review-photos">Store photos and logo</h3>
            <p>Images included with your store profile.</p>
          </div>
        </div>
        {logo || photos.length ? (
          <div className="sr-review-images">
            {logo && (
              <figure>
                <img src={logo.dataUrl} alt="Store logo" />
                <figcaption>Store logo</figcaption>
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
          aria-describedby={errors.terms ? "terms-error" : undefined}
          required
        />
        <span>
          I agree to the <strong>Terms &amp; Conditions</strong> and{" "}
          <strong>Privacy Policy</strong>.
        </span>
      </label>
      {errors.terms && (
        <p className="sr-field-error" id="terms-error" role="alert">
          {errors.terms}
        </p>
      )}
    </>
  );
}

export default StoreReview;
