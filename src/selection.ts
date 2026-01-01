export function canSelect(
  isOpen: boolean,
  highlightedIndex: number,
  length: number
): boolean {
  return isOpen && highlightedIndex >= 0 && highlightedIndex < length;
}
