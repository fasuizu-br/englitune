import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

const Container = ({ className, ...props }: ComponentProps<"div">) => (
  <div
    className={cn(
      "flex flex-col items-center max-w-md mx-auto space-y-4",
      className
    )}
    {...props}
  />
);

export default Container;
