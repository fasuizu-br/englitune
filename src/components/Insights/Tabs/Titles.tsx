import type { ComponentProps } from "react";
import { BarChart3Icon, BookOpenIcon, TrophyIcon } from "lucide-react";
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import type { Study } from "@/lib/types";
import { cn, formatCount } from "@/lib/utils";

const Titles = ({
  due,
  learning,
  mastered,
  className,
  ...props
}: ComponentProps<typeof TabsList> & {
  due: Study[];
  learning: Study[];
  mastered: Study[];
}) => {
  const learningBadge =
    due.length > 0
      ? ({
          variant: "destructive",
          label: formatCount(due.length),
          suffix: "due"
        } as const)
      : undefined;
  const titles = [
    {
      value: "stats",
      label: "Statistics",
      icon: BarChart3Icon
    },
    {
      value: "learning",
      label: `Learning (${formatCount(learning.length)})`,
      icon: BookOpenIcon,
      badge: learningBadge
    },
    {
      value: "mastered",
      label: `Mastered (${formatCount(mastered.length)})`,
      icon: TrophyIcon
    }
  ] as const;

  return (
    <TabsList
      className={cn("grid w-full gap-1 grid-cols-3", className)}
      {...props}
    >
      {titles.map((title) => (
        <TabsTrigger
          key={title.value}
          value={title.value}
          className="flex items-center justify-center gap-1.5 md:gap-2 border-border/50 data-[state=active]:border-transparent"
          aria-label={title.label}
        >
          <title.icon />
          <span className="hidden md:inline">{title.label}</span>
          {"badge" in title && title.badge && (
            <Badge variant={title.badge.variant}>
              <span>{title.badge.label}</span>
              <span className="hidden md:inline">{title.badge.suffix}</span>
            </Badge>
          )}
        </TabsTrigger>
      ))}
    </TabsList>
  );
};

export default Titles;
