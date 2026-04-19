import Navbar from "@/components/Navbar";
import PageHero from "@/components/ui/PageHero";
import Icon from "@/components/ui/icon";

const fullName = "Тлехурай Разиет Нуховна";
const inn = "230906368302";
const ogrnip = "322010000029881";
const status = "Действующий ИП";
const registrationDate = "06.12.2022";
const activity = "Деятельность в области связи на базе проводных технологий";
const okved = "61.10";
const region = "Республика Адыгея, Тахтамукайский район, п. Отрадный";
const okpo = "2019765926";
const pfrNumber = "001006069284";
const email = "art888018@mail.ru";
const phone = "+7 902 404-88-50";

const licenses = [
  {
    number: "Л030-00114-77/00632132",
    type: "Телематические услуги связи",
    issueDate: "19.12.2022",
    expiryDate: "19.12.2027",
  },
  {
    number: "Л030-00114-77/00632149",
    type: "Услуги связи по передаче данных",
    issueDate: "19.12.2022",
    expiryDate: "19.12.2027",
  },
];

type FieldProps = {
  label: string;
  value: string;
  icon?: string;
  mono?: boolean;
  copyable?: boolean;
};

const Field = ({ label, value, icon, mono, copyable }: FieldProps) => {
  const handleCopy = () => {
    if (copyable) navigator.clipboard.writeText(value);
  };

  return (
    <div className="rounded-2xl border border-white/5 p-4" style={{ background: "rgba(255,255,255,0.03)" }}>
      <div className="flex items-center gap-2 mb-2">
        {icon && <Icon name={icon} size={14} style={{ color: "var(--neon-blue)" }} />}
        <div className="text-xs uppercase tracking-wider text-white/40">{label}</div>
      </div>
      <div className="flex items-center justify-between gap-3">
        <div
          className={`text-white font-semibold ${mono ? "font-mono text-lg tracking-wider" : "text-base"} break-all`}
        >
          {value}
        </div>
        {copyable && (
          <button
            onClick={handleCopy}
            className="shrink-0 p-2 rounded-lg hover:bg-white/10 transition-colors text-white/40 hover:text-white"
            title="Скопировать"
          >
            <Icon name="Copy" size={16} />
          </button>
        )}
      </div>
    </div>
  );
};

export default function RequisitesPage() {
  const today = new Date().toLocaleDateString("ru-RU");

  return (
    <div className="min-h-screen mesh-bg noise font-sans text-white">
      <Navbar />
      <div className="pt-28 pb-20">
        <div className="max-w-5xl mx-auto px-6">
          <PageHero
            badge="Официальные данные"
            badgeIcon="FileCheck2"
            title="Реквизиты"
            highlight="компании"
            subtitle={`ИП ${fullName} — данные из ЕГРИП, ФНС России и Роскомнадзора`}
            accent="blue"
          />

          <div className="glass-card rounded-3xl p-8 border border-white/5 mb-8">
            <div className="flex items-start justify-between flex-wrap gap-4 mb-6">
              <div>
                <div className="text-white/40 text-sm mb-1">Индивидуальный предприниматель</div>
                <h2 className="font-montserrat font-bold text-2xl md:text-3xl text-white">
                  {fullName}
                </h2>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-full border border-emerald-400/30 bg-emerald-400/10">
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-emerald-300 text-sm font-medium">{status}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field label="ИНН" value={inn} icon="Hash" mono copyable />
              <Field label="ОГРНИП" value={ogrnip} icon="Hash" mono copyable />
            </div>
          </div>

          <div className="glass-card rounded-3xl p-8 border border-white/5 mb-8">
            <div className="flex items-center gap-3 mb-6">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: "rgba(59, 130, 246, 0.15)" }}
              >
                <Icon name="Building2" size={20} style={{ color: "var(--neon-blue)" }} />
              </div>
              <h3 className="font-montserrat font-bold text-xl text-white">Регистрационные данные</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field label="Дата регистрации" value={registrationDate} icon="Calendar" />
              <Field label="Регион" value={region} icon="MapPin" />
              <Field label={`ОКВЭД ${okved}`} value={activity} icon="Briefcase" />
              <Field label="ОКПО" value={okpo} icon="Hash" mono />
              <Field label="Рег. номер в ПФР" value={pfrNumber} icon="Hash" mono />
            </div>
          </div>

          <div className="glass-card rounded-3xl p-8 border border-white/5 mb-8">
            <div className="flex items-center gap-3 mb-6">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: "rgba(59, 130, 246, 0.15)" }}
              >
                <Icon name="Phone" size={20} style={{ color: "var(--neon-blue)" }} />
              </div>
              <h3 className="font-montserrat font-bold text-xl text-white">Контакты</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <a
                href={`tel:${phone.replace(/[^+\d]/g, "")}`}
                className="rounded-2xl border border-white/5 p-4 hover:border-white/20 transition-colors block"
                style={{ background: "rgba(255,255,255,0.03)" }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Icon name="Phone" size={14} style={{ color: "var(--neon-blue)" }} />
                  <div className="text-xs uppercase tracking-wider text-white/40">Телефон</div>
                </div>
                <div className="text-white font-semibold text-lg">{phone}</div>
              </a>
              <a
                href={`mailto:${email}`}
                className="rounded-2xl border border-white/5 p-4 hover:border-white/20 transition-colors block"
                style={{ background: "rgba(255,255,255,0.03)" }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Icon name="Mail" size={14} style={{ color: "var(--neon-blue)" }} />
                  <div className="text-xs uppercase tracking-wider text-white/40">Email</div>
                </div>
                <div className="text-white font-semibold text-lg">{email}</div>
              </a>
            </div>
          </div>

          <div className="glass-card rounded-3xl p-8 border border-white/5 mb-8">
            <div className="flex items-center gap-3 mb-6">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: "rgba(59, 130, 246, 0.15)" }}
              >
                <Icon name="ShieldCheck" size={20} style={{ color: "var(--neon-blue)" }} />
              </div>
              <div>
                <h3 className="font-montserrat font-bold text-xl text-white">Лицензии Роскомнадзора</h3>
                <p className="text-white/40 text-sm mt-1">Разрешение на оказание услуг связи</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {licenses.map((lic, i) => (
                <div
                  key={i}
                  className="rounded-2xl p-5 border border-white/5"
                  style={{ background: "rgba(255,255,255,0.03)" }}
                >
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20">
                      <Icon name="Award" size={12} style={{ color: "var(--neon-blue)" }} />
                      <span className="text-xs text-blue-300">Лицензия</span>
                    </div>
                  </div>
                  <div className="font-mono text-white font-semibold text-base mb-3 break-all">
                    № {lic.number}
                  </div>
                  <div className="text-white/70 text-sm mb-3">{lic.type}</div>
                  <div className="flex items-center gap-4 text-xs text-white/40 flex-wrap">
                    <div className="flex items-center gap-1">
                      <Icon name="CalendarCheck" size={12} />
                      <span>Выдана: {lic.issueDate}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Icon name="CalendarClock" size={12} />
                      <span>До: {lic.expiryDate}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="text-center text-white/30 text-xs">
            Данные актуальны на {today}
          </div>
        </div>
      </div>
    </div>
  );
}
