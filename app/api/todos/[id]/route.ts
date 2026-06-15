import { NextRequest, NextResponse } from "next/server";
import { and, eq } from "drizzle-orm";
import { db } from "@/db";
import { todos } from "@/db/schema";
import { getTodos } from "@/lib/dashboard-data";
import { parseJson, taskPatchSchema } from "@/lib/dashboard-validation";
import { requireUserId, unauthorized } from "@/lib/session";
import { deleteGoogleCalendarEvent, updateGoogleCalendarEvent, type GoogleCalendarEventDraft } from "@/lib/google-calendar";


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
  if (body.source !== undefined) changes.source = body.source;
  if (body.syncStatus !== undefined) changes.syncStatus = body.syncStatus;
  if (body.startAt !== undefined) changes.startAt = body.startAt ?? null;
  if (body.endAt !== undefined) changes.endAt = body.endAt ?? null;
  if (body.allDay !== undefined) changes.allDay = body.allDay;
  if (body.location !== undefined) changes.location = body.location;
  if (body.googleCalendarId !== undefined) changes.googleCalendarId = body.googleCalendarId ?? null;
  if (body.googleEventId !== undefined) changes.googleEventId = body.googleEventId ?? null;
  if (body.googleEventLink !== undefined) changes.googleEventLink = body.googleEventLink ?? null;
  if (body.googleEventPayload !== undefined) changes.googleEventPayload = body.googleEventPayload ?? null;

  const [existing] = await db
    .select()
    .from(todos)
    .where(and(eq(todos.userId, userId), eq(todos.id, id)));
  
  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const isCalendarTask = existing.googleCalendarId && existing.googleEventId;
  const hasSyncableChanges =
    body.title !== undefined ||
    body.description !== undefined ||
    body.location !== undefined ||
    body.startAt !== undefined ||
    body.dueDate !== undefined ||
    body.endAt !== undefined ||
    body.allDay !== undefined;

  if (isCalendarTask && hasSyncableChanges) {
    try {
      const startMs = body.startAt !== undefined ? body.startAt : existing.startAt;
      const dueMs = body.dueDate !== undefined ? body.dueDate : existing.dueDate;
      const endMs = body.endAt !== undefined ? body.endAt : existing.endAt;
      
      const draft: GoogleCalendarEventDraft = {
        title: body.title ?? existing.title,
        description: body.description ?? existing.description ?? undefined,
        location: body.location ?? existing.location ?? undefined,
        start: startMs ? new Date(startMs).toISOString() : dueMs ? new Date(dueMs).toISOString() : undefined,
        end: endMs ? new Date(endMs).toISOString() : undefined,
        allDay: body.allDay ?? existing.allDay ?? undefined,
      };
      const event = await updateGoogleCalendarEvent(
        userId,
        existing.googleCalendarId!,
        existing.googleEventId!,
        draft
      );
      changes.googleEventLink = event.htmlLink ?? null;
      changes.googleEventPayload = { etag: event.etag, updated: event.updated };
      changes.syncStatus = "synced";
    } catch (e) {
      console.error("Failed to update Google Calendar event", e);
      changes.syncStatus = "error";
    }
  }

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

  const [existing] = await db
    .select()
    .from(todos)
    .where(and(eq(todos.userId, userId), eq(todos.id, id)));

  if (existing?.googleCalendarId && existing?.googleEventId) {
    try {
      await deleteGoogleCalendarEvent(userId, existing.googleCalendarId, existing.googleEventId);
    } catch (e) {
      console.error("Failed to delete Google Calendar event", e);
    }
  }

  await db.delete(todos).where(and(eq(todos.userId, userId), eq(todos.id, id)));
  return NextResponse.json(await getTodos(userId));
}
