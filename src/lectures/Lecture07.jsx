// Згенеровано scripts/gen.py з content/*.md - редагуйте markdown, потім `npm run gen`
import Quiz from '../components/Quiz.jsx'
import { QUIZ } from '../quizzes.js'
import TcoCalculator from '../widgets/TcoCalculator.jsx'

export default function Lecture07() {
  return (
    <article>
      <div className="kicker">Лекція 7</div>
      <h1>Розгортання, документація та економіка IIoT-проєкту</h1>
      <div className="lab-meta"><div><b>Тиждень</b><span dangerouslySetInnerHTML={{__html: "7"}} /></div><div><b>Обсяг</b><span dangerouslySetInnerHTML={{__html: "2 академічні години"}} /></div><div><b>Лабораторна</b><span dangerouslySetInnerHTML={{__html: "інтеграція, Docker Compose, захист проєкту"}} /></div></div>
      <div className="goals"><b>Цілі заняття</b><p dangerouslySetInnerHTML={{__html: "Навчитися пакувати IIoT-рішення в контейнери, конфігурувати його через середовище, документувати та оцінювати вартість володіння."}} /></div>
      <h2 dangerouslySetInnerHTML={{__html: "1. Життєвий цикл IIoT-проєкту"}} />
      <ol><li dangerouslySetInnerHTML={{__html: "Обстеження й вимоги → 2. Архітектура → 3. Прототип на симуляторі → 4. Пілот на одному агрегаті → 5. Масштабування → 6. Експлуатація та супровід."}} /></ol>
      <p dangerouslySetInnerHTML={{__html: "Принцип: <b>маленький наскрізний зріз працює раніше, ніж «ідеальна» архітектура</b>. У курсі кожна лабораторна додає ланку до єдиного конвеєра."}} />
      <h2 dangerouslySetInnerHTML={{__html: "2. Конфігурація (12-factor)"}} />
      <ul><li dangerouslySetInnerHTML={{__html: "Конфіг — у <b>змінних середовища</b>, не в коді."}} /><li dangerouslySetInnerHTML={{__html: "Один і той самий образ — для всіх середовищ."}} /><li dangerouslySetInnerHTML={{__html: "Секрети — окремо від конфігів; обов'язкові змінні перевіряються при старті."}} /></ul>
      <pre className="code"><code>{"import os\n\nclass Config:\n    def __init__(self, env=None):\n        e = os.environ if env is None else env\n        self.mqtt_host = e.get(\"MQTT_HOST\", \"localhost\")\n        self.mqtt_port = int(e.get(\"MQTT_PORT\", \"1883\"))\n        self.device_id = e.get(\"DEVICE_ID\", \"pump-01\")\n        self.signing_key = e[\"SIGNING_KEY\"].encode() if e.get(\"SIGNING_KEY\") else None"}</code></pre>
      <h2 dangerouslySetInnerHTML={{__html: "3. Контейнеризація"}} />
      <p dangerouslySetInnerHTML={{__html: "<b>Dockerfile</b> (мінімальний):"}} />
      <pre className="code"><code>{"FROM python:3.12-slim\nWORKDIR /app\nRUN pip install --no-cache-dir \"paho-mqtt>=2.0\"\nCOPY iiot ./iiot\nENV PYTHONUNBUFFERED=1"}</code></pre>
      <p dangerouslySetInnerHTML={{__html: "<b>Docker Compose</b> описує весь стек декларативно: сервіси, мережу, томи, залежності, health-check."}} />
      <pre className="code"><code>{"services:\n  mosquitto:\n    image: eclipse-mosquitto:2\n    ports: [\"1883:1883\"]\n    volumes: [\"./mosquitto.conf:/mosquitto/config/mosquitto.conf:ro\"]\n  gateway-pump01:\n    build: {context: ., dockerfile: deploy/Dockerfile}\n    command: python -m iiot.services.gateway_service\n    environment: {MQTT_HOST: mosquitto, DEVICE_ID: pump-01}\n    depends_on: [mosquitto]\n    restart: unless-stopped"}</code></pre>
      <p dangerouslySetInnerHTML={{__html: "Корисні команди: <code>docker compose up --build -d</code>, <code>docker compose ps</code>, <code>docker compose logs -f ingest</code>, <code>docker compose down</code>."}} />
      <p dangerouslySetInnerHTML={{__html: "<b>Health-check</b>: сервіс періодично «торкається» файла; перевірка — свіжість <code>mtime</code>. Для HTTP-сервісів — окремий <code>/health</code>."}} />
      <p dangerouslySetInnerHTML={{__html: "<b>Томи</b>: стан (БД, дані брокера) — у іменованих томах; контейнер можна перестворити без втрати даних."}} />
      <h2 dangerouslySetInnerHTML={{__html: "4. Спостережуваність"}} />
      <ul><li dangerouslySetInnerHTML={{__html: "<b>Логи</b> — у stdout, структуровані, з рівнями."}} /><li dangerouslySetInnerHTML={{__html: "<b>Метрики</b> — лічильники (отримано/відкинуто/записано), довжина буфера, затримка."}} /><li dangerouslySetInnerHTML={{__html: "<b>Трейси</b> — наскрізний <code>ts</code> в повідомленні дозволяє міряти затримку «вимір → сповіщення»."}} /></ul>
      <h2 dangerouslySetInnerHTML={{__html: "5. Документація проєкту"}} />
      <p dangerouslySetInnerHTML={{__html: "Мінімальний пакет:"}} />
      <ol><li dangerouslySetInnerHTML={{__html: "<b>ТЗ</b> (лекція 1) — з критеріями приймання."}} /><li dangerouslySetInnerHTML={{__html: "<b>Архітектурний опис</b>: схема компонентів, потоки даних, простір топіків, контракт повідомлення."}} /><li dangerouslySetInnerHTML={{__html: "<b>Інструкція розгортання</b> (<code>README</code>): передумови, команди, перевірка."}} /><li dangerouslySetInnerHTML={{__html: "<b>Модель загроз і налаштування безпеки</b> (лекція 6)."}} /><li dangerouslySetInnerHTML={{__html: "<b>План тестування</b> і результати (<code>pytest</code>)."}} /><li dangerouslySetInnerHTML={{__html: "<b>Експлуатація</b>: що робити при відмові, резервне копіювання, ротація секретів."}} /></ol>
      <p dangerouslySetInnerHTML={{__html: "Критерій якості: інша людина розгортає систему за вашим README <b>без питань до вас</b>."}} />
      <h2 dangerouslySetInnerHTML={{__html: "6. Економіка: TCO"}} />
      <p dangerouslySetInnerHTML={{__html: "<b>Total Cost of Ownership</b> = CAPEX (обладнання, ліцензії, розробка) + OPEX (зв'язок, хмара/сервери, супровід, навчання) за строк життя."}} />
      <p dangerouslySetInnerHTML={{__html: "Приклад структури оцінки для пілоту на 20 агрегатів:"}} />
      <ul><li dangerouslySetInnerHTML={{__html: "Датчики та шлюзи: кількість × ціна."}} /><li dangerouslySetInnerHTML={{__html: "Монтаж і інтеграція: людино-години × ставка."}} /><li dangerouslySetInnerHTML={{__html: "Інфраструктура: сервер/хмара (обсяг даних із лекції 3 × тариф)."}} /><li dangerouslySetInnerHTML={{__html: "Супровід: частка ставки інженера на рік."}} /><li dangerouslySetInnerHTML={{__html: "Ліцензії: Grafana/Influx/Timescale — відкриті версії безкоштовні, enterprise — платні."}} /></ul>
      <p dangerouslySetInnerHTML={{__html: "<b>Ефект</b>: уникнені простої × вартість години простою; зменшення аварійних ремонтів; оптимізація запчастин. Простий показник — <b>термін окупності</b> = витрати / річний ефект."}} />
      <p dangerouslySetInnerHTML={{__html: "Приклад (умовні числа): витрати 600 тис. грн; уникнений простій 3 год/рік × 150 тис. грн/год = 450 тис. + заощадження на аварійних ремонтах 150 тис. = 600 тис./рік → окупність ≈ 1 рік. Завжди показуйте <b>припущення</b> окремо від результату."}} />
      <h2 dangerouslySetInnerHTML={{__html: "7. Підсумковий проєкт і захист"}} />
      <p dangerouslySetInnerHTML={{__html: "Студент демонструє:"}} />
      <ol><li dangerouslySetInnerHTML={{__html: "Запуск стека однією командою."}} /><li dangerouslySetInnerHTML={{__html: "Потік даних від симулятора до БД; статус пристрою."}} /><li dangerouslySetInnerHTML={{__html: "Спрацювання сповіщення при ін'єкції несправності."}} /><li dangerouslySetInnerHTML={{__html: "Роботу захисту (відхилення підробленого/повторного повідомлення, заборона чужого топіка)."}} /><li dangerouslySetInnerHTML={{__html: "Відповіді на питання за архітектурою та ТЗ."}} /></ol>
      <h2 dangerouslySetInnerHTML={{__html: "Інтерактив"}} />
      <TcoCalculator />
      <Quiz questions={QUIZ.l7} />
      <p className="footer-note">Лабораторна цього тижня — ЛР7. Це остання лекція курсу; далі — захист підсумкового проєкту.</p>
    </article>
  )
}
