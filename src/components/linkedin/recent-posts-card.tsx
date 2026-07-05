import { Plus, Share2 } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import type { LinkedInPost } from "@/components/linkedin/types";

function PostRow({ post, isLast }: { post: LinkedInPost; isLast: boolean }) {
  return (
    <div
      className={cn(
        "flex flex-wrap items-center gap-4 px-6 py-4 sm:flex-nowrap",
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
    </div>
  );
}

export function RecentPostsCard({ posts }: { posts: LinkedInPost[] }) {
  return (
    <div className="rounded-2xl border border-border bg-card shadow-[0px_1px_1.5px_rgba(0,0,0,0.04),0px_2px_4px_rgba(0,0,0,0.02)]">
      <div className="flex items-center justify-between border-b border-border px-6 py-4">
        <p className="text-[14.5px] font-medium text-foreground">Recent Posts</p>
        <Button className="rounded-2xl px-4 py-2 shadow-sm">
          <Plus className="size-3.5" />
          Log Post
        </Button>
      </div>
      {posts.map((post, index) => (
        <PostRow key={post.id} post={post} isLast={index === posts.length - 1} />
      ))}
    </div>
  );
}
