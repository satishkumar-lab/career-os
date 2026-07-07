"use client";

import { useMemo, useState } from "react";

import { CertificationFormModal } from "@/components/certifications/certification-form-modal";
import { CertificationsHeader } from "@/components/certifications/certifications-header";
import { CertificationsList } from "@/components/certifications/certifications-list";
import { StatsRow } from "@/components/dashboard/stats-row";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { ToastProvider, useToast } from "@/components/shared/toast-provider";
import {
  addCertification,
  buildCertificationStats,
  editCertification,
  findPersistedCertification,
  removeCertification,
  toCertifications,
  type CertificationInput,
  type PersistedCertification,
} from "@/lib/certifications/storage";
import { useCertificationsState } from "@/lib/certifications/use-certifications-state";
import { usePageSearch } from "@/lib/search/search-context";
import { filterPersistedCertifications } from "@/lib/search/page-filters";

function CertificationsPageInner() {
  const [state, setState] = useCertificationsState();
  const { normalizedQuery, isSearchActive } = usePageSearch();
  const { showToast } = useToast();

  const [formOpen, setFormOpen] = useState(false);
  const [editingCertification, setEditingCertification] = useState<PersistedCertification | undefined>();
  const [deleteCertification, setDeleteCertification] = useState<PersistedCertification | undefined>();
  const [deleteOpen, setDeleteOpen] = useState(false);

  const certifications = useMemo(() => {
    if (!state) {
      return [];
    }

    const visibleCertifications = filterPersistedCertifications(
      state.certifications.filter((cert) => !cert.archived),
      normalizedQuery
    );

    return toCertifications(visibleCertifications);
  }, [state, normalizedQuery]);

  if (!state) {
    return null;
  }

  const stats = buildCertificationStats(state);

  const handleAddCertification = () => {
    setEditingCertification(undefined);
    setFormOpen(true);
  };

  const handleEditCertification = (id: string) => {
    const certification = findPersistedCertification(state, id);

    if (!certification) {
      return;
    }

    setEditingCertification(certification);
    setFormOpen(true);
  };

  const handleSaveCertification = (input: CertificationInput) => {
    if (editingCertification) {
      setState((current) =>
        current ? editCertification(current, editingCertification.id, input) : current
      );
      showToast("Certification updated successfully.");
      return;
    }

    setState((current) => (current ? addCertification(current, input) : current));
    showToast("Certification added successfully.");
  };

  const handleDeleteRequest = (id: string) => {
    const certification = findPersistedCertification(state, id);

    if (!certification) {
      return;
    }

    setDeleteCertification(certification);
    setDeleteOpen(true);
  };

  const handleConfirmDelete = () => {
    if (!deleteCertification) {
      return;
    }

    setState((current) =>
      current ? removeCertification(current, deleteCertification.id) : current
    );
    showToast("Certification deleted successfully.");
    setDeleteOpen(false);
    setDeleteCertification(undefined);
  };

  return (
    <>
      <div className="flex flex-col gap-6">
        <CertificationsHeader onAddCertification={handleAddCertification} />

        <StatsRow stats={stats} />

        <CertificationsList
          certifications={certifications}
          isSearchEmpty={isSearchActive}
          onEdit={handleEditCertification}
          onDelete={handleDeleteRequest}
        />
      </div>

      <CertificationFormModal
        open={formOpen}
        onOpenChange={setFormOpen}
        certification={editingCertification}
        onSave={handleSaveCertification}
      />

      <ConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Delete certification?"
        description={
          deleteCertification
            ? `This will permanently remove "${deleteCertification.name}" from your certifications.`
            : "This will permanently remove this certification."
        }
        onConfirm={handleConfirmDelete}
      />
    </>
  );
}

export function CertificationsPageContent() {
  return (
    <ToastProvider>
      <CertificationsPageInner />
    </ToastProvider>
  );
}
