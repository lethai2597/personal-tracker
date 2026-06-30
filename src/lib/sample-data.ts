import { toIsoDate } from "./date";
import { createId } from "./id";
import { suspendPersistence } from "./use-local-storage";
import type { Bookmark } from "../features/bookmarks/use-bookmarks";
import type { Habit } from "../features/habits/use-habits";
import type { Task, TaskStatus } from "../features/todo/task-types";

/** Tracker data keys — wiped by "clear", filled by "create sample". */
const DATA_KEYS = {
  todos: "pt.todos",
  note: "pt.note",
  bookmarks: "pt.bookmarks",
  groups: "pt.bookmark-groups",
  habits: "pt.habits",
} as const;

function isoInDays(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return toIsoDate(d);
}

/** Epoch ms `days` from now (negative = past); used for done timestamps. */
function msInDays(days: number): number {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.getTime();
}

/** Demo tasks: title, description, due-day offset (null = no date), status. */
const SAMPLE_TASKS: [string, string, number | null, TaskStatus][] = [
  ["Lên kế hoạch du lịch hè", "Chọn điểm đến, đặt vé và khách sạn cho cả nhà.", null, "backlog"],
  ["Khám sức khỏe định kỳ", "Đặt lịch khám tổng quát ở bệnh viện.", 9, "backlog"],
  ["Sơn lại phòng khách", "Chọn màu sơn, mua dụng cụ và lên lịch cuối tuần.", 12, "backlog"],
  ["Dọn dẹp tủ quần áo", "Lọc đồ cũ không mặc để đem cho hoặc bán.", null, "backlog"],
  ["Đóng tiền điện nước", "Thanh toán hóa đơn tháng này trước hạn.", 2, "todo"],
  ["Mua quà sinh nhật mẹ", "Tìm món mẹ thích, gói quà và viết thiệp.", 4, "todo"],
  ["Đi chợ cuối tuần", "Mua thực phẩm cho cả tuần theo danh sách.", 1, "todo"],
  ["Đổi nhớt xe máy", "Mang xe ra tiệm bảo dưỡng định kỳ.", 3, "todo"],
  ["Nấu cơm tối cho gia đình", "Thực đơn: canh chua, cá kho, rau luộc.", 0, "doing"],
  ["Học tiếng Anh mỗi ngày", "Hoàn thành bài học trên app, 30 phút.", 2, "doing"],
  ["Trả sách cho thư viện", "Sách đến hạn trả, tránh bị phạt.", -1, "doing"],
  ["Gọi điện hỏi thăm ông bà", "Cuối tuần gọi về hỏi thăm sức khỏe.", -1, "done"],
  ["Đưa con đi học bơi", "Lớp học chiều thứ Bảy ở hồ bơi gần nhà.", -3, "done"],
  ["Thanh toán thẻ tín dụng", "Trả đủ dư nợ trước ngày sao kê.", -5, "done"],
  ["Tổng vệ sinh nhà cửa", "Lau nhà, giặt rèm, dọn ban công.", -8, "done"],
];

/** Demo bookmarks: url, title, group. */
const SAMPLE_BOOKMARKS: [string, string, string][] = [
  ["https://mail.google.com", "Gmail", "Hằng ngày"],
  ["https://www.google.com/maps", "Google Maps", "Hằng ngày"],
  ["https://calendar.google.com", "Google Lịch", "Hằng ngày"],
  ["https://vnexpress.net", "VnExpress", "Tin tức"],
  ["https://tuoitre.vn", "Tuổi Trẻ", "Tin tức"],
  ["https://thanhnien.vn", "Thanh Niên", "Tin tức"],
  ["https://shopee.vn", "Shopee", "Mua sắm"],
  ["https://www.lazada.vn", "Lazada", "Mua sắm"],
  ["https://tiki.vn", "Tiki", "Mua sắm"],
  ["https://www.cooky.vn", "Cooky - Công thức nấu ăn", "Nấu ăn"],
  ["https://www.dienmayxanh.com", "Điện Máy Xanh", "Mua sắm"],
  ["https://www.facebook.com", "Facebook", ""],
  ["https://www.youtube.com", "YouTube", "Giải trí"],
  ["https://www.netflix.com", "Netflix", "Giải trí"],
];

const SAMPLE_GROUPS = ["Hằng ngày", "Tin tức", "Mua sắm", "Nấu ăn", "Giải trí"];

const SAMPLE_NOTE = `Việc cần làm tuần này
- Đi siêu thị mua đồ ăn cho cả tuần
- Đặt lịch cắt tóc cuối tuần
- Nhắc con làm bài tập về nhà

Cần nhớ
- Sinh nhật mẹ ngày 20, đặt bánh kem
- Đóng học phí cho con đầu tháng
- Mang xe đi bảo dưỡng`;

function buildTasks(): Task[] {
  const now = Date.now();
  return SAMPLE_TASKS.map(([title, description, dueOffset, status], i) => {
    const task: Task = {
      id: createId(),
      title,
      description,
      dueDate: dueOffset === null ? "" : isoInDays(dueOffset),
      status,
      createdAt: now - (SAMPLE_TASKS.length - i) * 1000,
    };
    // Done demos carry a recent completion time (relative to today) so the
    // auto-hide / purge-old-done features have something to act on.
    if (status === "done") task.doneAt = msInDays(dueOffset ?? -1);
    return task;
  });
}

function buildBookmarks(): Bookmark[] {
  return SAMPLE_BOOKMARKS.map(([url, title, group], i) => ({
    id: createId(),
    url,
    title,
    group,
    createdAt: SAMPLE_BOOKMARKS.length - i,
  }));
}

function buildHabits(): Habit[] {
  return [
    { id: createId(), name: "Uống đủ nước", done: [0, -1, -2, -3].map(isoInDays) },
    { id: createId(), name: "Đọc sách 20 phút", done: [-1, -2, -4].map(isoInDays) },
    { id: createId(), name: "Tập thể dục", done: [0, -1].map(isoInDays) },
  ];
}

/** Write a full demo dataset into storage (no reload). */
export function writeSampleData() {
  const store = window.localStorage;
  store.setItem(DATA_KEYS.todos, JSON.stringify(buildTasks()));
  store.setItem(DATA_KEYS.note, JSON.stringify(SAMPLE_NOTE));
  store.setItem(DATA_KEYS.bookmarks, JSON.stringify(buildBookmarks()));
  store.setItem(DATA_KEYS.groups, JSON.stringify(SAMPLE_GROUPS));
  store.setItem(DATA_KEYS.habits, JSON.stringify(buildHabits()));
}

/** Seed a demo dataset only if the board has never held tasks. */
export function seedSampleDataIfEmpty() {
  if (window.localStorage.getItem(DATA_KEYS.todos) === null) {
    writeSampleData();
  }
}

/** Overwrite every tracker with a full demo dataset, then reload to render it. */
export function createSampleData() {
  // Stop in-memory fields (the debounced note) from flushing stale text over
  // the fresh sample data during the reload's pagehide.
  suspendPersistence();
  writeSampleData();
  window.location.reload();
}

/** Clear all tracker data and reload, keeping personalization settings. */
export function clearData() {
  // Suspend writes first, else the note's pagehide flush re-saves it post-wipe.
  suspendPersistence();
  for (const key of Object.values(DATA_KEYS)) {
    window.localStorage.removeItem(key);
  }
  window.location.reload();
}

const DAY_MS = 24 * 60 * 60 * 1000;

function readTodos(): Task[] {
  try {
    const raw = window.localStorage.getItem(DATA_KEYS.todos);
    return raw ? (JSON.parse(raw) as Task[]) : [];
  } catch {
    return [];
  }
}

/** How many done tasks were completed more than `days` ago (for the confirm). */
export function countDoneOlderThan(days: number): number {
  const cutoff = Date.now() - days * DAY_MS;
  return readTodos().filter(
    (t) => t.status === "done" && t.doneAt != null && t.doneAt < cutoff,
  ).length;
}

/** Permanently delete done tasks completed more than `days` ago, then reload. */
export function purgeDoneOlderThan(days: number) {
  const cutoff = Date.now() - days * DAY_MS;
  const kept = readTodos().filter(
    (t) => !(t.status === "done" && t.doneAt != null && t.doneAt < cutoff),
  );
  window.localStorage.setItem(DATA_KEYS.todos, JSON.stringify(kept));
  window.location.reload();
}
