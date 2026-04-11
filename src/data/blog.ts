// ─────────────────────────────────────────────
//  БЛОГ — редактируй здесь
// ─────────────────────────────────────────────

const HERO_IMG = "https://cdn.poehali.dev/projects/5573dd0c-764b-4bc3-951f-74ecfdbb396f/files/9344e7ca-fcbc-4475-8001-83fa179e1412.jpg";
const CITY_IMG = "https://cdn.poehali.dev/projects/5573dd0c-764b-4bc3-951f-74ecfdbb396f/files/8c65a182-986a-4921-8613-7a88e4c04b6f.jpg";
const WORK_IMG = "https://cdn.poehali.dev/projects/5573dd0c-764b-4bc3-951f-74ecfdbb396f/files/16177b32-dfe0-4dd3-bfd5-a6620431a2a3.jpg";

export interface BlogPost {
  title: string;
  date: string;
  tag: string;
  img: string;
  desc: string;
  // Добавь поле content: string если нужна полная статья
}

const blog: BlogPost[] = [
  {
    title: "Wi-Fi 6E vs Wi-Fi 7: что выбрать в 2026 году",
    date: "5 апреля 2026",
    tag: "Технологии",
    img: HERO_IMG,
    desc: "Сравниваем новые стандарты беспроводной связи и объясняем, кому действительно нужен Wi-Fi 7.",
  },
  {
    title: "Как повысить скорость Wi-Fi дома: 10 советов",
    date: "28 марта 2026",
    tag: "Советы",
    img: WORK_IMG,
    desc: "Расположение роутера, каналы, DNS — разбираем каждый пункт с практическими примерами.",
  },
  {
    title: "Умный дом на базе нашей сети: реальные кейсы",
    date: "15 марта 2026",
    tag: "Кейсы",
    img: CITY_IMG,
    desc: "Три истории клиентов, которые построили автоматизацию дома благодаря стабильному гигабитному интернету.",
  },

  // ─── Добавить статью — скопируй блок выше и вставь сюда ───
];

export default blog;
