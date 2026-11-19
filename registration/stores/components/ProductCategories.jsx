import { useEffect, useRef, useState } from "react";
import FormField from "../../shared/components/FormField";
import { STORE_CATEGORIES, STORE_CATEGORY_OPTIONS } from "../storesConfig";

function ProductCategories({ form, errors, onChange }) {
  const [isSubcategoryOpen, setIsSubcategoryOpen] = useState(false);
  const subcategoryDropdownRef = useRef(null);
  const mainCategories = form.category
    ? ["All", ...Object.keys(STORE_CATEGORY_OPTIONS[form.category])]
    : [];
  const subcategories =
    form.category && form.mainCategory === "All"
      ? [...new Set(Object.values(STORE_CATEGORY_OPTIONS[form.category]).flat())]
      : form.category && form.mainCategory
        ? STORE_CATEGORY_OPTIONS[form.category][form.mainCategory] || []
      : [];
  const allSubcategoriesSelected =
    subcategories.length > 0 &&
    subcategories.every((subcategory) => form.subcategory.includes(subcategory));

  useEffect(() => {
    if (!isSubcategoryOpen) return undefined;

    const closeOnOutsideClick = (event) => {
      if (!subcategoryDropdownRef.current?.contains(event.target)) {
        setIsSubcategoryOpen(false);
      }
    };
    const closeOnEscape = (event) => {
      if (event.key === "Escape") setIsSubcategoryOpen(false);
    };

    document.addEventListener("mousedown", closeOnOutsideClick);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("mousedown", closeOnOutsideClick);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [isSubcategoryOpen]);

  const updateSubcategories = (subcategory, isSelected) => {
    const selectedSubcategories =
      subcategory === "All"
        ? isSelected
          ? subcategories
          : []
        : isSelected
          ? [...form.subcategory, subcategory]
          : form.subcategory.filter((selected) => selected !== subcategory);
    onChange({
      target: { name: "subcategory", value: selectedSubcategories },
    });
  };

  return (
    <>
      <FormField
        label="Store category *"
        name="category"
        error={errors.category}
      >
        <select
          id="category"
          name="category"
          value={form.category}
          onChange={onChange}
          aria-invalid={Boolean(errors.category)}
          required
        >
          <option value="">Select a store category</option>
          {STORE_CATEGORIES.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </FormField>
      <FormField
        label="Main category *"
        name="mainCategory"
        error={errors.mainCategory}
      >
        <select
          id="mainCategory"
          name="mainCategory"
          value={form.mainCategory}
          onChange={onChange}
          aria-invalid={Boolean(errors.mainCategory)}
          required
          disabled={!form.category}
        >
          <option value="">Select a main category</option>
          {mainCategories.map((mainCategory) => (
            <option key={mainCategory} value={mainCategory}>
              {mainCategory}
            </option>
          ))}
        </select>
      </FormField>
      <FormField
        label="Subcategory *"
        name="subcategory"
        error={errors.subcategory}
      >
        <div className="sr-multiselect" ref={subcategoryDropdownRef}>
          <button
            id="subcategory"
            className="sr-multiselect-trigger"
            type="button"
            aria-haspopup="true"
            aria-expanded={isSubcategoryOpen}
            aria-invalid={Boolean(errors.subcategory)}
            aria-describedby={`subcategory-help${errors.subcategory ? " subcategory-error" : ""}`}
            disabled={!form.mainCategory}
            onClick={() => setIsSubcategoryOpen((isOpen) => !isOpen)}
          >
            <span className="sr-multiselect-value">
              {form.subcategory.length
                ? form.subcategory.join(", ")
                : "Select subcategories"}
            </span>
            <span className="sr-multiselect-chevron" aria-hidden="true" />
          </button>
          {isSubcategoryOpen && (
            <div
              className="sr-multiselect-options"
              role="group"
              aria-label="Subcategories"
            >
              <label className="sr-multiselect-option">
                <input
                  type="checkbox"
                  checked={allSubcategoriesSelected}
                  onChange={(event) =>
                    updateSubcategories("All", event.target.checked)
                  }
                />
                <span>All</span>
              </label>
              {subcategories.map((subcategory) => (
                <label className="sr-multiselect-option" key={subcategory}>
                  <input
                    type="checkbox"
                    checked={
                      allSubcategoriesSelected ||
                      form.subcategory.includes(subcategory)
                    }
                    onChange={(event) =>
                      updateSubcategories(subcategory, event.target.checked)
                    }
                  />
                  <span>{subcategory}</span>
                </label>
              ))}
            </div>
          )}
        </div>
        <span className="sr-field-help" id="subcategory-help">
          Select all that apply.
        </span>
      </FormField>
    </>
  );
}

export default ProductCategories;
