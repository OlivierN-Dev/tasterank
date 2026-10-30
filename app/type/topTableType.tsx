import type { GetFilter, RestaurantPriceTier, RestaurantView } from "./restaurantRequestType";

export type topTableType = {
    id: number;
    rank: number;
    name: string;
    cuisine: string;
    area: string;
    price: RestaurantPriceTier;
    img: string;
    tags: string[];
};

export type TopTableTab = "ranked" | "want_to_try";

export type TopTableProps = {
    onClose: () => void;
    onSelect: (restaurantId: number) => void;
    data: RestaurantView[];
    filters: GetFilter[];
    locationLabel: string;
};