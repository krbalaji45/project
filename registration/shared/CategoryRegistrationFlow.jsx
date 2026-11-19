import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Check } from "lucide-react";
import RegistrationSidebar from "./components/RegistrationSidebar";
import ContactFields from "./components/ContactFields";
import AddressFields from "./components/AddressFields";
import ScheduleFields from "./components/ScheduleFields";
import MediaUploadFields from "./components/MediaUpload";
import RegistrationReview from "./components/RegistrationReview";
import {
  createInitialForm,
  IMAGE_TYPES,
  MAX_IMAGE_SIZE,
  MAX_PHOTOS,
  getDateAfterDays,
  readImage,
  validateForm,
} from "./utils/formUtils";
import { saveRegistration } from "./utils/registrationService";
import "./styles/registrationCommon.css";

const STEPS = [
  {
    title: "Create your profile",
    description: "Tell us who you are and how customers can reach you.",
  },
  {
    title: "Add your details",
    description: "Describe your offering, location, and availability.",
  },
  {
    title: "Show off your space",
    description: "Upload photos to show customers what you offer.",
  },
  {
    title: "Review your details",
    description: "Check your information before submitting.",
  },
];

const contactFieldNames = ["ownerName", "email", "phone"];

function CategoryRegistrationFlow({
  config,
  DetailsFields,
  ReviewFields,
  validateRegistration,
  ScheduleComponent = ScheduleFields,
  MediaUploadComponent = MediaUploadFields,
  save,
}) {
  const validate =
    validateRegistration ||
    ((currentForm, termsAccepted) =>
      validateForm(currentForm, config, termsAccepted));
  const persist =
    save || ((registration) => saveRegistration(config.collection, registration));
  const location = useLocation();
  const navigate = useNavigate();
  const logoInputRef = useRef(null);
  const photosInputRef = useRef(null);
  const cardRef = useRef(null);
  const [form, setForm] = useState(() =>
    createInitialForm(config, location.state?.profile),
  );
  const [activeStep, setActiveStep] = useState(() =>
    location.state?.profile ? 1 : 0,
  );
  const [logo, setLogo] = useState(null);
  const [photos, setPhotos] = useState([]);
  const [uploadErrors, setUploadErrors] = useState({});
  const [errors, setErrors] = useState({});
  const [validationAttempted, setValidationAttempted] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [isEditingDetails, setIsEditingDetails] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [savedName, setSavedName] = useState("");

  useEffect(() => {
    if (activeStep === 0 && !savedName) {
      cardRef.current?.scrollTo({ top: 0 });
      window.scrollTo({ top: 0 });
    }
  }, [activeStep, savedName]);

  const updateValue = (name, value) => {
    const shouldRecalculateEndDate =
      config.totalDaysField &&
      (name === config.totalDaysField || name === "scheduleStartDate");
    const nextForm = {
      ...form,
      [name]: value,
      ...(shouldRecalculateEndDate
        ? {
            scheduleEndDate: getDateAfterDays(
              name === "scheduleStartDate" ? value : form.scheduleStartDate,
              name === config.totalDaysField ? value : form[config.totalDaysField],
            ),
          }
        : {}),
      ...(name === config.categoryField && config.mainCategoryField
        ? {
            [config.mainCategoryField]: "",
            [config.subcategoryField]: [],
          }
        : {}),
      ...(name === config.mainCategoryField && config.subcategoryField
        ? { [config.subcategoryField]: [] }
        : {}),
      ...(name === config.categoryField && config.subcategoryField
        ? { [config.subcategoryField]: [] }
        : {}),
      ...(name === config.accessibilityField &&
      config.accessibilityOtherField &&
      value !== "Other"
        ? { [config.accessibilityOtherField]: "" }
        : {}),
      ...(name === config.categoryField && value !== "Other"
        ? { otherCategory: "" }
        : {}),
      ...(name === config.providerTypeField &&
      config.providerTypeOtherField &&
      value !== "Other"
        ? { [config.providerTypeOtherField]: "" }
        : {}),
      ...(name === config.locationTypeField &&
      config.locationTypeOtherField &&
      value !== "Other"
        ? { [config.locationTypeOtherField]: "" }
        : {}),
      ...(name === config.safetyEquipmentField &&
      config.safetyEquipmentOtherField &&
      Array.isArray(value) &&
      !value.includes("Other")
        ? { [config.safetyEquipmentOtherField]: "" }
        : {}),
    };
    setForm(nextForm);
    if (validationAttempted) {
      const nextErrors = validate(nextForm, agreedToTerms);
      setErrors(
        activeStep === 0
          ? Object.fromEntries(
              Object.entries(nextErrors).filter(([field]) =>
                contactFieldNames.includes(field),
              ),
            )
          : nextErrors,
      );
    } else {
      setErrors((current) => ({ ...current, [name]: undefined }));
    }
    setSubmitError("");
  };

  const updateField = (event) => {
    const { name } = event.target;
    const value =
      name === "postalCode"
        ? event.target.value.replace(/\D/g, "").slice(0, 6)
        : event.target.value;
    updateValue(name, value);
  };

  const updateHours = (index, changes) => {
    const nextForm = {
      ...form,
      openingHours: form.openingHours.map((hours, hoursIndex) =>
        hoursIndex === index ? { ...hours, ...changes } : hours,
      ),
    };
    setForm(nextForm);
    if (validationAttempted) {
      setErrors(validate(nextForm, agreedToTerms));
    }
    setSubmitError("");
  };

  const updateDayPreset = (days, checked) => {
    const selectedDays = new Set(checked ? days : []);
    const nextForm = {
      ...form,
      openingHours: form.openingHours.map((hours) => ({
        ...hours,
        isOpen: selectedDays.has(hours.day),
      })),
    };
    setForm(nextForm);
    if (validationAttempted) {
      setErrors(validate(nextForm, agreedToTerms));
    }
    setSubmitError("");
  };

  const handleImageChange = async (event, kind) => {
    const files = Array.from(event.target.files || []);
    event.target.value = "";
    if (!files.length) return;

    if (kind === "logo" && files.length > 1) {
      setUploadErrors((current) => ({ ...current, logo: "Upload one logo image." }));
      return;
    }
    const maxPhotos = config.maxPhotos ?? MAX_PHOTOS;
    if (kind === "photos" && photos.length + files.length > maxPhotos) {
      setUploadErrors((current) => ({
        ...current,
        photos: `Upload up to ${maxPhotos} photos.`,
      }));
      return;
    }
    const invalidFile = files.find(
      (file) =>
        !IMAGE_TYPES.includes(file.type) || file.size > MAX_IMAGE_SIZE,
    );
    if (invalidFile) {
      setUploadErrors((current) => ({
        ...current,
        [kind]: !IMAGE_TYPES.includes(invalidFile.type)
          ? "Use a JPG, PNG, or WebP image."
          : "Each image must be 2 MB or smaller.",
      }));
      return;
    }

    try {
      const images = await Promise.all(files.map(readImage));
      if (kind === "logo") setLogo(images[0]);
      else setPhotos((current) => [...current, ...images]);
      setUploadErrors((current) => ({ ...current, [kind]: undefined }));
      setSubmitError("");
    } catch (error) {
      console.error(`Unable to read ${config.singular} registration image.`, error);
      setUploadErrors((current) => ({
        ...current,
        [kind]: "Unable to read the selected image. Try another file.",
      }));
    }
  };

  const validateStep = (step) => {
    const allErrors = validate(form, agreedToTerms);
    const detailsFields = [
      config.nameField,
      ...(config.categoryField ? [config.categoryField] : []),
      ...(config.subcategoryField ? [config.subcategoryField] : []),
      ...(config.mainCategoryField
        ? [config.mainCategoryField, config.subcategoryField]
        : []),
      ...(config.providerTypeField ? [config.providerTypeField] : []),
      ...(config.providerTypeOtherField &&
      form[config.providerTypeField] === "Other"
        ? [config.providerTypeOtherField]
        : []),
      ...(config.locationTypeOtherField &&
      form[config.locationTypeField] === "Other"
        ? [config.locationTypeOtherField]
        : []),
      ...(form[config.categoryField] === "Other" && !config.subcategoryField
        ? ["otherCategory"]
        : []),
      config.descriptionField,
      ...(config.minimumAgeField
        ? [
            config.minimumAgeField,
            config.maximumAgeField,
          ]
        : config.ageRangeRequired === false
          ? []
          : ["ageRange"]),
      ...(config.durationField ? [config.durationField] : []),
      config.capacityField,
      ...(config.minimumParticipantsField
        ? [config.minimumParticipantsField]
        : []),
      ...(config.facilitiesRequired ? ["facilities"] : []),
      ...(config.indoorOutdoorField
        ? [
            config.indoorOutdoorField,
            config.adultSupervisionField,
            config.safetyEquipmentField,
            config.firstAidField,
            ...config.recommendedSafetyFields,
            config.parkingField,
            ...config.optionalFacilityFields,
            config.accessibilityField,
            ...(config.accessibilityOtherField
              ? [config.accessibilityOtherField]
              : []),
            ...(config.safetyEquipmentOtherField
              ? [config.safetyEquipmentOtherField]
              : []),
            ...(config.categoryOtherField ? [config.categoryOtherField] : []),
          ]
        : []),
      config.addressField || "address",
      "city",
      "area",
      "region",
      "postalCode",
      ...(config.additionalDetailFields || []),
      ...(config.customCategoryEntriesField
        ? [config.customCategoryEntriesField]
        : []),
      ...(config.locationTypeField
        ? [config.locationTypeField, "meetingPoint"]
        : []),
      "latitude",
      "longitude",
      ...(config.hasWeeklyAvailability === false ? [] : ["openingHours"]),
    ];
    const fieldsByStep = [contactFieldNames, detailsFields, [], ["terms"]];
    return Object.fromEntries(
      Object.entries(allErrors).filter(([field]) =>
        fieldsByStep[step].includes(field),
      ),
    );
  };

  const updateLocation = (latitude, longitude) => {
    const nextForm = { ...form, latitude, longitude };
    setForm(nextForm);
    if (validationAttempted && activeStep === 3 && isEditingDetails) {
      const nextErrors = validate(nextForm, true);
      delete nextErrors.terms;
      setErrors(nextErrors);
    } else {
      setErrors(
        validationAttempted
          ? getStepErrors(activeStep, validate(nextForm, agreedToTerms))
          : { ...errors, latitude: undefined },
      );
    }
    setSubmitError("");
  };

  const updatePostalLocation = ({ latitude, longitude, city, area }) => {
    const nextForm = {
      ...form,
      latitude,
      longitude,
      ...(city ? { city } : {}),
      ...(area ? { area } : {}),
    };
    setForm(nextForm);
    if (validationAttempted && activeStep === 3 && isEditingDetails) {
      const nextErrors = validate(nextForm, true);
      delete nextErrors.terms;
      setErrors(nextErrors);
    } else {
      setErrors(
        validationAttempted
          ? getStepErrors(activeStep, validate(nextForm, agreedToTerms))
          : { ...errors, latitude: undefined, city: undefined, area: undefined },
      );
    }
    setSubmitError("");
  };

  const continueStep = () => {
    if (activeStep === 2 && config.photosRequired && photos.length === 0) {
      setSubmitError(
        `Upload at least one ${config.singular} image before continuing.`,
      );
      return;
    }
    if (activeStep === 2 && Object.values(uploadErrors).some(Boolean)) {
      setSubmitError("Fix the image upload errors before continuing.");
      return;
    }
    const stepErrors = validateStep(activeStep);
    setErrors((current) => ({ ...current, ...stepErrors }));
    setValidationAttempted(true);
    const firstInvalid = Object.keys(stepErrors)[0];
    if (firstInvalid) {
      document.getElementById(firstInvalid)?.focus();
      return;
    }
    setSubmitError("");
    setActiveStep((current) => Math.min(current + 1, STEPS.length - 1));
  };

  const selectStep = (step) => {
    if (step <= activeStep) {
      setIsEditingDetails(false);
      setActiveStep(step);
    } else {
      continueStep();
    }
  };

  const saveReviewEdits = () => {
    const nextErrors = validate(form, true);
    delete nextErrors.terms;
    setErrors(nextErrors);
    setValidationAttempted(true);
    const firstInvalid = Object.keys(nextErrors)[0];
    if (firstInvalid) {
      document.getElementById(firstInvalid)?.focus();
      return;
    }
    if (Object.values(uploadErrors).some(Boolean)) {
      setSubmitError("Fix the image upload errors before saving your details.");
      return;
    }
    if (config.photosRequired && photos.length === 0) {
      setSubmitError(`Upload at least one ${config.singular} image before saving.`);
      setActiveStep(2);
      setIsEditingDetails(false);
      return;
    }
    setSubmitError("");
    setIsEditingDetails(false);
    cardRef.current?.scrollTo({ top: 0 });
  };

  const handleTermsChange = (event) => {
    const accepted = event.target.checked;
    setAgreedToTerms(accepted);
    if (validationAttempted) {
      setErrors(validate(form, accepted));
    }
    setSubmitError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitError("");
    const nextErrors = validate(form, agreedToTerms);
    setValidationAttempted(true);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) {
      const firstInvalid = Object.keys(nextErrors)[0];
      if (firstInvalid !== "terms") {
        setIsEditingDetails(true);
        document.getElementById(firstInvalid)?.focus();
      }
      return;
    }
    if (config.photosRequired && photos.length === 0) {
      setSubmitError(`Upload at least one ${config.singular} image before saving.`);
      setActiveStep(2);
      setIsEditingDetails(false);
      return;
    }
    if (Object.values(uploadErrors).some(Boolean)) {
      setSubmitError("Fix the image upload errors before saving.");
      setActiveStep(2);
      setIsEditingDetails(false);
      return;
    }

    setIsSaving(true);
    try {
      const registration = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        registrationType: config.registrationType,
        ...Object.fromEntries(
          Object.entries(form).map(([key, value]) => [
            key,
            typeof value === "string" ? value.trim() : value,
          ]),
        ),
        latitude: Number(form.latitude),
        longitude: Number(form.longitude),
        ...(config.totalDaysField
          ? {
              [config.totalDaysField]: Number(form[config.totalDaysField]),
            }
          : {}),
        logo,
        photos,
        termsAccepted: agreedToTerms,
        createdAt: new Date().toISOString(),
      };
      await persist(registration);
      setSavedName(form[config.nameField].trim());
    } catch (error) {
      console.error(`Unable to save ${config.singular} registration.`, error);
      setSubmitError(
        `Unable to save your ${config.singular} registration to db.json. Make sure the backend server is running, then try again.`,
      );
    } finally {
      setIsSaving(false);
    }
  };

  const registerAnother = () => {
    navigate("/registration", {
      state: { registrationType: config.registrationType },
    });
  };

  const handleBack = () => {
    if (activeStep === 1 && location.state?.profile) {
      const [firstName = "", ...lastNameParts] = form.ownerName
        .trim()
        .split(/\s+/);
      navigate("/registration", {
        state: {
          profile: {
            ...location.state.profile,
            firstName,
            lastName: lastNameParts.join(" "),
            email: form.email,
            phone: form.phone,
          },
          registrationType: config.registrationType,
        },
      });
      return;
    }
    setActiveStep((current) => Math.max(current - 1, 0));
  };

  const businessFields = (
    <>
      <section className="sr-form-section" aria-label={`${config.singular} details`}>
        <div className="sr-section-heading">
          <div>
            <h3>
              {config.detailsTitle ||
                `${config.singular === "activity" ? "Activity" : "Play"} details`}
            </h3>
            <p>Required information customers will see.</p>
          </div>
        </div>
        <DetailsFields
          config={config}
          form={form}
          errors={errors}
          onChange={updateField}
          onValueChange={updateValue}
        />
      </section>
      <AddressFields
        config={config}
        form={form}
        errors={errors}
        onChange={updateField}
        onLocationChange={updateLocation}
        onPostalLocationFound={updatePostalLocation}
      />
      <ScheduleComponent
        config={config}
        form={form}
        errors={errors}
        onChange={updateField}
        onHoursChange={updateHours}
        onDayPresetChange={updateDayPreset}
        showDayPresets={config.showDayPresets === true}
      />
    </>
  );

  const reviewFields = (
    <RegistrationReview
      businessTitle={
        config.detailsTitle ||
        `${config.singular.charAt(0).toUpperCase()}${config.singular.slice(1)} details`
      }
      businessReview={<ReviewFields config={config} form={form} />}
      form={form}
      logo={logo}
      photos={photos}
      photosTitle={config.photosTitle}
      agreedToTerms={agreedToTerms}
      errors={errors}
      onTermsChange={handleTermsChange}
    />
  );

  const title =
    activeStep === 1
      ? `Add your ${config.singular} details`
      : STEPS[activeStep].title;
  const description =
    activeStep === 1
      ? config.detailsDescription ||
        `Describe your ${config.singular}, location, and weekly availability.`
      : STEPS[activeStep].description;

  return (
    <main
      className="sr-page apr-page"
      data-registration-type={config.registrationType}
    >
      <div className="sr-container">
        <div className="sr-layout">
          <RegistrationSidebar
            activeStep={activeStep}
            description={`Create your ${config.singular} profile and help more customers discover it.`}
            onSelectStep={selectStep}
            steps={STEPS}
            title="Grow your local business."
            titleId="apr-main-title"
          />
          <section
            ref={cardRef}
            className="sr-card"
            aria-labelledby="apr-form-title"
          >
            {savedName ? (
              <div className="sr-success" role="status">
                <span className="sr-success-icon" aria-hidden="true">
                  <Check size={28} />
                </span>
                <p className="sr-eyebrow">APPLICATION SAVED</p>
                <h2 id="apr-form-title">
                  Your {config.singular} registration is saved
                </h2>
                <p>
                  <strong>{savedName}</strong> has been saved in the registration
                  database.
                </p>
                <Link className="sr-submit" to="/login">
                  Continue to log in <span aria-hidden="true">→</span>
                </Link>
                <button
                  className="sr-another-link"
                  type="button"
                  onClick={registerAnother}
                >
                  Register another {config.singular}
                </button>
              </div>
            ) : (
              <>
                <div className="sr-card-heading">
                  <p className="sr-eyebrow">
                    STEP {activeStep + 1} OF {STEPS.length}
                  </p>
                  <h2 id="apr-form-title">{title}</h2>
                  <p>{description}</p>
                </div>
                <form className="sr-form" onSubmit={handleSubmit} noValidate>
                  {(activeStep === 0 || (activeStep === 3 && isEditingDetails)) && (
                    <ContactFields
                      form={form}
                      errors={errors}
                      onChange={updateField}
                    />
                  )}
                  {(activeStep === 1 || (activeStep === 3 && isEditingDetails)) &&
                    businessFields}
                  {(activeStep === 2 || (activeStep === 3 && isEditingDetails)) && (
                    <MediaUploadComponent
                      singular={config.singular}
                      showLogo={config.showLogoUpload !== false}
                      photosTitle={config.photosTitle}
                      photosRequired={config.photosRequired}
                      maxPhotos={config.maxPhotos ?? MAX_PHOTOS}
                      logo={logo}
                      photos={photos}
                      logoInputRef={logoInputRef}
                      photosInputRef={photosInputRef}
                      uploadErrors={uploadErrors}
                      onChange={handleImageChange}
                      onRemoveLogo={() => {
                        setLogo(null);
                        setUploadErrors((current) => ({
                          ...current,
                          logo: undefined,
                        }));
                      }}
                      onRemovePhoto={(id) => {
                        setPhotos((current) =>
                          current.filter((photo) => photo.id !== id),
                        );
                        setUploadErrors((current) => ({
                          ...current,
                          photos: undefined,
                        }));
                      }}
                    />
                  )}
                  {activeStep === 3 && !isEditingDetails && reviewFields}
                  {activeStep === 3 && isEditingDetails && (
                    <div className="sr-review-editing-note" role="status">
                      Update the fields above, then select Save details to return
                      to your review.
                    </div>
                  )}
                  {submitError && (
                    <p className="sr-submit-error" role="alert">{submitError}</p>
                  )}
                  <div className="sr-step-navigation">
                    {activeStep > 0 && !isEditingDetails && (
                      <button
                        className="sr-step-back"
                        type="button"
                        onClick={handleBack}
                      >
                        Back
                      </button>
                    )}
                    {activeStep === 3 && isEditingDetails ? (
                      <button
                        className="sr-submit"
                        type="button"
                        onClick={saveReviewEdits}
                      >
                        Save details <span aria-hidden="true">→</span>
                      </button>
                    ) : activeStep === 3 ? (
                      <>
                        <button
                          className="sr-step-back"
                          type="button"
                          onClick={() => {
                            setIsEditingDetails(true);
                            cardRef.current?.scrollTo({ top: 0 });
                          }}
                        >
                          Edit details
                        </button>
                        <button
                          className="sr-submit"
                          type="submit"
                          disabled={isSaving}
                        >
                          {isSaving
                            ? "Saving..."
                            : `Create ${config.singular} profile`}{" "}
                          {!isSaving && <span aria-hidden="true">→</span>}
                        </button>
                      </>
                    ) : (
                      <button
                        className="sr-submit"
                        type="button"
                        onClick={continueStep}
                      >
                        Save and Continue <span aria-hidden="true">→</span>
                      </button>
                    )}
                  </div>
                  <p className="sr-login-prompt">
                    Already registered? <Link to="/login">Log in</Link>
                  </p>
                </form>
              </>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}

export default CategoryRegistrationFlow;
