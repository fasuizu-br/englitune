import dayjs from "dayjs";
import type { Study, Entry, GroupedSequences } from "@/lib/types";
import { getEntryId } from "@/lib/utils";

const INTERVALS = [
  { value: 1, unit: "minute" }, // Immediate reinforcement
  { value: 10, unit: "minute" }, // Short-term reinforcement
  { value: 1, unit: "hour" }, // Medium-term
  { value: 4, unit: "hour" }, // Extended short-term
  { value: 1, unit: "day" }, // Daily
  { value: 3, unit: "day" }, // Multi-day
  { value: 7, unit: "day" }, // Weekly
  { value: 14, unit: "day" }, // Bi-weekly
  { value: 30, unit: "day" } // Monthly
] as const;

export const isMastered = (study: Study) => study.step === INTERVALS.length - 1;

export const isDue = (study: Study) =>
  !isMastered(study) && study.review <= new Date();

export const getDue = (studies: Study[]) =>
  studies.filter(isDue).sort((a, b) => dayjs(a.review).diff(b.review));

export const getLearning = (studies: Study[]) =>
  studies.filter((study) => !isMastered(study));

export const getUpcoming = ({
  due,
  learning
}: {
  due: Study[];
  learning: Study[];
}) =>
  learning
    .filter((study) => !due.includes(study))
    .sort((a, b) => dayjs(a.review).diff(b.review));

export const getMastered = (studies: Study[]) =>
  studies.filter((study) => isMastered(study));

export const findByEntry = ({
  studies,
  entry
}: {
  studies: Study[];
  entry: Entry;
}) =>
  studies.findIndex((study) => getEntryId(study.entry) === getEntryId(entry));

export const groupBySpeaker = (studies: Study[]) =>
  studies.reduce((acc, study) => {
    const { speaker, sequence } = study.entry;
    if (!acc[speaker]) {
      acc[speaker] = [];
    }
    acc[speaker].push(sequence);

    return acc;
  }, {} as GroupedSequences);

export const calculateStep = ({
  step,
  understood
}: {
  step: number;
  understood: boolean;
}) =>
  understood ? Math.min(step + 1, INTERVALS.length - 1) : Math.max(step - 1, 0);

export const calculateIncorrect = ({
  currentIncorrect,
  understood
}: {
  currentIncorrect: number;
  understood: boolean;
}) => (understood ? currentIncorrect : currentIncorrect + 1);

export const calculateReview = (step: number) => {
  const { value, unit } = INTERVALS[step];

  return dayjs().add(value, unit).toDate();
};

export const createStudy = (entry: Entry) => ({
  step: 0,
  review: calculateReview(0),
  incorrect: 0,
  entry
});

export const updateOne = ({
  study,
  entry,
  understood
}: {
  study: Study | undefined;
  entry: Entry;
  understood: boolean;
}) => {
  const step = calculateStep({ step: study?.step ?? 0, understood });

  return {
    step,
    review: calculateReview(step),
    incorrect: calculateIncorrect({
      currentIncorrect: study?.incorrect ?? 0,
      understood
    }),
    entry
  };
};

export const updateAll = ({
  studies,
  entry,
  understood
}: {
  studies: Study[];
  entry: Entry;
  understood: boolean;
}) => {
  const studyIndex = findByEntry({ studies, entry });
  const updatedStudy = updateOne({
    study: studies[studyIndex],
    entry,
    understood
  });
  const updatedStudies = [...studies];
  if (studyIndex > -1) {
    updatedStudies[studyIndex] = updatedStudy;
  } else {
    updatedStudies.push(updatedStudy);
  }

  return updatedStudies;
};

export const getNextEntry = ({
  entries,
  due
}: {
  entries: Entry[] | undefined;
  due: Study[];
}) => {
  if (due.length > 0) {
    return {
      entry: due[0].entry,
      isNew: false
    };
  }
  if (entries && entries.length > 0) {
    return {
      entry: entries[0],
      isNew: true
    };
  }

  return null;
};
