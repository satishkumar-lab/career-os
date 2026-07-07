"use client";

import { useEffect, useMemo, useState } from "react";

import { ApplicationsList } from "@/components/job-tracker/applications-list";
import { JobApplicationFormModal } from "@/components/job-tracker/job-application-form-modal";
import { JobTrackerHeader } from "@/components/job-tracker/job-tracker-header";
import { PipelineCard } from "@/components/job-tracker/pipeline-card";
import { PipelineStageFormModal } from "@/components/job-tracker/pipeline-stage-form-modal";
import { StatsRow } from "@/components/dashboard/stats-row";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { ToastProvider, useToast } from "@/components/shared/toast-provider";
import type { PipelineStageStatus } from "@/components/job-tracker/types";
import {
  addJobApplication,
  addPipelineStage,
  archiveJobApplication,
  buildJobTrackerStats,
  calculatePipelineProgress,
  deletePipelineStage,
  editJobApplication,
  findPersistedJobApplication,
  removeJobApplication,
  renamePipelineStage,
  reorderPipelineStage,
  restoreJobApplication,
  setJobApplicationFavourite,
  setPipelineStageStatus,
  toJobApplications,
  type JobApplicationInput,
  type PersistedJobApplication,
} from "@/lib/job-tracker/storage";
import { useJobTrackerState } from "@/lib/job-tracker/use-job-tracker-state";
import { usePageSearch } from "@/lib/search/search-context";
import { filterPersistedJobApplications } from "@/lib/search/page-filters";

function JobTrackerPageInner() {
  const [state, setState] = useJobTrackerState();
  const { normalizedQuery, isSearchActive } = usePageSearch();
  const { showToast } = useToast();

  const [selectedApplicationId, setSelectedApplicationId] = useState<string>();
  const [formOpen, setFormOpen] = useState(false);
  const [editingApplication, setEditingApplication] = useState<PersistedJobApplication | undefined>();
  const [deleteApplication, setDeleteApplication] = useState<PersistedJobApplication | undefined>();
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [stageFormOpen, setStageFormOpen] = useState(false);
  const [stageFormMode, setStageFormMode] = useState<"add" | "rename">("add");
  const [editingStageId, setEditingStageId] = useState<string>();
  const [editingStageName, setEditingStageName] = useState("");
  const [deleteStageId, setDeleteStageId] = useState<string>();
  const [deleteStageOpen, setDeleteStageOpen] = useState(false);

  useEffect(() => {
    if (!state || selectedApplicationId) {
      return;
    }

    const firstApplication = state.applications.find((application) => !application.archived);

    if (firstApplication) {
      setSelectedApplicationId(firstApplication.id);
    }
  }, [state, selectedApplicationId]);

  const filteredPersistedApplications = useMemo(
    () =>
      state ? filterPersistedJobApplications(state.applications, normalizedQuery) : [],
    [state, normalizedQuery]
  );
  const applications = useMemo(() => {
    const activeApplications = toJobApplications(
      filteredPersistedApplications.filter((application) => !application.archived)
    );
    const archivedApplications = toJobApplications(
      filteredPersistedApplications.filter((application) => application.archived)
    );

    return [...activeApplications, ...archivedApplications];
  }, [filteredPersistedApplications]);

  if (!state) {
    return null;
  }

  const stats = buildJobTrackerStats(state);
  const selectedApplication = selectedApplicationId
    ? findPersistedJobApplication(state, selectedApplicationId)
    : undefined;
  const selectedInFiltered =
    !!selectedApplicationId &&
    filteredPersistedApplications.some((application) => application.id === selectedApplicationId);
  const pipelineStages = selectedApplication?.pipeline ?? [];
  const pipelineProgress = calculatePipelineProgress(pipelineStages);

  const handleAddApplication = () => {
    setEditingApplication(undefined);
    setFormOpen(true);
  };

  const handleEditApplication = (id: string) => {
    const application = findPersistedJobApplication(state, id);

    if (!application) {
      return;
    }

    setEditingApplication(application);
    setFormOpen(true);
  };

  const handleSaveApplication = (input: JobApplicationInput) => {
    if (editingApplication) {
      setState((current) =>
        current ? editJobApplication(current, editingApplication.id, input) : current
      );
      showToast("Job application updated successfully.");
      return;
    }

    setState((current) => (current ? addJobApplication(current, input) : current));
    showToast("Job application added successfully.");
  };

  const handleDeleteRequest = (id: string) => {
    const application = findPersistedJobApplication(state, id);

    if (!application) {
      return;
    }

    setDeleteApplication(application);
    setDeleteOpen(true);
  };

  const handleConfirmDelete = () => {
    if (!deleteApplication) {
      return;
    }

    setState((current) =>
      current ? removeJobApplication(current, deleteApplication.id) : current
    );

    if (selectedApplicationId === deleteApplication.id) {
      setSelectedApplicationId(undefined);
    }

    showToast("Job application deleted successfully.");
    setDeleteOpen(false);
    setDeleteApplication(undefined);
  };

  const handleArchive = (id: string) => {
    setState((current) => (current ? archiveJobApplication(current, id) : current));
    showToast("Job application archived successfully.");
  };

  const handleRestore = (id: string) => {
    setState((current) => (current ? restoreJobApplication(current, id) : current));
    showToast("Job application restored successfully.");
  };

  const handleToggleFavourite = (id: string) => {
    const application = findPersistedJobApplication(state, id);

    if (!application) {
      return;
    }

    const favourite = !application.favourite;
    setState((current) => (current ? setJobApplicationFavourite(current, id, favourite) : current));
    showToast(
      favourite ? "Job application added to favourites." : "Job application removed from favourites."
    );
  };

  const handleAddStage = () => {
    setStageFormMode("add");
    setEditingStageId(undefined);
    setEditingStageName("");
    setStageFormOpen(true);
  };

  const handleRenameStage = (stageId: string) => {
    const stage = pipelineStages.find((item) => item.id === stageId);

    if (!stage) {
      return;
    }

    setStageFormMode("rename");
    setEditingStageId(stageId);
    setEditingStageName(stage.name);
    setStageFormOpen(true);
  };

  const handleSaveStage = (name: string) => {
    if (!selectedApplicationId) {
      return;
    }

    if (stageFormMode === "rename" && editingStageId) {
      setState((current) =>
        current ? renamePipelineStage(current, selectedApplicationId, editingStageId, name) : current
      );
      showToast("Pipeline stage renamed successfully.");
      return;
    }

    setState((current) =>
      current ? addPipelineStage(current, selectedApplicationId, name) : current
    );
    showToast("Pipeline stage added successfully.");
  };

  const handleDeleteStageRequest = (stageId: string) => {
    setDeleteStageId(stageId);
    setDeleteStageOpen(true);
  };

  const handleConfirmDeleteStage = () => {
    if (!selectedApplicationId || !deleteStageId) {
      return;
    }

    setState((current) =>
      current ? deletePipelineStage(current, selectedApplicationId, deleteStageId) : current
    );
    showToast("Pipeline stage deleted successfully.");
    setDeleteStageOpen(false);
    setDeleteStageId(undefined);
  };

  const handleMoveStageUp = (stageId: string) => {
    if (!selectedApplicationId) {
      return;
    }

    setState((current) =>
      current ? reorderPipelineStage(current, selectedApplicationId, stageId, "up") : current
    );
  };

  const handleMoveStageDown = (stageId: string) => {
    if (!selectedApplicationId) {
      return;
    }

    setState((current) =>
      current ? reorderPipelineStage(current, selectedApplicationId, stageId, "down") : current
    );
  };

  const handleChangeStageStatus = (stageId: string, status: PipelineStageStatus) => {
    if (!selectedApplicationId) {
      return;
    }

    setState((current) =>
      current ? setPipelineStageStatus(current, selectedApplicationId, stageId, status) : current
    );
  };

  return (
    <>
      <div className="flex flex-col gap-6">
        <JobTrackerHeader onAddApplication={handleAddApplication} />

        <StatsRow stats={stats} />

        {selectedApplication && selectedInFiltered && (
          <PipelineCard
            companyName={selectedApplication.companyName}
            stages={pipelineStages}
            progress={pipelineProgress}
            onAddStage={handleAddStage}
            onRenameStage={handleRenameStage}
            onDeleteStage={handleDeleteStageRequest}
            onMoveStageUp={handleMoveStageUp}
            onMoveStageDown={handleMoveStageDown}
            onChangeStageStatus={handleChangeStageStatus}
          />
        )}

        <ApplicationsList
          applications={applications}
          isSearchEmpty={isSearchActive}
          selectedApplicationId={selectedApplicationId}
          onSelect={setSelectedApplicationId}
          onEdit={handleEditApplication}
          onDelete={handleDeleteRequest}
          onArchive={handleArchive}
          onRestore={handleRestore}
          onToggleFavourite={handleToggleFavourite}
        />
      </div>

      <JobApplicationFormModal
        open={formOpen}
        onOpenChange={setFormOpen}
        application={editingApplication}
        onSave={handleSaveApplication}
      />

      <PipelineStageFormModal
        open={stageFormOpen}
        onOpenChange={setStageFormOpen}
        title={stageFormMode === "rename" ? "Rename Stage" : "Add Stage"}
        initialName={editingStageName}
        submitLabel={stageFormMode === "rename" ? "Save Changes" : "Add Stage"}
        onSave={handleSaveStage}
      />

      <ConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Delete job application?"
        description={
          deleteApplication
            ? `This will permanently remove "${deleteApplication.companyName}" from your job tracker.`
            : "This will permanently remove this job application."
        }
        onConfirm={handleConfirmDelete}
      />

      <ConfirmDialog
        open={deleteStageOpen}
        onOpenChange={setDeleteStageOpen}
        title="Delete pipeline stage?"
        description="This will permanently remove this stage from the pipeline."
        onConfirm={handleConfirmDeleteStage}
      />
    </>
  );
}

export function JobTrackerPageContent() {
  return (
    <ToastProvider>
      <JobTrackerPageInner />
    </ToastProvider>
  );
}
