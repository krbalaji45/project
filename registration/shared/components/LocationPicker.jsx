import { useEffect, useMemo, useState } from "react";
import L from "leaflet";
import {
  MapContainer,
  Marker,
  TileLayer,
  useMap,
  useMapEvents,
} from "react-leaflet";
import { hasValidCoordinates } from "../utils/formUtils";
import "leaflet/dist/leaflet.css";
import "./LocationPicker.css";

const INDIA_CENTER = [12.585727, 79.363784];
const LOCATION_MARKER_ICON = L.divIcon({
  className: "location-picker-marker",
  html: "<span></span>",
  iconSize: [24, 24],
  iconAnchor: [12, 12],
});

function MapClickHandler({ onLocationChange }) {
  useMapEvents({
    click(event) {
      onLocationChange(event.latlng.lat, event.latlng.lng);
    },
  });
  return null;
}

function MapRecenter({ position }) {
  const map = useMap();

  useEffect(() => {
    if (position) {
      map.setView(position, Math.max(map.getZoom(), 15));
    }
  }, [map, position]);

  return null;
}

function LocationPicker({
  latitude,
  longitude,
  error,
  onLocationChange,
}) {
  const [isLocating, setIsLocating] = useState(false);
  const [locationError, setLocationError] = useState("");
  const hasCoordinates = hasValidCoordinates(latitude, longitude);
  const position = useMemo(
    () => (hasCoordinates ? [Number(latitude), Number(longitude)] : null),
    [hasCoordinates, latitude, longitude],
  );
  const center = position || INDIA_CENTER;
  const displayCoordinate = (value) =>
    value === "" || value == null || !Number.isFinite(Number(value))
      ? ""
      : Number(value).toFixed(6);

  const useCurrentLocation = () => {
    if (!navigator.geolocation) {
      setLocationError("Your browser does not support location access.");
      return;
    }

    setIsLocating(true);
    setLocationError("");
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        onLocationChange(coords.latitude, coords.longitude);
        setIsLocating(false);
      },
      (error) => {
        const messages = {
          1: "Location access was denied. Allow location access in your browser and try again.",
          2: "Your current location is unavailable. Try again or select it on the map.",
          3: "Getting your location timed out. Try again.",
        };
        setLocationError(
          messages[error.code] ||
            "Unable to get your current location. Try again or select it on the map.",
        );
        setIsLocating(false);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 60000 },
    );
  };

  return (
    <div className="location-picker">
      <p className="location-picker-instructions">
        Click the map to pin your location. You can move the pin by clicking
        elsewhere.
      </p>
      <button
        className="location-picker-current-button"
        type="button"
        onClick={useCurrentLocation}
        disabled={isLocating}
      >
        {isLocating ? "Getting your location…" : "Use current location"}
      </button>
      {locationError && (
        <p className="location-picker-error" role="alert">
          {locationError}
        </p>
      )}
      <MapContainer
        center={center}
        zoom={position ? 15 : 5}
        scrollWheelZoom
        className="location-picker-map"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapClickHandler onLocationChange={onLocationChange} />
        {position && (
          <Marker
            position={position}
            icon={LOCATION_MARKER_ICON}
            title="Selected registration location"
            alt="Selected location"
          />
        )}
        <MapRecenter position={position} />
      </MapContainer>
      <div className="location-picker-coordinates">
        <label htmlFor="latitude">
          Latitude *
          <input
            id="latitude"
            name="latitude"
            type="text"
            value={displayCoordinate(latitude)}
            readOnly
            aria-invalid={Boolean(error)}
            aria-describedby={error ? "location-coordinates-error" : undefined}
          />
        </label>
        <label htmlFor="longitude">
          Longitude *
          <input
            id="longitude"
            name="longitude"
            type="text"
            value={displayCoordinate(longitude)}
            readOnly
            aria-invalid={Boolean(error)}
            aria-describedby={error ? "location-coordinates-error" : undefined}
          />
        </label>
      </div>
      {error && (
        <p
          className="location-picker-error"
          id="location-coordinates-error"
          role="alert"
        >
          {error}
        </p>
      )}
    </div>
  );
}

export default LocationPicker;
