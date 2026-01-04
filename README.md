# simple-react-combobox

A simple, headless React hook for building **combobox-style autocompletes**.

This library provides only behavior and state management.
You are free to render the UI however you like.

- Headless
- Lightweight
- No external dependencies
- IME-safe (Japanese / Chinese input supported)

---

## Installation

```bash
npm install simple-react-combobox
```

## Basic Usage

```
import { useCombobox } from "simple-react-combobox";

const items = ["Apple", "Banana", "Orange", "Grape"];

export function Example() {
  const {
    inputProps,
    listProps,
    getItemProps,
    isOpen,
    filteredItems,
  } = useCombobox({
    items,
    onSelect: (item) => {
      console.log("selected:", item);
    },
  });

  return (
    <div>
      <input {...inputProps} />

      {isOpen && filteredItems.length > 0 && (
        <ul {...listProps}>
          {filteredItems.map((item, index) => (
            <li key={item} {...getItemProps(index)}>
              {item}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
```

## API

```
useCombobox<T>(options)
```

## Options

```
type UseComboboxOptions<T> = {
  items: readonly T[];
  itemToString?: (item: T) => string;
  onSelect?: (item: T) => void;
  openOnFocus?: boolean;
  filterFn?: (items: readonly T[], inputValue: string) => readonly T[];
};
```

`items` (required)

The source items for the combobox.

`itemToString`

Converts an item to a string for display and filtering.

Default: String

`onSelect`

Called when an item is selected via mouse or keyboard.

`openOnFocus`

If true, opens the list when the input receives focus.

Default: false

`filterFn`

Custom filtering logic.
If omitted, a case-insensitive substring match is used.

```
const defaultFilter: FilterFn<T> = (items, input) =>
  input === ""
    ? items
    : items.filter((i) =>
      itemToString(i).toLowerCase().includes(input.toLowerCase())
    );
```

## Return Value

```
type UseComboboxResult<T> = {
  inputProps: TextInputProps;
  listProps: ListProps;
  getItemProps: (index: number) => ItemProps;

  inputValue: string;
  isOpen: boolean;
  setOpen: (open: boolean) => void;

  highlightedIndex: number;
  highlightedItem?: T;

  filteredItems: readonly T[];
};
```

`inputProps`

Props for the `<input type="text">`.

Includes:

- value
- onChange
- onKeyDown
- IME composition handlers
- ARIA attributes (`role="combobox"`)

`listProps`

Props for the list container (e.g. `<ul>`).

Includes:

- role="listbox"
- onMouseDown guard to prevent premature blur

`getItemProps(index)`

Props for each item element (e.g. `<li>`).

Handles:

- mouse hover
- mouse selection
- ARIA attributes

`inputValue`

The current input value.

`isOpen`

Whether the list is currently open.

`setOpen(open: boolean)`

Imperatively control the open state.
Useful for closing on outside click, etc.

`highlightedIndex`

The currently highlighted index within filteredItems.

`highlightedItem`

The currently highlighted item, or undefined.

`filteredItems`

Items after filtering based on the current input value.

## Design Notes

### Headless by design

This hook does not render any UI.
You control all markup and styling.

### Filtering responsibility

Filtering is handled internally by default.
You can fully override it with filterFn if needed.

### Index semantics

All indices (highlightedIndex, getItemProps) are based on
filteredItems, not the original items.

### IME-safe

Composition events are handled internally to avoid breaking
Japanese / Chinese input.

### Accessibility

This hook applies appropriate ARIA roles:

- combobox
- listbox
- option

You are responsible for final markup and styling.

## License

MIT
