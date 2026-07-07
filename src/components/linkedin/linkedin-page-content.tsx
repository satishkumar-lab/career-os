"use client";

import { useMemo, useState } from "react";

import { FollowerGrowthCard } from "@/components/linkedin/follower-growth-card";
import { LinkedInHeader } from "@/components/linkedin/linkedin-header";
import { LinkedInPostFormModal } from "@/components/linkedin/linkedin-post-form-modal";
import { RecentPostsCard } from "@/components/linkedin/recent-posts-card";
import { StatsRow } from "@/components/dashboard/stats-row";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { ToastProvider, useToast } from "@/components/shared/toast-provider";
import {
  addLinkedInPost,
  archiveLinkedInPost,
  buildFollowerGrowthData,
  buildFollowerGrowthSummary,
  buildLinkedInStats,
  editLinkedInPost,
  findPersistedLinkedInPost,
  removeLinkedInPost,
  restoreLinkedInPost,
  setLinkedInPostFavourite,
  toLinkedInPosts,
  type LinkedInPostInput,
  type PersistedLinkedInPost,
} from "@/lib/linkedin/storage";
import { useLinkedInState } from "@/lib/linkedin/use-linkedin-state";
import { usePageSearch } from "@/lib/search/search-context";
import { filterPersistedLinkedInPosts } from "@/lib/search/page-filters";

function LinkedInPageInner() {
  const [state, setState] = useLinkedInState();
  const { normalizedQuery, isSearchActive } = usePageSearch();
  const { showToast } = useToast();

  const [formOpen, setFormOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<PersistedLinkedInPost | undefined>();
  const [deletePost, setDeletePost] = useState<PersistedLinkedInPost | undefined>();
  const [deleteOpen, setDeleteOpen] = useState(false);

  const posts = useMemo(() => {
    if (!state) {
      return [];
    }

    const filtered = filterPersistedLinkedInPosts(state.posts, normalizedQuery);
    const activePosts = toLinkedInPosts(filtered.filter((post) => !post.archived));
    const archivedPosts = toLinkedInPosts(filtered.filter((post) => post.archived));

    return [...activePosts, ...archivedPosts];
  }, [state, normalizedQuery]);

  if (!state) {
    return null;
  }

  const stats = buildLinkedInStats(state);
  const followerGrowthSummary = buildFollowerGrowthSummary(state);
  const followerGrowthData = buildFollowerGrowthData(state);

  const handleLogPost = () => {
    setEditingPost(undefined);
    setFormOpen(true);
  };

  const handleEditPost = (id: string) => {
    const post = findPersistedLinkedInPost(state, id);

    if (!post) {
      return;
    }

    setEditingPost(post);
    setFormOpen(true);
  };

  const handleSavePost = (input: LinkedInPostInput) => {
    if (editingPost) {
      setState((current) => (current ? editLinkedInPost(current, editingPost.id, input) : current));
      showToast("LinkedIn post updated successfully.");
      return;
    }

    setState((current) => (current ? addLinkedInPost(current, input) : current));
    showToast("LinkedIn post added successfully.");
  };

  const handleDeleteRequest = (id: string) => {
    const post = findPersistedLinkedInPost(state, id);

    if (!post) {
      return;
    }

    setDeletePost(post);
    setDeleteOpen(true);
  };

  const handleConfirmDelete = () => {
    if (!deletePost) {
      return;
    }

    setState((current) => (current ? removeLinkedInPost(current, deletePost.id) : current));
    showToast("LinkedIn post deleted successfully.");
    setDeleteOpen(false);
    setDeletePost(undefined);
  };

  const handleArchive = (id: string) => {
    setState((current) => (current ? archiveLinkedInPost(current, id) : current));
    showToast("LinkedIn post archived successfully.");
  };

  const handleRestore = (id: string) => {
    setState((current) => (current ? restoreLinkedInPost(current, id) : current));
    showToast("LinkedIn post restored successfully.");
  };

  const handleToggleFavourite = (id: string) => {
    const post = findPersistedLinkedInPost(state, id);

    if (!post) {
      return;
    }

    const favourite = !post.favourite;
    setState((current) => (current ? setLinkedInPostFavourite(current, id, favourite) : current));
    showToast(favourite ? "LinkedIn post added to favourites." : "LinkedIn post removed from favourites.");
  };

  return (
    <>
      <div className="flex flex-col gap-6">
        <LinkedInHeader onLogPost={handleLogPost} />

        <StatsRow stats={stats} />

        <FollowerGrowthCard summary={followerGrowthSummary} data={followerGrowthData} />

        <RecentPostsCard
          posts={posts}
          isSearchEmpty={isSearchActive}
          onLogPost={handleLogPost}
          onEdit={handleEditPost}
          onDelete={handleDeleteRequest}
          onArchive={handleArchive}
          onRestore={handleRestore}
          onToggleFavourite={handleToggleFavourite}
        />
      </div>

      <LinkedInPostFormModal
        open={formOpen}
        onOpenChange={setFormOpen}
        post={editingPost}
        onSave={handleSavePost}
      />

      <ConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Delete LinkedIn post?"
        description={
          deletePost
            ? `This will permanently remove "${deletePost.postTitle}" from your LinkedIn tracker.`
            : "This will permanently remove this LinkedIn post."
        }
        onConfirm={handleConfirmDelete}
      />
    </>
  );
}

export function LinkedInPageContent() {
  return (
    <ToastProvider>
      <LinkedInPageInner />
    </ToastProvider>
  );
}
