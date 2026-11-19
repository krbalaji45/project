import {
  ADDRESS_TYPES,
  BUSINESS_TYPES,
  CANCELLATION_POLICIES,
  GIFT_WRAPPING_OPTIONS,
  OPEN_DAYS,
  ORDER_PROCESSING_TIMES,
  RETURN_POLICIES,
  RETURN_WINDOWS,
  STORE_CATEGORIES,
  STORE_CATEGORY_OPTIONS,
} from "./storesConfig";
import { INDIAN_STATES_AND_TERRITORIES } from "../shared/indianStates";
import { hasValidCoordinates } from "../shared/utils/formUtils";

export function validateStoreForm(form, agreedToTerms) {
  const errors = {};
  const text = (field) =>
    typeof form[field] === "string" ? form[field].trim() : "";
  const storeName = text("storeName");
  const ownerName = text("ownerName");
  const email = text("email");
  const phone = text("phone");
  const phoneDigits = phone.replace(/\D/g, "");
  const address = text("address");
  const city = text("city");
  const area = text("area");
  const region = text("region");
  const postalCode = text("postalCode");
  const validPersonName = /^[\p{L}\p{M}][\p{L}\p{M}' -]*$/u;
  const hasInvalidControls = (value) => {
    for (let index = 0; index < value.length; index += 1) {
      const characterCode = value.charCodeAt(index);
      if (characterCode < 32 || characterCode === 127) return true;
    }
    return false;
  };
  const validCustomText = (value, min, max) =>
    value.length >= min &&
    value.length <= max &&
    !hasInvalidControls(value);

  if (storeName.length < 2 || storeName.length > 100) {
    errors.storeName = "Enter a store name between 2 and 100 characters.";
  } else if (hasInvalidControls(storeName)) {
    errors.storeName = "Store name contains invalid characters.";
  }
  if (!STORE_CATEGORIES.includes(form.category)) {
    errors.category = "Choose a store category.";
  }
  const mainCategories = STORE_CATEGORY_OPTIONS[form.category] || {};
  const allowedSubcategories =
    form.mainCategory === "All"
      ? [...new Set(Object.values(mainCategories).flat())]
      : mainCategories[form.mainCategory];
  if (
    form.mainCategory !== "All" &&
    !Object.hasOwn(mainCategories, form.mainCategory)
  ) {
    errors.mainCategory = "Choose a main category.";
  } else if (
    !Array.isArray(form.subcategory) ||
    form.subcategory.length === 0 ||
    new Set(form.subcategory).size !== form.subcategory.length ||
    form.subcategory.some(
      (subcategory) => !allowedSubcategories.includes(subcategory),
    )
  ) {
    errors.subcategory = "Choose a subcategory.";
  }
  if (!BUSINESS_TYPES.includes(form.businessType)) {
    errors.businessType = "Choose a business type.";
  } else if (form.businessType === "Other" &&
      !validCustomText(text("otherBusinessType"), 2, 100)) {
    errors.otherBusinessType = "Specify a business type using 2 to 100 characters.";
  }
  if (text("otherBusinessType") && form.businessType !== "Other") {
    errors.otherBusinessType = "Only specify a business type when Other is selected.";
  }
  if (text("description").length > 500 || hasInvalidControls(text("description"))) {
    errors.description = "Keep the description to 500 characters or fewer and remove invalid characters.";
  }
  if (ownerName.length < 2 || ownerName.length > 100 || !validPersonName.test(ownerName)) {
    errors.ownerName = "Enter a valid contact person's name using letters, spaces, apostrophes, or hyphens.";
  }
  if (
    email.length > 254 ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email) ||
    email.split("@").length !== 2
  ) {
    errors.email = "Enter a valid email address.";
  }
  if (
    !/^\+?[\d\s().-]+$/.test(phone) ||
    phoneDigits.length < 7 ||
    phoneDigits.length > 15
  ) {
    errors.phone = "Enter a valid phone number with 7 to 15 digits.";
  }
  if (address.length < 5 || address.length > 200 || hasInvalidControls(address)) {
    errors.address = "Enter a street address between 5 and 200 characters.";
  }
  if (!ADDRESS_TYPES.includes(form.addressType)) {
    errors.addressType = "Choose an address type.";
  } else if (form.addressType === "Other" &&
      !validCustomText(text("otherAddressType"), 2, 100)) {
    errors.otherAddressType = "Specify an address type using 2 to 100 characters.";
  }
  if (text("otherAddressType") && form.addressType !== "Other") {
    errors.otherAddressType = "Only specify an address type when Other is selected.";
  }
  if (city.length < 2 || city.length > 80 || /[<>]/.test(city) || hasInvalidControls(city)) {
    errors.city = "Enter a city between 2 and 80 characters.";
  }
  if (area.length < 2 || area.length > 80 || /[<>]/.test(area) || hasInvalidControls(area)) {
    errors.area = "Enter an area between 2 and 80 characters.";
  }
  if (!INDIAN_STATES_AND_TERRITORIES.includes(region)) {
    errors.region = "Choose a state or union territory.";
  }
  if (!/^\d{6}$/.test(postalCode)) {
    errors.postalCode = "Enter a 6-digit postal or ZIP code.";
  }
  if (!hasValidCoordinates(form.latitude, form.longitude)) {
    errors.latitude = "Select a valid location on the map.";
  }
  if (!ORDER_PROCESSING_TIMES.includes(form.orderProcessingTime)) {
    errors.orderProcessingTime = "Choose an order processing time.";
  } else if (
    form.orderProcessingTime === "Custom" &&
    !validCustomText(text("customOrderProcessingTime"), 2, 100)
  ) {
    errors.customOrderProcessingTime = "Enter your custom processing time.";
  }
  if (!RETURN_POLICIES.includes(form.returnPolicy)) {
    errors.returnPolicy = "Choose a return policy.";
  } else if (form.returnPolicy !== "Non-Returnable Products") {
    if (!RETURN_WINDOWS.includes(form.returnWindow)) {
      errors.returnWindow = "Choose a return window.";
    } else if (
      form.returnWindow === "Custom" &&
      !validCustomText(text("customReturnWindow"), 2, 100)
    ) {
      errors.customReturnWindow = "Enter your custom return window.";
    }
  }
  if (!CANCELLATION_POLICIES.includes(form.cancellationPolicy)) {
    errors.cancellationPolicy = "Choose a cancellation policy.";
  } else if (
    form.cancellationPolicy === "Custom Policy" &&
    !validCustomText(text("customCancellationPolicy"), 2, 300)
  ) {
    errors.customCancellationPolicy =
      "Enter the details of your custom cancellation policy.";
  }
  if (form.giftWrapping && !GIFT_WRAPPING_OPTIONS.includes(form.giftWrapping)) {
    errors.giftWrapping = "Choose a valid gift wrapping option.";
  }
  const validOpeningHours =
    Array.isArray(form.openingHours) &&
    form.openingHours.length === OPEN_DAYS.length &&
    OPEN_DAYS.every(
      (day) =>
        form.openingHours.filter((hours) => hours?.day === day).length === 1,
    ) &&
    form.openingHours.every(
      (hours) =>
        hours &&
        typeof hours.isOpen === "boolean" &&
        (!hours.isOpen ||
          (/^(?:[01]\d|2[0-3]):[0-5]\d$/.test(hours.open) &&
            /^(?:[01]\d|2[0-3]):[0-5]\d$/.test(hours.close) &&
            hours.open !== hours.close)),
    );
  if (
    !validOpeningHours ||
    !form.openingHours.some((hours) => hours?.isOpen)
  ) {
    errors.openingHours = validOpeningHours
      ? "Choose at least one working day."
      : "Check that every working day has valid opening hours.";
  }
  if (!agreedToTerms) {
    errors.terms = "Please agree to the terms before registering.";
  }

  return errors;
}
