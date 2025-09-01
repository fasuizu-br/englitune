import type { ComponentProps } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";

const ProgressBar = ({
  isLoading,
  ...props
}: ComponentProps<typeof Progress> & { isLoading: boolean }) =>
  isLoading ? (
    <Skeleton className="h-2 w-full" />
  ) : (
    <Progress aria-hidden="true" {...props} />
  );

export default ProgressBar;
