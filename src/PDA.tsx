import { memo } from "react";
import { UnlockRecord } from "./types";

interface PDAInterface {
  unlocks: UnlockRecord;
  onViewChange: () => string;
}

export const PDA = memo(({ unlocks, onViewChange }: PDAInterface) => {
  function lol() {
    console.log(unlocks);
  }
  return (
    <div className="flex w-full h-full">
      <button className="w-1/5 bg-gray-100 border-x-1">Base</button>
      <button className="w-1/5"></button>
      <button className="w-1/5"></button>
      <button className="w-1/5"></button>
      <button className="w-1/5 bg-gray-100 border-x-1">Settings</button>
    </div>
  );
});
