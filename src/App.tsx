import { useEffect, useState } from "react";
import ResourceBar from "./ResourceBar";
import BaseView from "./BaseView";
import { ActiveTask, GameView, Resources, UnlockRecord } from "./types";
import { unlockDefinitions } from "./systems/unlocks";
import { taskDefinition } from "./systems/tasks";

function App() {
  const isDebug = import.meta.env.DEV;

  const [resources, setResources] = useState<Resources>({
    pikmin: 0,
    pellets: 1,
    nectar: 0,
  });
  const [activeTasks, setActiveTasks] = useState<ActiveTask[]>([]);
  const [unlocks, setUnlocks] = useState<UnlockRecord>({});
  const [gameView, setGameView] = useState<GameView>("base");
  const [tick, setTick] = useState(0);

  //consolelogger
  /*
  useEffect(() => {
    console.log(resources);
    console.log(activeTasks);
    console.log(unlocks);
    console.log(getIdlePikmin());
  }, [resources, unlocks, activeTasks, getIdlePikmin]);
  */

  useEffect(() => {
    const interval = setInterval(() => {
      setTick((t) => t + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    setResources((prev) => {
      const updates = { ...prev };

      // Every 3 seconds, each idle pikmin collects 1 pellet
      if (tick % 3 === 0) {
        updates.pellets += getIdlePikmin() * 1;
      }

      return updates;
    });

    // look for tasks that are started
    setActiveTasks((prev) => {
      const updatedTasks = prev.map((task) => {
        if (!task.started) return task;

        // update every other tick
        if (tick % 2 === 0 && task.progress < 100) {
          const newProgress = Math.min(
            task.progress + task.assignedPikmin * 2,
            100
          );
          return {
            ...task,
            progress: newProgress,
          };
        }
        // no update needed
        return task;
      });

      // remove finished tasks
      return updatedTasks.filter((task) => task.progress < 100);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tick]);

  useEffect(() => {
    activeTasks.map((task) => triggerActiveTask(task));
  }, [activeTasks]);

  useEffect(() => {
    // filter unlockDefinitions for objects where conditions are met, such as resources gained and if the unlock has been activated yet or not take their id and put them in a newUnlocks array
    const newUnlocks = unlockDefinitions
      .filter((obj) => obj.condition(resources, unlocks))
      .map((obj) => obj.id);

    // if any conditions are found to be met, update the state
    if (newUnlocks.length > 0) {
      setUnlocks((prev) => {
        const updates = {} as UnlockRecord;
        newUnlocks.forEach((id) => {
          updates[id] = true;
        });
        return { ...prev, ...updates };
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resources]);

  useEffect(() => {
    // also update activetasks according to defined taskreveal in taskdefinition
    const tasksConditionMet = taskDefinition.filter((obj) =>
      obj.revealCondition(unlocks)
    );

    if (tasksConditionMet.length > 0) {
      const newActiveTasks: ActiveTask[] = tasksConditionMet.map((task) => ({
        id: task.id,
        assignedPikmin: 0,
        progress: 0,
        started: false,
      }));
      setActiveTasks([...activeTasks, ...newActiveTasks]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [unlocks]);

  function triggerActiveTask(task: ActiveTask) {
    const taskDef = taskDefinition.find((t) => t.id === task.id);
    setActiveTasks((prev) => {
      return prev.map((t) => {
        if (t.id === task.id) {
          if (
            (task.started && t.assignedPikmin < taskDef!.minPikmin) ||
            (!task.started && t.assignedPikmin >= taskDef!.minPikmin)
          ) {
            return { ...t, started: !t.started };
          }
        }
        return t;
      });
    });
  }

  function gatherResource(resource: keyof Resources, amount: number) {
    setResources((prevResources) => ({
      ...prevResources,
      [resource]: prevResources[resource] + amount,
    }));
  }

  function spendResource(resource: keyof Resources, amount: number) {
    setResources((prevResources) => ({
      ...prevResources,
      [resource]: prevResources[resource] - amount,
    }));
  }

  function getIdlePikmin() {
    const totalPikmin = resources.pikmin || 0;
    if (!activeTasks.length) return totalPikmin;

    const busyPikmin = activeTasks.reduce(
      (sum, task) => sum + task.assignedPikmin,
      0
    );
    return resources.pikmin - busyPikmin;
  }

  function handleAssign(taskId: string) {
    const idlePikmin = getIdlePikmin();
    if (idlePikmin < 1) {
      return;
    }

    const task = activeTasks.find((t) => t.id === taskId);
    if (task) {
      setActiveTasks((prev) =>
        prev.map((t) =>
          t.id === taskId ? { ...t, assignedPikmin: t.assignedPikmin + 1 } : t
        )
      );

      const taskDef = taskDefinition.find((t) => t.id === taskId);
      if (task.assignedPikmin >= taskDef!.minPikmin) {
        task.started = true;
        setActiveTasks((prev) =>
          prev.map((t) => (t.id === taskId ? { ...t, started: true } : t))
        );
      }
    }
  }

  function handleUnassign(taskId: string) {
    const task = activeTasks.find((t) => t.id === taskId);
    if (task && task.assignedPikmin < 1) {
      return;
    }

    if (task) {
      setActiveTasks((prev) =>
        prev.map((t) => ({ ...t, assignedPikmin: t.assignedPikmin - 1 }))
      );
    }
  }

  function renderView() {
    if (gameView === "base")
      return (
        <BaseView
          resources={resources}
          activeTasks={activeTasks}
          onGather={(resource, amount) => gatherResource(resource, amount)}
          onSpend={(resource, amount) => spendResource(resource, amount)}
          handleAssign={handleAssign}
          handleUnassign={handleUnassign}
        />
      );
    else if (gameView === "map") return "map view";
    else if (gameView === "settings") return "settings view";
  }

  return (
    <div className="m-0 p-0 flex h-screen justify-center">
      <div className="w-1/2 h-full">
        <div className="w-full h-1/12 border-b-2">PDA</div>
        <div className="w-full h-10/12 flex">
          <ResourceBar
            resources={resources}
            unlocks={unlocks}
            idlePikmin={getIdlePikmin()}
          />
          {isDebug && (
            <button
              onClick={() =>
                setResources({ ...resources, pellets: resources.pellets + 500 })
              }
            >
              cheat pellets
            </button>
          )}
          <div className="h-full w-full p-4">{renderView()}</div>
        </div>
      </div>
    </div>
  );
}

export default App;
