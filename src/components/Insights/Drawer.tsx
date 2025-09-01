import type { ComponentProps } from "react";
import { BarChart3Icon } from "lucide-react";
import {
  Drawer as DrawerComponent,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Study } from "@/lib/types";
import { formatCount } from "@/lib/utils";

const Drawer = ({
  due,
  children,
  ...props
}: ComponentProps<typeof DrawerComponent> & { due: Study[] }) => (
  <DrawerComponent {...props}>
    <DrawerTrigger asChild>
      <Button
        variant="outline"
        title="View learning progress and statistics"
        aria-label="View learning progress and statistics"
      >
        <BarChart3Icon />
        <span className="hidden md:inline">Learning progress</span>
        {due.length > 0 && (
          <Badge variant="destructive" className="rounded-full">
            {formatCount(due.length)}
          </Badge>
        )}
      </Button>
    </DrawerTrigger>
    <DrawerContent className="max-h-[80vh] md:max-w-4xl md:mx-auto">
      <DrawerHeader>
        <DrawerTitle>Learning progress</DrawerTitle>
        <DrawerDescription>
          View learning progress and statistics.
        </DrawerDescription>
      </DrawerHeader>
      <div className="flex flex-col overflow-hidden px-4 pb-4">{children}</div>
    </DrawerContent>
  </DrawerComponent>
);

export default Drawer;
