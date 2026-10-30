import type { RestaurantDetailProps } from "~/type/restaurantRequestType";
import "./restaurantDetail.css";

function formatPrice(level: number) {
  return "£".repeat(Math.max(1, Math.min(4, level)));
}

export default function RestaurantDetail({
  restaurant,
  onBack,
}: RestaurantDetailProps) {
  const photos = restaurant.photos ?? [];
  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
    [
      restaurant.streetAddress,
      restaurant.postcode,
      restaurant.city,
    ]
      .filter(Boolean)
      .join(", "),
  )}`;

  return (
    <section className="restaurant-detail" aria-label={`${restaurant.name} details`}>
      <header className="restaurant-detail__header">
        <button
          className="restaurant-detail__back"
          type="button"
          onClick={onBack}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="m15 18-6-6 6-6M9 12h12" />
          </svg>
          <span>Back to all places</span>
        </button>
      </header>

      <div className="restaurant-detail__content">
        {photos.length > 0 && (
          <div className="restaurant-detail__gallery">
            {photos[0] && (
              <figure className="restaurant-detail__photo restaurant-detail__photo--feature">
                <img
                  src={photos[0].url}
                  alt={photos[0].altText || `${restaurant.name} restaurant`}
                  onError={(event) => {
                    event.currentTarget.hidden = true;
                  }}
                />
                <figcaption>{photos[0].caption || restaurant.name}</figcaption>
              </figure>
            )}
            {photos.length > 1 && (
              <div className="restaurant-detail__photo-row">
                {photos.slice(1, 3).map((photo, index) => (
                  <figure className="restaurant-detail__photo" key={photo.url}>
                    <img
                      src={photo.url}
                      alt={photo.altText || `${restaurant.name} photo ${index + 2}`}
                      onError={(event) => {
                        event.currentTarget.hidden = true;
                      }}
                    />
                    <figcaption>{photo.caption || restaurant.name}</figcaption>
                  </figure>
                ))}
              </div>
            )}
          </div>
        )}

        <div className="restaurant-detail__heading">
          <h1>{restaurant.name}</h1>
          <div className="restaurant-detail__meta">
            <div className="restaurant-detail__tags">
              {restaurant.tags?.map((tag) => (
                <span className="restaurant-detail__tag" key={`${tag.kind}-${tag.name}`}>
                  {tag.name}
                </span>
              ))}
            </div>
            <span className="restaurant-detail__separator" aria-hidden="true">
              ·
            </span>
            <span className="restaurant-detail__price" aria-label={`Price ${restaurant.priceTier} of 4`}>
              {formatPrice(restaurant.priceTier)}
            </span>
            {restaurant.ratingAvg > 0 && (
              <span className="restaurant-detail__rating">
                <span aria-hidden="true">★</span>
                <strong>{restaurant.ratingAvg.toFixed(1)}</strong>
                <span className="restaurant-detail__reviews">
                  ({restaurant.ratingCount} reviews)
                </span>
              </span>
            )}
          </div>
        </div>

        {restaurant.description && (
          <p className="restaurant-detail__description">
            {restaurant.description}
          </p>
        )}

        <div className="restaurant-detail__address">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z" />
            <circle cx="12" cy="10" r="2.5" />
          </svg>
          <div>
            <p>
              {[restaurant.streetAddress, restaurant.postcode, restaurant.city]
                .filter(Boolean)
                .join(", ")}{" "}
              · {restaurant.neighborhood}
            </p>
            <a href={directionsUrl} target="_blank" rel="noreferrer">
              Get Directions <span aria-hidden="true">↗</span>
            </a>
          </div>
        </div>
      </div>

      <footer className="restaurant-detail__footer">
        {restaurant.phone ? (
          <a
            className="restaurant-detail__book"
            href={`tel:${restaurant.phone.replace(/[^\d+]/g, "")}`}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M4 3h3l2 5-2.2 1.5a15 15 0 0 0 7.7 7.7L16 15l5 2v3c0 1.1-.9 2-2 2C10.7 22 2 13.3 2 5c0-1.1.9-2 2-2Z" />
            </svg>
            Book a Table
          </a>
        ) : (
          <a
            className="restaurant-detail__book"
            href={directionsUrl}
            target="_blank"
            rel="noreferrer"
          >
            Get Directions
          </a>
        )}
      </footer>
    </section>
  );
}
