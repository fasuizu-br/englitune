import type { ComponentProps } from "react";
import { AlertCircleIcon, RefreshCcwIcon } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

const Error = ({
  onRefresh,
  ...props
}: ComponentProps<typeof Alert> & { onRefresh?: () => void }) => (
  <Alert variant="destructive" {...props}>
    <AlertCircleIcon />
    <AlertTitle>Failed to load study content.</AlertTitle>
    <AlertDescription>
      Something went wrong while loading the study content.
      <Button
        variant="destructive"
        className="mt-1"
        size="sm"
        onClick={onRefresh}
      >
        <RefreshCcwIcon />
        Try again
      </Button>
    </AlertDescription>
  </Alert>
);

export default Error;
