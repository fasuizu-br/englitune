import type { ComponentProps } from "react";
import {
  PauseIcon,
  PlayIcon,
  RefreshCwIcon,
  RotateCcwIcon
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import type { AudioState } from "@/hooks/useAudio";

const titleMap = {
  idle: "Play audio",
  playing: "Pause audio",
  played: "Replay audio",
  error: "Retry loading audio"
} as const;

const iconMap = {
  idle: PlayIcon,
  playing: PauseIcon,
  played: RotateCcwIcon,
  error: RefreshCwIcon
} as const;

const Play = ({
  state,
  ...props
}: ComponentProps<typeof Button> & {
  state: AudioState;
}) => {
  const key = state as keyof typeof titleMap;
  const title = titleMap[key];
  const Icon = iconMap[key];

  return state === "loading" ? (
    <Skeleton className="h-9 w-12" />
  ) : (
    <Button
      variant={state === "error" ? "destructive" : "outline"}
      size="icon"
      title={title}
      aria-label={title}
      {...props}
    >
      <Icon />
    </Button>
  );
};

export default Play;
