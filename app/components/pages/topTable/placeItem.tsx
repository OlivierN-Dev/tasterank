import type { topTableType } from "~/type/topTableType";
import Price from "./price";
import "./placeItem.css";

export default function PlaceItem({
  place,
  onClick,
}: {
  place: topTableType;
  onClick: () => void;
}) {
  return (
    <li>
      <button
        className={`tt-item ${place.rank === 1 ? "top" : ""}`}
        type="button"
        onClick={onClick}
      >
        <span className="tt-rank">{place.rank}</span>
        <img className="tt-img" src={place.img} alt="" />
        <span className="tt-info">
          <strong>{place.name}</strong>
          <small>
            {place.cuisine} · {place.area}
          </small>
        </span>
        <span className="tt-right">
          <Price level={place.price} />
          {place.rank === 1 && <span className="tt-toppick">TOP PICK</span>}
        </span>
      </button>
    </li>
  );
}
