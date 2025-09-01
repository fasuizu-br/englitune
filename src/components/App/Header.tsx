import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

const Header = ({ className, ...props }: ComponentProps<"div">) => (
  <div
    className={cn("flex items-start justify-between", className)}
    {...props}
  />
);

export default Header;
