import "./price.css";

export default function Price({ level }: { level: number }) {
  return (
    <span className="tt-price">
      {[1, 2, 3, 4].map((priceLevel) => (
        <span key={priceLevel} className={priceLevel <= level ? "on" : "off"}>£</span>
      ))}
    </span>
  );
}
