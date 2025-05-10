import { Resources, UnlockId } from "./types";

interface ResourceBarProps {
  resources: Resources;
  idlePikmin: number;
  unlocks: Partial<Record<UnlockId, boolean>>;
}

export default function ResourceBar({
  resources,
  idlePikmin,
  unlocks,
}: ResourceBarProps) {
  return (
    <div className="pt-4 w-1/5 h-full border-r-2 flex flex-col gap-y-1">
      {unlocks.pikmin && (
        <span>
          You have {resources.pikmin} pikmin ({idlePikmin} idle)
        </span>
      )}
      <span>You have {resources.pellets} pellets</span>
    </div>
  );
}
