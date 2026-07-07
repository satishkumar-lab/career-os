"use client";

import {
  Archive,
  ArchiveRestore,
  MoreHorizontal,
  Pencil,
  Plus,
  Share2,
  Star,
  Trash2,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { cardShell, listRowHover } from "@/lib/interaction-styles";
import { SearchEmptyState } from "@/components/shared/search-empty-state";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { LinkedInPost } from "@/components/linkedin/types";

interface PostRowProps {
  post: LinkedInPost;
  isLast: boolean;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onArchive: (id: string) => void;
  onRestore: (id: string) => void;
  onToggleFavourite: (id: string) => void;
}

function PostRow({
  post,
  isLast,
  onEdit,
  onDelete,
  onArchive,
  onRestore,
  onToggleFavourite,
}: PostRowProps) {
  return (
    <div
      className={cn(
        "flex flex-wrap items-center gap-4 px-6 py-4 sm:flex-nowrap",
        listRowHover,
        !isLast && "border-b border-border"
      )}
    >
      <span className="flex size-9 shrink-0 items-center justify-center rounded-2xl bg-[rgba(10,102,194,0.12)]">
        <Share2 className="size-[15px] text-[#0a66c2]" />
      </span>

      <div className="min-w-0 flex-1">
        <p className="truncate text-[13.5px] font-medium text-foreground">{post.title}</p>
        <p className="mt-0.5 text-[11.5px] font-medium text-muted-foreground">{post.dateLabel}</p>
      </div>

      <div className="shrink-0 text-right">
        <p className="text-sm font-medium text-foreground">{post.reach}</p>
        <p className="text-[11px] font-medium text-muted-foreground">{post.likesLabel}</p>
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button
              variant="ghost"
              size="icon-sm"
              className="size-7 shrink-0 text-muted-foreground"
              aria-label={`Actions for ${post.title}`}
            />
          }
        >
          <MoreHorizontal className="size-3.5" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => onEdit(post.id)}>
            <Pencil className="size-3.5" />
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onToggleFavourite(post.id)}>
            <Star className="size-3.5" />
            {post.favourite ? "Unfavourite" : "Favourite"}
          </DropdownMenuItem>
          {post.archived ? (
            <DropdownMenuItem onClick={() => onRestore(post.id)}>
              <ArchiveRestore className="size-3.5" />
              Restore
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem onClick={() => onArchive(post.id)}>
              <Archive className="size-3.5" />
              Archive
            </DropdownMenuItem>
          )}
          <DropdownMenuSeparator />
          <DropdownMenuItem variant="destructive" onClick={() => onDelete(post.id)}>
            <Trash2 className="size-3.5" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

export interface RecentPostsCardProps {
  posts: LinkedInPost[];
  isSearchEmpty?: boolean;
  onLogPost: () => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onArchive: (id: string) => void;
  onRestore: (id: string) => void;
  onToggleFavourite: (id: string) => void;
}

export function RecentPostsCard({
  posts,
  isSearchEmpty = false,
  onLogPost,
  onEdit,
  onDelete,
  onArchive,
  onRestore,
  onToggleFavourite,
}: RecentPostsCardProps) {
  return (
    <div className={cardShell}>
      <div className="flex items-center justify-between border-b border-border px-6 py-4">
        <p className="text-[14.5px] font-medium text-foreground">Recent Posts</p>
        <Button className="rounded-2xl px-4 py-2 shadow-sm" onClick={onLogPost}>
          <Plus className="size-3.5" />
          Log Post
        </Button>
      </div>
      {isSearchEmpty && posts.length === 0 ? (
        <SearchEmptyState />
      ) : (
        posts.map((post, index) => (
          <PostRow
            key={post.id}
            post={post}
            isLast={index === posts.length - 1}
            onEdit={onEdit}
            onDelete={onDelete}
            onArchive={onArchive}
            onRestore={onRestore}
            onToggleFavourite={onToggleFavourite}
          />
        ))
      )}
    </div>
  );
}
