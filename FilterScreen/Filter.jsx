import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import FilterForm from "./FilterForm";
import ResultPreview from "./ResultPreview";
import "./Filter.css";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

const normalizeExperience = (item = {}) => {
  const image =
    item.image ||
    (item.eventImage
      ? `data:image/jpeg;base64,${item.eventImage}`
      : "");

  return {
    ...item,
    id:
      item.id ??
      item.eventId ??
      item._id ??
      Math.random().toString(36).slice(2),
    name: item.name || item.title || item.eventName || "Experience",
    category: item.category || item.categoryName || "",
    location: item.location || item.eventLocation || "",
    price:
      Number(
        String(item.price ?? item.eventPrice ?? 0).replace(/[^0-9.-]/g, ""),
      ) || 0,
    rating: Number(item.rating ?? 0) || 0,
    startDate: item.startDate || item.eventDate || "",
    endDate: item.endDate || item.eventDate || "",
    image,
  };
};

const fetchExperiences = async (filters = {}) => {
  const baseUrl = API_BASE_URL.replace(/\/+$/, "");
  const requestBody = {
    categoryName: filters.category?.trim() || null,
    fromDate: filters.fromDate || null,
    toDate: filters.toDate || null,
    minPrice: filters.minPrice !== "" ? Number(filters.minPrice) : null,
    maxPrice: filters.maxPrice !== "" ? Number(filters.maxPrice) : null,
    location: filters.location?.trim() || null,
    minRating:
      filters.rating !== ""
        ? Number(String(filters.rating).replace(/[^0-9.]/g, ""))
        : null,
    maxRating: null,
    sortBy:
      filters.sortBy === "Price: Low to High"
        ? "PRICE_LOW_TO_HIGH"
        : filters.sortBy === "Top rated"
          ? "TOP_RATED"
          : "RECOMMENDED",
  };

  const response = await fetch(`${baseUrl}/api/user/filter/events`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }

  const data = await response.json();
  return Array.isArray(data) ? data.map(normalizeExperience) : [];
};

const FilterPage = () => {
  const navigate = useNavigate();
  const { category: routeCategory } = useParams();

  const [category, setCategory] = useState(routeCategory || "");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [location, setLocation] = useState("");
  const [rating, setRating] = useState("");
  const [sortBy, setSortBy] = useState("Recommended");
  const [filteredResults, setFilteredResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setCategory(routeCategory || "");
  }, [routeCategory]);

  const loadInitialExperiences = async () => {
    try {
      setLoading(true);
      setError("");
      const experiences = await fetchExperiences();
      setFilteredResults(experiences);
    } catch (err) {
      console.error("Initial API error:", err);
      setError("Unable to load experiences from the server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInitialExperiences();
  }, []);

  const handleApply = async () => {
    try {
      setLoading(true);
      setError("");

      const filters = {
        category: category.trim(),
        fromDate,
        toDate,
        minPrice,
        maxPrice,
        location: location.trim(),
        rating: rating.trim(),
        sortBy,
      };

      const data = await fetchExperiences(filters);
      setFilteredResults(data);

      if (data.length > 0) {
        navigate("/matches", {
          state: {
            results: data,
            filters,
            heading: "Matching experiences",
          },
        });
        return;
      }

      setError("No experiences found for the selected filters.");
    } catch (err) {
      console.error("Filter API error:", err);
      setError("Unable to connect to the backend server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <header className="page-header">
        <h1>Find your perfect experience</h1>
        <p className="subtitle">Choose what matters and apply once.</p>
      </header>

      <main className="main-content">
        <FilterForm
          category={category}
          setCategory={setCategory}
          fromDate={fromDate}
          setFromDate={setFromDate}
          toDate={toDate}
          setToDate={setToDate}
          minPrice={minPrice}
          setMinPrice={setMinPrice}
          maxPrice={maxPrice}
          setMaxPrice={setMaxPrice}
          location={location}
          setLocation={setLocation}
          rating={rating}
          setRating={setRating}
          sortBy={sortBy}
          setSortBy={setSortBy}
        />

        <ResultPreview
          results={filteredResults}
          sortBy={sortBy}
          error={error}
          loading={loading}
          onApply={handleApply}
        />
      </main>
    </div>
  );
};

export default FilterPage;
