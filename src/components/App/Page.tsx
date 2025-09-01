import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

const Page = ({ className, ...props }: ComponentProps<"div">) => (
  <div className={cn("flex flex-col min-h-screen", className)} {...props} />
);

export default Page;
