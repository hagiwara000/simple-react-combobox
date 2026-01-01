export type FilterFn<T> = (
  items: readonly T[],
  inputValue: string,
  itemToString: (item: T) => string
) => readonly T[];

export const defaultFilter = <T>(
  items: readonly T[],
  input: string,
  itemToString: (item: T) => string = String
): readonly T[] =>
  input === ""
    ? items
    : items.filter((item) =>
        itemToString(item).toLowerCase().includes(input.toLowerCase())
      );
