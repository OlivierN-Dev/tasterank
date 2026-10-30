import { useCallback, useMemo, useState } from "react";
import { useLoaderData } from "react-router";
import type { Route } from "./+types/home";
import { getHomeData } from "~/lib/server/server";
import AsideView from "~/components/aside";
import TopTable from "~/components/pages/topTable";
import AddRestaurant from "~/components/pages/addRestaurant";
import RestaurantDetail from "~/components/pages/restaurantDetail";
import { NavBar } from "~/components/navBar";
import OwnerRestaurantButton from "~/components/ownerRestaurantButton";
import MapView from "~/components/map";
import type { RestaurantView } from "~/type/restaurantRequestType";
import type { SearchLocation } from "~/type/mapType";
import "./home.css";

const SEARCH_RADIUS_METERS = 1000;
const EARTH_RADIUS_METERS = 6_371_000;

function distanceInMeters(
  first: { latitude: number; longitude: number },
  second: { latitude: number; longitude: number },
) {
  const toRadians = (degrees: number) => (degrees * Math.PI) / 180;
  const latitudeDifference = toRadians(second.latitude - first.latitude);
  const longitudeDifference = toRadians(second.longitude - first.longitude);
  const firstLatitude = toRadians(first.latitude);
  const secondLatitude = toRadians(second.latitude);
  const haversine =
    Math.sin(latitudeDifference / 2) ** 2 +
    Math.cos(firstLatitude) *
      Math.cos(secondLatitude) *
      Math.sin(longitudeDifference / 2) ** 2;
  const boundedHaversine = Math.min(1, Math.max(0, haversine));

  return (
    2 *
    EARTH_RADIUS_METERS *
    Math.atan2(
      Math.sqrt(boundedHaversine),
      Math.sqrt(1 - boundedHaversine),
    )
  );
}

export function meta({}: Route.MetaArgs) {
  return [
    { title: "rankTaster" },
    { name: "description", content: "trust" },
  ];
}

export function loader() {
  return getHomeData();
}

export default function Home() {
  const { restaurants, filters } = useLoaderData<typeof loader>();
  const [isAsideOpen, setIsAsideOpen] = useState(false);
  const [isAsideRestaurantOpen, setIsAsideRestaurantOpen] = useState(false);
  const [searchLocation, setSearchLocation] = useState<SearchLocation | null>(
    null,
  );
  const [selectedRestaurant, setSelectedRestaurant] =
    useState<RestaurantView | null>(null);
  const handleRestaurantSelect = useCallback((restaurant: RestaurantView) => {
    setSelectedRestaurant(restaurant);
    setIsAsideOpen(true);
  }, []);
  console.log(restaurants);
  
  const nearbyRestaurants: RestaurantView[] = useMemo(
    () =>
      searchLocation
        ? restaurants
            .map((restaurant) => {
              if (restaurant.latitude == null || restaurant.longitude == null) {
                return { restaurant, distance: Number.POSITIVE_INFINITY };
              }

              return {
                restaurant,
                distance: distanceInMeters(searchLocation, {
                  latitude: restaurant.latitude,
                  longitude: restaurant.longitude,
                }),
              };
            })
            .filter(({ distance }) => distance <= SEARCH_RADIUS_METERS)
            .sort((first, second) => first.distance - second.distance)
            .map(({ restaurant }) => restaurant)
        : restaurants,
    [restaurants, searchLocation],
  );

  return (
    <>
      <MapView
        restaurants={nearbyRestaurants}
        center={searchLocation}
        onRestaurantSelect={handleRestaurantSelect}
      />
      <NavBar
        onSearch={(location) => {
          setSearchLocation(location);
          setIsAsideOpen(true);
        }}
      />

      <AsideView
        side="left"
        size={selectedRestaurant ? "detail" : "default"}
        isOpen={isAsideOpen}
      >
        {selectedRestaurant ? (
          <RestaurantDetail
            restaurant={selectedRestaurant}
            onBack={() => setSelectedRestaurant(null)}
          />
        ) : (
          <TopTable
            onClose={() => setIsAsideOpen(false)}
            onSelect={(restaurantId) => {
              const restaurant = nearbyRestaurants.find(
                (item) => item.id === restaurantId,
              );
              if (restaurant) setSelectedRestaurant(restaurant);
            }}
            data={nearbyRestaurants}
            filters={filters}
            locationLabel={searchLocation?.label ?? "London"}
          />
        )}
      </AsideView>

      <AsideView side="right" size="wide" isOpen={isAsideRestaurantOpen}>
        <AddRestaurant onClose={() => setIsAsideRestaurantOpen(false)} />
      </AsideView>

      <OwnerRestaurantButton
        onClick={() => {
          setIsAsideOpen(false);
          setSelectedRestaurant(null);
          setIsAsideRestaurantOpen(true);
        }}
      />
    </>
  );
}