import { INDIAN_STATES_AND_TERRITORIES } from "../indianStates";

export const OPEN_DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

export const MAX_PHOTOS = 6;
export const MAX_IMAGE_SIZE = 2 * 1024 * 1024;
export const IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

export function hasValidCoordinates(latitude, longitude) {
  const hasValue = (value) =>
    (typeof value === "number" && Number.isFinite(value)) ||
    (typeof value === "string" && value.trim() !== "");
  const parsedLatitude = Number(latitude);
  const parsedLongitude = Number(longitude);
  return (
    hasValue(latitude) &&
    hasValue(longitude) &&
    Number.isFinite(parsedLatitude) &&
    parsedLatitude >= -90 &&
    parsedLatitude <= 90 &&
    Number.isFinite(parsedLongitude) &&
    parsedLongitude >= -180 &&
    parsedLongitude <= 180
  );
}

export function getInclusiveDateCount(startDate, endDate) {
  const isValidDate = (value) => {
    if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
      return false;
    }
    const [year, month, day] = value.split("-").map(Number);
    const date = new Date(Date.UTC(year, month - 1, day));
    return (
      date.getUTCFullYear() === year &&
      date.getUTCMonth() === month - 1 &&
      date.getUTCDate() === day
    );
  };

  if (!isValidDate(startDate) || !isValidDate(endDate) || endDate < startDate) {
    return null;
  }

  const start = new Date(`${startDate}T00:00:00.000Z`).getTime();
  const end = new Date(`${endDate}T00:00:00.000Z`).getTime();
  return (end - start) / 86400000 + 1;
}

export function getDateAfterDays(startDate, days) {
  if (
    typeof startDate !== "string" ||
    !/^\d{4}-\d{2}-\d{2}$/.test(startDate) ||
    !Number.isInteger(Number(days)) ||
    Number(days) < 1
  ) {
    return "";
  }

  const [year, month, day] = startDate.split("-").map(Number);
  const start = new Date(Date.UTC(year, month - 1, day));
  if (
    start.getUTCFullYear() !== year ||
    start.getUTCMonth() !== month - 1 ||
    start.getUTCDate() !== day
  ) {
    return "";
  }

  start.setUTCDate(start.getUTCDate() + Number(days) - 1);
  return start.toISOString().slice(0, 10);
}

export const createInitialForm = (config, profile) => ({
  ownerName: profile
    ? `${profile.firstName || ""} ${profile.lastName || ""}`.trim()
    : "",
  email: profile?.email || "",
  phone: profile?.phone || "",
  [config.nameField]: "",
  ...(config.categoryField ? { [config.categoryField]: "" } : {}),
  ...(config.mainCategoryField ? { [config.mainCategoryField]: "" } : {}),
  ...(config.subcategoryField ? { [config.subcategoryField]: [] } : {}),
  ...(config.providerTypeField ? { [config.providerTypeField]: "" } : {}),
  ...(config.providerTypeOtherField
    ? { [config.providerTypeOtherField]: "" }
    : {}),
  ...(config.extraInitialValues || {}),
  otherCategory: "",
  [config.descriptionField]: "",
  ageRange: "",
  durationMinutes: "",
  [config.capacityField]: "",
  ...(config.minimumParticipantsField
    ? { [config.minimumParticipantsField]: "" }
    : {}),
  facilities: "",
  city: "",
  area: "",
  region: "",
  postalCode: "",
  latitude: "",
  longitude: "",
  ...(config.locationTypeField ? { [config.locationTypeField]: "" } : {}),
  ...(config.locationTypeOtherField
    ? { [config.locationTypeOtherField]: "" }
    : {}),
  ...(config.locationTypeField ? { meetingPoint: "" } : {}),
  ...(config.addressField ? { [config.addressField]: "" } : { address: "" }),
  ...(config.hasWeeklyAvailability === false
    ? {}
    : {
        openingHours: OPEN_DAYS.map((day) => ({
          day,
          isOpen: day !== "Sunday",
          open: "09:00",
          close: "18:00",
        })),
      }),
});

const isValidTime = (value) =>
  typeof value === "string" && /^(?:[01]\d|2[0-3]):[0-5]\d$/.test(value);

const hasInvalidControlCharacters = (value) => {
  for (let index = 0; index < value.length; index += 1) {
    const characterCode = value.charCodeAt(index);
    if (
      (characterCode < 32 && ![9, 10, 13].includes(characterCode)) ||
      characterCode === 127
    ) {
      return true;
    }
  }
  return false;
};

export function validateForm(form, config, agreedToTerms) {
  const errors = {};
  const requiredText = (
    field,
    label,
    min = 2,
    max = 100,
    allowTextWhitespace = false,
  ) => {
    const value = typeof form[field] === "string" ? form[field].trim() : "";
    if (value.length < min || value.length > max) {
      errors[field] =
        `Enter ${label.toLowerCase()} between ${min} and ${max} characters.`;
    } else if (
      hasInvalidControlCharacters(value) ||
      (!allowTextWhitespace && /[\r\n\t]/.test(value))
    ) {
      errors[field] = `${label} contains invalid characters.`;
    }
  };

  requiredText("ownerName", "Contact person's name", 2, 100);
  const ownerName =
    typeof form.ownerName === "string" ? form.ownerName.trim() : "";
  if (ownerName && !/^[\p{L}\p{M}][\p{L}\p{M} '-]*$/u.test(ownerName)) {
    errors.ownerName =
      "Use letters, spaces, apostrophes, or hyphens for the contact name.";
  }
  const email = typeof form.email === "string" ? form.email.trim() : "";
  if (
    email.length > 254 ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email) ||
    email.split("@").length !== 2
  ) {
    errors.email = "Enter a valid email address.";
  }
  const phone = typeof form.phone === "string" ? form.phone.trim() : "";
  const phoneDigits = phone.replace(/\D/g, "");
  if (!/^\+?[\d\s().-]+$/.test(phone) || phoneDigits.length < 7 || phoneDigits.length > 15) {
    errors.phone = "Enter a valid phone number with 7 to 15 digits.";
  }

  requiredText(config.nameField, config.nameLabel);
  if (config.categoryField && config.categories) {
    if (config.categoryHierarchy) {
      const categoryMap = config.categories;
      const mainCategories = categoryMap[form[config.categoryField]];
      if (!mainCategories) {
        errors[config.categoryField] =
          `Choose ${config.categoryLabel.toLowerCase()}.`;
      } else if (
        form[config.mainCategoryField] !== "All" &&
        !Object.hasOwn(mainCategories, form[config.mainCategoryField])
      ) {
        errors[config.mainCategoryField] = "Choose a main category.";
      } else {
        const allowedSubcategories =
          form[config.mainCategoryField] === "All"
            ? Object.values(mainCategories).flat()
            : mainCategories[form[config.mainCategoryField]];
        const selectedSubcategories = form[config.subcategoryField];
        if (
          !Array.isArray(selectedSubcategories) ||
          selectedSubcategories.length === 0 ||
          new Set(selectedSubcategories).size !== selectedSubcategories.length ||
          selectedSubcategories.some(
            (subcategory) => !allowedSubcategories.includes(subcategory),
          )
        ) {
          errors[config.subcategoryField] = "Choose an activity subcategory.";
        }
      }
    } else if (!config.categories.includes(form[config.categoryField])) {
      errors[config.categoryField] =
        `Choose ${config.categoryLabel.toLowerCase()}.`;
    }
    const otherCategoryField = config.categoryOtherField || "otherCategory";
    if (config.categoryOtherField && form[config.categoryField] === "Other") {
      requiredText(otherCategoryField, "Category", 2, 100);
    } else if (
      !config.subcategoryField &&
      form[config.categoryField] === "Other"
    ) {
      requiredText(otherCategoryField, "Category", 2, 100);
    } else if (
      typeof form[otherCategoryField] === "string" &&
      form[otherCategoryField].trim() &&
      form[config.categoryField] !== "Other"
    ) {
      errors[otherCategoryField] =
        "Only specify a category when Other is selected.";
    }
    if (config.subcategoryField && config.subcategories) {
      const subcategories =
        config.subcategories[form[config.categoryField]] || [];
      const selectedSubcategories = form[config.subcategoryField];
      if (
        !Array.isArray(selectedSubcategories) ||
        selectedSubcategories.length === 0 ||
        new Set(selectedSubcategories).size !== selectedSubcategories.length ||
        selectedSubcategories.some(
          (subcategory) => !subcategories.includes(subcategory),
        )
      ) {
        errors[config.subcategoryField] = "Choose a play subcategory.";
      }
    }
  }
  if (
    config.providerTypeField &&
    !config.providerTypes.includes(form[config.providerTypeField])
  ) {
    errors[config.providerTypeField] = "Choose a provider type.";
  }
  if (
    config.providerTypeOtherField &&
    form[config.providerTypeField] === "Other"
  ) {
    requiredText(config.providerTypeOtherField, "Provider type", 2, 100);
  } else if (
    config.providerTypeOtherField &&
    typeof form[config.providerTypeOtherField] === "string" &&
    form[config.providerTypeOtherField].trim()
  ) {
    errors[config.providerTypeOtherField] =
      "Only specify a provider type when Other is selected.";
  }
  requiredText(config.descriptionField, config.descriptionLabel, 10, 500, true);
  if (config.minimumAgeField) {
    const minimumAge = Number(form[config.minimumAgeField]);
    const maximumAge =
      form[config.maximumAgeField] === ""
        ? null
        : Number(form[config.maximumAgeField]);
    if (
      form[config.minimumAgeField] === "" ||
      !Number.isInteger(minimumAge) ||
      minimumAge < 0 ||
      minimumAge > 120
    ) {
      errors[config.minimumAgeField] = "Enter a minimum age from 0 to 120.";
    }
    if (
      maximumAge !== null &&
      (!Number.isInteger(maximumAge) ||
        maximumAge < minimumAge ||
        maximumAge > 120)
    ) {
      errors[config.maximumAgeField] =
        "Maximum age must be a whole number at or above the minimum age.";
    }
  } else if (config.ageRangeRequired !== false) {
    requiredText("ageRange", "Suitable age range", 2, 50);
  }

  if (config.durationField) {
    const duration = Number(form[config.durationField]);
    if (!Number.isInteger(duration) || duration < 1 || duration > 1440) {
      errors[config.durationField] = "Enter a duration from 1 to 1,440 minutes.";
    }
  }
  const capacity = Number(form[config.capacityField]);
  if (!Number.isInteger(capacity) || capacity < 1 || capacity > 10000) {
    errors[config.capacityField] = "Enter a whole number from 1 to 10,000.";
  }
  if (config.minimumParticipantsField) {
    const minimumParticipants = Number(form[config.minimumParticipantsField]);
    if (
      !Number.isInteger(minimumParticipants) ||
      minimumParticipants < 1 ||
      minimumParticipants > capacity
    ) {
      errors[config.minimumParticipantsField] =
        "Enter a minimum from 1 up to the maximum capacity.";
    }
  }
  if (config.facilitiesRequired) {
    requiredText("facilities", "Facilities or play equipment", 2, 500);
  }
  if (
    config.indoorOutdoorField &&
    !config.indoorOutdoorOptions.includes(form[config.indoorOutdoorField])
  ) {
    errors[config.indoorOutdoorField] = "Choose an indoor or outdoor type.";
  }
  if (
    config.adultSupervisionField &&
    !config.adultSupervisionOptions.includes(form[config.adultSupervisionField])
  ) {
    errors[config.adultSupervisionField] = "Choose an adult supervision option.";
  }
  if (config.safetyEquipmentField) {
    const equipment = form[config.safetyEquipmentField];
    if (
      equipment != null &&
      (!Array.isArray(equipment) ||
        equipment.some(
          (item) => !config.safetyEquipmentOptions.includes(item),
        ))
    ) {
      errors[config.safetyEquipmentField] =
        "Choose valid safety equipment options.";
    }
    if (
      config.safetyEquipmentOtherField &&
      Array.isArray(equipment) &&
      equipment.includes("Other")
    ) {
      requiredText(
        config.safetyEquipmentOtherField,
        "Safety equipment",
        2,
        100,
      );
    } else if (
      config.safetyEquipmentOtherField &&
      typeof form[config.safetyEquipmentOtherField] === "string" &&
      form[config.safetyEquipmentOtherField].trim()
    ) {
      errors[config.safetyEquipmentOtherField] =
        "Only specify safety equipment when Other is selected.";
    }
  }
  if (
    config.firstAidField &&
    !config.yesNoOptions.includes(form[config.firstAidField])
  ) {
    errors[config.firstAidField] = "Choose whether a first-aid facility is available.";
  }
  for (const field of config.recommendedSafetyFields || []) {
    if (form[field] && !config.yesNoOptions.includes(form[field])) {
      errors[field] = "Choose Yes or No.";
    }
  }
  if (
    config.parkingField &&
    form[config.parkingField] &&
      !config.parkingOptions.includes(form[config.parkingField])) {
    errors[config.parkingField] = "Choose a parking option.";
  }
  for (const field of config.optionalFacilityFields || []) {
    if (form[field] && !config.yesNoOptions.includes(form[field])) {
      errors[field] = "Choose Yes or No.";
    }
  }
  if (
    config.accessibilityField &&
    form[config.accessibilityField] &&
    !config.accessibilityOptions.includes(form[config.accessibilityField])
  ) {
    errors[config.accessibilityField] = "Choose an accessibility option.";
  }
  if (
    config.accessibilityOtherField &&
    form[config.accessibilityField] === "Other"
  ) {
    requiredText(config.accessibilityOtherField, "Accessibility details", 2, 300);
  }

  requiredText(
    config.addressField || "address",
    config.addressLabel || "Street address",
    5,
    200,
  );
  requiredText("city", "City", 2, 80);
  requiredText("area", "Area", 2, 80);
  if (!hasValidCoordinates(form.latitude, form.longitude)) {
    errors.latitude = "Select a valid location on the map.";
  }
  if (!INDIAN_STATES_AND_TERRITORIES.includes(form.region)) {
    errors.region = "Choose a state or union territory.";
  }
  const postalCode =
    typeof form.postalCode === "string" ? form.postalCode.trim() : "";
  if (
    config.postalCodePattern
      ? !config.postalCodePattern.test(postalCode)
      : !/^\d{6}$/.test(postalCode)
  ) {
    errors.postalCode = "Enter a 6-digit postal or ZIP code.";
  }
  if (
    config.locationTypeField &&
    !config.locationTypes.includes(form[config.locationTypeField])
  ) {
    errors[config.locationTypeField] = "Choose a location type.";
  }
  if (
    config.locationTypeOtherField &&
    form[config.locationTypeField] === "Other"
  ) {
    requiredText(config.locationTypeOtherField, "Location type", 2, 100);
  } else if (
    config.locationTypeOtherField &&
    typeof form[config.locationTypeOtherField] === "string" &&
    form[config.locationTypeOtherField].trim()
  ) {
    errors[config.locationTypeOtherField] =
      "Only specify a location type when Other is selected.";
  }
  if (config.locationTypeField && form.meetingPoint) {
    const meetingPoint =
      typeof form.meetingPoint === "string" ? form.meetingPoint.trim() : "";
    if (meetingPoint.length < 2 || meetingPoint.length > 200) {
      errors.meetingPoint =
        "Enter a meeting point between 2 and 200 characters.";
    }
  }

  if (config.hasWeeklyAvailability !== false) {
    const openingHours = Array.isArray(form.openingHours)
      ? form.openingHours
      : [];
    const validOpeningHours =
      openingHours.length === OPEN_DAYS.length &&
      OPEN_DAYS.every(
        (day) => openingHours.filter((hours) => hours?.day === day).length === 1,
      ) &&
      openingHours.every(
        (hours) =>
          hours &&
          typeof hours.isOpen === "boolean" &&
          (!hours.isOpen ||
            (isValidTime(hours.open) &&
              isValidTime(hours.close) &&
              hours.open !== hours.close)),
      );
    if (!validOpeningHours) {
      errors.openingHours = "Check that every day has valid opening hours.";
    } else if (!openingHours.some((hours) => hours.isOpen)) {
      errors.openingHours = "Choose at least one working day.";
    }
  }
  if (!agreedToTerms) {
    errors.terms = "Please agree to the terms before registering.";
  }
  return errors;
}

export function readImage(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result !== "string") {
        reject(new Error(`Unable to read ${file.name} as an image.`));
        return;
      }
      resolve({
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        name: file.name,
        dataUrl: reader.result,
      });
    };
    reader.onerror = () => reject(new Error(`Unable to read ${file.name}.`));
    reader.readAsDataURL(file);
  });
}
