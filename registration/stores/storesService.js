import {
  ACCEPTED_IMAGE_TYPES,
  MAX_IMAGE_SIZE,
  STORE_REGISTRATIONS_API,
} from "./storesConfig";

export function readStoreImage(file) {
  if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
    return Promise.reject(new Error("Use a JPG, PNG, or WebP image."));
  }
  if (file.size > MAX_IMAGE_SIZE) {
    return Promise.reject(new Error("Each image must be 2 MB or smaller."));
  }

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

export async function saveStoreRegistration(registration) {
  const response = await fetch(STORE_REGISTRATIONS_API, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(registration),
  });
  if (!response.ok) {
    throw new Error(`Registration API returned HTTP ${response.status}.`);
  }
  return response.json();
}
