import { Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "../../lib/cn";
import { Modal } from "../../components/modal";
import { DatePicker } from "../../components/ui/date-picker";
import { STATUS_META, TASK_STATUSES, type Task } from "./task-types";
import type { TaskDraft } from "./use-todos";

type TaskDetailDialogProps = {
  task: Task | null;
  onClose: () => void;
  onPatch: (patch: Partial<TaskDraft>) => void;
  onDelete: () => void;
};

/**
 * Trello-style "card back": a readable detail view where each field becomes
 * editable on click and saves immediately — no form, no explicit Save button.
 */
export function TaskDetailDialog({
  task,
  onClose,
  onPatch,
  onDelete,
}: TaskDetailDialogProps) {
  const [editingTitle, setEditingTitle] = useState(false);
  const [editingDesc, setEditingDesc] = useState(false);
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");

  // Re-seed local buffers whenever a different task opens.
  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDesc(task.description);
      setEditingTitle(false);
      setEditingDesc(false);
    }
  }, [task?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!task) {
    return <Modal open={false} title="" onClose={onClose} children={null} />;
  }

  function commitTitle() {
    const clean = title.trim();
    if (clean && clean !== task!.title) onPatch({ title: clean });
    else setTitle(task!.title);
    setEditingTitle(false);
  }

  function commitDesc() {
    if (desc !== task!.description) onPatch({ description: desc });
    setEditingDesc(false);
  }

  // Status pills live in the modal header (replacing a redundant "Chi tiết" title).
  const statusPills = (
    <div className="flex flex-wrap gap-1.5">
      {TASK_STATUSES.map((s) => {
        const active = task.status === s;
        return (
          <button
            key={s}
            type="button"
            onClick={() => onPatch({ status: s })}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium transition-colors",
              active
                ? "bg-accent-strong text-white"
                : "bg-surface-muted text-ink-soft hover:bg-surface-hover",
            )}
          >
            <span
              className={cn(
                "h-1.5 w-1.5 rounded-full",
                active ? "bg-white/80" : STATUS_META[s].dot,
              )}
            />
            {STATUS_META[s].label}
          </button>
        );
      })}
    </div>
  );

  return (
    <Modal open title={statusPills} onClose={onClose}>
      <div className="space-y-5">
        {/* Title — click to edit inline. */}
        {editingTitle ? (
          <input
            autoFocus
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onBlur={commitTitle}
            onKeyDown={(e) => {
              if (e.key === "Enter") commitTitle();
              if (e.key === "Escape") {
                // Exit the inline edit only — don't let Modal catch Esc + close.
                e.stopPropagation();
                setTitle(task.title);
                setEditingTitle(false);
              }
            }}
            className="w-full rounded-[var(--radius-inner)] bg-surface-sunken px-3 py-2 text-lg font-semibold text-ink outline-none ring-2 ring-accent/40"
          />
        ) : (
          <button
            type="button"
            onClick={() => setEditingTitle(true)}
            className="-mx-2 block w-[calc(100%+1rem)] break-words rounded-[var(--radius-inner)] px-2 py-1 text-left text-lg font-semibold leading-snug text-ink transition-colors hover:bg-surface-sunken"
          >
            {task.title}
          </button>
        )}

        {/* Due date — change saves immediately. */}
        <div>
          <p className="mb-2 text-xs font-medium uppercase tracking-wide text-ink-faint">
            Hạn chót
          </p>
          <DatePicker
            value={task.dueDate}
            onChange={(iso) => onPatch({ dueDate: iso })}
            placeholder="Thêm hạn chót"
          />
        </div>

        {/* Description — click to edit inline. */}
        <div>
          <p className="mb-2 text-xs font-medium uppercase tracking-wide text-ink-faint">
            Mô tả
          </p>
          {editingDesc ? (
            <textarea
              autoFocus
              rows={5}
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              onBlur={commitDesc}
              onKeyDown={(e) => {
                if (e.key === "Escape") {
                  // Exit the inline edit only — don't let Modal catch Esc + close.
                  e.stopPropagation();
                  setDesc(task.description);
                  setEditingDesc(false);
                }
              }}
              placeholder="Thêm chi tiết..."
              className="w-full resize-none rounded-[var(--radius-inner)] bg-surface-sunken p-3 text-sm leading-relaxed text-ink outline-none ring-2 ring-accent/40 placeholder:text-ink-faint"
            />
          ) : (
            <button
              type="button"
              onClick={() => setEditingDesc(true)}
              className={cn(
                "block max-h-[38vh] w-full overflow-y-auto whitespace-pre-wrap break-words rounded-[var(--radius-inner)] bg-surface-sunken p-3 text-left text-sm leading-relaxed transition-colors hover:bg-surface-muted",
                task.description ? "text-ink" : "text-ink-faint",
              )}
            >
              {task.description || "Thêm chi tiết..."}
            </button>
          )}
        </div>

        <div className="border-t border-line pt-4">
          <button
            type="button"
            onClick={() => {
              onDelete();
              onClose();
            }}
            className="flex w-full items-center justify-center gap-2 rounded-full bg-red-50 py-2.5 text-sm font-semibold text-red-600 transition-colors hover:bg-red-100"
          >
            <Trash2 size={16} />
            Xoá task
          </button>
        </div>
      </div>
    </Modal>
  );
}
