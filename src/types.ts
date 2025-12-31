import * as React from "react";

export type TextInputProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "type" | "value" | "defaultValue" | "onChange" | "onKeyDown" | "onBlur"
> & {
  type?: "text";
};
export type ListProps = {
  role?: "listbox";
  onMouseDown: (e: React.MouseEvent) => void;
};

export type ItemProps = {
  role?: "option";
  "aria-selected"?: boolean;
  onMouseEnter: () => void;
  onMouseDown: (e: React.MouseEvent) => void;
};
