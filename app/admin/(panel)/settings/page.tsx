import { requireAdmin } from "../../../lib/auth";
import { toSettings } from "../../../lib/content";
import { db } from "../../../lib/db";
import { SettingsForm } from "../../_components/settings-form";

export default async function SettingsPage() {
  await requireAdmin();
  const settings = toSettings(await db()`select key, value from settings`);
  return <SettingsForm key={JSON.stringify(settings)} settings={settings} />;
}
