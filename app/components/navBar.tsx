import { useState, type FormEvent } from "react";
import "./navBar.css";

type SearchLocation = {
  latitude: number;
  longitude: number;
  label: string;
};

type GeocodingResult = {
  lat: string;
  lon: string;
  display_name: string;
};

function isGeocodingResult(value: unknown): value is GeocodingResult {
  if (typeof value !== "object" || value === null) return false;
  const result = value as Record<string, unknown>;
  return (
    typeof result.lat === "string" &&
    typeof result.lon === "string" &&
    typeof result.display_name === "string"
  );
}

export function NavBar({
  onSearch,
}: {
  onSearch: (location: SearchLocation) => void;
}) {
  const [query, setQuery] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const address = query.trim();
    if (!address) {
      setMessage("Saisissez une adresse ou un quartier.");
      return;
    }

    setIsLoading(true);
    setMessage("");
    try {
      const params = new URLSearchParams({
        format: "jsonv2",
        limit: "1",
        q: address,
      });
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?${params.toString()}`,
        { headers: { "Accept-Language": "fr" } },
      );
      if (!response.ok) {
        throw new Error("Le service de recherche d’adresses est indisponible.");
      }

      const results: unknown = await response.json();
      if (!Array.isArray(results)) {
        throw new Error("Le service a renvoyé un résultat invalide.");
      }

      const firstResult: unknown = results[0];
      if (firstResult === undefined) {
        setMessage("Adresse introuvable. Essayez une adresse plus précise.");
        return;
      }
      if (!isGeocodingResult(firstResult)) {
        throw new Error("Le service a renvoyé un résultat invalide.");
      }

      const latitude = Number(firstResult.lat);
      const longitude = Number(firstResult.lon);
      if (
        !Number.isFinite(latitude) ||
        !Number.isFinite(longitude) ||
        latitude < -90 ||
        latitude > 90 ||
        longitude < -180 ||
        longitude > 180
      ) {
        throw new Error("Le service a renvoyé des coordonnées invalides.");
      }

      onSearch({
        latitude,
        longitude,
        label: firstResult.display_name,
      });
      setMessage("");
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Impossible de rechercher cette adresse.",
      );
    } finally {
      setIsLoading(false);
    }
  }

  function handleGeolocation() {
    if (!navigator.geolocation) {
      setMessage("La géolocalisation n’est pas disponible sur cet appareil.");
      return;
    }

    setIsLoading(true);
    setMessage("Localisation en cours...");
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        onSearch({
          latitude: coords.latitude,
          longitude: coords.longitude,
          label: "Ma position actuelle",
        });
        setQuery("");
        setIsLoading(false);
      },
      (error) => {
        setMessage(
          error.code === error.PERMISSION_DENIED
            ? "Autorisez la géolocalisation pour utiliser votre position."
            : "Votre position n’a pas pu être déterminée.",
        );
        setIsLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000 },
    );
  }

  return (
    <div className="map-search">
      <form
        className="map-navbar"
        role="search"
        aria-label="Recherche de restaurants"
        onSubmit={handleSubmit}
      >
        <svg
          className="map-navbar__search-icon"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <circle cx="10.8" cy="10.8" r="6.8" />
          <path d="m16 16 4.5 4.5" />
        </svg>
        <input
          className="map-navbar__input"
          type="search"
          aria-label="Adresse ou quartier"
          placeholder="Adresse ou quartier..."
          value={query}
          disabled={isLoading}
          onChange={(event) => setQuery(event.target.value)}
        />
        <span className="map-navbar__radius">1 km</span>
        <button
          className="map-navbar__location"
          type="button"
          aria-label="Utiliser ma position actuelle"
          title="Utiliser ma position actuelle"
          disabled={isLoading}
          onClick={handleGeolocation}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12 22s7-6.2 7-13a7 7 0 1 0-14 0c0 6.8 7 13 7 13Z" />
            <circle cx="12" cy="9" r="2.3" />
          </svg>
        </button>
        <button
          className="map-navbar__submit"
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? "Recherche..." : "Rechercher"}
        </button>
      </form>
      <p className="map-search__message" role="status" aria-live="polite">
        {message}
      </p>
    </div>
  );
}