import { useMemo } from "react";
import { createId } from "../../lib/id";
import { useLocalStorage } from "../../lib/use-local-storage";
import { TASK_STATUSES, type Task, type TaskStatus } from "./task-types";

export type TaskDraft = Pick<Task, "title" | "description" | "dueDate" | "status">;

/** Source of truth for tasks with grouping + CRUD + status moves. */
export function useTodos() {
  const [tasks, setTasks] = useLocalStorage<Task[]>("pt.todos", []);

  const byStatus = useMemo(() => {
    const groups = Object.fromEntries(
      TASK_STATUSES.map((s) => [s, [] as Task[]]),
    ) as Record<TaskStatus, Task[]>;
    for (const task of tasks) groups[task.status].push(task);
    return groups;
  }, [tasks]);

  function addTask(draft: TaskDraft) {
    setTasks((prev) => [
      { ...draft, id: createId(), createdAt: Date.now() },
      ...prev,
    ]);
  }

  function updateTask(id: string, draft: TaskDraft) {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...draft } : t)),
    );
  }

  /** Inline auto-save: merge a partial patch into one task. */
  function patchTask(id: string, patch: Partial<TaskDraft>) {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...patch } : t)),
    );
  }

  function moveTask(id: string, status: TaskStatus) {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, status } : t)));
  }

  /** Replace the whole task list — used by drag-sort to persist new order/status. */
  function reorderTasks(next: Task[]) {
    setTasks(next);
  }

  function removeTask(id: string) {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  }

  return {
    tasks,
    byStatus,
    addTask,
    updateTask,
    patchTask,
    moveTask,
    reorderTasks,
    removeTask,
  };
}
