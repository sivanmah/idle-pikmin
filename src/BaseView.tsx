import { ActiveTask, Resources } from "./types";
import Button from "./ui/Button";
import TaskControls from "./ui/TaskControls";
import { taskDefinition } from "./systems/tasks";

interface BaseViewProps {
  resources: Resources;
  activeTasks: ActiveTask[];
  onGather: (resource: keyof Resources, amount: number) => void;
  onSpend: (resource: keyof Resources, amount: number) => void;
  handleAssign: (taskId: string) => void;
  handleUnassign: (taskId: string) => void;
}

export default function BaseView({
  resources,
  activeTasks,
  onGather,
  onSpend,
  handleAssign,
  handleUnassign,
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
          <TaskControls
            key={activeTask.id}
            onAssign={() => handleAssign(activeTask.id)}
            onUnassign={() => handleUnassign(activeTask.id)}
            taskDef={taskDef}
            activeTask={activeTask}
          />
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
      <div>{renderTasks()}</div>
    </div>
  );
}
