"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

export async function markLessonCompleteAction(formData: FormData) {
  const lessonId = formData.get("lessonId");
  const courseSlug = formData.get("courseSlug");
  if (typeof lessonId !== "string" || typeof courseSlug !== "string") return;

  const user = await getCurrentUser();
  if (!user) return;

  await db.lessonProgress.upsert({
    where: { userId_lessonId: { userId: user.id, lessonId } },
    create: { userId: user.id, lessonId },
    update: {},
  });

  revalidatePath(`/learn/${courseSlug}`);
}
