import type { ComponentProps } from "react";
import { DrawerClose } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";

const LetsStudy = ({ ...props }: ComponentProps<typeof DrawerClose>) => (
  <DrawerClose asChild {...props}>
    <Button variant="outline">Let's study!</Button>
  </DrawerClose>
);

export default LetsStudy;
