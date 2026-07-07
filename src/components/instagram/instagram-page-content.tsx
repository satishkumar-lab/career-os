"use client";

import { useMemo, useState } from "react";

import { ContentBreakdown } from "@/components/instagram/content-breakdown";
import { FollowerGrowthCard } from "@/components/instagram/follower-growth-card";
import { InstagramHeader } from "@/components/instagram/instagram-header";
import { InstagramPostFormModal } from "@/components/instagram/instagram-post-form-modal";
import { InstagramPostsCard } from "@/components/instagram/instagram-posts-card";
import { StatsRow } from "@/components/dashboard/stats-row";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { ToastProvider, useToast } from "@/components/shared/toast-provider";
import {
  addInstagramPost,
  archiveInstagramPost,
  buildContentBreakdown,
  buildFollowerGrowthData,
  buildFollowerGrowthSummary,
  buildInstagramStats,
  editInstagramPost,
  findPersistedInstagramPost,
  getFeaturedInstagramPosts,
  removeInstagramPost,
  restoreInstagramPost,
  setInstagramPostFavourite,
  toInstagramPosts,
  type InstagramPostInput,
  type PersistedInstagramPost,
} from "@/lib/instagram/storage";
import { useInstagramState } from "@/lib/instagram/use-instagram-state";
import { usePageSearch } from "@/lib/search/search-context";
import { filterPersistedInstagramPosts } from "@/lib/search/page-filters";

function InstagramPageInner() {
  const [state, setState] = useInstagramState();
  const { normalizedQuery, isSearchActive } = usePageSearch();
  const { showToast } = useToast();

  const [formOpen, setFormOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<PersistedInstagramPost | undefined>();
  const [deletePost, setDeletePost] = useState<PersistedInstagramPost | undefined>();
  const [deleteOpen, setDeleteOpen] = useState(false);

  const posts = useMemo(() => {
    if (!state) {
      return [];
    }

    const featuredPosts = getFeaturedInstagramPosts(state);
    const filtered = filterPersistedInstagramPosts(featuredPosts, normalizedQuery);
    const activePosts = toInstagramPosts(filtered.filter((post) => !post.archived));
    const archivedPosts = toInstagramPosts(filtered.filter((post) => post.archived));

    return [...activePosts, ...archivedPosts];
  }, [state, normalizedQuery]);

  if (!state) {
    return null;
  }

  const stats = buildInstagramStats(state);
  const followerGrowthSummary = buildFollowerGrowthSummary(state);
  const followerGrowthData = buildFollowerGrowthData(state);
  const contentBreakdown = buildContentBreakdown(state);

  const handleLogPost = () => {
    setEditingPost(undefined);
    setFormOpen(true);
  };

  const handleEditPost = (id: string) => {
    const post = findPersistedInstagramPost(state, id);

    if (!post) {
      return;
    }

    setEditingPost(post);
    setFormOpen(true);
  };

  const handleSavePost = (input: InstagramPostInput) => {
    if (editingPost) {
      setState((current) =>
        current ? editInstagramPost(current, editingPost.id, input) : current
      );
      showToast("Instagram post updated successfully.");
      return;
    }

    setState((current) => (current ? addInstagramPost(current, input) : current));
    showToast("Instagram post added successfully.");
  };

  const handleDeleteRequest = (id: string) => {
    const post = findPersistedInstagramPost(state, id);

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

    setState((current) => (current ? removeInstagramPost(current, deletePost.id) : current));
    showToast("Instagram post deleted successfully.");
    setDeleteOpen(false);
    setDeletePost(undefined);
  };

  const handleArchive = (id: string) => {
    setState((current) => (current ? archiveInstagramPost(current, id) : current));
    showToast("Instagram post archived successfully.");
  };

  const handleRestore = (id: string) => {
    setState((current) => (current ? restoreInstagramPost(current, id) : current));
    showToast("Instagram post restored successfully.");
  };

  const handleToggleFavourite = (id: string) => {
    const post = findPersistedInstagramPost(state, id);

    if (!post) {
      return;
    }

    const favourite = !post.favourite;
    setState((current) => (current ? setInstagramPostFavourite(current, id, favourite) : current));
    showToast(
      favourite ? "Instagram post added to favourites." : "Instagram post removed from favourites."
    );
  };

  return (
    <>
      <div className="flex flex-col gap-6">
        <InstagramHeader onLogPost={handleLogPost} />

        <StatsRow stats={stats} />

        <FollowerGrowthCard summary={followerGrowthSummary} data={followerGrowthData} />

        <ContentBreakdown items={contentBreakdown} />

        <InstagramPostsCard
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

      <InstagramPostFormModal
        open={formOpen}
        onOpenChange={setFormOpen}
        post={editingPost}
        onSave={handleSavePost}
      />

      <ConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Delete Instagram post?"
        description={
          deletePost
            ? `This will permanently remove "${deletePost.postTitle}" from your Instagram tracker.`
            : "This will permanently remove this Instagram post."
        }
        onConfirm={handleConfirmDelete}
      />
    </>
  );
}

export function InstagramPageContent() {
  return (
    <ToastProvider>
      <InstagramPageInner />
    </ToastProvider>
  );
}
