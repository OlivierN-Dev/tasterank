import type { FormFieldProps } from "~/type/restaurantType";
import "./formField.css";

export default function FormField({
  label,
  htmlFor,
  required = false,
  hint,
  children,
}: FormFieldProps) {
  return (
    <div className="restaurant-field">
      <div className="restaurant-field__heading">
        <label htmlFor={htmlFor}>
          {label}
          {required && <span className="restaurant-field__required"> *</span>}
        </label>
        {hint && <span className="restaurant-field__hint">{hint}</span>}
      </div>
      {children}
    </div>
  );
}
