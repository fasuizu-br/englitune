import type { ComponentProps } from "react";
import Statistics from "@/components/Insights/Tabs/Panels/Statistics";
import Learning from "@/components/Insights/Tabs/Panels/Learning";
import Mastered from "@/components/Insights/Tabs/Panels/Mastered";
import type { Study } from "@/lib/types";
import { cn } from "@/lib/utils";

const Panels = ({
  studies,
  due,
  learning,
  mastered,
  className,
  ...props
}: ComponentProps<"div"> & {
  due: Study[];
  learning: Study[];
  mastered: Study[];
  studies: Study[];
}) => (
  <div className={cn("overflow-auto", className)} {...props}>
    <Statistics
      due={due}
      learning={learning}
      mastered={mastered}
      studies={studies}
    />
    <Learning due={due} learning={learning} />
    <Mastered mastered={mastered} />
  </div>
);

export default Panels;
