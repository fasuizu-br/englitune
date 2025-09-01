import type { ComponentProps } from "react";
import { BookOpenIcon } from "lucide-react";
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
import { formatCount, getEntryId } from "@/lib/utils";
import { getUpcoming } from "@/lib/studyUtils";

const Learning = ({
  due,
  learning,
  ...props
}: Omit<ComponentProps<typeof TabsContent>, "value"> & {
  due: Study[];
  learning: Study[];
}) => {
  const upcoming = getUpcoming({ learning, due });

  return (
    <TabsContent value="learning" {...props}>
      {learning.length === 0 ? (
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <BookOpenIcon />
            </EmptyMedia>
            <EmptyTitle>No items in learning yet</EmptyTitle>
            <EmptyDescription>
              Start studying to see your progress here!
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <LetsStudy />
          </EmptyContent>
        </Empty>
      ) : (
        <div className="space-y-2">
          {due.length > 0 && (
            <>
              <h3 className="text-sm font-medium text-destructive mb-2">
                Due for review ({formatCount(due.length)})
              </h3>
              <ItemGroup className="gap-2">
                {due.map((study) => (
                  <Item key={getEntryId(study.entry)} study={study} />
                ))}
              </ItemGroup>
            </>
          )}
          {upcoming.length > 0 && (
            <>
              <h3 className="text-sm font-medium mb-2">
                Upcoming reviews ({formatCount(learning.length - due.length)})
              </h3>
              <ItemGroup className="gap-2">
                {upcoming.map((study) => (
                  <Item key={getEntryId(study.entry)} study={study} />
                ))}
              </ItemGroup>
            </>
          )}
        </div>
      )}
    </TabsContent>
  );
};

export default Learning;
