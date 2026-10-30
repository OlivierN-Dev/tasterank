import type { OwnerRestaurantButtonProps } from "~/type/restaurantType";
import "./ownerRestaurantButton.css";

export default function OwnerRestaurantButton({
  onClick,
}: OwnerRestaurantButtonProps) {
  return (
    <button
      className="owner-restaurant-button"
      type="button"
      onClick={onClick}
    >
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M4 10V20h16V10M3 9l2-5h14l2 5M3 9a3 3 0 0 0 6 0 3 3 0 0 0 6 0 3 3 0 0 0 6 0M9 20v-6h6v6" />
      </svg>
      <span>Owner of restaurant?</span>
    </button>
  );
}
