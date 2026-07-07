"use client";

import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";

export interface CertificationsHeaderProps {
  onAddCertification: () => void;
}

export function CertificationsHeader({ onAddCertification }: CertificationsHeaderProps) {
  return (
    <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-[24px]">Certifications</h1>
        <p className="mt-1 text-[13.5px] text-muted-foreground">Track every certification from start to credential.</p>
      </div>
      <Button className="rounded-2xl px-4 py-2 shadow-sm" onClick={onAddCertification}>
        <Plus className="size-3.5" />
        Add Cert
      </Button>
    </div>
  );
}
