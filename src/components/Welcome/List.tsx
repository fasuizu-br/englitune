import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

const List = ({ className, ...props }: ComponentProps<"ul">) => (
  <ul className={cn("space-y-2", className)} {...props} />
);

export default List;
