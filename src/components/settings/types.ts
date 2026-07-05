export interface ProfileSettings {
  name: string;
  email: string;
  initials: string;
  title: string;
  location: string;
  bio: string;
}

export interface CareerPreferences {
  targetRole: string;
  targetIndustry: string;
  workMode: string;
  openToRoles: boolean;
}

export interface ToggleSetting {
  id: string;
  label: string;
  description: string;
  enabled: boolean;
  disabled?: boolean;
}

export interface IntegrationSetting {
  id: string;
  name: string;
  description: string;
}

export interface AppearanceSettings {
  darkMode: boolean;
  compactSidebar: boolean;
}
