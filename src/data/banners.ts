// ─────────────────────────────────────────────
//  ПЛАВАЮЩИЕ БАННЕРЫ — редактируй здесь
// ─────────────────────────────────────────────
//
//  Чтобы добавить баннер — скопируй блок и вставь в массив.
//  Чтобы убрать — удали блок или поставь enabled: false.
//  Картинку замени на любую ссылку (или загрузи через S3).

export interface Banner {
  id: string;
  img: string;         // Ссылка на картинку
  alt: string;         // Описание (для доступности)
  link: string;        // Куда ведёт клик (путь на сайте)
  enabled: boolean;    // false = баннер скрыт
}

const banners: Banner[] = [
  {
    id: "gigabit",
    img: "https://cdn.poehali.dev/projects/5573dd0c-764b-4bc3-951f-74ecfdbb396f/files/b48e7dd8-0872-4306-92fd-0125203a3ef8.jpg",
    alt: "1 Гбит/с от 999₽",
    link: "/tariffs",
    enabled: true,
  },
  {
    id: "wifi6",
    img: "https://cdn.poehali.dev/projects/5573dd0c-764b-4bc3-951f-74ecfdbb396f/files/f4fbcfcb-5b10-4ff8-b69d-9ad9361e5263.jpg",
    alt: "Wi-Fi 6 роутер в подарок",
    link: "/tariffs",
    enabled: true,
  },
  {
    id: "business",
    img: "https://cdn.poehali.dev/projects/5573dd0c-764b-4bc3-951f-74ecfdbb396f/files/bd736924-5d18-469e-ae77-792da134c696.jpg",
    alt: "Бизнес-интернет SLA 99.9%",
    link: "/business",
    enabled: true,
  },

  // ─── Добавить баннер — скопируй блок выше ───
];

export default banners;
