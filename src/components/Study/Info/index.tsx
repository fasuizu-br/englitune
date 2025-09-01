import type { ComponentProps } from "react";
import {
  LanguagesIcon,
  MapPinIcon,
  MarsIcon,
  PersonStandingIcon,
  VenusIcon
} from "lucide-react";
import InfoBadge from "@/components/Study/Info/InfoBadge";
import type { Entry } from "@/lib/types";
import { cn } from "@/lib/utils";

const Info = ({
  entry,
  className,
  ...props
}: ComponentProps<"div"> & { entry?: Entry | null }) => (
  <div
    className={cn("flex flex-wrap justify-evenly gap-2 text-xs", className)}
    {...props}
  >
    <InfoBadge title={entry?.age ? `Age: ${entry.age} years` : undefined}>
      <PersonStandingIcon />
      {entry?.age}y
    </InfoBadge>
    <InfoBadge title={entry?.gender ? `Gender: ${entry.gender}` : undefined}>
      {entry?.gender === "M" ? <MarsIcon /> : <VenusIcon />}
      {entry?.gender}
    </InfoBadge>
    <InfoBadge title={entry?.accent ? `Accent: ${entry.accent}` : undefined}>
      <LanguagesIcon />
      {entry?.accent}
    </InfoBadge>
    <InfoBadge title={`Region: ${entry?.region || "Unknown"}`}>
      <MapPinIcon />
      {entry?.region || "Unknown"}
    </InfoBadge>
  </div>
);

export default Info;
