import { useEffect, useState } from "react";
import { useDocumentTitle } from "usehooks-ts";
import type { Entry } from "@/lib/types";
import { formatExcluded, formatTitle } from "@/lib/utils";
import {
  findByEntry,
  getDue,
  getLearning,
  getNextEntry,
  groupBySpeaker,
  updateAll
} from "@/lib/studyUtils";
import useStudiesStorage from "@/hooks/useStudiesStorage";
import useEntriesQuery from "@/hooks/useEntriesQuery";

const useStudy = () => {
  const [entry, setEntry] = useState<Entry | null>(null);
  const { studies, initialize, save } = useStudiesStorage();

  const due = getDue(studies);

  useDocumentTitle(formatTitle(due.length));

  const {
    isLoading,
    data: entries,
    error,
    refetch
  } = useEntriesQuery({
    params: { excluded: formatExcluded(groupBySpeaker(studies)) },
    enabled: due.length === 0 && !entry
  });

  const isDone =
    !isLoading &&
    (!entries || entries.length === 0) &&
    getLearning(studies).length === 0;

  const answer = (understood: boolean) => {
    if (entry) {
      save({ entry, understood });
      const updatedDue = getDue(updateAll({ studies, entry, understood }));
      setEntry(updatedDue.length > 0 ? updatedDue[0].entry : null);
    }
  };

  useEffect(() => {
    if (!entry) {
      const nextEntry = getNextEntry({ entries, due });
      if (nextEntry) {
        queueMicrotask(() => setEntry(nextEntry.entry));
        if (
          nextEntry.isNew &&
          findByEntry({ studies, entry: nextEntry.entry }) < 0
        ) {
          initialize(nextEntry.entry);
        }
      }
    }
  }, [entry, studies, due, entries, initialize]);

  return {
    isLoading,
    isDone,
    entry,
    error,
    answer,
    refetch
  };
};

export default useStudy;
