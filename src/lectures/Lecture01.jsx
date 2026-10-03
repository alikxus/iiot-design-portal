// Згенеровано scripts/gen.py з content/*.md - редагуйте markdown, потім `npm run gen`
import Quiz from '../components/Quiz.jsx'
import { QUIZ } from '../quizzes.js'
import LayersExplorer from '../widgets/LayersExplorer.jsx'

export default function Lecture01() {
  return (
    <article>
      <div className="kicker">Лекція 1</div>
      <h1>Архітектура IIoT-систем та вимоги до них</h1>
      <div className="lab-meta"><div><b>Лабораторна</b><span dangerouslySetInnerHTML={{__html: "ТЗ та симулятор насосного агрегату"}} /></div></div>
      <div className="goals"><b>Цілі заняття</b><p dangerouslySetInnerHTML={{__html: "Навчитися описувати індустріальну систему інтернету речей (IIoT) на рівні архітектури: рівні, потоки даних, вимоги; перетворювати вимоги на технічне завдання (ТЗ)."}} /></div>
      <h2 dangerouslySetInnerHTML={{__html: "1. Що таке IIoT і чим він відрізняється від «побутового» IoT"}} />
      <div className="resp"><table className="data"><thead><tr><th dangerouslySetInnerHTML={{__html: "Критерій"}} /><th dangerouslySetInnerHTML={{__html: "Споживчий IoT"}} /><th dangerouslySetInnerHTML={{__html: "Індустріальний IoT"}} /></tr></thead><tbody><tr><td dangerouslySetInnerHTML={{__html: "Ціна відмови"}} /><td dangerouslySetInnerHTML={{__html: "незручність"}} /><td dangerouslySetInnerHTML={{__html: "простій лінії, аварія, ризик для людей"}} /></tr><tr><td dangerouslySetInnerHTML={{__html: "Строк життя пристроїв"}} /><td dangerouslySetInnerHTML={{__html: "2–5 років"}} /><td dangerouslySetInnerHTML={{__html: "10–25 років"}} /></tr><tr><td dangerouslySetInnerHTML={{__html: "Мережа"}} /><td dangerouslySetInnerHTML={{__html: "Wi-Fi, BLE"}} /><td dangerouslySetInnerHTML={{__html: "Ethernet, RS-485, 4G/5G, LoRaWAN, OPC UA"}} /></tr><tr><td dangerouslySetInnerHTML={{__html: "Доступність"}} /><td dangerouslySetInnerHTML={{__html: "«кращі зусилля»"}} /><td dangerouslySetInnerHTML={{__html: "99,9–99,999 %"}} /></tr><tr><td dangerouslySetInnerHTML={{__html: "Безпека"}} /><td dangerouslySetInnerHTML={{__html: "пароль у застосунку"}} /><td dangerouslySetInnerHTML={{__html: "сегментація, IEC 62443, аудит"}} /></tr><tr><td dangerouslySetInnerHTML={{__html: "Протоколи"}} /><td dangerouslySetInnerHTML={{__html: "довільні"}} /><td dangerouslySetInnerHTML={{__html: "стандартні: Modbus, OPC UA, MQTT"}} /></tr><tr><td dangerouslySetInnerHTML={{__html: "Детермінізм"}} /><td dangerouslySetInnerHTML={{__html: "не потрібен"}} /><td dangerouslySetInnerHTML={{__html: "часто потрібен (контур керування)"}} /></tr></tbody></table></div>
      <p dangerouslySetInnerHTML={{__html: "Ключова ідея курсу: IIoT не замінює АСУ ТП, а <b>надбудовується</b> над нею — збирає дані, аналізує, дає сервіси (моніторинг, прогноз, оптимізація). Контур регулювання лишається на ПЛК."}} />
      <h2 dangerouslySetInnerHTML={{__html: "2. Піраміда автоматизації (ISA-95) та її «розплющення»"}} />
      <ul><li dangerouslySetInnerHTML={{__html: "Рівень 0 — датчики й виконавчі механізми (процес)."}} /><li dangerouslySetInnerHTML={{__html: "Рівень 1 — ПЛК, контролери."}} /><li dangerouslySetInnerHTML={{__html: "Рівень 2 — SCADA/HMI."}} /><li dangerouslySetInnerHTML={{__html: "Рівень 3 — MES (виробничі операції)."}} /><li dangerouslySetInnerHTML={{__html: "Рівень 4 — ERP (бізнес)."}} /></ul>
      <p dangerouslySetInnerHTML={{__html: "IIoT додає <b>горизонтальний шлях даних</b> «рівень 0/1 → edge → хмара/дата-центр», який обходить жорстку ієрархію: дані з датчиків вібрації можуть йти напряму в аналітику, не зачіпаючи SCADA."}} />
      <h2 dangerouslySetInnerHTML={{__html: "3. Еталонні архітектури"}} />
      <p dangerouslySetInnerHTML={{__html: "<b>RAMI 4.0</b> (Industrie 4.0): тривимірна модель."}} />
      <ul><li dangerouslySetInnerHTML={{__html: "Вісь <i>Layers</i>: Asset → Integration → Communication → Information → Functional → Business."}} /><li dangerouslySetInnerHTML={{__html: "Вісь <i>Life Cycle &amp; Value Stream</i>: тип/екземпляр, розробка/виробництво/експлуатація."}} /><li dangerouslySetInnerHTML={{__html: "Вісь <i>Hierarchy Levels</i>: Product, Field Device, Control Device, Station, Work Centers, Enterprise, Connected World."}} /></ul>
      <p dangerouslySetInnerHTML={{__html: "<b>IIRA</b> (Industrial Internet Consortium): чотири точки зору — <i>business, usage, functional, implementation</i>; п'ять функціональних доменів — <i>control, operation, information, application, business</i>."}} />
      <p dangerouslySetInnerHTML={{__html: "Практичний висновок: перед вибором технологій відповісти на чотири питання — <b>що</b> є активом, <b>які</b> дані потрібні, <b>де</b> вони обробляються, <b>хто</b> їх споживає."}} />
      <h2 dangerouslySetInnerHTML={{__html: "4. Edge / Fog / Cloud"}} />
      <div className="resp"><table className="data"><thead><tr><th dangerouslySetInnerHTML={{__html: "Шар"}} /><th dangerouslySetInnerHTML={{__html: "Де"}} /><th dangerouslySetInnerHTML={{__html: "Затримка"}} /><th dangerouslySetInnerHTML={{__html: "Типові задачі"}} /></tr></thead><tbody><tr><td dangerouslySetInnerHTML={{__html: "Device"}} /><td dangerouslySetInnerHTML={{__html: "на машині"}} /><td dangerouslySetInnerHTML={{__html: "мс"}} /><td dangerouslySetInnerHTML={{__html: "вимірювання, первинна фільтрація"}} /></tr><tr><td dangerouslySetInnerHTML={{__html: "Edge"}} /><td dangerouslySetInnerHTML={{__html: "шафа/цех"}} /><td dangerouslySetInnerHTML={{__html: "10–100 мс"}} /><td dangerouslySetInnerHTML={{__html: "протокольна трансляція, буферизація, правила, локальний ML"}} /></tr><tr><td dangerouslySetInnerHTML={{__html: "Fog/On-prem"}} /><td dangerouslySetInnerHTML={{__html: "серверна підприємства"}} /><td dangerouslySetInnerHTML={{__html: "0,1–1 с"}} /><td dangerouslySetInnerHTML={{__html: "збереження, дашборди, інтеграція з MES"}} /></tr><tr><td dangerouslySetInnerHTML={{__html: "Cloud"}} /><td dangerouslySetInnerHTML={{__html: "дата-центр"}} /><td dangerouslySetInnerHTML={{__html: "0,1–кілька с"}} /><td dangerouslySetInnerHTML={{__html: "довгострокова аналітика, навчання моделей, флот-рівень"}} /></tr></tbody></table></div>
      <p dangerouslySetInnerHTML={{__html: "<b>Правило вибору місця обробки</b>: чим жорсткіша вимога до затримки/автономності й чим більший обсяг сирих даних — тим ближче до джерела. Агреговані дані й складні моделі — вгору."}} />
      <h2 dangerouslySetInnerHTML={{__html: "5. Наскрізний сценарій курсу: насосна станція"}} />
      <p dangerouslySetInnerHTML={{__html: "Станція має кілька насосних агрегатів. Кожен агрегат: датчик вібрації (мм/с RMS), температури підшипника (°C), тиску на виході (бар), струм двигуна (А)."}} />
      <p dangerouslySetInnerHTML={{__html: "Бізнес-цілі: (1) бачити стан у реальному часі, (2) отримувати сповіщення про відхилення, (3) прогнозувати знос підшипника та планувати ремонт, (4) мати журнал для аудиту."}} />
      <p dangerouslySetInnerHTML={{__html: "<b>Архітектура, яку ми будуватимемо за 7 тижнів:</b>"}} />
      <pre className="code"><code>{"[Pump simulator] -> [Edge gateway] --MQTT--> [Broker] --> [Ingest -> TSDB]\n                                                  |-----> [Alert engine -> alerts topic]\n                                                  '-----> [Analytics: anomalies, RUL]"}</code></pre>
      <h2 dangerouslySetInnerHTML={{__html: "6. Вимоги"}} />
      <p dangerouslySetInnerHTML={{__html: "<b>Функціональні (FR)</b> — що система робить. Приклад: FR-1 «Шлюз публікує телеметрію кожного агрегату з періодом ≤ 1 с». <b>Нефункціональні (NFR)</b> — як добре: продуктивність, доступність, безпека, супровідність. Приклад: NFR-1 «Втрата даних при розриві зв'язку до 10 хв — 0 %»."}} />
      <p dangerouslySetInnerHTML={{__html: "Хороша вимога <b>вимірювана</b> та <b>перевірювана</b>:"}} />
      <ul><li dangerouslySetInnerHTML={{__html: "✗ «Система має бути швидкою»."}} /><li dangerouslySetInnerHTML={{__html: "✓ «Від вимірювання до сповіщення — не більше 3 с (p95)»."}} /></ul>
      <p dangerouslySetInnerHTML={{__html: "Шаблон розділів ТЗ: мета; межі системи; стейкголдери; FR; NFR; інтерфейси; обмеження; критерії приймання; ризики."}} />
      <h2 dangerouslySetInnerHTML={{__html: "7. Моделювання пристроїв"}} />
      <p dangerouslySetInnerHTML={{__html: "Коли фізичного стенда немає (наш випадок), пишемо <b>симулятор</b> — він також корисний у реальних проєктах для тестів і демо."}} />
      <p dangerouslySetInnerHTML={{__html: "Хороший симулятор: детермінований (seed), параметризований (знос, несправності), видає той самий формат, що й реальний пристрій."}} />
      <p dangerouslySetInnerHTML={{__html: "Мінімальна модель з шумом і дрейфом:"}} />
      <pre className="code"><code>{"import random\nrng = random.Random(42)\nwear = 0.0\nfor step in range(5):\n    wear += 0.01\n    vibration = 1.8 + 6.0 * wear + rng.gauss(0, 0.15)   # мм/с\n    print(round(vibration, 3))"}</code></pre>
      <p dangerouslySetInnerHTML={{__html: "Формат повідомлення (контракт даних):"}} />
      <pre className="code"><code>{"{\"device_id\": \"pump-01\", \"ts\": 1760000000.0, \"running\": true,\n \"metrics\": {\"vibration_mm_s\": 1.84, \"temperature_c\": 55.2, \"pressure_bar\": 4.19, \"current_a\": 12.1}}"}</code></pre>
      <p dangerouslySetInnerHTML={{__html: "Правила контракту: UTC-час у вигляді epoch; одиниці — у назві поля; усі значення — числа; поля не перейменовуємо без версії схеми."}} />
      <h2 dangerouslySetInnerHTML={{__html: "Джерела"}} />
      <p dangerouslySetInnerHTML={{__html: "IIC, <i>Industrial Internet Reference Architecture</i>; DIN SPEC 91345 (RAMI 4.0); ISA-95 / IEC 62264."}} />
      <h2 dangerouslySetInnerHTML={{__html: "Інтерактив"}} />
      <LayersExplorer />
      <Quiz questions={QUIZ.l1} />
      <p className="footer-note">Лабораторна цього тижня — ЛР1. Наступна лекція — №2.</p>
    </article>
  )
}
