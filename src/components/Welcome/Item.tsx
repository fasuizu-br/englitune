import type { ComponentProps } from "react";
import {
  PlayCircle,
  CheckCircle2,
  Clock,
  ChartLine,
  Sparkles
} from "lucide-react";
import { cn } from "@/lib/utils";

const iconMap = {
  "play-circle": PlayCircle,
  "check-circle-2": CheckCircle2,
  clock: Clock,
  "chart-line": ChartLine,
  sparkles: Sparkles
} as const;

type IconName = keyof typeof iconMap;

const Item = ({
  className,
  children,
  icon,
  ...props
}: ComponentProps<"li"> & { icon: IconName }) => {
  const IconComponent = iconMap[icon];

  return (
    <li className={cn("flex items-start gap-1", className)} {...props}>
      <IconComponent size={16} className="shrink-0 leading-4" />
      <span className="leading-4">{children}</span>
    </li>
  );
};

export default Item;
