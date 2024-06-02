import { Input } from "@/componentes/ui/input";

export default function Settings() {
  return (
    <div>
      <label htmlFor="musicPaths">Pastas de música</label>
      <Input type="text" name="musicPaths" />
    </div>
  );
}