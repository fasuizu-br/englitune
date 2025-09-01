import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

const Content = ({ className, ...props }: ComponentProps<"main">) => (
  <main
    className={cn(
      "flex items-center justify-center bg-background min-h-[80vh] md:min-h-[60vh]",
      className
    )}
    {...props}
  />
);

export default Content;
