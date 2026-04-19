import Navbar from "@/components/Navbar";
import Icon from "@/components/ui/icon";
import PageHero from "@/components/ui/PageHero";

const info = {
  fullName: "Тлехурай Разиет Нуховна",
  inn: "230906368302",
  ogrnip: "322010000029881",
  status: "Действующий ИП",
  registrationDate: "06.12.2022",
  activity: "Деятельность в области связи на базе проводных технологий",
  okved: "61.10",
  region: "Республика Адыгея, Тахтамукайский район, п. Отрадный",
  okpo: "2019765926",
  pfrNumber: "001006069284",
  email: "art888018@mail.ru",
  phone: "+7 902 404-88-50",
};

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

const fields = [
  { label: "ФИО", value: info.fullName, icon: "User" },
  { label: "ИНН", value: info.inn, icon: "Hash" },
  { label: "ОГРНИП", value: info.ogrnip, icon: "Hash" },
  { label: "Статус", value: info.status, icon: "CheckCircle2" },
  { label: "Дата регистрации", value: info.registrationDate, icon: "Calendar" },
  { label: "ОКВЭД", value: `${info.okved} — ${info.activity}`, icon: "Briefcase" },
  { label: "Регион", value: info.region, icon: "MapPin" },
  { label: "ОКПО", value: info.okpo, icon: "Hash" },
  { label: "Рег. номер в ПФР", value: info.pfrNumber, icon: "Hash" },
  { label: "Телефон", value: info.phone, icon: "Phone" },
  { label: "Email", value: info.email, icon: "Mail" },
];

export default function RequisitesPage() {
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
            subtitle={`ИП ${info.fullName} — данные из ЕГРИП, ФНС России и Роскомнадзора`}
            accent="blue"
          />

          <div className="grid lg:grid-cols-2 gap-10">
            <div className="space-y-4">
              {fields.map((f, i) => (
                <div key={i} className="flex items-center gap-4 glass-card rounded-2xl p-5 border border-white/5 card-hover">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{ background: "rgba(0,212,255,0.1)", color: "var(--neon-blue)" }}>
                    <Icon name={f.icon} size={20} />
                  </div>
                  <div className="flex-1">
                    <div className="text-white/40 text-xs mb-0.5">{f.label}</div>
                    <div className="text-white font-semibold break-all">{f.value}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="glass-card rounded-3xl p-8 border border-white/5">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{ background: "rgba(0,212,255,0.1)", color: "var(--neon-blue)" }}>
                  <Icon name="ShieldCheck" size={20} />
                </div>
                <div>
                  <h2 className="font-montserrat font-bold text-xl text-white">Лицензии Роскомнадзора</h2>
                  <p className="text-white/40 text-sm">Разрешение на оказание услуг связи</p>
                </div>
              </div>

              <div className="space-y-4">
                {licenses.map((lic, i) => (
                  <div key={i} className="rounded-2xl p-5 border border-white/10" style={{ background: "rgba(255,255,255,0.03)" }}>
                    <div className="flex items-center gap-2 mb-3">
                      <div className="px-3 py-1 rounded-full text-xs font-bold" style={{ background: "rgba(0,212,255,0.15)", color: "var(--neon-blue)" }}>
                        Лицензия
                      </div>
                    </div>
                    <div className="font-mono text-white font-semibold text-base mb-2 break-all">
                      № {lic.number}
                    </div>
                    <div className="text-white/70 text-sm mb-3">{lic.type}</div>
                    <div className="flex items-center gap-4 text-xs text-white/50 flex-wrap">
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
          </div>

        </div>
      </div>
    </div>
  );
}
