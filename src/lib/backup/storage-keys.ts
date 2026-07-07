import { CAREER_OS_KEY_PREFIXES } from "@/lib/backup/constants";

export function isCareerOsStorageKey(key: string): boolean {
  return CAREER_OS_KEY_PREFIXES.some((prefix) => key.startsWith(prefix));
}

export function getCareerOsStorageKeys(): string[] {
  if (typeof window === "undefined") {
    return [];
  }

  const keys: string[] = [];

  for (let index = 0; index < window.localStorage.length; index += 1) {
    const key = window.localStorage.key(index);

    if (key && isCareerOsStorageKey(key)) {
      keys.push(key);
    }
  }

  return keys.sort();
}

export function collectCareerOsStorageData(): Record<string, unknown> {
  const data: Record<string, unknown> = {};

  getCareerOsStorageKeys().forEach((key) => {
    const raw = window.localStorage.getItem(key);

    if (!raw) {
      return;
    }

    try {
      data[key] = JSON.parse(raw) as unknown;
    } catch {
      data[key] = raw;
    }
  });

  return data;
}
