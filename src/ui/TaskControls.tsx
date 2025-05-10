import { useEffect } from "react";
import { ActiveTask, TaskDefinition } from "../types";

interface TaskControlProps {
  taskDef: TaskDefinition;
  activeTask: ActiveTask;
  onAssign: () => void;
  onUnassign: () => void;
}

export default function TaskControls({
  taskDef,
  activeTask,
  onAssign,
  onUnassign,
}: TaskControlProps) {
  return (
    <div className="p-1 w-80 text-center border bg-gray-200  disabled:cursor-default disabled:hover:bg-gray-200">
      <span>
        {taskDef.name} (requires {taskDef.minPikmin} pikmin)
      </span>
      <div className="flex justify-between p-1">
        <button
          onClick={() => onAssign()}
          className="bg-gray-300 hover:bg-gray-100  cursor-pointer w-1/6"
        >
          +
        </button>
        <span>{activeTask.assignedPikmin} assigned</span>
        <button
          onClick={() => onUnassign()}
          className="bg-gray-300 hover:bg-gray-100 cursor-pointer w-1/6"
        >
          -
        </button>
      </div>
    </div>
  );
}
