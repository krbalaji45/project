import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./DiningRegistration.css";
import DiningRegistrationForm from "./components/DiningRegistrationForm";
import RegistrationIntro from "./components/RegistrationIntro";
import RegistrationSuccess from "./components/RegistrationSuccess";
import { readImage, saveDiningRegistration } from "./diningService";
import {
  ACCEPTED_IMAGE_TYPES,
  MAX_FILE_SIZE,
  MAX_GALLERY_IMAGES,
  MAX_MENU_IMAGES,
  initialForm,
  TABLE_LOCATIONS,
} from "./diningConfig";
import {
  sanitizeFieldInput,
  sanitizeIntegerInput,
} from "./registrationUtils";
import { validateFields } from "./diningValidation";

function DiningRegistration() {
  const location = useLocation();
  const navigate = useNavigate();
  const logoInputRef = useRef(null);
  const galleryInputRef = useRef(null);
  const menuInputRef = useRef(null);
  const [form, setForm] = useState(() =>
    location.state?.profile
      ? { ...initialForm, ...location.state.profile }
      : initialForm,
  );
  const [registrationType, setRegistrationType] = useState(
    () => location.state?.registrationType || "",
  );
  const [activeStep, setActiveStep] = useState(0);
  const [fieldErrors, setFieldErrors] = useState({});
  const [isEditingSummary, setIsEditingSummary] = useState(false);
  const [logo, setLogo] = useState(null);
  const [photos, setPhotos] = useState([]);
  const [menuPhotos, setMenuPhotos] = useState([]);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [uploadErrors, setUploadErrors] = useState({});
  const [submitError, setSubmitError] = useState("");
  const [savedRestaurant, setSavedRestaurant] = useState("");
  const fieldToFocus = useRef("");

  const selectRegistrationType = (type) => {
    setRegistrationType(type);
    setFieldErrors((current) => ({ ...current, registrationType: undefined }));
    setSubmitError("");
  };

  const handleStepSelect = (step) => {
    if (step === activeStep) return;
    if (step > activeStep) {
      handleContinue();
      return;
    }
    setActiveStep(step);
  };

  useEffect(() => {
    if (fieldToFocus.current) {
      document.querySelector(fieldToFocus.current)?.focus();
      fieldToFocus.current = "";
    }
  }, [activeStep]);

  const updateField = (event) => {
    const { name } = event.target;
    const value = sanitizeFieldInput(name, event.target.value);
    const nextForm = {
      ...form,
      [name]: value,
      ...(name === "restaurantType" && value !== "Other"
        ? { restaurantTypeOther: "" }
        : {}),
    };
    setForm(nextForm);
    setFieldErrors((current) => ({
      ...current,
      [name]: undefined,
      ...(name === "restaurantType" && value !== "Other"
        ? { restaurantTypeOther: undefined }
        : {}),
    }));
    setSubmitError("");
  };

  const updateLocation = (latitude, longitude) => {
    setForm((current) => ({ ...current, latitude, longitude }));
    setFieldErrors((current) => ({ ...current, latitude: undefined }));
    setSubmitError("");
  };

  const updatePostalLocation = ({ latitude, longitude, city, area }) => {
    setForm((current) => ({
      ...current,
      latitude,
      longitude,
      ...(city ? { city } : {}),
      ...(area ? { area } : {}),
    }));
    setFieldErrors((current) => ({
      ...current,
      latitude: undefined,
      city: city ? undefined : current.city,
      area: area ? undefined : current.area,
    }));
    setSubmitError("");
  };

  const updateOpeningHours = (index, changes) => {
    const openingHours = form.openingHours.map((hours, hoursIndex) =>
      hoursIndex === index ? { ...hours, ...changes } : hours,
    );
    const nextForm = { ...form, openingHours };
    setForm(nextForm);
    setFieldErrors((current) => ({ ...current, openingHours: undefined }));
  };

  const updateOpeningDayPreset = (days, checked) => {
    const selectedDays = new Set(checked ? days : []);
    const openingHours = form.openingHours.map((hours) => ({
      ...hours,
      isOpen: selectedDays.has(hours.day),
    }));
    const nextForm = { ...form, openingHours };
    setForm(nextForm);
    setFieldErrors((current) => ({ ...current, openingHours: undefined }));
  };

  const updateDiningServices = (event) => {
    const { checked, value } = event.target;
    const diningServices = checked
      ? [...form.diningServices, value]
      : form.diningServices.filter((service) => service !== value);
    const nextForm = { ...form, diningServices };
    setForm(nextForm);
    setFieldErrors((current) => ({ ...current, diningServices: undefined }));
  };

  const updateCuisineTypes = (event) => {
    const { checked, value } = event.target;
    const cuisineTypes = checked
      ? [...form.cuisineTypes, value]
      : form.cuisineTypes.filter((cuisine) => cuisine !== value);
    const nextForm = {
      ...form,
      cuisineTypes,
      ...(value === "Other" && !checked ? { cuisineTypeOther: "" } : {}),
    };
    setForm(nextForm);
    setFieldErrors((current) => ({
      ...current,
      cuisineTypes: undefined,
      ...(value === "Other" && !checked ? { cuisineTypeOther: undefined } : {}),
    }));
    setSubmitError("");
  };

  const updateCustomTableCount = (index, field, value) => {
    const sanitizedValue =
      field === "customSeats" || field === "count"
        ? sanitizeIntegerInput(value)
        : value;
    const customTableCounts = form.customTableCounts.map((table, tableIndex) =>
      tableIndex === index
        ? field === "seats"
          ? { ...table, seats: value, customSeats: "" }
          : { ...table, [field]: sanitizedValue }
        : table,
    );
    const nextForm = { ...form, customTableCounts };
    setForm(nextForm);
    setFieldErrors((current) => ({ ...current, tableCounts: undefined }));
    setSubmitError("");
  };

  const addTableSize = () => {
    const customTableCounts = [
      ...form.customTableCounts,
      {
        seats: "",
        customSeats: "",
        count: "",
        location: "",
        saved: false,
      },
    ];
    const nextForm = { ...form, customTableCounts };
    setForm(nextForm);
    setFieldErrors((current) => ({ ...current, tableCounts: undefined }));
  };

  const saveTableConfiguration = (index) => {
    const table = form.customTableCounts[index];
    const seats = Number(table.seats === "Other" ? table.customSeats : table.seats);
    const count = Number(table.count);
    if (
      !Number.isInteger(seats) ||
      seats < 1 ||
      seats > 1000 ||
      !Number.isInteger(count) ||
      count < 1 ||
      count > 1000 ||
      !TABLE_LOCATIONS.includes(table.location)
    ) {
      setFieldErrors((current) => ({
        ...current,
        tableCounts:
          "Choose a seat size and location, then enter a whole-number table count from 1 to 1,000.",
      }));
      const invalidField =
        table.seats === ""
          ? `customTableSeats${index}`
          : table.seats === "Other" &&
              (!Number.isInteger(seats) || seats < 1 || seats > 1000)
            ? `customTableSeatCount${index}`
            : !Number.isInteger(count) || count < 1 || count > 1000
              ? `customTableCount${index}`
              : `customTableLocation${index}`;
      document.querySelector(`[name="${invalidField}"]`)?.focus();
      return;
    }

    const duplicate = form.customTableCounts.some((other, otherIndex) => {
      if (otherIndex === index || !other.saved) return false;
      const otherSeats = Number(
        other.seats === "Other" ? other.customSeats : other.seats,
      );
      return otherSeats === seats && other.location === table.location;
    });
    if (duplicate) {
      setFieldErrors((current) => ({
        ...current,
        tableCounts: "This table size and location has already been saved.",
      }));
      document
        .querySelector(`[name="customTableLocation${index}"]`)
        ?.focus();
      return;
    }

    const customTableCounts = form.customTableCounts.map((item, itemIndex) =>
      itemIndex === index ? { ...item, saved: true } : item,
    );
    setForm({ ...form, customTableCounts });
    setFieldErrors((current) => ({ ...current, tableCounts: undefined }));
  };

  const editTableConfiguration = (index) => {
    const customTableCounts = form.customTableCounts.map((table, itemIndex) =>
      itemIndex === index ? { ...table, saved: false } : table,
    );
    setForm({ ...form, customTableCounts });
  };

  const removeTableSize = (index) => {
    const customTableCounts = form.customTableCounts.filter(
      (_, tableIndex) => tableIndex !== index,
    );
    const nextForm = { ...form, customTableCounts };
    setForm(nextForm);
    setFieldErrors((current) => ({ ...current, tableCounts: undefined }));
  };

  const handleContinue = () => {
    const stepFields =
      activeStep === 0
        ? ["registrationType", "firstName", "lastName", "phone", "email"]
        : activeStep === 1
          ? [
            "restaurantName",
            "restaurantType",
            "restaurantTypeOther",
            "businessDescription",
            "cuisineTypes",
            "cuisineTypeOther",
            "foodPreference",
            "diningServices",
            "address",
            "city",
            "region",
            "postalCode",
            "airConditioning",
            "tableBookingCharge",
            "tableCounts",
            "openingHours",
          ]
          : [];
    const errors = validateFields(form, agreedToTerms);
    if (activeStep === 0 && !registrationType) {
      errors.registrationType = "Choose what you would like to register.";
    }
    const stepErrors = Object.fromEntries(
      Object.entries(errors).filter(([field]) => stepFields.includes(field)),
    );
    setFieldErrors((current) => {
      const nextErrors = { ...current };
      stepFields.forEach((field) => {
        delete nextErrors[field];
      });
      return { ...nextErrors, ...stepErrors };
    });
    const firstInvalidField = Object.keys(stepErrors)[0];
    if (firstInvalidField) {
      const pendingTableIndex = form.customTableCounts.findIndex(
        (table) => !table.saved,
      );
      const focusSelector =
        firstInvalidField !== "tableCounts"
          ? firstInvalidField === "registrationType"
            ? '[name="registrationType"]'
            : `[name="${firstInvalidField}"]`
          : pendingTableIndex >= 0
            ? `[name="customTableSeats${pendingTableIndex}"]`
            : form.customTableCounts.length
              ? ".dr-saved-table button"
              : ".dr-add-table";
      document.querySelector(focusSelector)?.focus();
      return;
    }
    if (activeStep === 0 && registrationType === "Stores") {
      navigate("/registration/storesregistration", {
        state: { profile: form },
      });
      return;
    }
    if (activeStep === 0 && registrationType === "Events") {
      navigate("/registration/eventsregistration", {
        state: { profile: form },
      });
      return;
    }
    if (
      activeStep === 0 &&
      (registrationType === "Activities" || registrationType === "Play")
    ) {
      navigate(
        registrationType === "Activities"
          ? "/registration/activitiesregistration"
          : "/registration/playregistration",
        { state: { profile: form } },
      );
      return;
    }
    if (activeStep === 2 && Object.values(uploadErrors).some(Boolean)) {
      setSubmitError(
        "Fix the image upload errors or remove the invalid files before continuing.",
      );
      document.querySelector(".dr-upload-section")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
      return;
    }
    setSubmitError("");
    setActiveStep(activeStep + 1);
  };

  const clearUploadError = (kind) => {
    setUploadErrors((current) => ({ ...current, [kind]: "" }));
  };

  const addLogo = async (file) => {
    if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
      setUploadErrors((current) => ({
        ...current,
        logo: "Choose a JPG, PNG, or WebP image.",
      }));
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      setUploadErrors((current) => ({
        ...current,
        logo: "Each image must be 2 MB or smaller.",
      }));
      return;
    }
    try {
      const image = {
        id: `${Date.now()}-${Math.random()}`,
        name: file.name,
        size: file.size,
        dataUrl: await readImage(file),
      };
      setLogo(image);
      clearUploadError("logo");
    } catch (error) {
      setUploadErrors((current) => ({ ...current, logo: error.message }));
    }
  };

  const handleFileChange = async (event, kind) => {
    const files = Array.from(event.target.files ?? []);
    event.target.value = "";
    if (kind === "logo") {
      if (files[0]) await addLogo(files[0]);
      return;
    }

    const photoCollections = {
      photo: {
        currentPhotos: photos,
        setPhotos,
        maxImages: MAX_GALLERY_IMAGES,
        photoLabel: "restaurant",
      },
      menu: {
        currentPhotos: menuPhotos,
        setPhotos: setMenuPhotos,
        maxImages: MAX_MENU_IMAGES,
        photoLabel: "menu",
      },
    };
    const collection = photoCollections[kind];
    const { currentPhotos, setPhotos: setSelectedPhotos, maxImages, photoLabel } =
      collection;
    const newPhotos = [];
    let errorMessage = "";
    for (const file of files) {
      if (currentPhotos.length + newPhotos.length >= maxImages) {
        errorMessage = `You can add up to ${maxImages} ${photoLabel} photos.`;
        break;
      }
      if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
        errorMessage = `Choose JPG, PNG, or WebP ${photoLabel} photos.`;
        continue;
      }
      if (file.size > MAX_FILE_SIZE) {
        errorMessage = "Each image must be 2 MB or smaller.";
        continue;
      }
      try {
        newPhotos.push({
          id: `${Date.now()}-${Math.random()}`,
          name: file.name,
          size: file.size,
          dataUrl: await readImage(file),
        });
      } catch (error) {
        errorMessage = error.message;
      }
    }
    if (newPhotos.length) {
      setSelectedPhotos((current) => [...current, ...newPhotos]);
    }
    setUploadErrors((current) => ({ ...current, [kind]: errorMessage }));
  };

  const removePhoto = (photoId) => {
    setPhotos((current) => current.filter((photo) => photo.id !== photoId));
    clearUploadError("photo");
  };

  const removeMenuPhoto = (photoId) => {
    setMenuPhotos((current) => current.filter((photo) => photo.id !== photoId));
    clearUploadError("menu");
  };

  const handleTermsChange = (accepted) => {
    setAgreedToTerms(accepted);
    setFieldErrors((current) => ({ ...current, terms: undefined }));
    setSubmitError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitError("");

    const errors = validateFields(form, agreedToTerms);
    if (!registrationType) {
      errors.registrationType = "Choose what you would like to register.";
    }
    setFieldErrors(errors);
    const firstInvalidField = Object.keys(errors)[0];
    if (firstInvalidField) {
      const fieldSteps = {
        registrationType: 0,
        firstName: 0,
        lastName: 0,
        phone: 0,
        email: 0,
        restaurantName: 1,
        restaurantType: 1,
        restaurantTypeOther: 1,
        cuisineTypes: 1,
        foodPreference: 1,
        diningServices: 1,
        businessDescription: 1,
        city: 1,
        address: 1,
        latitude: 1,
        longitude: 1,
        tableCounts: 1,
        openingHours: 1,
        terms: 3,
      };
      const invalidStep = fieldSteps[firstInvalidField] ?? 0;
      const pendingTableIndex = form.customTableCounts.findIndex(
        (table) => !table.saved,
      );
      const invalidInputSelector =
        firstInvalidField === "tableCounts"
          ? pendingTableIndex >= 0
            ? `[name="customTableSeats${pendingTableIndex}"]`
            : form.customTableCounts.length
              ? ".dr-saved-table button"
              : ".dr-add-table"
          : `[name="${firstInvalidField}"]`;
      if (invalidStep === activeStep) {
        document.querySelector(invalidInputSelector)?.focus();
      } else {
        fieldToFocus.current = invalidInputSelector;
        setActiveStep(invalidStep);
      }
      return;
    }
    if (Object.values(uploadErrors).some(Boolean)) {
      setSubmitError(
        "Fix the image upload errors or remove the invalid files before saving.",
      );
      document.querySelector(".dr-upload-section")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
      return;
    }

    try {
      const registration = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        registrationType,
        ...form,
        latitude: Number(form.latitude),
        longitude: Number(form.longitude),
        customTableCounts: form.customTableCounts.map(
          ({ saved: _saved, ...table }) => table,
        ),
        ownerName: `${form.firstName.trim()} ${form.lastName.trim()}`,
        seatingCapacity:
          form.customTableCounts.reduce(
            (total, table) =>
              total +
              Number(
                table.seats === "Other"
                  ? table.customSeats || 0
                  : table.seats || 0,
              ) * Number(table.count || 0),
            0,
          ),
        logo,
        photos,
        menuPhotos,
        termsAccepted: agreedToTerms,
        createdAt: new Date().toISOString(),
      };
      await saveDiningRegistration(registration);
      setSavedRestaurant(form.restaurantName);
    } catch (error) {
      console.error("Unable to save dining registration.", error);
      setSubmitError(
        "Unable to save your registration to db.json. Make sure the backend server is running, then try again.",
      );
    }
  };

  const startAnotherRegistration = () => {
    setForm(initialForm);
    setRegistrationType("");
    setActiveStep(0);
    setFieldErrors({});
    setIsEditingSummary(false);
    setLogo(null);
    setPhotos([]);
    setMenuPhotos([]);
    setAgreedToTerms(false);
    fieldToFocus.current = "";
    setSavedRestaurant("");
    setUploadErrors({});
    setSubmitError("");
  };

  return (
    <main className="dining-registration-page">
      <div className="dr-container">
        <div className="dr-layout">
          <RegistrationIntro
            activeStep={activeStep}
            onSelectStep={handleStepSelect}
          />
          <section
            className="dr-card"
            aria-labelledby="dr-form-title"
          >
            {savedRestaurant ? (
              <RegistrationSuccess
                businessName={savedRestaurant}
                registrationType={registrationType}
                onRegisterAnother={startAnotherRegistration}
              />
            ) : (
              <DiningRegistrationForm
                activeStep={activeStep}
                registrationType={registrationType}
                onRegistrationTypeChange={selectRegistrationType}
                onSelectStep={handleStepSelect}
                form={form}
                fieldErrors={fieldErrors}
                onFieldChange={updateField}
                onLocationChange={updateLocation}
                onPostalLocationFound={updatePostalLocation}
                onCuisineTypesChange={updateCuisineTypes}
                onDiningServicesChange={updateDiningServices}
                onOpeningHoursChange={updateOpeningHours}
                onOpeningDayPresetChange={updateOpeningDayPreset}
                onCustomTableCountChange={updateCustomTableCount}
                onAddTableSize={addTableSize}
                onRemoveTableSize={removeTableSize}
                onSaveTable={saveTableConfiguration}
                onEditTable={editTableConfiguration}
                logo={logo}
                photos={photos}
                menuPhotos={menuPhotos}
                logoInputRef={logoInputRef}
                galleryInputRef={galleryInputRef}
                menuInputRef={menuInputRef}
                onFileChange={handleFileChange}
                onRemoveLogo={() => {
                  setLogo(null);
                  clearUploadError("logo");
                }}
                onRemovePhoto={removePhoto}
                onRemoveMenuPhoto={removeMenuPhoto}
                uploadErrors={uploadErrors}
                agreedToTerms={agreedToTerms}
                onTermsChange={handleTermsChange}
                isEditingSummary={isEditingSummary}
                onEditSummary={() => setIsEditingSummary(true)}
                onSaveSummaryEdits={() => setIsEditingSummary(false)}
                submitError={submitError}
                onSubmit={handleSubmit}
                onContinue={handleContinue}
              />
            )}
          </section>
        </div>
      </div>
    </main>
  );
}

export default DiningRegistration;
