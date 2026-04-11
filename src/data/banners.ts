// ─────────────────────────────────────────────
//  ПЛАВАЮЩИЕ БАННЕРЫ — редактируй здесь
// ─────────────────────────────────────────────

export type BannerColor = "blue" | "green" | "purple";

export interface Banner {
  id: string;
  icon: string;          // Иконка (lucide)
  label: string;         // Маленький текст сверху
  title: string;         // Главный заголовок
  subtitle: string;      // Подпись под заголовком
  btnText: string;       // Текст кнопки
  link: string;          // Куда ведёт клик
  color: BannerColor;    // Цвет: "blue" | "green" | "purple"
  enabled: boolean;      // false = баннер скрыт
}

const banners: Banner[] = [
  {
    id: "gigabit",
    icon: "Zap",
    label: "Специальное предложение",
    title: "1 Гбит/с",
    subtitle: "от 999 ₽ / мес",
    btnText: "Выбрать тариф",
    link: "/tariffs",
    color: "blue",
    enabled: true,
  },
  {
    id: "wifi6",
    icon: "Wifi",
    label: "При подключении",
    title: "Wi-Fi 6 роутер",
    subtitle: "в подарок",
    btnText: "Подробнее",
    link: "/tariffs",
    color: "green",
    enabled: true,
  },
  {
    id: "business",
    icon: "Building2",
    label: "Для бизнеса",
    title: "SLA 99.99%",
    subtitle: "Персональный менеджер",
    btnText: "Узнать условия",
    link: "/business",
    color: "purple",
    enabled: true,
  },

  // ─── Добавить баннер — скопируй блок выше ───
];

export default banners;
