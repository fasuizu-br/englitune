import type { ComponentProps } from "react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const InfoBadge = ({
  title,
  className,
  ...props
}: ComponentProps<typeof Badge>) => (
  <Badge
    variant="outline"
    className={cn("flex items-center gap-1", className)}
    title={title}
    aria-label={title}
    {...props}
  />
);

export default InfoBadge;
