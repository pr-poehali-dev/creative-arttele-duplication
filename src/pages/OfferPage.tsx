import Navbar from "@/components/Navbar";
import PageHero from "@/components/ui/PageHero";
import Icon from "@/components/ui/icon";

const companyName = "ИП Тлехурай Разиет Нуховна";
const inn = "230906368302";
const ogrnip = "322010000029881";
const email = "art888018@mail.ru";
const phone = "+7 902 404-88-50";
const address = "Республика Адыгея, Тахтамукайский район, п. Отрадный";
const siteUrl = "arttele.ru";
const lastUpdate = "01.01.2026";

const sections = [
  {
    icon: "FileText",
    title: "1. Общие положения",
    items: [
      "Настоящий документ является публичной офертой (далее — «Оферта») ИП Тлехурай Разиет Нуховна (далее — «Оператор»).",
      "Оферта адресована любому дееспособному физическому или юридическому лицу (далее — «Абонент»).",
      "Акцептом Оферты признаётся оплата услуг или совершение Абонентом иных действий, свидетельствующих о намерении пользоваться услугами.",
      "Настоящая Оферта регулируется законодательством Российской Федерации, включая ФЗ «О связи» № 126-ФЗ и Правила оказания услуг связи.",
    ],
  },
  {
    icon: "Wifi",
    title: "2. Предмет договора",
    items: [
      "Оператор обязуется оказывать Абоненту услуги доступа к сети Интернет на условиях выбранного тарифного плана.",
      "Оператор оказывает телематические услуги связи и услуги связи по передаче данных на основании лицензий Роскомнадзора № Л030-00114-77/00632132 и № Л030-00114-77/00632149.",
      "Перечень и стоимость услуг указаны на сайте " + siteUrl + " в разделе «Тарифы».",
      "Технические параметры и характеристики услуг определяются выбранным тарифным планом.",
    ],
  },
  {
    icon: "Wallet",
    title: "3. Стоимость услуг и порядок оплаты",
    items: [
      "Абонент самостоятельно выбирает тарифный план и производит оплату услуг в соответствии с действующими тарифами.",
      "Оплата услуг производится по предоплатной системе путём пополнения лицевого счёта Абонента.",
      "Способы оплаты: банковской картой через платёжный сервис ЮKassa, а также иными способами, указанными на сайте.",
      "Услуги считаются оплаченными с момента поступления денежных средств на расчётный счёт Оператора.",
      "Оператор вправе изменять тарифы в одностороннем порядке с предварительным уведомлением Абонента не менее чем за 10 дней.",
    ],
  },
  {
    icon: "UserCheck",
    title: "4. Права и обязанности сторон",
    items: [
      "Оператор обязуется обеспечивать Абоненту доступ к услугам 24 часа в сутки, за исключением времени проведения плановых профилактических работ.",
      "Оператор обязуется информировать Абонента о плановых работах не менее чем за 24 часа.",
      "Абонент обязуется своевременно оплачивать услуги и использовать их в соответствии с законодательством РФ.",
      "Абонент несёт ответственность за сохранность своих аутентификационных данных (логин, пароль).",
      "Абонент обязуется не использовать услуги для рассылки спама, распространения вредоносного ПО и совершения противоправных действий.",
    ],
  },
  {
    icon: "RefreshCcw",
    title: "5. Возврат денежных средств",
    items: [
      "Абонент вправе в любое время отказаться от услуг и потребовать возврата неиспользованной суммы с лицевого счёта.",
      "Для возврата средств необходимо направить заявление на email " + email + " с указанием реквизитов для перевода.",
      "Возврат производится в течение 10 рабочих дней с момента получения заявления.",
      "Возврат осуществляется тем же способом, которым была произведена оплата (при оплате картой — на ту же карту).",
      "Комиссии платёжных систем при возврате не возвращаются.",
    ],
  },
  {
    icon: "ShieldAlert",
    title: "6. Ответственность сторон",
    items: [
      "Стороны несут ответственность за неисполнение или ненадлежащее исполнение своих обязательств в соответствии с законодательством РФ.",
      "Оператор не несёт ответственности за содержание информации, передаваемой Абонентом через сеть Оператора.",
      "Оператор не несёт ответственности за перебои в работе услуг, вызванные обстоятельствами непреодолимой силы, действиями третьих лиц или техническими причинами, находящимися вне зоны ответственности Оператора.",
      "Ответственность Оператора ограничивается стоимостью услуг за период, в течение которого услуги не оказывались.",
    ],
  },
  {
    icon: "Lock",
    title: "7. Персональные данные",
    items: [
      "Акцептуя настоящую Оферту, Абонент даёт согласие на обработку своих персональных данных в соответствии с ФЗ № 152-ФЗ «О персональных данных».",
      "Оператор обрабатывает следующие персональные данные: ФИО, адрес, контактный телефон, email, паспортные данные (при необходимости).",
      "Цели обработки: заключение и исполнение договора, биллинг, техническая поддержка, информирование об услугах.",
      "Персональные данные хранятся в течение срока действия договора и 5 лет после его расторжения.",
      "Абонент имеет право на доступ, изменение и удаление своих персональных данных по запросу на email " + email + ".",
    ],
  },
  {
    icon: "Scale",
    title: "8. Разрешение споров",
    items: [
      "Все споры, возникающие из настоящей Оферты, решаются путём переговоров.",
      "При невозможности урегулирования спора в досудебном порядке, он передаётся на рассмотрение в суд по месту нахождения Оператора.",
      "Срок ответа на претензию Абонента — 30 календарных дней с момента её получения.",
    ],
  },
  {
    icon: "FileCheck2",
    title: "9. Срок действия и изменения",
    items: [
      "Оферта вступает в силу с момента её акцепта Абонентом и действует до момента расторжения договора.",
      "Оператор вправе в одностороннем порядке вносить изменения в Оферту с публикацией новой редакции на сайте " + siteUrl + ".",
      "Продолжение использования услуг после публикации изменений означает согласие Абонента с новой редакцией Оферты.",
    ],
  },
];

export default function OfferPage() {
  return (
    <div className="min-h-screen mesh-bg noise font-sans text-white">
      <Navbar />
      <div className="pt-28 pb-20">
        <div className="max-w-4xl mx-auto px-6">
          <PageHero
            badge="Правовая информация"
            badgeIcon="FileText"
            title="Публичная"
            highlight="оферта"
            subtitle="Договор на оказание услуг связи — условия использования и предоставления услуг"
            accent="blue"
          />

          <div className="glass-card rounded-3xl p-6 md:p-8 border border-white/5 mb-8">
            <div className="flex items-start gap-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                style={{ background: "rgba(59, 130, 246, 0.15)" }}
              >
                <Icon name="Info" size={20} style={{ color: "var(--neon-blue)" }} />
              </div>
              <div className="flex-1">
                <div className="text-white/40 text-xs uppercase tracking-wider mb-1">Редакция от</div>
                <div className="text-white font-semibold mb-3">{lastUpdate}</div>
                <p className="text-white/60 text-sm leading-relaxed">
                  Настоящий документ является официальным предложением {companyName} заключить
                  договор об оказании услуг связи на изложенных ниже условиях.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {sections.map((section, i) => (
              <div
                key={i}
                className="glass-card rounded-3xl p-6 md:p-8 border border-white/5"
              >
                <div className="flex items-center gap-3 mb-5">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                    style={{ background: "rgba(59, 130, 246, 0.15)" }}
                  >
                    <Icon name={section.icon} size={20} style={{ color: "var(--neon-blue)" }} />
                  </div>
                  <h2 className="font-montserrat font-bold text-lg md:text-xl text-white">
                    {section.title}
                  </h2>
                </div>

                <ul className="space-y-3">
                  {section.items.map((item, j) => (
                    <li key={j} className="flex items-start gap-3">
                      <div
                        className="w-1.5 h-1.5 rounded-full mt-2 shrink-0"
                        style={{ background: "var(--neon-blue)" }}
                      />
                      <p className="text-white/70 text-sm md:text-base leading-relaxed flex-1">
                        {item}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="glass-card rounded-3xl p-6 md:p-8 border border-white/5 mt-8">
            <div className="flex items-center gap-3 mb-5">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                style={{ background: "rgba(59, 130, 246, 0.15)" }}
              >
                <Icon name="Building2" size={20} style={{ color: "var(--neon-blue)" }} />
              </div>
              <h2 className="font-montserrat font-bold text-lg md:text-xl text-white">
                10. Реквизиты Оператора
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="rounded-2xl border border-white/5 p-4" style={{ background: "rgba(255,255,255,0.03)" }}>
                <div className="text-white/40 text-xs uppercase tracking-wider mb-1">Наименование</div>
                <div className="text-white font-semibold text-sm">{companyName}</div>
              </div>
              <div className="rounded-2xl border border-white/5 p-4" style={{ background: "rgba(255,255,255,0.03)" }}>
                <div className="text-white/40 text-xs uppercase tracking-wider mb-1">ИНН</div>
                <div className="text-white font-semibold font-mono">{inn}</div>
              </div>
              <div className="rounded-2xl border border-white/5 p-4" style={{ background: "rgba(255,255,255,0.03)" }}>
                <div className="text-white/40 text-xs uppercase tracking-wider mb-1">ОГРНИП</div>
                <div className="text-white font-semibold font-mono">{ogrnip}</div>
              </div>
              <div className="rounded-2xl border border-white/5 p-4" style={{ background: "rgba(255,255,255,0.03)" }}>
                <div className="text-white/40 text-xs uppercase tracking-wider mb-1">Адрес</div>
                <div className="text-white font-semibold text-sm">{address}</div>
              </div>
              <a
                href={`tel:${phone.replace(/[^+\d]/g, "")}`}
                className="rounded-2xl border border-white/5 p-4 hover:border-white/20 transition-colors block"
                style={{ background: "rgba(255,255,255,0.03)" }}
              >
                <div className="text-white/40 text-xs uppercase tracking-wider mb-1">Телефон</div>
                <div className="text-white font-semibold">{phone}</div>
              </a>
              <a
                href={`mailto:${email}`}
                className="rounded-2xl border border-white/5 p-4 hover:border-white/20 transition-colors block"
                style={{ background: "rgba(255,255,255,0.03)" }}
              >
                <div className="text-white/40 text-xs uppercase tracking-wider mb-1">Email</div>
                <div className="text-white font-semibold">{email}</div>
              </a>
            </div>
          </div>

          <div className="text-center text-white/30 text-xs mt-8">
            Последнее обновление: {lastUpdate}
          </div>
        </div>
      </div>
    </div>
  );
}
