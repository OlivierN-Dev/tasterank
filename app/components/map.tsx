import { useEffect, useRef } from "react";
import * as maplibregl from "maplibre-gl";
import mapWorkerUrl from "maplibre-gl/dist/maplibre-gl-worker.mjs?url";
import type { Feature, FeatureCollection, Point, Polygon } from "geojson";
import type { RestaurantView } from "~/type/restaurantRequestType";
import type { SearchLocation } from "~/type/mapType";
import "maplibre-gl/dist/maplibre-gl.css";
import "./map.css";

const SEARCH_RADIUS_METERS = 1000;
const EARTH_RADIUS_METERS = 6_371_008.8;


function createSearchArea(
  center: SearchLocation | null,
): FeatureCollection<Polygon | Point> {
  if (!center) {
    return { type: "FeatureCollection", features: [] };
  }

  const latitude = (center.latitude * Math.PI) / 180;
  const longitude = (center.longitude * Math.PI) / 180;
  const angularDistance = SEARCH_RADIUS_METERS / EARTH_RADIUS_METERS;
  const coordinates: [number, number][] = [];

  for (let bearing = 0; bearing <= 64; bearing += 1) {
    const angle = (bearing * 2 * Math.PI) / 64;
    const circleLatitude = Math.asin(
      Math.sin(latitude) * Math.cos(angularDistance) +
        Math.cos(latitude) * Math.sin(angularDistance) * Math.cos(angle),
    );
    const circleLongitude =
      longitude +
      Math.atan2(
        Math.sin(angle) * Math.sin(angularDistance) * Math.cos(latitude),
        Math.cos(angularDistance) -
          Math.sin(latitude) * Math.sin(circleLatitude),
      );
    coordinates.push([
      (circleLongitude * 180) / Math.PI,
      (circleLatitude * 180) / Math.PI,
    ]);
  }

  const circle: Feature<Polygon> = {
    type: "Feature",
    properties: {},
    geometry: { type: "Polygon", coordinates: [coordinates] },
  };
  const point: Feature<Point> = {
    type: "Feature",
    properties: {},
    geometry: {
      type: "Point",
      coordinates: [center.longitude, center.latitude],
    },
  };

  return { type: "FeatureCollection", features: [circle, point] };
}

function createPin(label: string): HTMLDivElement {
  const el = document.createElement("div");
  el.className = "custom-pin";
  el.innerHTML = `<div class="custom-pin__body"><span>${label}</span></div>`;
  return el;
}

export default function MapView({
  restaurants,
  center,
  onRestaurantSelect,
}: {
  restaurants: RestaurantView[];
  center: SearchLocation | null;
  onRestaurantSelect: (restaurant: RestaurantView) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const markersRef = useRef<maplibregl.Marker[]>([]);
  const restaurantsRef = useRef(restaurants);
  const centerRef = useRef(center);
  const onRestaurantSelectRef = useRef(onRestaurantSelect);

  restaurantsRef.current = restaurants;
  centerRef.current = center;
  onRestaurantSelectRef.current = onRestaurantSelect;

  useEffect(() => {
    if (!containerRef.current) return;

    maplibregl.setWorkerUrl(mapWorkerUrl);
    const map = new maplibregl.Map({
      container: containerRef.current,
      style: {
        version: 8,
        sources: {
          openstreetmap: {
            type: "raster",
            tiles: ["https://tile.openstreetmap.org/{z}/{x}/{y}.png"],
            tileSize: 256,
            attribution: "&copy; OpenStreetMap contributors",
          },
        },
        layers: [{ id: "openstreetmap", type: "raster", source: "openstreetmap" }],
      },
      center: [-0.09965, 51.51745],
      zoom: 11.5,
    });
    mapRef.current = map;

    map.once("load", () => {
      map.addSource("search-area", {
        type: "geojson",
        data: createSearchArea(centerRef.current),
      });
      map.addLayer({
        id: "search-area-fill",
        type: "fill",
        source: "search-area",
        filter: ["==", ["geometry-type"], "Polygon"],
        paint: { "fill-color": "#4c8058", "fill-opacity": 0.13 },
      });
      map.addLayer({
        id: "search-area-outline",
        type: "line",
        source: "search-area",
        filter: ["==", ["geometry-type"], "Polygon"],
        paint: { "line-color": "#2d5a3d", "line-width": 2 },
      });
      map.addLayer({
        id: "search-location",
        type: "circle",
        source: "search-area",
        filter: ["==", ["geometry-type"], "Point"],
        paint: {
          "circle-radius": 8,
          "circle-color": "#2d5a3d",
          "circle-stroke-color": "#fff",
          "circle-stroke-width": 3,
        },
      });
      markersRef.current = updateMapContents(
        map,
        markersRef.current,
        restaurantsRef.current,
        centerRef.current,
        onRestaurantSelectRef.current,
      );
    });

    return () => {
      markersRef.current.forEach((marker) => marker.remove());
      markersRef.current = [];
      map.remove();
      mapRef.current = null;
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map?.isStyleLoaded()) return;

    markersRef.current = updateMapContents(
      map,
      markersRef.current,
      restaurants,
      center,
      onRestaurantSelect,
    );
  }, [restaurants, center, onRestaurantSelect]);

  return <div ref={containerRef} className="map" />;
}

function updateMapContents(
  map: maplibregl.Map,
  existingMarkers: maplibregl.Marker[],
  restaurants: RestaurantView[],
  center: SearchLocation | null,
  onRestaurantSelect: (restaurant: RestaurantView) => void,
): maplibregl.Marker[] {
  existingMarkers.forEach((marker) => marker.remove());
  const markers: maplibregl.Marker[] = [];
  const bounds = new maplibregl.LngLatBounds();
  restaurants.forEach((restaurant, index) => {
    const { latitude, longitude } = restaurant;
    if (latitude == null || longitude == null) return;

    bounds.extend([longitude, latitude]);
    const element = createPin(String(index + 1));
    element.setAttribute("role", "button");
    element.setAttribute("aria-label", `Afficher ${restaurant.name}`);
    element.tabIndex = 0;
    element.addEventListener("click", () => onRestaurantSelect(restaurant));
    element.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        onRestaurantSelect(restaurant);
      }
    });
    markers.push(
      new maplibregl.Marker({
        element,
        anchor: "bottom",
      })
        .setLngLat([longitude, latitude])
        .addTo(map),
    );
  });

  const area = map.getSource("search-area") as maplibregl.GeoJSONSource | undefined;
  area?.setData(createSearchArea(center));
  if (center) {
    map.flyTo({
      center: [center.longitude, center.latitude],
      zoom: 14.5,
      duration: 900,
    });
  } else if (!bounds.isEmpty()) {
    map.fitBounds(bounds, {
      padding: { top: 90, right: 48, bottom: 48, left: 48 },
      maxZoom: 12.5,
      duration: 0,
    });
  }
  return markers;
}