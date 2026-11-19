import { Link } from "react-router-dom";
import RestaurantDetails from "./RestaurantDetails";
import DiningRegistrationSummary from "./DiningReview";
import RestaurantBranding from "./DiningMediaUpload";

const stepContent = [
  {
    kicker: "STEP 1 OF 4",
    title: "Create your profile",
    description: "Add your contact details to get started.",
  },
  {
    kicker: "STEP 2 OF 4",
    title: "Add your business details",
    description: "Describe your offering, services, location, and weekly hours.",
  },
  {
    kicker: "STEP 3 OF 4",
    title: "Show off your business",
    description: "Add photos to help customers discover your business.",
  },
  {
    kicker: "STEP 4 OF 4",
    title: "Review your details",
    description: "Check your registration before submitting.",
  },
];

function DiningRegistrationForm({
  activeStep,
  registrationType,
  onSelectStep,
  onRegistrationTypeChange,
  form,
  fieldErrors,
  onFieldChange,
  onLocationChange,
  onPostalLocationFound,
  onCuisineTypesChange,
  onDiningServicesChange,
  onOpeningHoursChange,
  onOpeningDayPresetChange,
  onCustomTableCountChange,
  onAddTableSize,
  onRemoveTableSize,
  onSaveTable,
  onEditTable,
  photos,
  menuPhotos,
  logo,
  logoInputRef,
  galleryInputRef,
  menuInputRef,
  onFileChange,
  onRemoveLogo,
  onRemovePhoto,
  onRemoveMenuPhoto,
  uploadErrors,
  agreedToTerms,
  onTermsChange,
  isEditingSummary,
  onEditSummary,
  onSaveSummaryEdits,
  submitError,
  onSubmit,
  onContinue,
}) {
  if ((activeStep === 1 || activeStep === 2) && registrationType !== "Dining") {
    return (
      <div className="dr-blank-registration-step">
        <button
          className="dr-step-back"
          type="button"
          onClick={() => onSelectStep(0)}
        >
          ← Back to profile
        </button>
      </div>
    );
  }

  const currentStep = { ...stepContent[activeStep] };
  if (activeStep === 1 && registrationType) {
    currentStep.title = `Add your ${registrationType.toLowerCase()} details`;
    currentStep.description =
      "Describe your offering, location, capacity, and opening hours.";
  }

  return (
    <>
      <div className="dr-card-heading">
        <p className="dr-card-kicker">
          {currentStep.kicker}
        </p>
        <h2 id="dr-form-title">{currentStep.title}</h2>
        <p>{currentStep.description}</p>
      </div>

      <form
        className="dr-form"
        onSubmit={(event) => {
          event.preventDefault();
          if (activeStep < 3) {
            onContinue();
            return;
          }
          onSubmit(event);
        }}
        noValidate
      >
        <RestaurantDetails
          activeStep={activeStep}
          form={form}
          registrationType={registrationType}
          onRegistrationTypeChange={onRegistrationTypeChange}
          fieldErrors={fieldErrors}
          onChange={onFieldChange}
          onLocationChange={onLocationChange}
          onPostalLocationFound={onPostalLocationFound}
          onCuisineTypesChange={onCuisineTypesChange}
          onDiningServicesChange={onDiningServicesChange}
          onOpeningHoursChange={onOpeningHoursChange}
          onOpeningDayPresetChange={onOpeningDayPresetChange}
          onCustomTableCountChange={onCustomTableCountChange}
          onAddTableSize={onAddTableSize}
          onRemoveTableSize={onRemoveTableSize}
          onSaveTable={onSaveTable}
          onEditTable={onEditTable}
        />

        {activeStep === 2 && (
          <RestaurantBranding
            logo={logo}
            photos={photos}
            menuPhotos={menuPhotos}
            logoInputRef={logoInputRef}
            galleryInputRef={galleryInputRef}
            menuInputRef={menuInputRef}
            onFileChange={onFileChange}
            onRemoveLogo={onRemoveLogo}
            onRemovePhoto={onRemovePhoto}
            onRemoveMenuPhoto={onRemoveMenuPhoto}
            uploadErrors={uploadErrors}
          />
        )}

        {activeStep === 3 && !isEditingSummary && (
          <DiningRegistrationSummary
            registrationType={registrationType}
            form={form}
            logo={logo}
            photos={photos}
            menuPhotos={menuPhotos}
            agreedToTerms={agreedToTerms}
          />
        )}

        {activeStep === 3 && isEditingSummary && (
          <div className="dr-summary-editing">
            <RestaurantDetails
              activeStep={0}
              form={form}
              registrationType={registrationType}
              onRegistrationTypeChange={onRegistrationTypeChange}
              fieldErrors={fieldErrors}
              onChange={onFieldChange}
              onLocationChange={onLocationChange}
              onPostalLocationFound={onPostalLocationFound}
              onCuisineTypesChange={onCuisineTypesChange}
              onDiningServicesChange={onDiningServicesChange}
              onOpeningHoursChange={onOpeningHoursChange}
              onOpeningDayPresetChange={onOpeningDayPresetChange}
              onCustomTableCountChange={onCustomTableCountChange}
              onAddTableSize={onAddTableSize}
              onRemoveTableSize={onRemoveTableSize}
              onSaveTable={onSaveTable}
              onEditTable={onEditTable}
            />
            <RestaurantDetails
              activeStep={1}
              form={form}
              registrationType={registrationType}
              onRegistrationTypeChange={onRegistrationTypeChange}
              fieldErrors={fieldErrors}
              onChange={onFieldChange}
              onLocationChange={onLocationChange}
              onPostalLocationFound={onPostalLocationFound}
              onCuisineTypesChange={onCuisineTypesChange}
              onDiningServicesChange={onDiningServicesChange}
              onOpeningHoursChange={onOpeningHoursChange}
              onOpeningDayPresetChange={onOpeningDayPresetChange}
              onCustomTableCountChange={onCustomTableCountChange}
              onAddTableSize={onAddTableSize}
              onRemoveTableSize={onRemoveTableSize}
              onSaveTable={onSaveTable}
              onEditTable={onEditTable}
            />
            <RestaurantBranding
              logo={logo}
              photos={photos}
              menuPhotos={menuPhotos}
              logoInputRef={logoInputRef}
              galleryInputRef={galleryInputRef}
              menuInputRef={menuInputRef}
              onFileChange={onFileChange}
              onRemoveLogo={onRemoveLogo}
              onRemovePhoto={onRemovePhoto}
              onRemoveMenuPhoto={onRemoveMenuPhoto}
              uploadErrors={uploadErrors}
            />
          </div>
        )}

        {activeStep === 3 && (
          <>
            <label className="dr-terms">
              <input
                name="terms"
                type="checkbox"
                checked={agreedToTerms}
                onChange={(event) => onTermsChange(event.target.checked)}
                aria-invalid={Boolean(fieldErrors.terms)}
                aria-describedby={fieldErrors.terms ? "dr-error-terms" : undefined}
                required
              />
              <span>
                I agree to the <strong>Terms &amp; Conditions</strong> and{" "}
                <strong>Privacy Policy</strong>.
              </span>
            </label>
            {fieldErrors.terms && (
              <p className="dr-field-error" id="dr-error-terms" role="alert">
                {fieldErrors.terms}
              </p>
            )}
            {submitError && (
              <p className="dr-error" role="alert">
                {submitError}
              </p>
            )}
          </>
        )}

        <div className="dr-step-navigation">
          {activeStep > 0 && activeStep < 3 && (
            <button
              className="dr-step-back"
              type="button"
              onClick={() => onSelectStep(activeStep - 1)}
            >
              Back
            </button>
          )}
          {activeStep < 3 ? (
            <button
              className="dr-submit"
              type="button"
              onClick={onContinue}
            >
              Save and Continue <span aria-hidden="true">→</span>
            </button>
          ) : isEditingSummary ? (
            <button
              className="dr-submit"
              type="button"
              onClick={onSaveSummaryEdits}
            >
              Save edits <span aria-hidden="true">→</span>
            </button>
          ) : (
            <>
              <button
                className="dr-step-back"
                type="button"
                onClick={onEditSummary}
              >
                Edit details
              </button>
              <button className="dr-submit" type="submit">
                Save registration <span aria-hidden="true">→</span>
              </button>
            </>
          )}
        </div>
        <div className="dr-login-prompt">
          Already registered? <Link to="/login">Log in</Link>
        </div>
      </form>
    </>
  );
}

export default DiningRegistrationForm;
