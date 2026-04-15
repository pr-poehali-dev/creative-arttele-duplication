import Icon from "@/components/ui/icon";

const services = [
  {
    icon: "Camera",
    title: "Установка камер",
    desc: "Монтируем камеры видеонаблюдения любой сложности: квартиры, офисы, склады, стройплощадки. Аналоговые, IP, 4K.",
    color: "var(--neon-blue)",
  },
  {
    icon: "Settings",
    title: "Настройка системы",
    desc: "Конфигурируем видеорегистраторы, настраиваем удалённый доступ, оповещения и запись по расписанию.",
    color: "var(--neon-green)",
  },
  {
    icon: "ShoppingCart",
    title: "Продажа оборудования",
    desc: "Поставляем сертифицированные камеры и регистраторы ведущих брендов. Гарантия от производителя.",
    color: "var(--neon-purple)",
  },
  {
    icon: "Wifi",
    title: "Беспроводные системы",
    desc: "Wi-Fi и 4G камеры там, где нет кабеля. Идеально для дач, парковок и временных объектов.",
    color: "var(--neon-blue)",
  },
  {
    icon: "Cloud",
    title: "Облачное хранение",
    desc: "Запись видео в облако — доступ с телефона 24/7. Никакого локального оборудования для хранения.",
    color: "var(--neon-green)",
  },
  {
    icon: "Shield",
    title: "Техническое обслуживание",
    desc: "Регулярное ТО, диагностика, замена оборудования. Договор на обслуживание с приоритетным выездом.",
    color: "var(--neon-purple)",
  },
];

export default function VideoServicesSection() {
  return (
    <section className="py-20 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-14">
          <p className="text-xs font-bold tracking-widest uppercase mb-3" style={{ color: "var(--neon-blue)" }}>
            Что мы делаем
          </p>
          <h2 className="text-3xl lg:text-5xl font-black text-white">
            Полный цикл услуг
          </h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((s) => (
            <div
              key={s.title}
              className="group p-7 rounded-2xl transition-all duration-300 hover:-translate-y-1"
              style={{
                background: "var(--glass-bg)",
                border: "1px solid var(--glass-border)",
              }}
            >
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5 transition-all duration-300 group-hover:scale-110"
                style={{ background: `${s.color}18`, border: `1px solid ${s.color}33` }}
              >
                <Icon name={s.icon} size={26} style={{ color: s.color }} />
              </div>
              <h3 className="text-white font-bold text-lg mb-3">{s.title}</h3>
              <p className="text-white/50 text-sm leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}