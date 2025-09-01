import type { ComponentProps } from "react";
import { TrophyIcon } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const Congratulations = ({ ...props }: ComponentProps<typeof Alert>) => (
  <Alert {...props}>
    <TrophyIcon />
    <AlertTitle>Congratulations!</AlertTitle>
    <AlertDescription>
      You've completed all available study content.
    </AlertDescription>
  </Alert>
);

export default Congratulations;
