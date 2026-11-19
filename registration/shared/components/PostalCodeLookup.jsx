import { useEffect, useRef, useState } from "react";
import "./PostalCodeLookup.css";

const LOOKUP_DELAY_MS = 1100;

function getPostalLocation(result) {
  const address = result.address || {};
  const city =
    address.city ||
    address.town ||
    address.village ||
    address.municipality ||
    address.county ||
    address.state_district ||
    "";
  const area =
    address.neighbourhood ||
    address.suburb ||
    address.city_district ||
    address.quarter ||
    address.hamlet ||
    address.village ||
    address.town ||
    city;

  return {
    latitude: Number(result.lat),
    longitude: Number(result.lon),
    ...(city ? { city: city.slice(0, 80) } : {}),
    ...(area ? { area: area.slice(0, 80) } : {}),
  };
}

function PostalCodeLookup({ postalCode, onLocationFound, statusId }) {
  const onLocationFoundRef = useRef(onLocationFound);
  const [lookupState, setLookupState] = useState({
    postalCode: "",
    status: "idle",
  });

  useEffect(() => {
    onLocationFoundRef.current = onLocationFound;
  }, [onLocationFound]);

  useEffect(() => {
    const normalizedPostalCode = postalCode.trim();
    if (!/^\d{6}$/.test(normalizedPostalCode)) {
      return undefined;
    }

    const controller = new AbortController();
    const timeoutId = window.setTimeout(async () => {
      setLookupState({ postalCode: normalizedPostalCode, status: "loading" });

      try {
        const url = new URL("https://nominatim.openstreetmap.org/search");
        url.search = new URLSearchParams({
          postalcode: normalizedPostalCode,
          country: "India",
          format: "jsonv2",
          addressdetails: "1",
          limit: "1",
        }).toString();
        const response = await fetch(url, {
          signal: controller.signal,
          headers: { Accept: "application/json" },
        });
        if (!response.ok) {
          throw new Error(`Postcode lookup returned HTTP ${response.status}.`);
        }

        const results = await response.json();
        const result = Array.isArray(results) ? results[0] : null;
        if (!result) {
          setLookupState({ postalCode: normalizedPostalCode, status: "not-found" });
          return;
        }

        const location = getPostalLocation(result);
        if (
          !Number.isFinite(location.latitude) ||
          !Number.isFinite(location.longitude) ||
          location.latitude < -90 ||
          location.latitude > 90 ||
          location.longitude < -180 ||
          location.longitude > 180
        ) {
          setLookupState({ postalCode: normalizedPostalCode, status: "not-found" });
          return;
        }

        onLocationFoundRef.current(location);
        setLookupState({ postalCode: normalizedPostalCode, status: "found" });
      } catch (error) {
        if (error.name === "AbortError") return;
        console.error("Unable to look up the registration postcode.", error);
        setLookupState({ postalCode: normalizedPostalCode, status: "error" });
      }
    }, LOOKUP_DELAY_MS);

    return () => {
      window.clearTimeout(timeoutId);
      controller.abort();
    };
  }, [postalCode]);

  if (
    lookupState.postalCode !== postalCode.trim() ||
    lookupState.status === "idle"
  ) {
    return null;
  }

  const messages = {
    loading: "Finding this PIN code on the map…",
    found: "Location found. City, area, and map pin updated where available.",
    "not-found": "No map location found for this PIN code. Select the location on the map.",
    error: "Could not look up this PIN code. Check your connection or select the location on the map.",
  };

  return (
    <p
      className={`postal-code-lookup postal-code-lookup-${lookupState.status}`}
      id={statusId}
      role={lookupState.status === "error" ? "alert" : "status"}
    >
      {messages[lookupState.status]}
    </p>
  );
}

export default PostalCodeLookup;
