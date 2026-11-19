export const REGISTRATION_API = "http://localhost:5002";

export async function saveRegistration(collection, registration) {
  const response = await fetch(`${REGISTRATION_API}/${collection}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(registration),
  });
  if (!response.ok) {
    throw new Error(`Registration API returned HTTP ${response.status}.`);
  }
  return response.json();
}
