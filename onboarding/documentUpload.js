export const MAX_DOCUMENT_SIZE = 2 * 1024 * 1024;
export const DOCUMENT_ACCEPT = ".pdf,.jpg,.jpeg,.png";
export const DOCUMENT_FORMATS_LABEL = "Accepted formats: PDF, JPG, JPEG, PNG. Maximum size: 2 MB.";

export const validateDocumentFile = (file) => {
  const extension = file.name.split(".").pop()?.toLowerCase();
  const acceptedExtensions = ["pdf", "jpg", "jpeg", "png"];

  if (!extension || !acceptedExtensions.includes(extension)) {
    return "File format must be PDF, JPG, JPEG, or PNG.";
  }

  if (file.size > MAX_DOCUMENT_SIZE) {
    return "File size must not exceed 2 MB.";
  }

  return "";
};

export const getTodayDate = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

export const isValidDateOfBirth = (value) => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false;
  }

  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(year, month - 1, day);

  return (
    year >= 1900 &&
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day &&
    value <= getTodayDate()
  );
};
