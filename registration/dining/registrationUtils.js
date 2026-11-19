const inputSanitizers = {
  firstName: (value) =>
    value.replace(/[^\p{L}\p{M} ]/gu, "").slice(0, 50),
  lastName: (value) =>
    value.replace(/[^\p{L}\p{M} ]/gu, "").slice(0, 50),
  phone: (value) => {
    const digits = value.replace(/\D/g, "").slice(0, 15);
    return `${value.trimStart().startsWith("+") ? "+" : ""}${digits}`;
  },
  email: (value) => value.replace(/\s/g, "").slice(0, 254),
  restaurantName: (value) =>
    value.replace(/[^\p{L}\p{M}\d '&.,()-]/gu, "").slice(0, 100),
  restaurantTypeOther: (value) =>
    value.replace(/[^\p{L}\p{M}\d '&.,()-]/gu, "").slice(0, 100),
  businessDescription: (value) =>
    Array.from(value)
      .filter((character) => {
        const codePoint = character.codePointAt(0);
        return !(
          (codePoint < 32 && ![9, 10, 13].includes(codePoint)) ||
          codePoint === 127
        );
      })
      .join("")
      .slice(0, 500),
  city: (value) =>
    value.replace(/[^\p{L}\p{M} .'-]/gu, "").slice(0, 80),
  address: (value) =>
    value.replace(/[^\p{L}\p{M}\d #\x2f.,'&()-]/gu, "").slice(0, 200),
  postalCode: (value) => value.replace(/\D/g, "").slice(0, 6),
};

export const sanitizeFieldInput = (name, value) =>
  inputSanitizers[name] ? inputSanitizers[name](value) : value;

export const sanitizeIntegerInput = (value, maxDigits = 4) =>
  value.replace(/\D/g, "").slice(0, maxDigits);
