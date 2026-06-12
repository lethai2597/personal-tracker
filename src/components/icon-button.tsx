import type { ButtonHTMLAttributes } from "react";
import { cn } from "../lib/cn";

type IconButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  /** Filled dark variant for primary actions, ghost for subtle ones. */
  variant?: "ghost" | "solid";
};

/** Square, pill-rounded icon button used in card headers and toolbars. */
export function IconButton({
  variant = "ghost",
  className,
  title,
  "aria-label": ariaLabel,
  ...props
}: IconButtonProps) {
  return (
    <button
      type="button"
      // Icon-only buttons get a native tooltip from their accessible label.
      title={title ?? ariaLabel}
      aria-label={ariaLabel}
      className={cn(
        "grid h-9 w-9 place-items-center rounded-full transition-colors",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50",
        "disabled:cursor-not-allowed disabled:opacity-40",
        variant === "ghost" &&
          "bg-surface-muted text-ink-soft hover:bg-surface-hover/80 hover:text-ink",
        variant === "solid" &&
          "bg-btn text-btn-ink hover:opacity-90",
        className,
      )}
      {...props}
    />
  );
}
