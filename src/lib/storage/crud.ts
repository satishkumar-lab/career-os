export function generateId(prefix: string): string {
  return `${prefix}-${crypto.randomUUID()}`;
}

export function createItem<T extends { id: string }>(items: T[], item: T): T[] {
  return [...items, item];
}

export function updateItem<T extends { id: string }>(
  items: T[],
  id: string,
  patch: Partial<T>
): T[] {
  return items.map((item) => (item.id === id ? { ...item, ...patch } : item));
}

export function deleteItem<T extends { id: string }>(items: T[], id: string): T[] {
  return items.filter((item) => item.id !== id);
}

export function findItem<T extends { id: string }>(items: T[], id: string): T | undefined {
  return items.find((item) => item.id === id);
}
