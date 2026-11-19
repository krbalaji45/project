import React from "react";

const categories = [
  { value: "", label: "All categories" },
  { value: "Activities", label: "Activities" },
  { value: "Dining", label: "Dining" },
  { value: "Events", label: "Events" },
  { value: "Wellness", label: "Wellness" },
];

const sortOptions = [
  { value: "Recommended", label: "Recommended" },
  { value: "Price: Low to High", label: "Price: Low to High" },
  { value: "Top rated", label: "Top rated" },
];

const FormField = ({ icon, label, children }) => (
  <div className="filter-row">
    <label>
      <span className="label-icon">{icon}</span>
      {label}
    </label>
    {children}
  </div>
);

const FilterForm = ({
  category,
  setCategory,
  fromDate,
  setFromDate,
  toDate,
  setToDate,
  minPrice,
  setMinPrice,
  maxPrice,
  setMaxPrice,
  location,
  setLocation,
  rating,
  setRating,
  sortBy,
  setSortBy,
}) => (
  <section className="filters-box" aria-label="Experience filters">
    <header className="filters-header">
      <div>
        <h2>Filters</h2>
        <p>Customize your search</p>
      </div>
    </header>

    <div className="filter-form">
      <FormField icon="◈" label="Category">
        <select
          id="category-filter"
          className="category-select"
          value={category}
          onChange={(event) => setCategory(event.target.value)}
        >
          {categories.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </FormField>

      <FormField icon="◷" label="From date">
        <input
          type="date"
          value={fromDate}
          onChange={(event) => setFromDate(event.target.value)}
        />
      </FormField>

      <FormField icon="◷" label="To date">
        <input
          type="date"
          value={toDate}
          onChange={(event) => setToDate(event.target.value)}
        />
      </FormField>

      <FormField icon="₹" label="Price range">
        <div className="price-inputs">
          <input
            type="number"
            placeholder="Min"
            value={minPrice}
            onChange={(event) => setMinPrice(event.target.value)}
          />
          <input
            type="number"
            placeholder="Max"
            value={maxPrice}
            onChange={(event) => setMaxPrice(event.target.value)}
          />
        </div>
      </FormField>

      <FormField icon="⌖" label="Location">
        <input
          type="text"
          placeholder="Chennai, Marina, T Nagar"
          value={location}
          onChange={(event) => setLocation(event.target.value)}
        />
      </FormField>

      <FormField icon="★" label="Rating">
        <input
          type="text"
          placeholder="4★ and above"
          value={rating}
          onChange={(event) => setRating(event.target.value)}
        />
      </FormField>

      <div className="sort-row">
        <label>
          <span className="label-icon">↕</span>
          Sort by
        </label>
        <div className="sort-buttons">
          {sortOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              className={sortBy === option.value ? "active" : ""}
              onClick={() => setSortBy(option.value)}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  </section>
);

export default FilterForm;
