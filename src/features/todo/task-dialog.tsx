import { Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { FieldLabel, TextArea, TextField } from "../../components/form-controls";
import { Modal } from "../../components/modal";
import { DatePicker } from "../../components/ui/date-picker";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { STATUS_META, TASK_STATUSES, type Task } from "./task-types";
import type { TaskDraft } from "./use-todos";

type TaskDialogProps = {
  open: boolean;
  /** Existing task when editing, otherwise creating a new one. */
  task: Task | null;
  onClose: () => void;
  onSubmit: (draft: TaskDraft) => void;
  onDelete?: () => void;
};

const EMPTY: TaskDraft = {
  title: "",
  description: "",
  dueDate: "",
  status: "todo",
};

export function TaskDialog({
  open,
  task,
  onClose,
  onSubmit,
  onDelete,
}: TaskDialogProps) {
  const [draft, setDraft] = useState<TaskDraft>(EMPTY);
  // A task with an id is an edit; one without (but with prefilled fields like a
  // due date picked on the calendar) is still a brand-new task.
  const isEditing = Boolean(task?.id);

  useEffect(() => {
    if (!open) return;
    setDraft(task ? { ...task } : EMPTY);
  }, [open, task]);

  function submit() {
    if (!draft.title.trim()) return;
    onSubmit({ ...draft, title: draft.title.trim() });
    onClose();
  }

  return (
    <Modal
      open={open}
      title={isEditing ? "Sửa task" : "Task mới"}
      onClose={onClose}
    >
      <div className="space-y-4">
        <div>
          <FieldLabel>Tiêu đề</FieldLabel>
          <TextField
            autoFocus
            placeholder="Bạn cần làm gì?"
            value={draft.title}
            onChange={(e) => setDraft({ ...draft, title: e.target.value })}
            onKeyDown={(e) => e.key === "Enter" && e.metaKey && submit()}
          />
        </div>
        <div>
          <FieldLabel>Mô tả</FieldLabel>
          <TextArea
            rows={5}
            placeholder="Thêm chi tiết (không bắt buộc)"
            value={draft.description}
            onChange={(e) =>
              setDraft({ ...draft, description: e.target.value })
            }
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <FieldLabel>Hạn chót</FieldLabel>
            <DatePicker
              value={draft.dueDate}
              onChange={(iso) => setDraft({ ...draft, dueDate: iso })}
              placeholder="Chọn ngày"
            />
          </div>
          <div>
            <FieldLabel>Trạng thái</FieldLabel>
            <Select
              value={draft.status}
              onValueChange={(v) =>
                setDraft({ ...draft, status: v as Task["status"] })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {TASK_STATUSES.map((s) => (
                  <SelectItem key={s} value={s}>
                    {STATUS_META[s].label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex items-center gap-2 pt-1">
          <button
            type="button"
            onClick={submit}
            className="flex-1 rounded-full bg-btn py-2.5 text-sm font-semibold text-btn-ink transition-colors hover:opacity-90"
          >
            {isEditing ? "Lưu thay đổi" : "Thêm task"}
          </button>
          {isEditing && onDelete ? (
            <button
              type="button"
              aria-label="Xóa task"
              title="Xóa task"
              onClick={() => {
                onDelete();
                onClose();
              }}
              className="grid h-[42px] w-[42px] place-items-center rounded-full bg-red-50 text-red-500 transition-colors hover:bg-red-100"
            >
              <Trash2 size={18} />
            </button>
          ) : null}
        </div>
      </div>
    </Modal>
  );
}
