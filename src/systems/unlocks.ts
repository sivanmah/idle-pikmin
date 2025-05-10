import { UnlockDefinition } from "../types";

export const unlockDefinitions: UnlockDefinition[] = [
  {
    id: "pikmin",
    name: "Pikmin Discovered",
    description: "You have found your first Pikmin.",
    condition: (resources, unlocks) => resources.pikmin > 0 && !unlocks.pikmin,
  },
];
