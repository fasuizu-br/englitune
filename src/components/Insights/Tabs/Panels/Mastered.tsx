import type { ComponentProps } from "react";
import { TrophyIcon } from "lucide-react";
import { TabsContent } from "@/components/ui/tabs";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle
} from "@/components/ui/empty";
import { ItemGroup } from "@/components/ui/item";
import LetsStudy from "@/components/LetsStudy";
import Item from "@/components/Insights/Item";
import type { Study } from "@/lib/types";
import { getEntryId } from "@/lib/utils";

const Mastered = ({
  mastered,
  ...props
}: Omit<ComponentProps<typeof TabsContent>, "value"> & {
  mastered: Study[];
}) => (
  <TabsContent value="mastered" {...props}>
    {mastered.length === 0 ? (
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <TrophyIcon />
          </EmptyMedia>
          <EmptyTitle>No mastered items yet</EmptyTitle>
          <EmptyDescription>
            Keep practicing to master more content!
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <LetsStudy />
        </EmptyContent>
      </Empty>
    ) : (
      <ItemGroup className="gap-2">
        {mastered.map((study) => (
          <Item key={getEntryId(study.entry)} study={study} />
        ))}
      </ItemGroup>
    )}
  </TabsContent>
);

export default Mastered;
