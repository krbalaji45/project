import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./ResultsPage.css";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

const normalizeExperience = (item = {}) => ({
  ...item,
  id: item.id ?? item._id ?? item.experienceId ?? item.name ?? Math.random().toString(36).slice(2),
  name: item.name || item.title || item.eventName || "Experience",
  category: item.category || item.type || "",
  location: item.location || item.city || item.place || "",
  price: Number(String(item.price ?? item.amount ?? item.basePrice ?? 0).replace(/[^0-9.-]/g, "")) || 0,
  rating: Number(item.rating ?? item.averageRating ?? 0) || 0,
  startDate: item.startDate || item.fromDate || item.date || item.eventDate || "",
  endDate: item.endDate || item.toDate || item.date || item.startDate || item.eventDate || "",
});

const fetchExperiences = async (filters = {}) => {
  const baseUrl = API_BASE_URL ? API_BASE_URL.replace(/\/+$/, "") : "";
  const endpoints = baseUrl
    ? [`${baseUrl}/api/experiences`, `${baseUrl}/experiences`]
    : [];
  endpoints.push("/db.json");

  const query = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== "" && value !== null && value !== undefined) {
      query.append(key, String(value));
    }
  });

  let lastError = null;

  for (const endpoint of endpoints) {
    try {
      const finalUrl = query.toString() && !endpoint.endsWith(".json") ? `${endpoint}?${query.toString()}` : endpoint;
      const response = await fetch(finalUrl);

      if (!response.ok) {
        throw new Error(`Could not load ${endpoint}`);
      }

      const payload = await response.json();
      const list = Array.isArray(payload)
        ? payload
        : Array.isArray(payload.data)
          ? payload.data
          : Array.isArray(payload.experiences)
            ? payload.experiences
            : Array.isArray(payload.results)
              ? payload.results
              : Array.isArray(payload.Filter)
                ? payload.Filter
                : Array.isArray(payload.Filters)
                  ? payload.Filters
                  : [];

      return list.map(normalizeExperience);
    } catch (error) {
      lastError = error;
    }
  }

  console.error("Failed to load results from backend or local json", lastError);
  return [];
};

const ResultsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [results, setResults] = useState(location.state?.results || []);
  const [loading, setLoading] = useState(results.length === 0);

  useEffect(() => {
    if (location.state?.results?.length > 0) {
      setResults(location.state.results);
      setLoading(false);
      return;
    }

    const loadResults = async () => {
      setLoading(true);

      try {
        const filters = location.state?.filters || {};
        const data = await fetchExperiences(filters);
        setResults(data);
      } catch (error) {
        console.error("Failed to load results:", error);
        setResults([]);
      } finally {
        setLoading(false);
      }
    };

    loadResults();
  }, [location.state]);

  if (loading) {
    return <h2 className="results-status">Loading experiences...</h2>;
  }

  if (results.length === 0) {
    return <h2 className="results-status">No experiences found</h2>;
  }

  return (
    <main className="results-page">
      <div className="results-header">
        <h1>{location.state?.heading || "Available experiences"}</h1>
        <p>{results.length} experiences match your search.</p>
      </div>

      <div className="results-list">
        {results.map((item) => (
          <button
            className="experience-card"
            key={item.id}
            type="button"
            onClick={() => navigate("/experience", { state: { experience: item } })}
          >
            <img src={item.image} alt={item.name} />
            <span className="experience-card-content">
              <strong>{item.name}</strong>
              <span>{item.category} · {item.location}</span>
              <span>
                {item.startDate || item.date || "Flexible date"} · ₹{item.price} · {item.rating} ★
              </span>
              <span className="view-details">View details</span>
            </span>
          </button>
        ))}
      </div>
    </main>
  );
};

export default ResultsPage;
