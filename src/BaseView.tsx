import { ActiveTask, Resources } from "./types";
import Button from "./ui/Button";
import TaskControls from "./ui/TaskControls";
import { taskDefinition } from "./systems/tasks";
import { motion, AnimatePresence } from "framer-motion";

interface BaseViewProps {
  resources: Resources;
  activeTasks: ActiveTask[];
  onGather: (resource: keyof Resources, amount: number) => void;
  onSpend: (resource: keyof Resources, amount: number) => void;
  onTaskOperation: (taskId: string, pikminDelta: number) => void;
  handleTaskComplete: (taskId: string) => void;
}

export default function BaseView({
  resources,
  activeTasks,
  onGather,
  onSpend,
  onTaskOperation,
  handleTaskComplete,
}: BaseViewProps) {
  function pikminCost(totalPikmin: Resources["pikmin"]) {
    const cost = 1 * 2.2 ** totalPikmin;
    return Math.floor(cost);
  }

  const handleGatherPikmin = () => {
    const cost = pikminCost(resources.pikmin);
    if (resources.pellets >= cost) {
      onGather("pikmin", 1);
      onSpend("pellets", cost);
    }
  };

  function renderTasks() {
    if (activeTasks.length) {
      return activeTasks.map((activeTask) => {
        const taskDef = taskDefinition.find((t) => t.id === activeTask.id)!;

        return (
          <motion.div
            key={activeTask.id}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <TaskControls
              onAssign={() => onTaskOperation(activeTask.id, 1)}
              onUnassign={() => onTaskOperation(activeTask.id, -1)}
              onTaskComplete={() => handleTaskComplete(activeTask.id)}
              taskDef={taskDef}
              activeTask={activeTask}
            />
          </motion.div>
        );
      });
    }
    return null;
  }

  return (
    <div className="flex flex-col gap-10">
      <div>
        <Button
          onClick={() => handleGatherPikmin()}
          disabled={resources.pellets < pikminCost(resources.pikmin)}
        >
          Gather pikmin ({pikminCost(resources.pikmin)} pellets)
        </Button>
      </div>
      <AnimatePresence>{renderTasks()}</AnimatePresence>
    </div>
  );
}
