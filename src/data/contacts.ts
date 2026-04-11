// ─────────────────────────────────────────────
//  КОНТАКТЫ — редактируй здесь
// ─────────────────────────────────────────────

export interface ContactItem {
  icon: string;
  label: string;
  value: string;
  sub: string;
}

export const contacts: ContactItem[] = [
  { icon: "Phone",         label: "Единый номер",   value: "+7 902 404-88-50",       sub: "Бесплатно по России" },
  { icon: "Mail",          label: "Email",           value: "hello@arttelekom-yug.ru",     sub: "Ответим в течение 2 часов" },
  { icon: "MapPin",        label: "Головной офис",   value: "Москва, ул. Цифровая, 1", sub: "Пн–Пт 9:00–18:00" },
  { icon: "MessageCircle", label: "Онлайн-чат",      value: "В личном кабинете",     sub: "24/7 без ожидания" },
];

export const formTopics = [
  "Подключение интернета",
  "Техническая поддержка",
  "Вопрос по счёту",
  "Другое",
];