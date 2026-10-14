import { requireAdmin } from "../../../lib/auth";
import { toMedia } from "../../../lib/content";
import { db } from "../../../lib/db";
import { MediaManager } from "../../_components/media";
import s from "../../studio.module.css";

export default async function MediaPage() {
  await requireAdmin();
  const media = (await db()`select * from media order by created_at desc, id desc`).map(toMedia);
  return <><div className={s.pageHeading}><div><h1>Media library</h1></div></div><MediaManager initial={media} /></>;
}
