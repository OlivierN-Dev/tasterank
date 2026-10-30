import { useState } from "react";
import FormField from "./addRestaurant/formField";
import SelectableChip from "./addRestaurant/selectableChip";
import type { AddRestaurantProps } from "~/type/restaurantType";
import "./addRestaurant.css";

const CUISINE_TAGS = ["Basque", "Wine Bar", "British", "Italian", "Wood-fired", "Bakery"];
const PRICE_TIERS = ["€", "€€", "€€€", "€€€€"];


export default function AddRestaurant({ onClose }: AddRestaurantProps) {
  const [selectedTags, setSelectedTags] = useState(["Basque", "Wine Bar"]);
  const [priceTier, setPriceTier] = useState("€€€");
  const [isAddingTag, setIsAddingTag] = useState(false);
  const [customTag, setCustomTag] = useState("");
  const [tags, setTags] = useState(CUISINE_TAGS);

  function toggleTag(tag: string) {
    setSelectedTags((current) => {
      if (current.includes(tag)) return current.filter((item) => item !== tag);
      if (current.length >= 4) return current;
      return [...current, tag];
    });
  }

  function addTag() {
    const tag = customTag.trim();
    if (!tag || selectedTags.length >= 4) return;
    if (!tags.includes(tag)) setTags((current) => [...current, tag]);
    setSelectedTags((current) => [...current, tag]);
    setCustomTag("");
    setIsAddingTag(false);
  }

  return (
    <section className="add-restaurant">
      <header className="add-restaurant__header">
        <div>
          <h1>Add your restaurant</h1>
          <p>Submit your venue to the curated Tastemap directory</p>
        </div>
        <button className="add-restaurant__close" type="button" onClick={onClose} aria-label="Close form">
          ×
        </button>
      </header>

      <form
        className="add-restaurant__form"
        id="restaurant-form"
        onSubmit={(event) => event.preventDefault()}
      >
        <FormField label="Restaurant Name" htmlFor="restaurant-name" required>
          <input
            className="restaurant-control"
            id="restaurant-name"
            name="name"
            placeholder="e.g. Brat Clodagh & Co."
            required
          />
        </FormField>

        <FormField label="Cuisine & Style" htmlFor="cuisine-tags" hint="Select up to 4 tags">
          <div className="restaurant-chip-list" id="cuisine-tags">
            {tags.map((tag) => (
              <SelectableChip
                key={tag}
                selected={selectedTags.includes(tag)}
                onClick={() => toggleTag(tag)}
              >
                {tag}
                {selectedTags.includes(tag) && <span aria-hidden="true"> ×</span>}
              </SelectableChip>
            ))}
            {isAddingTag ? (
              <input
                className="restaurant-control restaurant-control--tag"
                aria-label="New cuisine tag"
                autoFocus
                value={customTag}
                onChange={(event) => setCustomTag(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    event.preventDefault();
                    addTag();
                  }
                }}
              />
            ) : (
              <button
                className="restaurant-chip restaurant-chip--add"
                type="button"
                onClick={() => setIsAddingTag(true)}
                disabled={selectedTags.length >= 4}
              >
                + Add tag
              </button>
            )}
            {isAddingTag && (
              <button className="restaurant-chip restaurant-chip--add" type="button" onClick={addTag}>
                Add
              </button>
            )}
          </div>
        </FormField>

        <div className="add-restaurant__row">
          <FormField label="Neighborhood & City" htmlFor="restaurant-neighborhood">
            <input
              className="restaurant-control"
              id="restaurant-neighborhood"
              name="neighborhood"
              placeholder="Shoreditch, London"
            />
          </FormField>
          <FormField label="Street Address" htmlFor="restaurant-address">
            <input
              className="restaurant-control"
              id="restaurant-address"
              name="address"
              placeholder="4 Redchurch Street, E1 6JL"
            />
          </FormField>
        </div>

        <FormField label="Phone Number" htmlFor="restaurant-phone">
          <input
            className="restaurant-control"
            id="restaurant-phone"
            name="phone"
            type="tel"
            placeholder="+44 20 215 2150"
          />
        </FormField>

        <FormField label="Price Tier" htmlFor="price-tier">
          <div className="restaurant-chip-list restaurant-chip-list--price" id="price-tier">
            {PRICE_TIERS.map((tier) => (
              <SelectableChip
                key={tier}
                variant="price"
                selected={priceTier === tier}
                onClick={() => setPriceTier(tier)}
              >
                {tier}
              </SelectableChip>
            ))}
          </div>
          <p className="add-restaurant__hint">Average spend: £45 - £80 per person with wine</p>
        </FormField>

        <FormField label="Editorial Grade / Rating" htmlFor="restaurant-rating">
          <div className="add-restaurant__rating" aria-label="5 out of 5 stars">
            ★★★★★
          </div>
          <input
            className="restaurant-control"
            id="restaurant-rating"
            name="rating"
            type="number"
            min="0"
            max="5"
            step="0.1"
            placeholder="4.8"
          />
        </FormField>

        <FormField label="Culinary Concept & Heritage" htmlFor="restaurant-concept">
          <textarea
            className="restaurant-control restaurant-control--textarea"
            id="restaurant-concept"
            name="concept"
            placeholder="Describe the restaurant's culinary concept and heritage."
            rows={2}
          />
        </FormField>

        <FormField label="Photography" htmlFor="restaurant-photos" hint="3 photos ready">
          <label className="add-restaurant__upload" htmlFor="restaurant-photos">
            <span className="add-restaurant__upload-icon" aria-hidden="true">▧</span>
            <strong>Upload high-res photography</strong>
            <span>.jpg, .png, .webp · Max 15MB</span>
          </label>
          <input
            className="add-restaurant__file"
            id="restaurant-photos"
            name="photos"
            type="file"
            accept=".jpg,.jpeg,.png,.webp"
            multiple
          />
        </FormField>
      </form>

      <footer className="add-restaurant__footer">
        <button className="add-restaurant__cancel" type="button" onClick={onClose}>
          Cancel
        </button>
        <button className="add-restaurant__publish" type="submit" form="restaurant-form">
          <span aria-hidden="true">✓</span> Publish Restaurant
        </button>
      </footer>
    </section>
  );
}
