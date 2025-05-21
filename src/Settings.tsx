import Button from "./ui/Button";

export default function Settings() {
  return (
    <div className="flex flex-col gap-10 w-1/4">
      <Button>Save game</Button>
      <Button>Load save</Button>
    </div>
  );
}
