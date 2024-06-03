import { Input } from "@/componentes/ui/input";
import { LoaderData } from "@/router";

export default function Settings() {
  return (
    <div>
      <label htmlFor="musicPaths">Pastas de música</label>
      <Input type="text" name="musicPaths" />
    </div>
  );
}

export type SettingsLoaderData = LoaderData<typeof Settings.loader>;

Settings.loader = async () => {
  const config = await window.VimpAPI.config.getAll();

  return { config };
}