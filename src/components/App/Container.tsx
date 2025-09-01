import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

const Container = ({ className, ...props }: ComponentProps<"div">) => (
  <div
    className={cn(
      "flex flex-col flex-1 container mx-auto p-4 md:p-6",
      className
    )}
    {...props}
  />
);

export default Container;
