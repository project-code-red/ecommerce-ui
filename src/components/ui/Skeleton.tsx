import React from "react";
import { cn } from "@/lib/utils";

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "text" | "circular" | "rectangular";
  width?: string | number;
  height?: string | number;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className,
  variant = "rectangular",
  width,
  height,
  ...props
}) => {
  const variants = {
    text: "h-4 rounded",
    circular: "rounded-full",
    rectangular: "rounded",
  };

  return (
    <div
      className={cn(
        "animate-pulse bg-gray-200",
        variants[variant],
        className
      )}
      style={{ width, height }}
      {...props}
    />
  );
};

