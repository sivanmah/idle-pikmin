import { taskDefinition } from "./systems/tasks";

export type UnlockId = "pikmin" | "pda" | "nectar";

export type UnlockRecord = Partial<Record<UnlockId, boolean>>;

export type TaskId = "findPDA" | "exampleTask1";

export type GameView = "base" | "map" | "settings";

export interface UnlockDefinition {
  id: UnlockId;
  name: string;
  description: string;
  condition: (resources: Resources, unlocks: UnlockRecord) => boolean;
}

export interface TaskDefinition {
  id: TaskId;
  name: string;
  type: "oneTime" | "ongoing";
  minPikmin: number;
  maxPikmin?: number;

  duration?: number; // for onetime tasks, how many ticks to complete
  unlock?: UnlockId; // for onetime tasks, what to unlock
  rewardRate?: number; // for ongoing tasks, rewards per tick

  revealCondition: (unlocks: UnlockRecord) => boolean; // what needs to be done before task is revealed to player
  getReward?: (
    resources: Resources,
    assignedPikmin: number
  ) => Partial<Resources>;
}

export interface ActiveTask {
  id: TaskId;
  assignedPikmin: number;
  progress?: number; // for one-time tasks, 0-100
}

export interface Resources {
  pikmin: number;
  pellets: number;
  nectar: number;
}
