import { useEffect, useState } from "react";
import ResourceBar from "./ResourceBar";
import BaseView from "./BaseView";
import { ActiveTask, GameView, Resources, UnlockRecord } from "./types";
import { unlockDefinitions } from "./systems/unlocks";
import { taskDefinition } from "./systems/tasks";
import { PDA } from "./PDA";
import Settings from "./Settings";

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

      return updatedTasks;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tick]);

  useEffect(() => {
    setUnlocks((prev) => {
      // filter unlockDefinitions for objects where conditions are met, such as resources gained and if the unlock has been activated yet or not take their id and put them in a newUnlocks array
      const newUnlocks = unlockDefinitions
        .filter((obj) => obj.condition(resources, prev))
        .map((obj) => obj.id);

      if (newUnlocks.length === 0) return prev;

      const updates: UnlockRecord = {};
      newUnlocks.forEach((id) => {
        updates[id] = true;
      });

      return { ...prev, ...updates };
    });
  }, [resources]);

  useEffect(() => {
    setActiveTasks((prev) => {
      // also update activetasks according to defined reveal condition, and if its already in activetasks or not
      const tasksConditionMet = taskDefinition.filter(
        (obj) =>
          obj.revealCondition(unlocks) && !prev.some((t) => t.id === obj.id)
      );
      if (tasksConditionMet.length === 0) return prev;

      const newActiveTasks: ActiveTask[] = tasksConditionMet.map((task) => ({
        id: task.id,
        assignedPikmin: 0,
        progress: 0,
        started: false,
      }));
      return [...prev, ...newActiveTasks];
    });
  }, [unlocks]);

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

  function handleTaskOperation(taskId: string, pikminDelta: number) {
    if (pikminDelta > 0 && getIdlePikmin() < pikminDelta) return;

    const task = activeTasks.find((task) => task.id === taskId);
    if (pikminDelta < 0 && task!.assignedPikmin < pikminDelta * -1) return;

    const taskDef = taskDefinition.find((task) => task.id === taskId);
    setActiveTasks((prev) =>
      prev.map((t) => {
        if (t.id !== taskId) return t;
        const newPikmin = t.assignedPikmin + pikminDelta;
        return {
          ...t,
          assignedPikmin: newPikmin,
          started: newPikmin >= taskDef!.minPikmin,
        };
      })
    );
  }

  function handleTaskComplete(taskId: string) {
    const taskDef = taskDefinition.find((t) => t.id === taskId);
    setUnlocks((prev) => ({
      ...prev,
      // as keyof typeof prev so typescript knows its a valid type
      [taskDef!.unlock as keyof typeof prev]: true,
    }));

    // remove the finished task
    setActiveTasks((prev) => prev.filter((t) => t.id != taskId));
  }

  function renderView() {
    if (gameView === "base")
      return (
        <BaseView
          resources={resources}
          activeTasks={activeTasks}
          onGather={(resource, amount) => gatherResource(resource, amount)}
          onSpend={(resource, amount) => spendResource(resource, amount)}
          onTaskOperation={handleTaskOperation}
          handleTaskComplete={handleTaskComplete}
        />
      );
    else if (gameView === "map") return "map view";
    else if (gameView === "settings") return <Settings />;
  }

  return (
    <div className="m-0 p-0 flex h-screen justify-center">
      <div className="w-1/2 h-full">
        <div className="w-full h-1/12 border-b-2">
          {unlocks.pda && (
            <PDA unlocks={unlocks} onViewChange={(view) => setGameView(view)} />
          )}
        </div>
        <div className="w-full h-10/12 flex">
          <ResourceBar
            resources={resources}
            unlocks={unlocks}
            idlePikmin={getIdlePikmin()}
          />
          {isDebug && (
            <>
              <button
                onClick={() =>
                  setResources({
                    ...resources,
                    pellets: resources.pellets + 500,
                  })
                }
              >
                cheat pellets
              </button>
              <button
                onClick={() =>
                  setResources({
                    ...resources,
                    pikmin: resources.pikmin + 10,
                  })
                }
              >
                cheat pikmin
              </button>
            </>
          )}
          <div className="h-full w-full p-4">{renderView()}</div>
        </div>
      </div>
    </div>
  );
}

export default App;
