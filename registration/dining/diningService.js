import { DINING_REGISTRATIONS_API } from "./diningConfig";

export const readImage = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error(`Unable to read ${file.name}.`));
    reader.readAsDataURL(file);
  });

export const saveDiningRegistration = async (registration) => {
  const response = await fetch(DINING_REGISTRATIONS_API, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(registration),
  });

  if (!response.ok) {
    throw new Error(`Registration API returned HTTP ${response.status}.`);
  }

  return response.json();
};
