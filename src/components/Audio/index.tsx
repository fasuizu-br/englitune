import { type ComponentProps } from "react";
import { toast } from "sonner";
import Play from "@/components/Audio/Play";
import ProgressBar from "@/components/Audio/ProgressBar";
import Time from "@/components/Audio/Time";
import { cn } from "@/lib/utils";
import useAudio from "@/hooks/useAudio";

const Audio = ({
  src,
  className,
  onComplete,
  ...props
}: ComponentProps<"div"> & {
  src?: string | null;
  onComplete?: () => void;
}) => {
  const {
    ref,
    state,
    currentTime,
    duration,
    load,
    loadedMetadata,
    play,
    pause,
    playPause,
    ended,
    timeUpdate,
    error
  } = useAudio({ onComplete });

  const handleError = () => {
    toast.error("Failed to load audio");
    error();
  };

  return (
    <div className={cn("flex items-center space-x-3", className)} {...props}>
      <audio
        ref={ref}
        src={src ?? undefined}
        className="hidden"
        preload="metadata"
        aria-hidden="true"
        onLoadStart={load}
        onLoadedMetadata={loadedMetadata}
        onPlay={play}
        onPause={pause}
        onEnded={ended}
        onTimeUpdate={timeUpdate}
        onError={handleError}
      />
      <Play state={state} onClick={playPause} />
      <ProgressBar
        isLoading={state === "loading"}
        value={(currentTime / duration) * 100}
      />
      <Time isLoading={state === "loading"} value={currentTime || duration} />
    </div>
  );
};

export default Audio;
