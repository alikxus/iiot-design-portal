// Згенеровано scripts/gen.py з content/*.md - редагуйте markdown, потім `npm run gen`
import Quiz from '../components/Quiz.jsx'
import { QUIZ } from '../quizzes.js'

export default function Lab01() {
  return (
    <article>
      <div className="kicker">Лабораторна робота 1</div>
      <h1>ТЗ та симулятор насосного агрегату</h1>
      <div className="lab-meta"><div><b>Лекція</b><span dangerouslySetInnerHTML={{__html: "1"}} /></div><div><b>Файли</b><span dangerouslySetInnerHTML={{__html: "<code>iiot/sim.py</code>, <code>docs/tz.md</code>"}} /></div></div>
      <div className="goals"><b>Мета роботи</b><p dangerouslySetInnerHTML={{__html: "Описати вимоги до IIoT-системи моніторингу насосної станції та реалізувати симулятор агрегату, який буде джерелом даних для всього курсу."}} /></div>
      <h2 dangerouslySetInnerHTML={{__html: "Частина A. Технічне завдання (≈ 30 хв)"}} />
      <p dangerouslySetInnerHTML={{__html: "Створіть <code>docs/tz.md</code> (1–2 сторінки) за шаблоном із лекції 1: мета, межі системи, 4–6 FR, 4–6 NFR (<b>кожна вимога вимірювана</b>), інтерфейси, критерії приймання. Додайте схему архітектури (текстова чи зображення) із шарами edge / сервер."}} />
      <h2 dangerouslySetInnerHTML={{__html: "Частина B. Симулятор (≈ 1 год 30 хв)"}} />
      <p dangerouslySetInnerHTML={{__html: "Створіть пакет <code>iiot/</code> (файл <code>iiot/__init__.py</code> уже є) та модуль <code>iiot/sim.py</code> з класом <code>PumpSimulator</code>."}} />
      <h3 dangerouslySetInnerHTML={{__html: "Інтерфейс"}} />
      <pre className="code"><code>{"PumpSimulator(device_id=\"pump-01\", seed=None, wear_rate=0.0)\n.running: bool            # True за замовчуванням\n.wear: float              # 0..1\n.inject_fault(kind)       # \"bearing\" -> wear >= 0.7; \"clog\" -> засмічення; інше -> ValueError\n.step(dt=1.0, now=None) -> dict"}</code></pre>
      <h3 dangerouslySetInnerHTML={{__html: "Формат результату <code>step()</code>"}} />
      <pre className="code"><code>{"{\"device_id\": \"pump-01\", \"ts\": 1760000000.0, \"running\": true,\n \"metrics\": {\"vibration_mm_s\": 1.84, \"temperature_c\": 55.2, \"pressure_bar\": 4.19, \"current_a\": 12.1}}"}</code></pre>
      <p dangerouslySetInnerHTML={{__html: "<code>ts</code> = <code>now</code>, якщо задано, інакше <code>time.time()</code>."}} />
      <h3 dangerouslySetInnerHTML={{__html: "Модель (орієнтир; константи можна підібрати власні, але тести мають проходити)"}} />
      <ul><li dangerouslySetInnerHTML={{__html: "Справний агрегат: вібрація ≈ 1,8 мм/с, температура ≈ 55 °C, тиск ≈ 4,2 бар, струм ≈ 12 А, плюс гауссів шум."}} /><li dangerouslySetInnerHTML={{__html: "Знос <code>wear</code> збільшує вібрацію (≈ +6 мм/с при wear=1), температуру (≈ +25 °C) та струм."}} /><li dangerouslySetInnerHTML={{__html: "Засмічення <code>clog</code> знижує тиск і підвищує струм."}} /><li dangerouslySetInnerHTML={{__html: "Агрегат зупинено (<code>running=False</code>): тиск і струм = 0, вібрація ≈ 0, температура повільно спадає до 25 °C."}} /><li dangerouslySetInnerHTML={{__html: "Власний генератор <code>random.Random(seed)</code> — для відтворюваності."}} /><li dangerouslySetInnerHTML={{__html: "<code>wear</code> зростає на <code>wear_rate</code> за кожен крок і не перевищує 1."}} /></ul>
      <h2 dangerouslySetInnerHTML={{__html: "Перевірка"}} />
      <pre className="code"><code>{"python -m pytest tests/test_lab1_sim.py -v"}</code></pre>
      <p dangerouslySetInnerHTML={{__html: "Усі тести мають бути зеленими."}} />
      <h2 dangerouslySetInnerHTML={{__html: "Захист (усно)"}} />
      <ol><li dangerouslySetInnerHTML={{__html: "Чому симулятор має seed?"}} /><li dangerouslySetInnerHTML={{__html: "Поясніть, як ви обрали одиниці та назви полів."}} /><li dangerouslySetInnerHTML={{__html: "Які вимоги з вашого ТЗ перевіряє цей модуль?"}} /></ol>
      <h2 dangerouslySetInnerHTML={{__html: "Додатково (+бали)"}} />
      <p dangerouslySetInnerHTML={{__html: "Додайте сезонні коливання температури навколишнього середовища або режим «пуск/зупинка» зі змінним навантаженням."}} />
      <div className="callout"><b>Перевірка:</b> автотести <code>tests/test_lab1_*.py</code> у вашому форку шаблону; на захисті — демонстрація та відповіді на питання вище.</div>
      <Quiz questions={QUIZ.lr1} />
    </article>
  )
}
