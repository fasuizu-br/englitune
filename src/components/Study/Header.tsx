import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

const Header = ({ className, ...props }: ComponentProps<"div">) => (
  <div className={cn("text-center space-y-2", className)} {...props}>
    <h3 className="text-xl font-bold">Listen & Learn</h3>
    <p className="text-muted-foreground">
      Listen to the audio, show the transcript, then answer if it is correct or
      incorrect.
    </p>
  </div>
);

export default Header;
