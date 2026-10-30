export type RestaurantPriceTier = 1 | 2 | 3 | 4;
export type RestaurantListStatus = "ranked" | "want_to_try";
export type RestaurantTagKind = "cuisine" | "style";

export type RestaurantRequestTag = {
  name: string;
  kind?: RestaurantTagKind;
};

export type RestaurantRequestPhoto = {
  file: File;
  caption?: string;
  altText?: string;
};

export type RestaurantRequest = {
  name: string;
  tagline?: string;
  description?: string;
  priceTier: RestaurantPriceTier;
  avgSpendMin?: number;
  avgSpendMax?: number;
  currency?: string;
  editorialRating?: number;
  phone?: string;
  streetAddress: string;
  postcode?: string;
  neighborhood: string;
  city?: string;
  countryCode?: string;
  latitude?: number;
  longitude?: number;
  tags?: RestaurantRequestTag[];
  photos?: RestaurantRequestPhoto[];
};

export type UpdateRestaurantRequest = Partial<RestaurantRequest>;

export type GetRestaurantsRequest = {
  list_status?: RestaurantListStatus;
  neighborhood?: string;
  city?: string;
  priceTier?: RestaurantPriceTier;
  tags?: string[];
};

export type GetFilter = {
  slug: string;
  name: string;
  kind: string;
};

export type RestaurantPhotoView = {
  url: string;
  caption?: string | null;
  altText?: string | null;
};

export type RestaurantView = Omit<
  RestaurantRequest,
  | "photos"
  | "tagline"
  | "description"
  | "avgSpendMin"
  | "avgSpendMax"
  | "editorialRating"
  | "phone"
  | "postcode"
  | "latitude"
  | "longitude"
> & {
  id: number;
  list_status: RestaurantListStatus;
  tagline?: string | null;
  description?: string | null;
  avgSpendMin?: number | null;
  avgSpendMax?: number | null;
  editorialRating?: number | null;
  ratingAvg: number;
  ratingCount: number;
  phone?: string | null;
  postcode?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  photos?: RestaurantPhotoView[];
};

export type RestaurantRow = Omit<RestaurantView, "tags" | "photos"> & {
  tags: string;
  photos: string;
};

export type RestaurantDetailProps = {
  restaurant: RestaurantView;
  onBack: () => void;
};

export type CreateRestaurantData = {
  name: string,
  tag: RestaurantRequestTag,
  location: string,
  adresss: string,
  phone: string,
  priceTier: string,
  grade: number,
  description: string,
  photo:RestaurantPhotoView
}