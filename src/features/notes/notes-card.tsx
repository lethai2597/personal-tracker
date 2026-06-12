import { NotebookPen } from "lucide-react";
import { BentoCard } from "../../components/bento-card";
import { useLocalStorage } from "../../lib/use-local-storage";

/** A single free-form scratch note — no editor, no categories, just text. */
export function NotesCard({ className }: { className?: string }) {
  const [text, setText] = useLocalStorage("pt.note", "");
  const words = text.trim() ? text.trim().split(/\s+/).length : 0;

  return (
    <BentoCard
      icon={NotebookPen}
      title="Ghi chú"
      scrollBody={false}
      className={className}
      action={
        <span className="text-xs font-medium text-ink-faint">
          {words} từ
        </span>
      }
    >
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Note nhanh vài dòng ở đây, tự động lưu lại..."
        className="h-full w-full resize-none rounded-[var(--radius-inner)] bg-surface-sunken p-3.5 text-sm leading-relaxed text-ink outline-none transition-colors placeholder:text-ink-faint focus:bg-surface-sunken focus:ring-2 focus:ring-accent/30"
      />
    </BentoCard>
  );
}
