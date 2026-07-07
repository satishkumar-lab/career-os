export function readStorage<T>(key: string): T | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) {
      return null;
    }

    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

export function writeStorage<T>(key: string, value: T): void {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(key, JSON.stringify(value));

  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("career-os-storage-change"));
  }
}

export function initStorage<T>(key: string, seed: T): T {
  const existing = readStorage<T>(key);

  if (existing) {
    return existing;
  }

  writeStorage(key, seed);
  return seed;
}
