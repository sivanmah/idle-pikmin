import { TaskDefinition } from "../types";

export const taskDefinition: TaskDefinition[] = [
  {
    id: "findPDA",
    name: "Look for your PDA",
    type: "oneTime",
    minPikmin: 5,
    duration: 60,
    unlock: "pda",
    revealCondition: (unlocks) => !!unlocks.pikmin && !unlocks.pda,
  },
];
