// Згенеровано scripts/gen.py з content/*.md - редагуйте markdown, потім `npm run gen`
import Quiz from '../components/Quiz.jsx'
import { QUIZ } from '../quizzes.js'
import AlertSimulator from '../widgets/AlertSimulator.jsx'

export default function Lecture04() {
  return (
    <article>
      <div className="kicker">Лекція 4</div>
      <h1>Моніторинг, сповіщення та візуалізація</h1>
      <div className="lab-meta"><div><b>Тиждень</b><span dangerouslySetInnerHTML={{__html: "4"}} /></div><div><b>Обсяг</b><span dangerouslySetInnerHTML={{__html: "2 академічні години"}} /></div><div><b>Лабораторна</b><span dangerouslySetInnerHTML={{__html: "рушій сповіщень з гістерезисом і debounce"}} /></div></div>
      <div className="goals"><b>Цілі заняття</b><p dangerouslySetInnerHTML={{__html: "Навчитися проєктувати сповіщення так, щоб вони були корисними, а не шумними, та реалізувати конфігурований рушій правил."}} /></div>
      <h2 dangerouslySetInnerHTML={{__html: "1. Від даних до рішень"}} />
      <p dangerouslySetInnerHTML={{__html: "Дашборд відповідає на питання «що відбувається?», сповіщення — «що потребує дії <b>зараз</b>?». Погані сповіщення гірші за їх відсутність: оператори перестають на них реагувати (<i>alarm fatigue</i>)."}} />
      <p dangerouslySetInnerHTML={{__html: "Принципи (за ідеями ISA-18.2 / EEMUA 191):"}} />
      <ul><li dangerouslySetInnerHTML={{__html: "кожне сповіщення має <b>дію</b> — що робити оператору;"}} /><li dangerouslySetInnerHTML={{__html: "кожне має <b>пріоритет</b> (info / warning / critical);"}} /><li dangerouslySetInnerHTML={{__html: "кількість сповіщень — керована (орієнтир: хвилини між сповіщеннями, а не секунди);"}} /><li dangerouslySetInnerHTML={{__html: "правила переглядаються за статистикою спрацювань."}} /></ul>
      <h2 dangerouslySetInnerHTML={{__html: "2. Типи правил"}} />
      <div className="resp"><table className="data"><thead><tr><th dangerouslySetInnerHTML={{__html: "Тип"}} /><th dangerouslySetInnerHTML={{__html: "Приклад"}} /></tr></thead><tbody><tr><td dangerouslySetInnerHTML={{__html: "Поріг"}} /><td dangerouslySetInnerHTML={{__html: "вібрація &gt; 4,5 мм/с"}} /></tr><tr><td dangerouslySetInnerHTML={{__html: "Швидкість зміни"}} /><td dangerouslySetInnerHTML={{__html: "температура росте &gt; 5 °C/хв"}} /></tr><tr><td dangerouslySetInnerHTML={{__html: "Відсутність даних (heartbeat)"}} /><td dangerouslySetInnerHTML={{__html: "немає телеметрії &gt; 30 с"}} /></tr><tr><td dangerouslySetInnerHTML={{__html: "Складене"}} /><td dangerouslySetInnerHTML={{__html: "тиск низький <b>і</b> струм високий (ознака засмічення)"}} /></tr><tr><td dangerouslySetInnerHTML={{__html: "Аномалія"}} /><td dangerouslySetInnerHTML={{__html: "відхилення за z-оцінкою (лекція 5)"}} /></tr></tbody></table></div>
      <h2 dangerouslySetInnerHTML={{__html: "3. Проблема «дрижання» (flapping)"}} />
      <p dangerouslySetInnerHTML={{__html: "Значення коливається біля порога → сповіщення то з'являється, то зникає. Два стандартні засоби:"}} />
      <p dangerouslySetInnerHTML={{__html: "<b>Debounce (антидребезг)</b> — підняти сповіщення лише після N поспіль вимірів вище порога (або після T секунд)."}} />
      <p dangerouslySetInnerHTML={{__html: "<b>Гістерезис</b> — знімати сповіщення, коли значення впало нижче <code>high − hysteresis</code>, а не нижче <code>high</code>."}} />
      <p dangerouslySetInnerHTML={{__html: "Поріг 4,5; значення по черзі: <code>4.4, 4.6, 4.4, 4.6, 4.8, 4.9, 4.4, 4.2, 3.9</code>."}} />
      <ul><li dangerouslySetInnerHTML={{__html: "<b>Без захисту</b>: raise на 2-му значенні, clear на 3-му, raise на 4-му, clear на 7-му — чотири переходи на дев'ять вимірів."}} /><li dangerouslySetInnerHTML={{__html: "<b>З debounce=3 та hysteresis=0.5</b>: raise лише на 6-му значенні (4.9 — третє поспіль вище порога); <code>4.4</code> і <code>4.2</code> ще не знімають сповіщення (вони не нижчі за 4.0); clear — на <code>3.9</code>. Усього два переходи."}} /></ul>
      <h2 dangerouslySetInnerHTML={{__html: "4. Конфіг-орієнтований дизайн"}} />
      <p dangerouslySetInnerHTML={{__html: "Правила — це <b>дані</b>, а не код:"}} />
      <pre className="code"><code>{"from dataclasses import dataclass\n\n@dataclass\nclass Rule:\n    name: str\n    metric: str\n    high: float\n    hysteresis: float = 0.0\n    debounce: int = 3\n    severity: str = \"warning\"\n\nRULES = [\n    Rule(\"high_vibration\", \"vibration_mm_s\", high=4.5, hysteresis=0.5, severity=\"critical\"),\n    Rule(\"high_temperature\", \"temperature_c\", high=80.0, hysteresis=3.0, debounce=5),\n]"}</code></pre>
      <p dangerouslySetInnerHTML={{__html: "Рушій зберігає <b>стан для кожної пари (пристрій, правило)</b> і генерує події лише при <b>переходах</b> стану (<code>raised</code>, <code>cleared</code>), а не на кожен вимір."}} />
      <pre className="code"><code>{"def process(msg):               # псевдокод\n    for rule in rules:\n        st = state[(msg.device_id, rule.name)]\n        if not st.active:\n            st.count = st.count + 1 if value > rule.high else 0\n            if st.count >= rule.debounce:  raise_event()\n        elif value < rule.high - rule.hysteresis:\n            clear_event()"}</code></pre>
      <h2 dangerouslySetInnerHTML={{__html: "5. Доставка сповіщень"}} />
      <ul><li dangerouslySetInnerHTML={{__html: "<b>Окремий топік</b> <code>.../alerts</code> (події, а не потік) — на нього підписуються месенджери, SCADA, журнал."}} /><li dangerouslySetInnerHTML={{__html: "Подія містить: правило, пристрій, метрику, значення, час, серйозність, стан."}} /><li dangerouslySetInnerHTML={{__html: "Канали: дашборд, e-mail, Telegram/Slack-бот, SMS; для critical — ескалація, якщо немає підтвердження (acknowledge)."}} /><li dangerouslySetInnerHTML={{__html: "Журнал подій зберігається для аудиту та аналізу спрацювань."}} /></ul>
      <p dangerouslySetInnerHTML={{__html: "Приклад події:"}} />
      <pre className="code"><code>{"{\"rule\":\"high_vibration\",\"device_id\":\"pump-01\",\"metric\":\"vibration_mm_s\",\n \"state\":\"raised\",\"value\":5.1,\"ts\":1760000123.4,\"severity\":\"critical\"}"}</code></pre>
      <h2 dangerouslySetInnerHTML={{__html: "6. Візуалізація"}} />
      <p dangerouslySetInnerHTML={{__html: "Інструмент: Grafana (дашборди над TimescaleDB/InfluxDB/Prometheus; для SQLite потрібен плагін). Що показувати:"}} />
      <ul><li dangerouslySetInnerHTML={{__html: "<b>Огляд</b>: статус кожного пристрою (online/offline з retained-топіка), число активних сповіщень."}} /><li dangerouslySetInnerHTML={{__html: "<b>Деталі</b>: тренди вібрації/температури зі смугами порогів, хвилинні min/avg/max."}} /><li dangerouslySetInnerHTML={{__html: "<b>Якість даних</b>: частота повідомлень, затримка, відсоток пропусків."}} /></ul>
      <p dangerouslySetInnerHTML={{__html: "Практичні поради: одиниці на осях; кольори порогів ті ж, що й у правилах; не більше 6–8 панелей на екран; шкала часу за замовчуванням — остання година."}} />
      <h2 dangerouslySetInnerHTML={{__html: "7. Тестування правил"}} />
      <p dangerouslySetInnerHTML={{__html: "Правило — це функція від послідовності значень. Тестуйте <b>послідовностями</b>: «5,5,1,5,5,1 → подій немає»; «5,5,5 → raised»; «5,5,5,4.2,3.9 → raised, cleared». Саме такі тести ви маєте в лабораторній."}} />
      <h2 dangerouslySetInnerHTML={{__html: "Інтерактив"}} />
      <AlertSimulator />
      <Quiz questions={QUIZ.l4} />
      <p className="footer-note">Лабораторна цього тижня — ЛР4. Наступна лекція — №5.</p>
    </article>
  )
}
