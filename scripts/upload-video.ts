/**
 * Uploads a local video file to the object store and links it to a Lesson.
 *
 * Usage:
 *   npx tsx scripts/upload-video.ts <lessonId> <path/to/video.mp4>
 */
import "dotenv/config";
import { readFile } from "fs/promises";
import path from "path";
import { db } from "../lib/db";
import { uploadObject } from "../lib/storage";

async function main() {
  const [lessonId, filePath] = process.argv.slice(2);

  if (!lessonId || !filePath) {
    console.error("Usage: npx tsx scripts/upload-video.ts <lessonId> <path/to/video.mp4>");
    process.exit(1);
  }

  const lesson = await db.lesson.findUnique({ where: { id: lessonId } });
  if (!lesson) {
    console.error(`Lesson ${lessonId} nicht gefunden.`);
    process.exit(1);
  }

  const buffer = await readFile(filePath);
  const ext = path.extname(filePath) || ".mp4";
  const key = `lessons/${lessonId}${ext}`;

  console.log(`Lade ${filePath} (${(buffer.length / 1024 / 1024).toFixed(1)} MB) nach ${key} hoch…`);
  await uploadObject(key, buffer, "video/mp4");

  await db.lesson.update({ where: { id: lessonId }, data: { videoKey: key } });
  console.log(`Fertig. Lesson "${lesson.title}" verweist jetzt auf ${key}.`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
