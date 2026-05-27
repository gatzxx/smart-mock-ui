import { memo, useCallback, useMemo, useState } from "react";

import { cn } from "@/lib/utils";

type UserAvatarProps = {
  alt: string;
  className?: string;
  fullName: string;
  src?: string;
};

function getInitials(fullName: string): string {
  const parts = fullName.trim().split(/\s+/).filter(Boolean);

  if (parts.length === 0) {
    return "?";
  }

  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }

  return `${parts[0][0] ?? ""}${parts[1][0] ?? ""}`.toUpperCase();
}

export const UserAvatar = memo(function UserAvatar({
  alt,
  className,
  fullName,
  src,
}: UserAvatarProps) {
  const [hasImageError, setHasImageError] = useState(false);
  const initials = useMemo(() => getInitials(fullName), [fullName]);

  const handleImageError = useCallback(() => {
    setHasImageError(true);
  }, []);

  const avatarClassName = cn(
    "size-16 shrink-0 rounded-full border border-border object-cover",
    className,
  );

  if (!src || hasImageError) {
    return (
      <div
        aria-label={alt}
        className={cn(
          avatarClassName,
          "flex items-center justify-center bg-muted text-sm font-semibold text-muted-foreground",
        )}
        role="img"
      >
        {initials}
      </div>
    );
  }

  return (
    <img alt={alt} className={avatarClassName} onError={handleImageError} src={src} />
  );
});
