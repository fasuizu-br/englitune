import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { Entry, GroupedSequences } from "@/lib/types";

import { displayName } from "../../package.json";

dayjs.extend(relativeTime);

const AUDIO_URL = import.meta.env.VITE_AUDIO_URL;

export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));

export const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);

  return `${mins}:${secs.toString().padStart(2, "0")}`;
};

export const formatTimeFromNow = (date: Date) => dayjs(date).fromNow();

export const formatExcluded = (groupedSequences: GroupedSequences) =>
  Object.entries(groupedSequences)
    .map(([speaker, sequences]) => `${speaker}=${sequences.join(",")}`)
    .join(";");

export const getAudioUrl = (entry?: Entry | null) =>
  entry ? `${AUDIO_URL}/${entry.speaker}/${entry.sequence}.mp3` : null;

export const getEntryId = (entry: Entry) =>
  `${entry.speaker}-${entry.sequence}`;

export const translate = (text: string) => {
  const url = `https://translate.google.com/?sl=en&tl=auto&text=${encodeURIComponent(text)}`;
  window.open(url, "_blank", "noopener,noreferrer");
};

export const formatCount = (count: number): string =>
  count > 99 ? "99+" : count.toString();

export const formatNumber = (num: number): string =>
  num.toLocaleString("en-US");

export const formatTitle = (count: number): string =>
  `${count > 0 ? `(${formatCount(count)}) ` : ""}${displayName}`;
