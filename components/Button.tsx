import Link from "next/link";
import { twMerge } from "tailwind-merge";

import LoadingSpinner from "@/components/LoadingSpinner";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "ghost";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
  href?: string;
  fullWidth?: boolean;
  openInNewTab?: boolean;
}

const Button = ({
  children,
  size = "md",
  iconLeft,
  iconRight,
  isLoading,
  variant = "primary",
  href,
  fullWidth,
  openInNewTab,
  ...props
}: ButtonProps) => {
  const classes = twMerge(
    "inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-2 text-sm font-semibold text-light-50 shadow-sm focus-visible:outline-none",
    size === "sm" && "text-xs",
    size === "lg" && "py-[0.65rem]",
    fullWidth && "w-full",
    variant === "primary" &&
      "bg-[var(--primary)] text-[var(--primary-foreground)] shadow-sm hover:bg-[color-mix(in_oklch,var(--primary),black_10%)]",
    variant === "secondary" &&
      "border-[1px] border-light-600 bg-light-50 text-light-1000 dark:border-dark-600 dark:bg-dark-300 dark:text-dark-1000",
    variant === "danger" &&
      "dark:text-red-1000 border-[1px] border-red-600 bg-red-500 dark:border-red-600 dark:bg-red-500",
    variant === "ghost" &&
      "bg-transparent border border-[var(--border)] text-[var(--primary)] shadow-none hover:bg-[var(--muted)] dark:text-[var(--primary)] dark:hover:bg-[var(--muted)] dark:border-[var(--border)]",
    props.disabled && "opacity-60",
  );

  const content = (
    <span className="relative flex items-center justify-center">
      {isLoading && (
        <span className="absolute">
          <LoadingSpinner size={size} />
        </span>
      )}
      <div
        className={twMerge(
          "flex items-center",
          isLoading ? "invisible" : "visible",
        )}
      >
        {iconLeft && <span className="mr-2">{iconLeft}</span>}
        {children}
        {iconRight && <span className="ml-1">{iconRight}</span>}
      </div>
    </span>
  );

  if (href) {
    return (
      <Link
        href={href}
        className={classes}
        target={openInNewTab ? "_blank" : undefined}
        rel={openInNewTab ? "noopener noreferrer" : undefined}
        {...(props as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
      >
        {content}
      </Link>
    );
  }

  return (
    <button
      className={classes}
      disabled={isLoading ?? props.disabled}
      {...props}
    >
      {content}
    </button>
  );
};

export default Button;
