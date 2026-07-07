import {
  Award,
  Briefcase,
  BookOpen,
  Camera,
  Code2,
  FolderOpen,
  LayoutDashboard,
  Share2,
  Sparkles,
  Target,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

export interface NavSection {
  title?: string;
  items: NavItem[];
}

/**
 * Application-wide navigation structure, per the CareerOS Figma design.
 * Shared by the desktop sidebar and the mobile navigation drawer.
 */
export const navSections: NavSection[] = [
  {
    items: [{ label: "Dashboard", href: "/dashboard", icon: LayoutDashboard }],
  },
  {
    title: "Build",
    items: [
      { label: "Learning", href: "/learning", icon: BookOpen },
      { label: "AI Tools", href: "/ai-tools", icon: Sparkles },
      { label: "Certifications", href: "/certifications", icon: Award },
      { label: "Projects", href: "/projects", icon: Code2 },
      { label: "Portfolio", href: "/portfolio", icon: FolderOpen },
    ],
  },
  {
    title: "Grow",
    items: [
      { label: "Job Tracker", href: "/job-tracker", icon: Briefcase },
      { label: "LinkedIn", href: "/linkedin", icon: Share2 },
      { label: "Instagram", href: "/instagram", icon: Camera },
      { label: "Goals", href: "/goals", icon: Target },
    ],
  },
];
