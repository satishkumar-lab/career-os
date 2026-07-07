import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { deriveInitials } from "@/lib/settings/storage";
import { cn } from "@/lib/utils";

export interface UserAvatarUser {
  name: string;
  initials?: string;
  photoDataUrl?: string;
}

export interface UserAvatarProps {
  user: UserAvatarUser;
  size?: "sm" | "default" | "lg";
  className?: string;
}

export function UserAvatar({ user, size = "default", className }: UserAvatarProps) {
  const initials = deriveInitials(user.name) || user.initials || "?";

  return (
    <Avatar size={size} className={cn("after:hidden", className)}>
      {user.photoDataUrl ? (
        <AvatarImage src={user.photoDataUrl} alt={user.name || "Profile photo"} />
      ) : null}
      <AvatarFallback className="rounded-full bg-primary text-[11px] font-medium text-primary-foreground shadow-sm">
        {initials}
      </AvatarFallback>
    </Avatar>
  );
}
