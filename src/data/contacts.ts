// ─────────────────────────────────────────────
//  КОНТАКТЫ — редактируй здесь
// ─────────────────────────────────────────────

export interface ContactItem {
  icon: string;
  label: string;
  value: string;
  sub: string;
  link?: string;
}

export const contacts: ContactItem[] = [
  { icon: "Phone",         label: "Единый номер",   value: "+7 902 404-88-50",       sub: "Звонок по России" },
  { icon: "Mail",          label: "Email",           value: "info@arttele.ru",         sub: "Основная почта" },
  { icon: "Mail",          label: "Email",           value: "art888018@mail.ru",       sub: "Дополнительная почта" },
  { icon: "Send",          label: "Telegram",        value: "@ArtTelecom",             sub: "Написать в Telegram", link: "https://t.me/ArtTelecom" },
  { icon: "MapPin",        label: "Головной офис",   value: "Москва, ул. Цифровая, 1", sub: "Пн–Пт 9:00–18:00" },
  { icon: "MessageCircle", label: "Онлайн-чат",      value: "В личном кабинете",     sub: "24/7 без ожидания" },
];

export const formTopics = [
  "Подключение интернета",
  "Техническая поддержка",
  "Вопрос по счёту",
  "Другое",
];