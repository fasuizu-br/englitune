import pluralize from "pluralize";
import { useCounter } from "usehooks-ts";
import { toast } from "sonner";

const MILESTONES = [5, 20, 50] as const;

const MESSAGES = [
  {
    title: "Great start!",
    description: (count: number) =>
      `You've reviewed ${pluralize("item", count, true)}. You're on a roll!`
  },
  {
    title: "Keep it up!",
    description: (count: number) =>
      `Wow! ${pluralize("item", count, true)} reviewed. You're doing amazing!`
  },
  {
    title: "Incredible progress!",
    description: (count: number) =>
      `Outstanding! ${pluralize("item", count, true)} reviewed this session. You're unstoppable!`
  }
] as const;

const useReviews = () => {
  const { count, increment } = useCounter(0);

  const incrementReviews = () => {
    const reviewed = count + 1;
    const milestoneIndex = MILESTONES.findIndex(
      (milestone) => milestone === reviewed
    );
    if (milestoneIndex !== -1 && milestoneIndex < MESSAGES.length) {
      const message = MESSAGES[milestoneIndex];
      toast.success(message.title, {
        description: message.description(reviewed),
        duration: 10000,
        closeButton: true
      });
    }
    increment();
  };

  return { incrementReviews };
};

export default useReviews;
