import {
  OPENING_DAYS,
  TABLE_LOCATIONS,
  TABLE_SEAT_OPTIONS,
} from "./diningConfig";
import { INDIAN_STATES_AND_TERRITORIES } from "../shared/indianStates";
import { hasValidCoordinates } from "../shared/utils/formUtils";

const hasControlCharacters = (value, allowTextWhitespace = false) => {
  for (let index = 0; index < value.length; index += 1) {
    const characterCode = value.charCodeAt(index);
    if (
      (characterCode < 32 || characterCode === 127) &&
      !(allowTextWhitespace && [9, 10, 13].includes(characterCode))
    ) {
      return true;
    }
  }
  return false;
};

export const validateFields = (form, agreedToTerms) => {
  const errors = {};
  const restaurantName =
    typeof form.restaurantName === "string" ? form.restaurantName.trim() : "";
  const firstName =
    typeof form.firstName === "string" ? form.firstName.trim() : "";
  const lastName = typeof form.lastName === "string" ? form.lastName.trim() : "";
  const city = typeof form.city === "string" ? form.city.trim() : "";
  const area = typeof form.area === "string" ? form.area.trim() : "";
  const address = typeof form.address === "string" ? form.address.trim() : "";
  const region = typeof form.region === "string" ? form.region.trim() : "";
  const postalCode =
    typeof form.postalCode === "string" ? form.postalCode.trim() : "";
  const phone = typeof form.phone === "string" ? form.phone.trim() : "";
  const phoneDigits = phone.replace(/\D/g, "");
  const email = typeof form.email === "string" ? form.email.trim() : "";
  const businessDescription =
    typeof form.businessDescription === "string"
      ? form.businessDescription
      : "";
  const restaurantTypeOther =
    typeof form.restaurantTypeOther === "string"
      ? form.restaurantTypeOther.trim()
      : "";
  const validRestaurantTypes = [
    "Casual Dining",
    "Fine Dining",
    "Cafe",
    "Bakery",
    "Fast Casual",
    "Food Truck",
    "Other",
  ];

  if (!restaurantName) {
    errors.restaurantName = "Enter your restaurant name.";
  } else if (restaurantName.length < 2 || restaurantName.length > 100) {
    errors.restaurantName = "Enter a restaurant name between 2 and 100 characters.";
  }
  if (hasControlCharacters(restaurantName)) {
    errors.restaurantName = "Restaurant name contains invalid characters.";
  }
  if (!firstName) {
    errors.firstName = "Enter your first name.";
  } else if (firstName.length > 50) {
    errors.firstName = "First name must be 50 characters or fewer.";
  } else if (!/^[\p{L}\p{M} ]+$/u.test(firstName)) {
    errors.firstName = "Use letters and spaces only.";
  } else if (hasControlCharacters(firstName)) {
    errors.firstName = "First name contains invalid characters.";
  }
  if (!lastName) {
    errors.lastName = "Enter your last name.";
  } else if (lastName.length > 50) {
    errors.lastName = "Last name must be 50 characters or fewer.";
  } else if (!/^[\p{L}\p{M} ]+$/u.test(lastName)) {
    errors.lastName = "Use letters and spaces only.";
  } else if (hasControlCharacters(lastName)) {
    errors.lastName = "Last name contains invalid characters.";
  }
  if (!phone) {
    errors.phone = "Enter your phone number.";
  } else if (
    !/^\+?[\d\s().-]+$/.test(phone) ||
    phoneDigits.length < 7 ||
    phoneDigits.length > 15
  ) {
    errors.phone = "Enter a valid phone number with 7 to 15 digits.";
  }
  if (!email) {
    errors.email = "Enter your email address.";
  } else if (
    email.length > 254 ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email) ||
    email.split("@").length !== 2
  ) {
    errors.email = "Enter a valid email address.";
  }
  if (!validRestaurantTypes.includes(form.restaurantType)) {
    errors.restaurantType = "Choose a restaurant type.";
  }
  if (
    form.restaurantType === "Other" &&
    (restaurantTypeOther.length < 2 || restaurantTypeOther.length > 100)
  ) {
    errors.restaurantTypeOther =
      "Describe the restaurant type using 2 to 100 characters.";
  }
  if (hasControlCharacters(restaurantTypeOther)) {
    errors.restaurantTypeOther = "Restaurant type contains invalid characters.";
  }
  if (restaurantTypeOther && form.restaurantType !== "Other") {
    errors.restaurantTypeOther =
      "Only specify a restaurant type when Other is selected.";
  }
  if (
    businessDescription.trim().length > 500 ||
    hasControlCharacters(businessDescription, true)
  ) {
    errors.businessDescription =
      "Keep the business description to 500 characters or fewer and omit invalid characters.";
  }
  const validCuisineTypes = [
    "South Indian",
    "North Indian",
    "Chinese",
    "Continental",
    "Italian",
    "Mexican",
    "Multi-cuisine",
    "Other",
  ];
  if (
    !Array.isArray(form.cuisineTypes) ||
    form.cuisineTypes.length === 0 ||
    new Set(form.cuisineTypes).size !== form.cuisineTypes.length ||
    form.cuisineTypes.some((cuisine) => !validCuisineTypes.includes(cuisine))
  ) {
    errors.cuisineTypes = "Choose at least one cuisine type.";
  }
  const cuisineTypeOther =
    typeof form.cuisineTypeOther === "string"
      ? form.cuisineTypeOther.trim()
      : "";
  if (
    Array.isArray(form.cuisineTypes) &&
    form.cuisineTypes.includes("Other") &&
    (cuisineTypeOther.length < 2 || cuisineTypeOther.length > 100)
  ) {
    errors.cuisineTypeOther =
      "Describe the cuisine type using 2 to 100 characters.";
  } else if (cuisineTypeOther && !form.cuisineTypes?.includes("Other")) {
    errors.cuisineTypeOther = "Only specify a cuisine type when Other is selected.";
  }
  if (hasControlCharacters(cuisineTypeOther)) {
    errors.cuisineTypeOther = "Cuisine type contains invalid characters.";
  }
  if (!["Veg", "Non-Veg", "Both"].includes(form.foodPreference)) {
    errors.foodPreference = "Choose a food preference.";
  }
  const validDiningServices = ["Dine-in", "Takeaway", "Catering"];
  if (
    !Array.isArray(form.diningServices) ||
    form.diningServices.length === 0 ||
    new Set(form.diningServices).size !== form.diningServices.length ||
    form.diningServices.some((service) => !validDiningServices.includes(service))
  ) {
    errors.diningServices = "Choose at least one dining service.";
  }
  if (!city) {
    errors.city = "Enter your city.";
  } else if (city.length < 2 || city.length > 80) {
    errors.city = "Enter a city between 2 and 80 characters.";
  }
  if (!area) {
    errors.area = "Enter your area.";
  } else if (area.length < 2 || area.length > 80) {
    errors.area = "Enter an area between 2 and 80 characters.";
  } else if (hasControlCharacters(area)) {
    errors.area = "Area contains invalid characters.";
  }
  if (hasControlCharacters(city)) {
    errors.city = "City contains invalid characters.";
  }
  if (!address) {
    errors.address = "Enter your restaurant address.";
  } else if (address.length < 5 || address.length > 200) {
    errors.address = "Enter a full street address between 5 and 200 characters.";
  }
  if (hasControlCharacters(address)) {
    errors.address = "Address contains invalid characters.";
  }
  if (!INDIAN_STATES_AND_TERRITORIES.includes(region)) {
    errors.region = "Choose a state or union territory.";
  }
  if (!/^\d{6}$/.test(postalCode)) {
    errors.postalCode = "Enter a 6-digit PIN code.";
  }
  if (!hasValidCoordinates(form.latitude, form.longitude)) {
    errors.latitude = "Select a valid location on the map.";
  }
  if (!["AC", "Non-AC", "Both"].includes(form.airConditioning)) {
    errors.airConditioning = "Choose AC, Non-AC, or Both.";
  }
  const tableBookingCharge =
    typeof form.tableBookingCharge === "string"
      ? form.tableBookingCharge.trim()
      : "";
  const tableBookingChargeAmount = Number(tableBookingCharge);
  if (
    !/^\d+(?:\.\d{1,2})?$/.test(tableBookingCharge) ||
    !Number.isFinite(tableBookingChargeAmount) ||
    tableBookingChargeAmount < 0
  ) {
    errors.tableBookingCharge =
      "Enter a non-refundable booking charge of ₹0 or more with up to 2 decimal places.";
  }
  const customTableCounts = Array.isArray(form.customTableCounts)
    ? form.customTableCounts
    : [];
  const invalidCustomTableCounts =
    !Array.isArray(form.customTableCounts) ||
    customTableCounts.length === 0 ||
    customTableCounts.some(
      (table) => {
        if (!table || typeof table !== "object") return true;
        const seats = Number(
          table.seats === "Other" ? table.customSeats : table.seats,
        );
        const count = Number(table.count);
        return (
          !table.saved ||
          !TABLE_SEAT_OPTIONS.includes(table.seats) ||
          !Number.isInteger(seats) ||
          seats < 1 ||
          seats > 1000 ||
          !Number.isInteger(count) ||
          count < 1 ||
          count > 1000 ||
          !TABLE_LOCATIONS.includes(table.location)
        );
      },
    );
  const tableConfigurations = new Set();
  const hasDuplicateTableConfigurations = customTableCounts.some((table) => {
    if (!table || typeof table !== "object" || !table.saved) return false;
    const seats = Number(
      table.seats === "Other" ? table.customSeats : table.seats,
    );
    const configuration = `${seats}:${table.location}`;
    if (tableConfigurations.has(configuration)) return true;
    tableConfigurations.add(configuration);
    return false;
  });
  const seatingCapacity =
    customTableCounts.reduce(
      (total, table) => {
        if (!table || typeof table !== "object") return total;
        return (
        total +
        Number(table.seats === "Other" ? table.customSeats || 0 : table.seats || 0) *
          Number(table.count || 0)
        );
      },
      0,
    );
  if (
    invalidCustomTableCounts ||
    hasDuplicateTableConfigurations ||
    seatingCapacity < 1 ||
    seatingCapacity > 10000
  ) {
    errors.tableCounts =
      "Add valid table configurations. Table sizes and counts must be whole numbers, and each size/location combination can only be added once.";
  }
  const validOpeningHours =
    Array.isArray(form.openingHours) &&
    form.openingHours.length === OPENING_DAYS.length &&
    form.openingHours.every((hours) => hours && typeof hours === "object") &&
    OPENING_DAYS.every(
      (day) =>
        form.openingHours.filter((hours) => hours.day === day).length === 1,
    ) &&
    form.openingHours.every(
      (hours) =>
        OPENING_DAYS.includes(hours.day) &&
        typeof hours.isOpen === "boolean" &&
        (!hours.isOpen ||
          (typeof hours.open === "string" &&
            typeof hours.close === "string" &&
            /^(?:[01]\d|2[0-3]):[0-5]\d$/.test(hours.open) &&
            /^(?:[01]\d|2[0-3]):[0-5]\d$/.test(hours.close) &&
            hours.open !== hours.close)),
    );
  const openDays = Array.isArray(form.openingHours)
    ? form.openingHours.filter((hours) => hours?.isOpen)
    : [];
  if (!validOpeningHours) {
    errors.openingHours = "Check that every day has valid opening hours.";
  } else if (openDays.length === 0) {
    errors.openingHours = "Choose at least one day that your restaurant is open.";
  }
  if (!agreedToTerms) {
    errors.terms = "Please agree to the terms before registering.";
  }
  return errors;
};
