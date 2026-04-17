export const PAY_URL = "https://functions.poehali.dev/4e4b7ea0-3d9c-4c7a-9740-e36169ebf4c7";

export type Tab = "cameras" | "archive" | "alerts" | "billing" | "settings";

export const mockCameras = [
  { id: 1, name: "Вход — Камера 1", location: "Главный вход", status: "online", resolution: "1080p", storage: "7 дней", iframe: "https://vkvideo.ru/video_ext.php?oid=-104158648&id=456239679&hash=", color: "#00d4ff" },
  { id: 2, name: "Парковка — Камера 2", location: "Паркинг Б-1", status: "online", resolution: "4K", storage: "30 дней", iframe: "https://vkvideo.ru/video_ext.php?oid=-105329382&id=456240514&hd=2&autoplay=1", color: "#00f57a" },
  { id: 3, name: "Склад — Камера 3", location: "Склад №2", status: "offline", resolution: "1080p", storage: "7 дней", iframe: null, color: "#ef4444" },
  { id: 4, name: "Офис — Камера 4", location: "Кабинет директора", status: "online", resolution: "4K", storage: "30 дней", iframe: null, color: "#a855f7" },
];

export const mockAlerts = [
  { id: 1, cam: "Вход — Камера 1", time: "Сегодня, 14:32", type: "motion", text: "Обнаружено движение" },
  { id: 2, cam: "Парковка — Камера 2", time: "Сегодня, 12:15", type: "person", text: "Обнаружен человек" },
  { id: 3, cam: "Склад — Камера 3", time: "Вчера, 23:47", type: "offline", text: "Камера отключилась" },
  { id: 4, cam: "Вход — Камера 1", time: "Вчера, 09:10", type: "motion", text: "Обнаружено движение" },
  { id: 5, cam: "Офис — Камера 4", time: "12 апр, 18:00", type: "person", text: "Обнаружен человек" },
];

export const mockArchive = [
  { date: "Сегодня", items: ["14:32 — Движение (2 мин)", "10:15 — Движение (45 сек)", "08:02 — Вход в зону (1 мин)"] },
  { date: "Вчера", items: ["23:47 — Камера офлайн", "17:30 — Движение (3 мин)", "09:10 — Движение (1 мин)"] },
  { date: "10 апреля", items: ["20:15 — Движение (2 мин)", "13:00 — Человек в зоне (5 мин)"] },
];

export const plans = [
  { id: "start", name: "Старт", price: 490, cameras: 2, storage: "7 дней" },
  { id: "pro", name: "Про", price: 1290, cameras: 8, storage: "30 дней" },
  { id: "business", name: "Бизнес", price: 3900, cameras: 32, storage: "90 дней" },
];

export const navItems: { id: Tab; icon: string; label: string }[] = [
  { id: "cameras", icon: "Camera", label: "Камеры" },
  { id: "archive", icon: "Film", label: "Архив" },
  { id: "alerts", icon: "Bell", label: "Алерты" },
  { id: "billing", icon: "CreditCard", label: "Тариф" },
  { id: "settings", icon: "Settings", label: "Настройки" },
];

export type CloudUser = { name: string; email: string; plan: string; is_demo: boolean };
export type CloudCamera = (typeof mockCameras)[0];
