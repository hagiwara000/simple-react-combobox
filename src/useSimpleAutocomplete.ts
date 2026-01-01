import {
  ChangeEvent,
  ChangeEventHandler,
  FocusEventHandler,
  KeyboardEventHandler,
  useMemo,
  useRef,
  useState,
} from "react";
import { ItemProps, ListProps, TextInputProps } from "./types";
import { defaultFilter, FilterFn } from "./filter";
import { moveHighlight } from "./highlight";
import { canSelect } from "./selection";

type InternalInputProps = TextInputProps & {
  value: string;
  onChange: ChangeEventHandler<HTMLInputElement>;
  onKeyDown: KeyboardEventHandler<HTMLInputElement>;
  onBlur: FocusEventHandler<HTMLInputElement>;
  onFocus?: FocusEventHandler<HTMLInputElement>;
};

export type SimpleAutocompleteOptions<T> = {
  items: readonly T[];
  itemToString?: (item: T) => string;
  onSelect?: (item: T) => void;
  openOnFocus?: boolean;
  filterFn?: FilterFn<T>;
};

export type SimpleAutocompleteResult<T> = {
  inputProps: TextInputProps;
  listProps: ListProps;
  getItemProps: (index: number) => ItemProps;
  isOpen: boolean;
  inputValue: string;
  setOpen: (open: boolean) => void;
  highlightedIndex: number;
  highlightedItem?: T;
  filteredItems: readonly T[];
};

export function useSimpleAutocomplete<T>({
  items,
  itemToString = String,
  onSelect,
  openOnFocus = false,
  filterFn,
}: SimpleAutocompleteOptions<T>): SimpleAutocompleteResult<T> {
  const [inputValue, setInputValue] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);

  /** IME composition guard */
  const isComposingRef = useRef(false);

  /* ---------- filtering ---------- */
  const filteredItems = useMemo(
    () =>
      typeof filterFn === "function"
        ? filterFn(items, inputValue, itemToString)
        : defaultFilter(items, inputValue, itemToString),
    [items, inputValue, filterFn]
  );

  /* ---------- input handlers ---------- */
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);

    if (value.length > 0) {
      setIsOpen(true);
    } else {
      setIsOpen(false);
      setHighlightedIndex(-1);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (isComposingRef.current) return;

    switch (e.key) {
      case "ArrowDown": {
        e.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
          return;
        }
        setHighlightedIndex((i) => moveHighlight(i, 1, filteredItems.length));
        break;
      }
      case "ArrowUp": {
        e.preventDefault();
        setHighlightedIndex((i) => moveHighlight(i, -1, filteredItems.length));
        break;
      }
      case "Enter": {
        if (!canSelect(isOpen, highlightedIndex, filteredItems.length)) return;

        e.preventDefault();
        selectItem(filteredItems[highlightedIndex]);
        break;
      }
      case "Escape": {
        setIsOpen(false);
        setHighlightedIndex(-1);
        break;
      }
    }
  };

  const handleBlur = () => {
    setIsOpen(false);
    setHighlightedIndex(-1);
  };

  const handleFocus = () => {
    if (openOnFocus && filteredItems.length > 0) {
      setIsOpen(true);
    }
  };

  /* ---------- selection ---------- */

  const selectItem = (item: T) => {
    const value = itemToString(item);
    setInputValue(value);
    setIsOpen(false);
    setHighlightedIndex(-1);
    onSelect?.(item);
  };

  /* ---------- props builders ---------- */

  const inputProps: InternalInputProps = {
    type: "text",
    value: inputValue,
    onChange: handleChange,
    onKeyDown: handleKeyDown,
    onBlur: handleBlur,
    onFocus: handleFocus,
    onCompositionStart: () => {
      isComposingRef.current = true;
    },
    onCompositionEnd: () => {
      isComposingRef.current = false;
    },
    role: "combobox",
    "aria-expanded": isOpen,
  };

  const listProps: ListProps = {
    role: "listbox",
    onMouseDown: (e) => {
      // blur を先に起こさせない
      e.preventDefault();
    },
  };

  const getItemProps = (index: number): ItemProps => ({
    role: "option",
    "aria-selected": index === highlightedIndex,
    onMouseEnter: () => {
      setHighlightedIndex(index);
    },
    onMouseDown: (e) => {
      e.preventDefault();
      selectItem(filteredItems[index]);
    },
  });

  const getHighlightedItem = () => {
    if (highlightedIndex < 0 || highlightedIndex >= filteredItems.length) {
      return undefined;
    }
    return filteredItems[highlightedIndex];
  };

  return {
    inputProps,
    listProps,
    getItemProps,
    inputValue,
    isOpen,
    setOpen: (open: boolean) => setIsOpen(open),
    highlightedIndex,
    highlightedItem: getHighlightedItem(),
    filteredItems,
  };
}
