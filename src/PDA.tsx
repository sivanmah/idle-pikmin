import { memo } from "react";
import { GameView, UnlockRecord } from "./types";

interface PDAInterface {
  unlocks: UnlockRecord;
  onViewChange: (view: GameView) => void;
}

export const PDA = memo(({ unlocks, onViewChange }: PDAInterface) => {
  return (
    <div className="flex w-full h-full">
      <button
        onClick={() => onViewChange("base")}
        className="w-1/5 bg-gray-100 border-x-1"
      >
        Base
      </button>
      <button className="w-1/5"></button>
      <button className="w-1/5"></button>
      <button className="w-1/5"></button>
      <button
        onClick={() => onViewChange("settings")}
        className="w-1/5 bg-gray-100 border-x-1"
      >
        Settings
      </button>
    </div>
  );
});
