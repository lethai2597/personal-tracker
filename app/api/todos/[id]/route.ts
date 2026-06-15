import { NextRequest, NextResponse } from "next/server";
import { and, eq } from "drizzle-orm";
import { db } from "@/db";
import { todos } from "@/db/schema";
import { getTodos } from "@/lib/dashboard-data";
import { parseJson, taskPatchSchema } from "@/lib/dashboard-validation";
import { requireUserId, unauthorized } from "@/lib/session";

export async function PATCH(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const userId = await requireUserId();
  if (!userId) return unauthorized();
  const { id } = await context.params;
  const parsed = await parseJson(request, taskPatchSchema);
  if ("response" in parsed) return parsed.response;
  const body = parsed.data;
  const changes: Partial<typeof todos.$inferInsert> = {};
  if (body.title !== undefined) changes.title = body.title;
  if (body.description !== undefined) changes.description = body.description;
  if (body.dueDate !== undefined) changes.dueDate = body.dueDate;
  if (body.status !== undefined) changes.status = body.status;
  if (body.checklist !== undefined) changes.checklist = JSON.stringify(body.checklist);
  if (body.doneAt !== undefined) changes.doneAt = body.doneAt;
  await db
    .update(todos)
    .set(changes)
    .where(and(eq(todos.userId, userId), eq(todos.id, id)));
  return NextResponse.json(await getTodos(userId));
}

export async function DELETE(_request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const userId = await requireUserId();
  if (!userId) return unauthorized();
  const { id } = await context.params;
  await db.delete(todos).where(and(eq(todos.userId, userId), eq(todos.id, id)));
  return NextResponse.json(await getTodos(userId));
}
