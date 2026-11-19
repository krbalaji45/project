import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Check } from "lucide-react";
import RegistrationSidebar from "../shared/components/RegistrationSidebar";
import FormField from "../shared/components/FormField";
import {
  ACCEPTED_IMAGE_TYPES,
  createInitialStoreForm,
  MAX_IMAGE_SIZE,
  MAX_STORE_PHOTOS,
  STORE_STEPS,
} from "./storesConfig";
import { validateStoreForm } from "./storesValidation";
import { readStoreImage, saveStoreRegistration } from "./storesService";
import StoreDetails from "./components/StoreDetails";
import StoreLocation from "./components/StoreLocation";
import StoreSchedule from "./components/StoreSchedule";
import StoreMediaUpload from "./components/StoreMediaUpload";
import StoreReview from "./components/StoreReview";
import "./StoresRegistration.css";

function StoresRegistration() {
  const location = useLocation();
  const navigate = useNavigate();
  const logoInputRef = useRef(null);
  const photosInputRef = useRef(null);
  const cardRef = useRef(null);
  const hasSourceProfile = Boolean(location.state?.profile);
  const [form, setForm] = useState(() => {
    const profile = location.state?.profile;
    return {
      ...createInitialStoreForm(),
      ownerName: profile
        ? `${profile.firstName || ""} ${profile.lastName || ""}`.trim()
        : "",
      email: profile?.email || "",
      phone: profile?.phone || "",
    };
  });
  const [activeStep, setActiveStep] = useState(() =>
    location.state?.profile ? 1 : 0,
  );
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [errors, setErrors] = useState({});
  const [validationAttempted, setValidationAttempted] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [savedStore, setSavedStore] = useState("");
  const [logo, setLogo] = useState(null);
  const [photos, setPhotos] = useState([]);
  const [uploadErrors, setUploadErrors] = useState({});
  const [isEditingDetails, setIsEditingDetails] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (activeStep === 0 && !savedStore) {
      cardRef.current?.scrollTo({ top: 0 });
      window.scrollTo({ top: 0 });
    }
  }, [activeStep, savedStore]);

  const returnToProfile = () => {
    if (hasSourceProfile) {
      navigate("/registration", {
        state: {
          profile: location.state.profile,
          registrationType: "Stores",
        },
      });
      return;
    }
    setActiveStep(0);
  };

  const updateField = (event) => {
    const { name } = event.target;
    const value =
      event.target instanceof HTMLSelectElement && event.target.multiple
        ? Array.from(event.target.selectedOptions, (option) => option.value)
        : name === "postalCode"
          ? event.target.value.replace(/\D/g, "").slice(0, 6)
          : event.target.value;
    const updatedForm = {
      ...form,
      [name]: value,
      ...(name === "category"
        ? { mainCategory: "", subcategory: [] }
        : {}),
      ...(name === "mainCategory" ? { subcategory: [] } : {}),
      ...(name === "businessType" && value !== "Other"
        ? { otherBusinessType: "" }
        : {}),
      ...(name === "addressType" && value !== "Other"
        ? { otherAddressType: "" }
        : {}),
      ...(name === "orderProcessingTime" && value !== "Custom"
        ? { customOrderProcessingTime: "" }
        : {}),
      ...(name === "returnPolicy" && value === "Non-Returnable Products"
        ? { returnWindow: "", customReturnWindow: "" }
        : {}),
      ...(name === "returnWindow" && value !== "Custom"
        ? { customReturnWindow: "" }
        : {}),
      ...(name === "cancellationPolicy" && value !== "Custom Policy"
        ? { customCancellationPolicy: "" }
        : {}),
    };
    setForm(updatedForm);
    if (validationAttempted && activeStep === 3 && isEditingDetails) {
      const updatedErrors = validateStoreForm(updatedForm, true);
      delete updatedErrors.terms;
      setErrors(updatedErrors);
    } else {
      setErrors(
        validationAttempted
          ? getStepErrors(
              activeStep,
              validateStoreForm(updatedForm, agreedToTerms),
            )
          : {
              ...errors,
              [name]: undefined,
            },
      );
    }
    setSubmitError("");
  };

  const updateLocation = (latitude, longitude) => {
    const updatedForm = { ...form, latitude, longitude };
    setForm(updatedForm);
    if (validationAttempted && activeStep === 3 && isEditingDetails) {
      const nextErrors = validateStoreForm(updatedForm, true);
      delete nextErrors.terms;
      setErrors(nextErrors);
    } else {
      setErrors(
        validationAttempted
          ? getStepErrors(
              activeStep,
              validateStoreForm(updatedForm, agreedToTerms),
            )
          : { ...errors, latitude: undefined },
      );
    }
    setSubmitError("");
  };

  const updatePostalLocation = ({ latitude, longitude, city, area }) => {
    const updatedForm = {
      ...form,
      latitude,
      longitude,
      ...(city ? { city } : {}),
      ...(area ? { area } : {}),
    };
    setForm(updatedForm);
    if (validationAttempted && activeStep === 3 && isEditingDetails) {
      const nextErrors = validateStoreForm(updatedForm, true);
      delete nextErrors.terms;
      setErrors(nextErrors);
    } else {
      setErrors(
        validationAttempted
          ? getStepErrors(
              activeStep,
              validateStoreForm(updatedForm, agreedToTerms),
            )
          : { ...errors, latitude: undefined, city: undefined, area: undefined },
      );
    }
    setSubmitError("");
  };

  const updateOpeningHours = (index, changes) => {
    const updatedForm = {
      ...form,
      openingHours: form.openingHours.map((hours, hoursIndex) =>
        hoursIndex === index ? { ...hours, ...changes } : hours,
      ),
    };
    setForm(updatedForm);
    if (validationAttempted && activeStep === 3 && isEditingDetails) {
      const updatedErrors = validateStoreForm(updatedForm, true);
      delete updatedErrors.terms;
      setErrors(updatedErrors);
    } else {
      setErrors(
        validationAttempted
          ? getStepErrors(
              activeStep,
              validateStoreForm(updatedForm, agreedToTerms),
            )
          : { ...errors, openingHours: undefined },
      );
    }
    setSubmitError("");
  };

  const updateOpeningDayPreset = (days, checked) => {
    const selectedDays = new Set(checked ? days : []);
    const updatedForm = {
      ...form,
      openingHours: form.openingHours.map((hours) => ({
        ...hours,
        isOpen: selectedDays.has(hours.day),
      })),
    };
    setForm(updatedForm);
    if (validationAttempted && activeStep === 3 && isEditingDetails) {
      const updatedErrors = validateStoreForm(updatedForm, true);
      delete updatedErrors.terms;
      setErrors(updatedErrors);
    } else {
      setErrors(
        validationAttempted
          ? getStepErrors(
              activeStep,
              validateStoreForm(updatedForm, agreedToTerms),
            )
          : { ...errors, openingHours: undefined },
      );
    }
    setSubmitError("");
  };

  const handleImageChange = async (event, type) => {
    const files = Array.from(event.target.files || []);
    event.target.value = "";
    if (!files.length) return;

    const isLogo = type === "logo";
    const currentPhotos = isLogo ? [] : photos;
    const maxCount = isLogo ? 1 : MAX_STORE_PHOTOS;
    const errorKey = isLogo ? "logo" : "photos";
    if (currentPhotos.length + files.length > maxCount) {
      setUploadErrors((current) => ({
        ...current,
        [errorKey]: `You can upload up to ${maxCount} ${isLogo ? "logo" : "store photos"}.`,
      }));
      return;
    }
    const invalidFile = files.find(
      (file) =>
        !ACCEPTED_IMAGE_TYPES.includes(file.type) || file.size > MAX_IMAGE_SIZE,
    );
    if (invalidFile) {
      setUploadErrors((current) => ({
        ...current,
        [errorKey]: !ACCEPTED_IMAGE_TYPES.includes(invalidFile.type)
          ? "Use a JPG, PNG, or WebP image."
          : "Each image must be 2 MB or smaller.",
      }));
      return;
    }

    try {
      const images = await Promise.all(files.map(readStoreImage));
      if (isLogo) {
        setLogo(images[0]);
      } else {
        setPhotos((current) => [...current, ...images]);
      }
      setUploadErrors((current) => ({ ...current, [errorKey]: undefined }));
      setSubmitError("");
    } catch (error) {
      console.error("Unable to read store registration image.", error);
      setUploadErrors((current) => ({
        ...current,
        [errorKey]: "Unable to read the selected image. Try another file.",
      }));
    }
  };

  const getStepErrors = (step, allErrors) => {
    const fieldsByStep = [
      ["ownerName", "email", "phone"],
      [
        "storeName",
        "category",
        "mainCategory",
        "subcategory",
        "businessType",
        "otherBusinessType",
        "description",
        "address",
        "addressType",
        "otherAddressType",
        "city",
        "area",
        "region",
        "postalCode",
        "latitude",
        "longitude",
        "orderProcessingTime",
        "customOrderProcessingTime",
        "returnPolicy",
        "returnWindow",
        "customReturnWindow",
        "cancellationPolicy",
        "customCancellationPolicy",
        "giftWrapping",
        "openingHours",
      ],
      [],
      ["terms"],
    ];
    return Object.fromEntries(
      Object.entries(allErrors).filter(([field]) =>
        fieldsByStep[step].includes(field),
      ),
    );
  };

  const continueStep = () => {
    if (
      activeStep === 2 &&
      Object.values(uploadErrors).some(Boolean)
    ) {
      setSubmitError("Fix the image upload errors before continuing.");
      document.querySelector(".sr-upload-section")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
      return;
    }

    const allErrors = validateStoreForm(form, agreedToTerms);
    const stepErrors = getStepErrors(activeStep, allErrors);
    setErrors((current) => {
      const nextErrors = { ...current };
      Object.keys(validateStoreForm(form, agreedToTerms)).forEach((field) => {
        delete nextErrors[field];
      });
      return { ...nextErrors, ...stepErrors };
    });
    setValidationAttempted(true);
    const firstInvalidField = Object.keys(stepErrors)[0];
    if (firstInvalidField) {
      document.getElementById(firstInvalidField)?.focus();
      return;
    }
    setActiveStep((current) => Math.min(current + 1, STORE_STEPS.length - 1));
  };

  const selectStep = (step) => {
    if (step <= activeStep) {
      if (step === 0 && activeStep > 0) {
        returnToProfile();
        return;
      }
      setIsEditingDetails(false);
      setActiveStep(step);
      return;
    }
    continueStep();
  };

  const handleTermsChange = (event) => {
    const accepted = event.target.checked;
    setAgreedToTerms(accepted);
    if (validationAttempted) {
      setErrors(getStepErrors(activeStep, validateStoreForm(form, accepted)));
    }
    setSubmitError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitError("");

    if (Object.values(uploadErrors).some(Boolean)) {
      setSubmitError("Fix the image upload errors before saving.");
      setActiveStep(2);
      return;
    }

    const nextErrors = validateStoreForm(form, agreedToTerms);
    setValidationAttempted(true);
    setErrors(nextErrors);
    const firstInvalidField = Object.keys(nextErrors)[0];
    if (firstInvalidField) {
      document.getElementById(firstInvalidField)?.focus();
      return;
    }

    setIsSaving(true);
    try {
      const registration = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        registrationType: "Stores",
        ...Object.fromEntries(
          Object.entries(form).map(([key, value]) => [
            key,
            typeof value === "string" ? value.trim() : value,
          ]),
        ),
        latitude: Number(form.latitude),
        longitude: Number(form.longitude),
        logo,
        photos,
        createdAt: new Date().toISOString(),
      };
      await saveStoreRegistration(registration);
      setSavedStore(form.storeName.trim());
    } catch (error) {
      console.error("Unable to save store registration.", error);
      setSubmitError(
        "Unable to save your store registration to db.json. Make sure the backend server is running, then try again.",
      );
    } finally {
      setIsSaving(false);
    }
  };

  const registerAnotherStore = () => {
    navigate("/registration", {
      state: { registrationType: "Stores" },
    });
  };

  const saveReviewEdits = () => {
    const nextErrors = validateStoreForm(form, true);
    delete nextErrors.terms;
    setErrors(nextErrors);
    setValidationAttempted(true);
    const firstInvalidField = Object.keys(nextErrors)[0];
    if (firstInvalidField) {
      document.getElementById(firstInvalidField)?.focus();
      return;
    }
    if (Object.values(uploadErrors).some(Boolean)) {
      setSubmitError("Fix the image upload errors before saving your details.");
      document.querySelector(".sr-upload-section")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
      return;
    }
    setSubmitError("");
    setIsEditingDetails(false);
    cardRef.current?.scrollTo({ top: 0 });
  };

  return (
    <main className="sr-page">
      <div className="sr-container">
        <div className="sr-layout">
          <RegistrationSidebar
            activeStep={activeStep}
            description="Create your store profile and help more customers discover your business."
            onSelectStep={selectStep}
            steps={STORE_STEPS}
            title="Grow your local business."
            titleId="sr-main-title"
          />

          <section
            ref={cardRef}
            className="sr-card"
            aria-labelledby="sr-form-title"
          >
            {savedStore ? (
              <div className="sr-success" role="status">
                <span className="sr-success-icon" aria-hidden="true">
                  <Check size={28} />
                </span>
                <p className="sr-eyebrow">APPLICATION SAVED</p>
                <h2 id="sr-form-title">Your store is registered</h2>
                <p>
                  <strong>{savedStore}</strong> has been saved in the registration database.
                  You can sign in or register another store.
                </p>
                <Link className="sr-submit" to="/login">
                  Continue to log in <span aria-hidden="true">→</span>
                </Link>
                <button
                  className="sr-another-link"
                  type="button"
                  onClick={registerAnotherStore}
                >
                  Register another store
                </button>
              </div>
            ) : (
              <>
                <div className="sr-card-heading">
                  <p className="sr-eyebrow">
                    STEP {activeStep + 1} OF {STORE_STEPS.length}
                  </p>
                  <h2 id="sr-form-title">{STORE_STEPS[activeStep].title}</h2>
                  <p>{STORE_STEPS[activeStep].description}</p>
                </div>

                <form className="sr-form" onSubmit={handleSubmit} noValidate>
                  {(activeStep === 0 ||
                    (activeStep === 3 && isEditingDetails)) && (
                    <section
                      className="sr-form-section"
                      aria-labelledby="sr-contact"
                    >
                      <div className="sr-section-heading">
                        <div>
                          <h3 id="sr-contact">Primary contact</h3>
                          <p>
                            We’ll use these details to reach you about your
                            store.
                          </p>
                        </div>
                      </div>
                      <div className="sr-fields-grid">
                        <FormField
                          label="Contact person's name *"
                          name="ownerName"
                          error={errors.ownerName}
                        >
                          <input
                            id="ownerName"
                            name="ownerName"
                            value={form.ownerName}
                            onChange={updateField}
                            maxLength={100}
                            autoComplete="name"
                            aria-invalid={Boolean(errors.ownerName)}
                            aria-describedby={
                              errors.ownerName ? "ownerName-error" : undefined
                            }
                            required
                          />
                        </FormField>
                        <FormField
                          label="Email address *"
                          name="email"
                          error={errors.email}
                        >
                          <input
                            id="email"
                            name="email"
                            type="email"
                            value={form.email}
                            onChange={updateField}
                            maxLength={254}
                            autoComplete="email"
                            aria-invalid={Boolean(errors.email)}
                            aria-describedby={
                              errors.email ? "email-error" : undefined
                            }
                            required
                          />
                        </FormField>
                        <FormField
                          label="Phone number *"
                          name="phone"
                          error={errors.phone}
                        >
                          <input
                            id="phone"
                            name="phone"
                            type="tel"
                            value={form.phone}
                            onChange={updateField}
                            maxLength={20}
                            autoComplete="tel"
                            aria-invalid={Boolean(errors.phone)}
                            aria-describedby={
                              errors.phone ? "phone-error" : undefined
                            }
                            required
                          />
                        </FormField>
                      </div>
                    </section>
                  )}

                  {(activeStep === 1 ||
                    (activeStep === 3 && isEditingDetails)) && (
                    <>
                      <StoreDetails form={form} errors={errors} onChange={updateField} />

                      <StoreLocation
                        form={form}
                        errors={errors}
                        onChange={updateField}
                        onLocationChange={updateLocation}
                        onPostalLocationFound={updatePostalLocation}
                      />

                      <StoreSchedule
                        form={form}
                        errors={errors}
                        onHoursChange={updateOpeningHours}
                        onDayPresetChange={updateOpeningDayPreset}
                      />
                    </>
                  )}

                  {(activeStep === 2 ||
                    (activeStep === 3 && isEditingDetails)) && (
                    <StoreMediaUpload logo={logo} photos={photos} logoInputRef={logoInputRef} photosInputRef={photosInputRef} uploadErrors={uploadErrors} onChange={handleImageChange} onRemoveLogo={() => { setLogo(null); setUploadErrors((current) => ({ ...current, logo: undefined })); }} onRemovePhoto={(id) => { setPhotos((current) => current.filter((photo) => photo.id !== id)); setUploadErrors((current) => ({ ...current, photos: undefined })); }} />
                  )}

                  {activeStep === 3 && !isEditingDetails && (
                    <StoreReview
                      form={form}
                      logo={logo}
                      photos={photos}
                      agreedToTerms={agreedToTerms}
                      errors={errors}
                      onTermsChange={handleTermsChange}
                    />
                  )}

                  {activeStep === 3 && isEditingDetails && (
                    <div className="sr-review-editing-note" role="status">
                      Update the fields above, then select Save details to return
                      to your review.
                    </div>
                  )}

                  {submitError && (
                    <p className="sr-submit-error" role="alert">
                      {submitError}
                    </p>
                  )}
                  <div className="sr-step-navigation">
                    {activeStep > 0 && !isEditingDetails && (
                      <button
                        className="sr-step-back"
                        type="button"
                        onClick={() => {
                          if (activeStep === 1) {
                            returnToProfile();
                          } else {
                            setActiveStep((current) => current - 1);
                          }
                        }}
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
                        <button className="sr-submit" type="submit" disabled={isSaving}>
                          {isSaving ? "Saving..." : "Create store profile"}{" "}
                          {!isSaving && <span aria-hidden="true">→</span>}
                        </button>
                      </>
                    ) : activeStep < STORE_STEPS.length - 1 ? (
                      <button
                        className="sr-submit"
                        type="button"
                        onClick={continueStep}
                      >
                        Save and Continue <span aria-hidden="true">→</span>
                      </button>
                    ) : null}
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

export default StoresRegistration;
