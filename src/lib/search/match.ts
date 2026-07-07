function normalizeField(value: string | undefined | null): string {
  return value?.toLowerCase() ?? "";
}

export function matchesSearch(
  normalizedQuery: string,
  ...fields: (string | undefined | null | string[])[]
): boolean {
  if (!normalizedQuery) {
    return true;
  }

  return fields.some((field) => {
    if (Array.isArray(field)) {
      return field.some((item) => normalizeField(item).includes(normalizedQuery));
    }

    return normalizeField(field).includes(normalizedQuery);
  });
}
