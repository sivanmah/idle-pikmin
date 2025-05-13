import { useEffect } from "react";
import { ActiveTask, TaskDefinition } from "../types";

interface TaskControlProps {
  taskDef: TaskDefinition;
  activeTask: ActiveTask;
  onAssign: () => void;
  onUnassign: () => void;
  onTaskComplete: () => void;
}

export default function TaskControls({
  taskDef,
  activeTask,
  onAssign,
  onUnassign,
  onTaskComplete,
}: TaskControlProps) {
  useEffect(() => {
    if (activeTask.progress >= 100) {
      onTaskComplete();
    }
  }, [activeTask, onTaskComplete]);

  return (
    <div className="p-1 w-80 text-center border bg-gray-200  disabled:cursor-default disabled:hover:bg-gray-200">
      <span>
        {taskDef.name} ({activeTask.assignedPikmin} of {taskDef.minPikmin}{" "}
        pikmin)
      </span>
      <div className="flex justify-between p-1">
        <button
          onClick={() => onAssign()}
          className="bg-gray-300 hover:bg-gray-100  cursor-pointer w-1/6"
        >
          +
        </button>
        <progress max={100} value={activeTask.progress} />
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
