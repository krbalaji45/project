import { useEffect, useRef, useState } from "react";
import RegistrationField from "./FormField";

function SubcategoryMultiSelect({
  label,
  name,
  error,
  options,
  selectedOptions,
  disabled,
  onChange,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const allSelected =
    options.length > 0 &&
    options.every((option) => selectedOptions.includes(option));

  useEffect(() => {
    if (!isOpen) return undefined;

    const closeOnOutsideClick = (event) => {
      if (!dropdownRef.current?.contains(event.target)) setIsOpen(false);
    };
    const closeOnEscape = (event) => {
      if (event.key === "Escape") setIsOpen(false);
    };

    document.addEventListener("mousedown", closeOnOutsideClick);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("mousedown", closeOnOutsideClick);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [isOpen]);

  const updateSelection = (option, isSelected) => {
    const nextSelection =
      option === "All"
        ? isSelected
          ? options
          : []
        : isSelected
          ? [...selectedOptions, option]
          : selectedOptions.filter((selected) => selected !== option);

    onChange({ target: { name, value: nextSelection } });
  };

  return (
    <RegistrationField label={label} name={name} error={error}>
      <div className="sr-multiselect" ref={dropdownRef}>
        <button
          id={name}
          className="sr-multiselect-trigger"
          type="button"
          aria-haspopup="true"
          aria-expanded={isOpen}
          aria-invalid={Boolean(error)}
          aria-describedby={`${name}-help${error ? ` ${name}-error` : ""}`}
          disabled={disabled}
          onClick={() => setIsOpen((open) => !open)}
        >
          <span className="sr-multiselect-value">
            {selectedOptions.length
              ? selectedOptions.join(", ")
              : "Select subcategories"}
          </span>
          <span className="sr-multiselect-chevron" aria-hidden="true" />
        </button>
        {isOpen && (
          <div
            className="sr-multiselect-options"
            role="group"
            aria-label={label}
          >
            <label className="sr-multiselect-option">
              <input
                type="checkbox"
                checked={allSelected}
                onChange={(event) =>
                  updateSelection("All", event.target.checked)
                }
              />
              <span>All</span>
            </label>
            {options.map((option) => (
              <label className="sr-multiselect-option" key={option}>
                <input
                  type="checkbox"
                  checked={selectedOptions.includes(option)}
                  onChange={(event) =>
                    updateSelection(option, event.target.checked)
                  }
                />
                <span>{option}</span>
              </label>
            ))}
          </div>
        )}
      </div>
      <span className="sr-field-help" id={`${name}-help`}>
        Select all that apply.
      </span>
    </RegistrationField>
  );
}

export default SubcategoryMultiSelect;
