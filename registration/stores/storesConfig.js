export const STORE_REGISTRATIONS_API = "http://localhost:5002/storeRegistrations";

export const OPEN_DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

export const MAX_STORE_PHOTOS = 6;
export const MAX_IMAGE_SIZE = 2 * 1024 * 1024;
export const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

export const STORE_CATEGORY_OPTIONS = {
  "Fashion & Apparel": {
    "Men's Clothing": [
      "T-Shirts",
      "Shirts",
      "Jeans",
      "Trousers",
      "Ethnic Wear",
      "Formal Wear",
    ],
    "Women's Clothing": [
      "Dresses",
      "Tops",
      "Sarees",
      "Kurtis",
      "Ethnic Wear",
      "Western Wear",
    ],
    "Kids' Clothing": ["Boys' Clothing", "Girls' Clothing", "Baby Clothing"],
    Sportswear: ["Sports T-Shirts", "Track Pants", "Activewear"],
  },
  Electronics: {
    "Mobiles & Accessories": ["Smartphones", "Chargers", "Cases", "Earphones"],
    Computers: ["Laptops", "Desktops", "Keyboards", "Mice"],
    "Home Electronics": ["Televisions", "Speakers", "Cameras"],
  },
  "Grocery & Supermarket": {
    "Food & Beverages": ["Snacks", "Beverages", "Packaged Foods"],
    "Fresh Products": ["Fruits", "Vegetables", "Dairy Products"],
  },
  "Beauty & Personal Care": {
    Skincare: ["Face Wash", "Moisturizers", "Sunscreen"],
    Haircare: ["Shampoo", "Conditioner", "Hair Oil"],
  },
  "Home & Furniture": {
    Furniture: ["Sofas", "Beds", "Tables", "Chairs"],
    "Home Decor": ["Wall Decor", "Lighting", "Decorative Items"],
  },
  "Jewellery & Accessories": {
    Jewellery: ["Gold", "Silver", "Fashion Jewellery"],
  },
  Footwear: {
    "Men's Footwear": ["Sneakers", "Formal Shoes", "Sandals"],
    "Women's Footwear": ["Heels", "Flats", "Sandals"],
  },
  "Sports & Fitness": {
    "Fitness Equipment": ["Dumbbells", "Yoga Mats", "Exercise Equipment"],
  },
  "Books & Stationery": {
    Books: ["Educational Books", "Fiction", "Non-Fiction"],
  },
  "Toys & Baby Products": {
    Toys: ["Educational Toys", "Soft Toys", "Outdoor Toys"],
  },
  "Gifts & Lifestyle": {
    Gifts: ["Personalized Gifts", "Gift Sets", "Greeting Cards"],
  },
};

export const STORE_CATEGORIES = Object.keys(STORE_CATEGORY_OPTIONS);
export const ADDRESS_TYPES = [
  "Warehouse",
  "Home-Based Business",
  "Office",
  "Retail Shop",
  "Fulfilment Centre",
  "Other",
];
export const ORDER_PROCESSING_TIMES = [
  "Same Day",
  "1–2 Business Days",
  "3–5 Business Days",
  "Custom",
];
export const RETURN_POLICIES = [
  "Returns Accepted",
  "Exchanges Only",
  "Non-Returnable Products",
  "Category-Specific Policy",
];
export const RETURN_WINDOWS = [
  "3 Days",
  "7 Days",
  "10 Days",
  "15 Days",
  "Custom",
];
export const CANCELLATION_POLICIES = [
  "Before Dispatch",
  "Within a Defined Period",
  "Non-Cancellable After Confirmation",
  "Custom Policy",
];
export const GIFT_WRAPPING_OPTIONS = ["Available", "Not Available"];

export const BUSINESS_TYPES = [
  "Sole proprietorship",
  "Partnership",
  "Limited company",
  "Other",
];

export const STORE_STEPS = [
  {
    title: "Create your profile",
    description: "Tell us who you are and how customers can reach you.",
  },
  {
    title: "Add your store details",
    description: "Describe your store, location, and working days and hours.",
  },
  {
    title: "Show off your space",
    description: "Upload photos to show customers what you offer.",
  },
  {
    title: "Review your details",
    description: "Check your store information before submitting.",
  },
];

export const createInitialStoreForm = () => ({
  storeName: "",
  category: "",
  mainCategory: "",
  subcategory: [],
  businessType: "",
  description: "",
  ownerName: "",
  email: "",
  phone: "",
  address: "",
  city: "",
  area: "",
  region: "",
  postalCode: "",
  latitude: "",
  longitude: "",
  addressType: "",
  otherAddressType: "",
  otherBusinessType: "",
  orderProcessingTime: "",
  customOrderProcessingTime: "",
  returnPolicy: "",
  returnWindow: "",
  customReturnWindow: "",
  cancellationPolicy: "",
  customCancellationPolicy: "",
  giftWrapping: "",
  openingHours: OPEN_DAYS.map((day) => ({
    day,
    isOpen: day !== "Sunday",
    open: "09:00",
    close: "18:00",
  })),
});
