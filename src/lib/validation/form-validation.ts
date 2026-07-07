export interface FieldRule {
  required?: boolean;
  min?: number;
  max?: number;
  url?: boolean;
  email?: boolean;
}

export type ValidationSchema = Record<string, FieldRule>;

export function validateFields(
  values: Record<string, unknown>,
  schema: ValidationSchema
): Record<string, string> {
  const errors: Record<string, string> = {};

  for (const [field, rule] of Object.entries(schema)) {
    const value = values[field];

    if (rule.required) {
      if (value === undefined || value === null || String(value).trim() === "") {
        errors[field] = "This field is required.";
        continue;
      }

      if (typeof value === "number" && Number.isNaN(value)) {
        errors[field] = "This field is required.";
        continue;
      }
    }

    if (typeof value === "number" && rule.min !== undefined && value < rule.min) {
      errors[field] = `Must be at least ${rule.min}.`;
    }

    if (typeof value === "number" && rule.max !== undefined && value > rule.max) {
      errors[field] = `Must be at most ${rule.max}.`;
    }

    if (rule.url) {
      const urlValue = String(value ?? "").trim();

      if (urlValue !== "") {
        try {
          new URL(urlValue);
        } catch {
          errors[field] = "Enter a valid URL.";
        }
      }
    }

    if (rule.email) {
      const emailValue = String(value ?? "").trim();

      if (emailValue !== "" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailValue)) {
        errors[field] = "Enter a valid email.";
      }
    }
  }

  return errors;
}

export function hasValidationErrors(errors: Record<string, string>): boolean {
  return Object.keys(errors).length > 0;
}
