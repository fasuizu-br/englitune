import type { ComponentProps } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn, formatTime } from "@/lib/utils";

const Time = ({
  isLoading,
  value,
  className,
  ...props
}: ComponentProps<"span"> & {
  isLoading: boolean;
  value: number;
}) =>
  isLoading ? (
    <Skeleton className="h-4 w-10" />
  ) : (
    <span
      className={cn("w-10 text-sm text-muted-foreground", className)}
      {...props}
    >
      {formatTime(value)}
    </span>
  );

export default Time;
