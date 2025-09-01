import { useRef, useState } from "react";

export type AudioState = "idle" | "loading" | "playing" | "played" | "error";

const useAudio = ({ onComplete }: { onComplete?: () => void } = {}) => {
  const ref = useRef<HTMLAudioElement & { retry: boolean }>(null);
  const [state, setState] = useState<AudioState>("loading");
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const load = () => {
    setState("loading");
    setCurrentTime(0);
    setDuration(0);
  };

  const loadedMetadata = () => {
    setCurrentTime(0);
    setDuration(ref.current?.duration ?? 0);
    setState("idle");
    if (ref.current?.retry) {
      ref.current.retry = false;
      ref.current.play();
    }
  };

  const play = () => setState("playing");

  const pause = () =>
    setState((prev) => (prev === "played" ? "played" : "idle"));

  const playPause = () => {
    if (state === "error") {
      if (ref.current) {
        ref.current.retry = true;
        setState("loading");
        setCurrentTime(0);
        setDuration(0);
        ref.current.load();
      }
    } else if (state === "playing") {
      ref.current?.pause();
    } else {
      ref.current?.play();
    }
  };

  const ended = () => {
    setState("played");
    onComplete?.();
  };

  const timeUpdate = () => setCurrentTime(ref.current?.currentTime ?? 0);

  const error = () => setState("error");

  return {
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
  };
};

export default useAudio;
