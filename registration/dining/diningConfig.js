export const DINING_REGISTRATIONS_API =
  "http://localhost:5002/diningRegistrations";
export const MAX_FILE_SIZE = 2 * 1024 * 1024;
export const MAX_GALLERY_IMAGES = 5;
export const MAX_MENU_IMAGES = 5;
export const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

export const OPENING_DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

export const TABLE_LOCATIONS = [
  "Indoor",
  "Outdoor",
  "Rooftop",
  "Beach view",
  "Poolside",
  "Garden",
  "Terrace",
  "Banquet hall",
  "Private dining room",
  "Lounge / bar",
];

export const TABLE_SEAT_OPTIONS = [
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "8",
  "10",
  "12",
  "14",
  "16",
  "20",
  "Other",
];

export const initialForm = {
  restaurantName: "",
  firstName: "",
  lastName: "",
  phone: "",
  email: "",
  restaurantType: "Casual Dining",
  restaurantTypeOther: "",
  businessDescription: "",
  cuisineTypes: [],
  cuisineTypeOther: "",
  foodPreference: "",
  diningServices: [],
  city: "",
  area: "",
  address: "",
  region: "",
  postalCode: "",
  latitude: "",
  longitude: "",
  airConditioning: "",
  tableBookingCharge: "",
  customTableCounts: [],
  openingHours: OPENING_DAYS.map((day) => ({
    day,
    isOpen: day !== "Sunday",
    open: "09:00",
    close: "22:00",
  })),
};
