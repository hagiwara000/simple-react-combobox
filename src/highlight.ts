export function moveHighlight(
  current: number,
  delta: 1 | -1,
  length: number
): number {
  if (length <= 0) return -1;
  const next = current + delta;
  if (next < 0) return 0;
  if (next >= length) return length - 1;
  return next;
}
