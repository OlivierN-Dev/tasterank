export type AddRestaurantProps = {
  onClose: () => void;
};
export type FormFieldProps = {
  label: string;
  htmlFor: string;
  required?: boolean;
  hint?: string;
  children: React.ReactNode;
};

export type SelectableChipProps = {
  children: React.ReactNode;
  selected: boolean;
  onClick: () => void;
  variant?: "tag" | "price";
};

export type FilterChipProps = {
  active: boolean;
  label: string;
  onClick: () => void;
};

export type TabButtonProps = {
  active: boolean;
  count: number;
  label: string;
  onClick: () => void;
};

export type OwnerRestaurantButtonProps = {
  onClick?: () => void;
};