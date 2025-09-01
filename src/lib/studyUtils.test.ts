import dayjs from "dayjs";
import { describe, expect, it, vi, afterEach } from "vitest";
import type { Entry, Study } from "./types";
import {
  calculateReview,
  isMastered,
  isDue,
  getDue,
  getLearning,
  getUpcoming,
  getMastered,
  groupBySpeaker,
  createStudy,
  getNextEntry,
  updateAll
} from "./studyUtils";

const makeEntry = ({
  sequence,
  speaker = "alice"
}: {
  sequence: string;
  speaker?: string;
}): Entry => ({
  transcript: `Sentence ${sequence}`,
  sequence,
  speaker,
  age: 30,
  gender: "female",
  accent: "US"
});

const makeStudy = ({
  entry,
  review,
  step = 0,
  incorrect = 0
}: {
  entry: Entry;
  review: Date;
  step?: number;
  incorrect?: number;
}): Study => ({
  step,
  review,
  incorrect,
  entry
});

describe("studyUtils", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("calculates review dates for all intervals", () => {
    vi.useFakeTimers();
    vi.setSystemTime(dayjs("2026-01-01T12:00:00").toDate());

    expect(calculateReview(0).getTime()).toBe(
      dayjs("2026-01-01T12:01:00").toDate().getTime() // 1 minute
    );
    expect(calculateReview(1).getTime()).toBe(
      dayjs("2026-01-01T12:10:00").toDate().getTime() // 10 minutes
    );
    expect(calculateReview(2).getTime()).toBe(
      dayjs("2026-01-01T13:00:00").toDate().getTime() // 1 hour
    );
    expect(calculateReview(3).getTime()).toBe(
      dayjs("2026-01-01T16:00:00").toDate().getTime() // 4 hours
    );
    expect(calculateReview(4).getTime()).toBe(
      dayjs("2026-01-02T12:00:00").toDate().getTime() // 1 day
    );
    expect(calculateReview(5).getTime()).toBe(
      dayjs("2026-01-04T12:00:00").toDate().getTime() // 3 days
    );
    expect(calculateReview(6).getTime()).toBe(
      dayjs("2026-01-08T12:00:00").toDate().getTime() // 7 days
    );
    expect(calculateReview(7).getTime()).toBe(
      dayjs("2026-01-15T12:00:00").toDate().getTime() // 14 days
    );
    expect(calculateReview(8).getTime()).toBe(
      dayjs("2026-01-31T12:00:00").toDate().getTime() // 30 days (mastered)
    );
  });

  it("identifies mastered studies correctly", () => {
    const entry = makeEntry({ sequence: "001" });
    const masteredStudy = makeStudy({
      entry,
      review: dayjs("2026-01-01").toDate(),
      step: 8
    });

    expect(isMastered(masteredStudy)).toBe(true);

    for (let step = 0; step < 8; step++) {
      const learningStudy = makeStudy({
        entry,
        review: dayjs("2026-01-01").toDate(),
        step
      });

      expect(isMastered(learningStudy)).toBe(false);
    }
  });

  it("progresses through all intervals when understood", () => {
    vi.useFakeTimers();
    vi.setSystemTime(dayjs("2026-01-01T12:00:00").toDate());

    const entry = makeEntry({ sequence: "001" });
    let studies: Study[] = [];
    studies = updateAll({ studies, entry, understood: true });
    let study = studies.find((study) => study.entry.sequence === "001")!;

    expect(study.step).toBe(1);
    expect(study.review.getTime()).toBe(
      dayjs("2026-01-01T12:10:00").toDate().getTime()
    );

    const expectedSteps = [
      { step: 2, time: "2026-01-01T13:00:00" }, // 1 hour
      { step: 3, time: "2026-01-01T16:00:00" }, // 4 hours
      { step: 4, time: "2026-01-02T12:00:00" }, // 1 day
      { step: 5, time: "2026-01-04T12:00:00" }, // 3 days
      { step: 6, time: "2026-01-08T12:00:00" }, // 7 days
      { step: 7, time: "2026-01-15T12:00:00" }, // 14 days
      { step: 8, time: "2026-01-31T12:00:00" } // 30 days (mastered)
    ];
    for (const expected of expectedSteps) {
      studies = updateAll({ studies, entry, understood: true });
      study = studies.find((study) => study.entry.sequence === "001")!;

      expect(study.step).toBe(expected.step);
      expect(study.review.getTime()).toBe(
        dayjs(expected.time).toDate().getTime()
      );
    }

    studies = updateAll({ studies, entry, understood: true });
    study = studies.find((study) => study.entry.sequence === "001")!;

    expect(study.step).toBe(8);
    expect(isMastered(study)).toBe(true);
  });

  it("regresses when all answers are incorrect", () => {
    vi.useFakeTimers();
    vi.setSystemTime(dayjs("2026-01-01T12:00:00").toDate());

    const entry = makeEntry({ sequence: "002" });
    let studies: Study[] = [];
    studies = [
      makeStudy({
        entry,
        review: dayjs("2026-01-01T12:00:00").toDate(),
        step: 5
      })
    ];
    const expectedSteps = [
      { step: 4, time: "2026-01-02T12:00:00" }, // 1 day
      { step: 3, time: "2026-01-01T16:00:00" }, // 4 hours
      { step: 2, time: "2026-01-01T13:00:00" }, // 1 hour
      { step: 1, time: "2026-01-01T12:10:00" }, // 10 minutes
      { step: 0, time: "2026-01-01T12:01:00" } // 1 minute
    ];
    for (const expected of expectedSteps) {
      studies = updateAll({ studies, entry, understood: false });
      const study = studies.find((study) => study.entry.sequence === "002")!;

      expect(study.step).toBe(expected.step);
      expect(study.review.getTime()).toBe(
        dayjs(expected.time).toDate().getTime()
      );
    }

    studies = updateAll({ studies, entry, understood: false });
    const study = studies.find((study) => study.entry.sequence === "002")!;

    expect(study.step).toBe(0);
    expect(study.incorrect).toBeGreaterThan(0);
  });

  it("handles mixed correct and incorrect answers", () => {
    vi.useFakeTimers();
    vi.setSystemTime(dayjs("2026-01-01T12:00:00").toDate());

    const entry = makeEntry({ sequence: "003" });
    let studies: Study[] = [];
    studies = updateAll({ studies, entry, understood: true }); // 0 → 1
    let study = studies.find((study) => study.entry.sequence === "003")!;

    expect(study.step).toBe(1);

    studies = updateAll({ studies, entry, understood: true }); // 1 → 2
    study = studies.find((study) => study.entry.sequence === "003")!;

    expect(study.step).toBe(2);

    studies = updateAll({ studies, entry, understood: false }); // 2 → 1 (regress)
    study = studies.find((study) => study.entry.sequence === "003")!;

    expect(study.step).toBe(1);
    expect(study.incorrect).toBe(1);

    studies = updateAll({ studies, entry, understood: true }); // 1 → 2 (recover)
    study = studies.find((study) => study.entry.sequence === "003")!;

    expect(study.step).toBe(2);

    studies = updateAll({ studies, entry, understood: true }); // 2 → 3
    study = studies.find((study) => study.entry.sequence === "003")!;

    expect(study.step).toBe(3);

    studies = updateAll({ studies, entry, understood: false }); // 3 → 2 (regress)
    study = studies.find((study) => study.entry.sequence === "003")!;

    expect(study.step).toBe(2);

    studies = updateAll({ studies, entry, understood: false }); // 2 → 1 (regress again)
    study = studies.find((study) => study.entry.sequence === "003")!;

    expect(study.step).toBe(1);

    studies = updateAll({ studies, entry, understood: true }); // 1 → 2
    study = studies.find((study) => study.entry.sequence === "003")!;

    expect(study.step).toBe(2);
  });

  it("updates existing studies and appends unseen entries", () => {
    vi.useFakeTimers();
    vi.setSystemTime(dayjs("2026-01-01T12:00:00").toDate());

    const entryA = makeEntry({ sequence: "001", speaker: "alice" });
    const entryB = makeEntry({ sequence: "002", speaker: "bob" });
    const entryC = makeEntry({ sequence: "003", speaker: "carol" });
    const studies = [
      makeStudy({
        entry: entryA,
        review: dayjs("2025-12-31T12:00:00").toDate()
      }),
      makeStudy({
        entry: entryB,
        review: dayjs("2025-12-30T12:00:00").toDate(),
        step: 1
      })
    ];
    const updated = updateAll({ studies, entry: entryA, understood: true });
    const updatedA = updated.find(({ entry }) => entry.sequence === "001")!;
    const untouchedB = updated.find(({ entry }) => entry.sequence === "002")!;

    expect(updatedA.step).toBe(1);
    expect(updatedA.incorrect).toBe(0);
    expect(updatedA.review.getTime()).toBe(
      dayjs("2026-01-01T12:10:00").toDate().getTime()
    );
    expect(untouchedB.step).toBe(1);

    const withNew = updateAll({
      studies: updated,
      entry: entryC,
      understood: false
    });
    const newStudy = withNew.find(({ entry }) => entry.sequence === "003")!;

    expect(withNew).toHaveLength(3);
    expect(newStudy.step).toBe(0);
    expect(newStudy.incorrect).toBe(1);
    expect(newStudy.review.getTime()).toBe(
      dayjs("2026-01-01T12:01:00").toDate().getTime()
    );
  });

  it("returns due studies sorted by review date", () => {
    vi.useFakeTimers();
    vi.setSystemTime(dayjs("2026-01-01T12:00:00").toDate());

    const entryA = makeEntry({ sequence: "001" });
    const entryB = makeEntry({ sequence: "002" });
    const entryC = makeEntry({ sequence: "003" });
    const studies = [
      makeStudy({ entry: entryA, review: dayjs("2025-12-31").toDate() }),
      makeStudy({ entry: entryB, review: dayjs("2025-12-30").toDate() }),
      makeStudy({ entry: entryC, review: dayjs("2026-01-02").toDate() })
    ];
    const due = getDue(studies);

    expect(due.map(({ entry }) => entry.sequence)).toEqual(["002", "001"]);
  });

  it("prioritizes due studies before new entries", () => {
    const entryA = makeEntry({ sequence: "001" });
    const entryB = makeEntry({ sequence: "002" });
    const dueStudy = makeStudy({
      entry: entryA,
      review: dayjs("2025-12-30").toDate(),
      step: 0,
      incorrect: 0
    });
    const dueResult = getNextEntry({ entries: [entryB], due: [dueStudy] });
    const newResult = getNextEntry({ entries: [entryB], due: [] });
    const emptyResult = getNextEntry({ entries: [], due: [] });

    expect(dueResult).toEqual({ entry: entryA, isNew: false });
    expect(newResult).toEqual({ entry: entryB, isNew: true });
    expect(emptyResult).toBeNull();
  });

  it("identifies due studies correctly", () => {
    vi.useFakeTimers();
    vi.setSystemTime(dayjs("2026-01-01T12:00:00").toDate());

    const entry = makeEntry({ sequence: "001" });
    const dueStudy = makeStudy({
      entry,
      review: dayjs("2025-12-31").toDate(),
      step: 0
    });
    const notDueStudy = makeStudy({
      entry,
      review: dayjs("2026-01-02").toDate(),
      step: 0
    });
    const masteredStudy = makeStudy({
      entry,
      review: dayjs("2025-12-31").toDate(),
      step: 8
    });

    expect(isDue(dueStudy)).toBe(true);
    expect(isDue(notDueStudy)).toBe(false);
    expect(isDue(masteredStudy)).toBe(false);
  });

  it("filters learning studies correctly", () => {
    const entry1 = makeEntry({ sequence: "001" });
    const entry2 = makeEntry({ sequence: "002" });
    const entry3 = makeEntry({ sequence: "003" });
    const studies = [
      makeStudy({
        entry: entry1,
        review: dayjs("2026-01-01").toDate(),
        step: 0
      }),
      makeStudy({
        entry: entry2,
        review: dayjs("2026-01-01").toDate(),
        step: 5
      }),
      makeStudy({
        entry: entry3,
        review: dayjs("2026-01-01").toDate(),
        step: 8
      })
    ];
    const learning = getLearning(studies);

    expect(learning).toHaveLength(2);
    expect(learning.map((study) => study.entry.sequence)).toEqual([
      "001",
      "002"
    ]);
  });

  it("filters mastered studies correctly", () => {
    const entry1 = makeEntry({ sequence: "001" });
    const entry2 = makeEntry({ sequence: "002" });
    const entry3 = makeEntry({ sequence: "003" });
    const studies = [
      makeStudy({
        entry: entry1,
        review: dayjs("2026-01-01").toDate(),
        step: 0
      }),
      makeStudy({
        entry: entry2,
        review: dayjs("2026-01-01").toDate(),
        step: 5
      }),
      makeStudy({
        entry: entry3,
        review: dayjs("2026-01-01").toDate(),
        step: 8
      })
    ];
    const mastered = getMastered(studies);

    expect(mastered).toHaveLength(1);
    expect(mastered[0].entry.sequence).toBe("003");
  });

  it("filters upcoming studies correctly", () => {
    vi.useFakeTimers();
    vi.setSystemTime(dayjs("2026-01-01T12:00:00").toDate());

    const entry1 = makeEntry({ sequence: "001" });
    const entry2 = makeEntry({ sequence: "002" });
    const entry3 = makeEntry({ sequence: "003" });
    const studies = [
      makeStudy({
        entry: entry1,
        review: dayjs("2025-12-31").toDate(),
        step: 0
      }), // due
      makeStudy({
        entry: entry2,
        review: dayjs("2026-01-02").toDate(),
        step: 1
      }), // upcoming
      makeStudy({
        entry: entry3,
        review: dayjs("2026-01-03").toDate(),
        step: 2
      }) // upcoming
    ];
    const due = getDue(studies);
    const learning = getLearning(studies);
    const upcoming = getUpcoming({ due, learning });

    expect(upcoming).toHaveLength(2);
    expect(upcoming.map((study) => study.entry.sequence)).toEqual([
      "002",
      "003"
    ]);
    expect(upcoming[0].review.getTime()).toBeLessThan(
      upcoming[1].review.getTime()
    );
  });

  it("groups studies by speaker", () => {
    const entry1 = makeEntry({ sequence: "001", speaker: "alice" });
    const entry2 = makeEntry({ sequence: "002", speaker: "bob" });
    const entry3 = makeEntry({ sequence: "003", speaker: "alice" });
    const entry4 = makeEntry({ sequence: "004", speaker: "bob" });
    const studies = [
      makeStudy({ entry: entry1, review: dayjs("2026-01-01").toDate() }),
      makeStudy({ entry: entry2, review: dayjs("2026-01-01").toDate() }),
      makeStudy({ entry: entry3, review: dayjs("2026-01-01").toDate() }),
      makeStudy({ entry: entry4, review: dayjs("2026-01-01").toDate() })
    ];
    const grouped = groupBySpeaker(studies);

    expect(grouped).toEqual({ alice: ["001", "003"], bob: ["002", "004"] });
  });

  it("creates a new study with correct initial values", () => {
    vi.useFakeTimers();
    vi.setSystemTime(dayjs("2026-01-01T12:00:00").toDate());

    const entry = makeEntry({ sequence: "001" });
    const study = createStudy(entry);

    expect(study.step).toBe(0);
    expect(study.incorrect).toBe(0);
    expect(study.entry).toEqual(entry);
    expect(study.review.getTime()).toBe(
      dayjs("2026-01-01T12:01:00").toDate().getTime()
    );
  });
});
