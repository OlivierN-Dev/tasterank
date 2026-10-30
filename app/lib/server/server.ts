import Database from "better-sqlite3";
import type { GetFilter, RestaurantRow,CreateRestaurantData } from "~/type/restaurantRequestType";

const db = new Database("./tastemap.sqlite");


export function getHomeData() {
  const restaurants = db.prepare<[], RestaurantRow>(`
    SELECT r.id, r.name, r.tagline, r.description,
      r.price_tier AS priceTier, r.avg_spend_min AS avgSpendMin,
      r.avg_spend_max AS avgSpendMax, r.currency,
      r.editorial_rating AS editorialRating,
      r.rating_avg AS ratingAvg, r.rating_count AS ratingCount, r.phone,
      r.street_address AS streetAddress, r.postcode, r.neighborhood,
      r.city, r.country_code AS countryCode, r.latitude, r.longitude,
      r.list_status,
      (SELECT json_group_array(json_object('name', t.name, 'kind', t.kind)) FROM restaurant_tags rt JOIN tags t ON t.id = rt.tag_id WHERE rt.restaurant_id = r.id) AS tags,
      (SELECT json_group_array(json_object( 'url', p.url, 'caption', p.caption, 'altText', p.alt_text)) FROM photos p WHERE p.restaurant_id = r.id) 
      AS photos FROM restaurants r WHERE r.listing_status = 'published' AND r.list_status IN ('ranked', 'want_to_try') ORDER BY CASE WHEN r.list_status = 'ranked' THEN r.rank END,
      CASE WHEN r.list_status = 'want_to_try' THEN r.rating_avg END DESC
  `).all().map(({ tags, photos, ...restaurant }) => ({
    ...restaurant,
    tags: JSON.parse(tags),
    photos: JSON.parse(photos),
  }));

  const filters = db.prepare<[], GetFilter>(
    "SELECT slug, name, kind FROM tags ORDER BY name"
  ).all();

  return { restaurants, filters };
}

export function createRestaurant(data: CreateRestaurantData) {
  const restaurant = `INSERT INTO restaurants (slug, name, tagline, description, price_tier, avg_spend_min, avg_spend_max, currency, editorial_rating, rating_avg, rating_count, phone, street_adress, postcode, neighbour, city, country, latitude, longitude, list_status, rank, visit_count, listing_status, created_at, updated_at) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`
  const stmt = db.prepare(restaurant)
  return stmt.all()
}