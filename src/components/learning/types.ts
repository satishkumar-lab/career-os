export interface WeeklyHoursPoint {
  label: string;
  hours: number;
}

export interface Course {
  id: string;
  title: string;
  provider: string;
  moduleLabel: string;
  timeLeftLabel: string;
  percent: number;
  color: string;
  tint: string;
  icon: "analytics" | "leadership" | "cloud";
  status: "active" | "completed";
}
