export const PROFILE_TOPIC_OPTIONS = [
  "Physics",
  "Candlemaking",
  "Flower Arranging",
  "Fiction Writing",
  "Nonfiction Writing",
  "Crosswords",
  "Journaling",
  "Dance",
  "Film",
] as const;

export const LEARN_ROLE_OPTIONS = [
  "Curious Explorer",
  "Hands-on Builder",
  "Collaborative Storyteller",
  "Quiet Observer",
] as const;

export type ProfileTopicOption = (typeof PROFILE_TOPIC_OPTIONS)[number];
export type LearnRoleOption = (typeof LEARN_ROLE_OPTIONS)[number];
