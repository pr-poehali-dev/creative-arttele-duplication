// ─────────────────────────────────────────────
//  О КОМПАНИИ — редактируй здесь
// ─────────────────────────────────────────────

export const aboutInfo = {
  founded: "2012",
  description:
    "СвязьПро — один из крупнейших интернет-провайдеров России. Мы строим оптоволоконные сети, предоставляем гигабитный интернет, цифровое ТВ и IP-телефонию для дома и бизнеса.",
  mission:
    "Наша миссия — сделать быстрый и надёжный интернет доступным для каждого жителя России.",
};

export interface Stat {
  num: string;
  suffix: string;
  label: string;
}

export const stats: Stat[] = [
  { num: "14",    suffix: "лет",  label: "на рынке" },
  { num: "280",   suffix: "К+",   label: "клиентов" },
  { num: "99.9",  suffix: "%",    label: "uptime" },
  { num: "42",    suffix: "",     label: "города" },
];

export interface Advantage {
  icon: string;
  text: string;
}

export const advantages: Advantage[] = [
  { icon: "Award",          text: "Лидер рынка 2024–2025" },
  { icon: "Users",          text: "Команда 2400+ человек" },
  { icon: "Server",         text: "Собственная инфраструктура" },
  { icon: "HeartHandshake", text: "Поддержка 24/7/365" },
];

export interface TeamMember {
  name: string;
  role: string;
  initials: string;
}

export const team: TeamMember[] = [
  { name: "Алексей Волков",    role: "Генеральный директор",   initials: "АВ" },
  { name: "Мария Иванова",     role: "Директор по продукту",   initials: "МИ" },
  { name: "Дмитрий Соколов",   role: "Технический директор",   initials: "ДС" },
];
