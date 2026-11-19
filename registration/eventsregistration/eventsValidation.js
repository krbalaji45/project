import eventsRegistrationConfig from "./eventsConfig";
import {
  getInclusiveDateCount,
  validateForm,
} from "../shared/utils/formUtils";

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

export const validateEventRegistration = (form, agreedToTerms) => {
  const errors = validateForm(form, eventsRegistrationConfig, agreedToTerms);
  const eventCategories = form.eventCategories;
  if (!Array.isArray(eventCategories) || eventCategories.length === 0) {
    errors.eventCategories = "Add at least one event category.";
  } else if (
    eventCategories.some((category) => {
      if (
        typeof category.name !== "string" ||
        category.name.trim().length < 2 ||
        category.name.trim().length > 100
      ) {
        return true;
      }
      const price = String(category.pricePerPerson ?? "").trim();
      const priceAmount = Number(price);
      const capacity = Number(category.capacity);
      return (
        !/^\d+(?:\.\d{1,2})?$/.test(price) ||
        !Number.isFinite(priceAmount) ||
        priceAmount < 0 ||
        !Number.isInteger(capacity) ||
        capacity < 1 ||
        capacity > 10000
      );
    })
  ) {
    errors.eventCategories = "Check each category, price per person, and capacity.";
  } else {
    const categoryCapacityTotal = eventCategories.reduce(
      (total, category) => total + Number(category.capacity),
      0,
    );
    if (
      Number.isInteger(Number(form.capacity)) &&
      categoryCapacityTotal > Number(form.capacity)
    ) {
      errors.capacity =
        "Total event capacity must be at least the sum of category capacities.";
    }
  }
  if (!isValidDate(form.scheduleStartDate)) {
    errors.scheduleStartDate = "Enter a valid event start date.";
  }
  if (!isValidDate(form.scheduleEndDate)) {
    errors.scheduleEndDate = "Enter a valid event end date.";
  } else if (
    isValidDate(form.scheduleStartDate) &&
    form.scheduleEndDate < form.scheduleStartDate
  ) {
    errors.scheduleEndDate = "End date must be on or after the start date.";
  }
  const totalDays = getInclusiveDateCount(
    form.scheduleStartDate,
    form.scheduleEndDate,
  );
  if (!Number.isInteger(Number(form.totalDays)) || Number(form.totalDays) < 1) {
    errors.totalDays = "Enter a whole number of event days greater than zero.";
  } else if (totalDays !== null && Number(form.totalDays) !== totalDays) {
    errors.totalDays = "Total days must match the selected event dates.";
  }
  if (!/^(?:[01]\d|2[0-3]):[0-5]\d$/.test(form.startTime)) {
    errors.startTime = "Enter a valid event start time.";
  }
  if (!/^(?:[01]\d|2[0-3]):[0-5]\d$/.test(form.endTime)) {
    errors.endTime = "Enter a valid event end time.";
  } else if (
    form.scheduleStartDate === form.scheduleEndDate &&
    form.startTime &&
    form.endTime <= form.startTime
  ) {
    errors.endTime = "End time must be after the start time.";
  }
  return errors;
};
