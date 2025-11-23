import {
  Arts,
  Computer,
  English,
  Geography,
  History,
  Literature,
  Maths,
  Science,
  Sports,
} from "../category-icons";

export const IconRegistry = {
  science: Science,
  sports: Sports,
  arts: Arts,
  computer: Computer,
  english: English,
  geography: Geography,
  history: History,
  literature: Literature,
  maths: Maths,
} as const;

export type IconName = keyof typeof IconRegistry;
