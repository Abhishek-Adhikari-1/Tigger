import { useState } from "react";
import { cn } from "../../utils/utils";

export default function AvatarImage({
  src,
  alt = "Not Available",
  size = 40,
  name,
  className,
}) {
  const [imgError, setImgError] = useState(false);

  const getInitials = (name) => {
    if (!name) return "N/A";
    const parts = name.trim().split(" ");
    if (parts.length === 1) return parts[0][0].toUpperCase();
    return (parts[0][0] + parts[1][0]).toUpperCase();
  };

  const initials = getInitials(name);

  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        fontSize: size * 0.4,
      }}
      className={cn(
        "overflow-hidden inline-flex items-center justify-center bg-zinc-300 dark:bg-zinc-700 text-white font-bold uppercase shrink-0",
        className
      )}
    >
      {!imgError && src ? (
        <img
          src={src}
          alt={alt}
          title={name}
          className="w-full h-full object-cover"
          onError={() => setImgError(true)}
        />
      ) : (
        <span title={name || "Not Assigned"}>{initials}</span>
      )}
    </div>
  );
}
