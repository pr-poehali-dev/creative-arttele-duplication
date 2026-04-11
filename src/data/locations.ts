// ═══════════════════════════════════════════════════════
//  НАСЕЛЁННЫЕ ПУНКТЫ — редактируй здесь
//  Каждый пункт: свои тарифы, акции и описание
// ═══════════════════════════════════════════════════════

export type TariffColor = "blue" | "green" | "purple";

export interface LocationTariff {
  name: string;
  speed: string;          // Мбит/с
  price: string;          // ₽/мес
  oldPrice?: string;      // Зачёркнутая старая цена (для акции)
  popular?: boolean;
  color: TariffColor;
  features: string[];
}

export interface LocationPromo {
  title: string;          // Заголовок акции
  desc: string;           // Описание
  badge?: string;         // Бейдж ("Акция", "Новинка" и т.д.)
  color: TariffColor;
}

export interface Location {
  slug: string;           // URL: /location/oazis
  name: string;           // Название населённого пункта
  description: string;    // Короткое описание под заголовком
  available: boolean;     // false = скоро, без тарифов
  tariffs: LocationTariff[];
  promos: LocationPromo[];
}

const locations: Location[] = [
  {
    slug: "oazis",
    name: "Оазис",
    description: "Подключение к гигабитной оптике. Доступны все тарифы линейки.",
    available: true,
    promos: [
      { title: "Первый месяц бесплатно", desc: "При подключении тарифа «Оптима» или выше — первый месяц в подарок.", badge: "Акция", color: "green" },
      { title: "Роутер Wi-Fi 6 в подарок", desc: "При подключении тарифа «Максимум».", badge: "Подарок", color: "blue" },
    ],
    tariffs: [
      { name: "Старт", speed: "100", price: "399", color: "blue", features: ["100 Мбит/с", "Безлимит", "Поддержка 24/7"] },
      { name: "Оптима", speed: "300", price: "599", oldPrice: "649", popular: true, color: "green", features: ["300 Мбит/с", "Безлимит", "Антивирус", "ТВ 100 каналов"] },
      { name: "Максимум", speed: "1000", price: "899", oldPrice: "999", color: "purple", features: ["1 Гбит/с", "Безлимит", "Антивирус+", "ТВ 450+", "Роутер Wi-Fi 6"] },
    ],
  },
  {
    slug: "noviy",
    name: "Новый",
    description: "Высокоскоростной интернет для жителей посёлка Новый.",
    available: true,
    promos: [
      { title: "Скидка 20% на первые 3 месяца", desc: "Для новых абонентов посёлка Новый при подключении любого тарифа.", badge: "Акция", color: "blue" },
    ],
    tariffs: [
      { name: "Базовый", speed: "50", price: "279", color: "blue", features: ["50 Мбит/с", "Безлимит", "Поддержка 24/7"] },
      { name: "Комфорт", speed: "100", price: "379", popular: true, color: "green", features: ["100 Мбит/с", "Безлимит", "Антивирус", "ТВ 50 каналов"] },
      { name: "Оптима", speed: "300", price: "579", color: "purple", features: ["300 Мбит/с", "Безлимит", "Антивирус", "ТВ 100 каналов"] },
    ],
  },
  {
    slug: "otradniy",
    name: "Отрадный",
    description: "Стабильный интернет для Отрадного. Подключение за 24 часа.",
    available: true,
    promos: [
      { title: "Подключение за 0 ₽", desc: "Бесплатное подключение и прокладка кабеля до квартиры.", badge: "Бесплатно", color: "green" },
      { title: "ТВ 3 месяца бесплатно", desc: "При подключении тарифа «Оптима» или «Максимум».", badge: "Акция", color: "blue" },
    ],
    tariffs: [
      { name: "Старт", speed: "100", price: "399", color: "blue", features: ["100 Мбит/с", "Безлимит", "Поддержка 24/7"] },
      { name: "Оптима", speed: "300", price: "629", popular: true, color: "green", features: ["300 Мбит/с", "Безлимит", "Антивирус", "ТВ 100 каналов"] },
      { name: "Максимум", speed: "1000", price: "949", color: "purple", features: ["1 Гбит/с", "Безлимит", "Антивирус+", "ТВ 450+", "Роутер Wi-Fi 6"] },
    ],
  },
  {
    slug: "natuhay",
    name: "Натухай",
    description: "Оптоволоконный интернет в Натухае. Без ограничений трафика.",
    available: true,
    promos: [
      { title: "Скидка 15% пенсионерам", desc: "Постоянная скидка на любой тариф для пенсионеров при предъявлении удостоверения.", badge: "Льгота", color: "purple" },
    ],
    tariffs: [
      { name: "Лайт", speed: "30", price: "229", color: "blue", features: ["30 Мбит/с", "Безлимит", "Поддержка"] },
      { name: "Старт", speed: "100", price: "379", popular: true, color: "green", features: ["100 Мбит/с", "Безлимит", "Антивирус", "Поддержка 24/7"] },
      { name: "Оптима", speed: "300", price: "599", color: "purple", features: ["300 Мбит/с", "Безлимит", "Антивирус", "ТВ 100 каналов"] },
    ],
  },
  {
    slug: "enem",
    name: "Энем",
    description: "Быстрый интернет для жителей Энема. Гигабит уже доступен.",
    available: true,
    promos: [
      { title: "Два месяца по цене одного", desc: "При оплате на 6 месяцев вперёд — 2 месяца бесплатно.", badge: "Выгода", color: "green" },
      { title: "Антивирус в подарок на год", desc: "При подключении тарифа «Оптима» или выше.", badge: "Подарок", color: "blue" },
    ],
    tariffs: [
      { name: "Старт", speed: "100", price: "389", color: "blue", features: ["100 Мбит/с", "Безлимит", "Поддержка 24/7"] },
      { name: "Оптима", speed: "300", price: "609", oldPrice: "649", popular: true, color: "green", features: ["300 Мбит/с", "Безлимит", "Антивирус", "ТВ 100 каналов"] },
      { name: "Максимум", speed: "1000", price: "929", oldPrice: "999", color: "purple", features: ["1 Гбит/с", "Безлимит", "Антивирус+", "ТВ 450+", "Роутер Wi-Fi 6"] },
    ],
  },
  {
    slug: "enem-dachi",
    name: "Энем-дачи",
    description: "Сезонное и круглогодичное подключение для дачного посёлка Энем-дачи.",
    available: true,
    promos: [
      { title: "Дачный тариф — заморозка на зиму", desc: "Приостановите тариф на зимний период без потери номера и настроек.", badge: "Дачникам", color: "green" },
    ],
    tariffs: [
      { name: "Дачный", speed: "30", price: "199", color: "blue", features: ["30 Мбит/с", "Безлимит", "Заморозка на зиму"] },
      { name: "Комфорт", speed: "100", price: "369", popular: true, color: "green", features: ["100 Мбит/с", "Безлимит", "Антивирус", "Заморозка на зиму"] },
      { name: "Оптима", speed: "300", price: "579", color: "purple", features: ["300 Мбит/с", "Безлимит", "Антивирус", "ТВ 100 каналов"] },
    ],
  },
  {
    slug: "dachi-otrada",
    name: "Дачи Отрада и Пчелка",
    description: "Интернет для дачных посёлков Отрада и Пчелка. Один договор — две точки.",
    available: true,
    promos: [
      { title: "Два участка — одна цена", desc: "Подключите два дачных участка по цене одного тарифа.", badge: "Акция", color: "blue" },
      { title: "Установка за 1 ₽", desc: "Символическая стоимость подключения при заключении договора на год.", badge: "Выгода", color: "green" },
    ],
    tariffs: [
      { name: "Дачный", speed: "30", price: "199", color: "blue", features: ["30 Мбит/с", "Безлимит", "Заморозка на зиму"] },
      { name: "Стандарт", speed: "100", price: "359", popular: true, color: "green", features: ["100 Мбит/с", "Безлимит", "Антивирус"] },
      { name: "Комфорт", speed: "200", price: "499", color: "purple", features: ["200 Мбит/с", "Безлимит", "Антивирус", "ТВ 50 каналов"] },
    ],
  },
  {
    slug: "noviy-sad",
    name: "Новый Сад",
    description: "Оптоволокно в каждый дом посёлка Новый Сад.",
    available: true,
    promos: [
      { title: "Первый месяц — 1 ₽", desc: "Специальное предложение для новых абонентов Нового Сада.", badge: "Акция", color: "green" },
    ],
    tariffs: [
      { name: "Старт", speed: "100", price: "389", color: "blue", features: ["100 Мбит/с", "Безлимит", "Поддержка 24/7"] },
      { name: "Оптима", speed: "300", price: "599", popular: true, color: "green", features: ["300 Мбит/с", "Безлимит", "Антивирус", "ТВ 100 каналов"] },
      { name: "Максимум", speed: "1000", price: "939", color: "purple", features: ["1 Гбит/с", "Безлимит", "Антивирус+", "ТВ 450+", "Роутер Wi-Fi 6"] },
    ],
  },
  {
    slug: "supovskiy",
    name: "Суповский",
    description: "Надёжный интернет для посёлка Суповский. Поддержка 24/7.",
    available: true,
    promos: [
      { title: "Скидка 10% на годовую оплату", desc: "Оплатите сразу за год и сэкономьте 10%.", badge: "Выгода", color: "blue" },
    ],
    tariffs: [
      { name: "Лайт", speed: "30", price: "219", color: "blue", features: ["30 Мбит/с", "Безлимит", "Поддержка"] },
      { name: "Старт", speed: "100", price: "369", popular: true, color: "green", features: ["100 Мбит/с", "Безлимит", "Антивирус"] },
      { name: "Оптима", speed: "300", price: "579", color: "purple", features: ["300 Мбит/с", "Безлимит", "Антивирус", "ТВ 100 каналов"] },
    ],
  },
  {
    slug: "pricepilovka",
    name: "Прицепиловка",
    description: "Стабильный интернет в Прицепиловке. Быстрое подключение.",
    available: true,
    promos: [
      { title: "Бесплатный роутер", desc: "При подключении на срок от 6 месяцев роутер в аренду бесплатно.", badge: "Подарок", color: "green" },
    ],
    tariffs: [
      { name: "Базовый", speed: "50", price: "269", color: "blue", features: ["50 Мбит/с", "Безлимит", "Поддержка"] },
      { name: "Старт", speed: "100", price: "379", popular: true, color: "green", features: ["100 Мбит/с", "Безлимит", "Антивирус", "Поддержка 24/7"] },
      { name: "Оптима", speed: "300", price: "589", color: "purple", features: ["300 Мбит/с", "Безлимит", "Антивирус", "ТВ 100 каналов"] },
    ],
  },
  {
    slug: "shuvaevskiy",
    name: "Шуваевский",
    description: "Гигабитный интернет для жителей посёлка Шуваевский.",
    available: true,
    promos: [
      { title: "Подключись вместе с соседом — скидка 200 ₽", desc: "Приведи соседа — оба получаете скидку 200 ₽ на следующий месяц.", badge: "Реферал", color: "blue" },
      { title: "Три месяца ТВ бесплатно", desc: "При подключении тарифа «Максимум» — ТВ 450+ каналов на 3 месяца.", badge: "Акция", color: "purple" },
    ],
    tariffs: [
      { name: "Старт", speed: "100", price: "399", color: "blue", features: ["100 Мбит/с", "Безлимит", "Поддержка 24/7"] },
      { name: "Оптима", speed: "300", price: "619", popular: true, color: "green", features: ["300 Мбит/с", "Безлимит", "Антивирус", "ТВ 100 каналов"] },
      { name: "Максимум", speed: "1000", price: "959", color: "purple", features: ["1 Гбит/с", "Безлимит", "Антивирус+", "ТВ 450+", "Роутер Wi-Fi 6"] },
    ],
  },

  // ─── Добавить населённый пункт — скопируй блок выше ───
];

export default locations;
