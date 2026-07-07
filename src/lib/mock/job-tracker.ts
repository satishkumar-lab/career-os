export interface JobApplicationSeed {
  id: string;
  company: string;
  role: string;
}

export const jobApplications: JobApplicationSeed[] = [
  { id: "figma", company: "Figma", role: "Senior Product Manager" },
  { id: "stripe", company: "Stripe", role: "Product Manager II" },
  { id: "linear", company: "Linear", role: "Senior PM" },
  { id: "notion", company: "Notion", role: "Product Lead" },
];
