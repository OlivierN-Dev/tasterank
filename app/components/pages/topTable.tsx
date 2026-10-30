import { useMemo, useState } from "react";
import type { topTableType, TopTableProps, TopTableTab } from "~/type/topTableType";
import FilterChip from "./topTable/filterChip";
import PlaceItem from "./topTable/placeItem";
import TabButton from "./topTable/tabButton";
import "./topTable.css";

export default function TopTable({ onClose, onSelect, data, filters, locationLabel }: TopTableProps): React.JSX.Element {
    const [tab, setTab] = useState<TopTableTab>("ranked");
    const [activeFilter, setActiveFilter] = useState("all");

    const places: topTableType[] = useMemo(
        () =>
            data
                .filter((r) => r.list_status === tab)
                .map((r, i) => ({
                    id: r.id,
                    rank: i + 1,
                    name: r.name,
                    cuisine: r.tags?.find((t) => t.kind === "cuisine")?.name ?? r.tagline ?? "",
                    area: r.neighborhood,
                    price: r.priceTier,
                    img: r.photos?.[0]?.url ?? "/img/placeholder.jpg",
                    tags: r.tags?.map((t) => t.name) ?? [],
                })),
        [data, tab]
    );
const list = activeFilter === "all"
        ? places
        : places.filter((p) => p.tags.includes(activeFilter));
        
    const rankedCount = data.filter((r) => r.list_status === "ranked").length;
    const tryCount = data.filter((r) => r.list_status === "want_to_try").length;

    return (
        <aside className="tt">
            <header className="tt-head">
                <span className="tt-logo">Tastemap.</span>
                <button className="tt-close" type="button" aria-label="Fermer" onClick={onClose}>×</button>
            </header>

            <div className="tt-badge" title={locationLabel}>
                <span className="tt-dot" /> {locationLabel} · Rayon 1 km · {data.length} restaurants
            </div>

            <h1 className="tt-title">Your top tables</h1>
            <p className="tt-sub">
                Ranked head-to-head, so your #3 really is better than your #4 — no five-star mush.
            </p>

            <nav className="tt-tabs">
                <TabButton active={tab === "ranked"} count={rankedCount} label="Ranked" onClick={() => setTab("ranked")} />
                <TabButton active={tab === "want_to_try"} count={tryCount} label="Want to try" onClick={() => setTab("want_to_try")} />
            </nav>

            <div className="tt-filters">
                <FilterChip active={activeFilter === "all"} label="All" onClick={() => setActiveFilter("all")} />
                {filters.map((f) => (
                    <FilterChip
                        key={f.slug}
                        active={activeFilter === f.name}
                        label={f.name}
                        onClick={() => setActiveFilter(f.name)}
                    />
                ))}
            </div>

            <ul className="tt-list">
                {list.length > 0
                    ? list.map((place) => (
                        <PlaceItem
                            key={place.id}
                            place={place}
                            onClick={() => onSelect(place.id)}
                        />
                    ))
                    : <li className="tt-empty">Aucun restaurant trouvé dans ce rayon avec ces filtres.</li>}
            </ul>

            <footer className="tt-foot">Tap any table to inspect notes, dishes &amp; coordinates.</footer>
        </aside>
    );
}