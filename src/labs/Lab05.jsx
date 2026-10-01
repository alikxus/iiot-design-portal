// Згенеровано scripts/gen.py з content/*.md - редагуйте markdown, потім `npm run gen`
import Quiz from '../components/Quiz.jsx'
import { QUIZ } from '../quizzes.js'

export default function Lab05() {
  return (
    <article>
      <div className="kicker">Лабораторна робота 5</div>
      <h1>Аномалії та залишковий ресурс (RUL)</h1>
      <div className="lab-meta"><div><b>Обсяг</b><span dangerouslySetInnerHTML={{__html: "2 академічні години"}} /></div><div><b>Лекція</b><span dangerouslySetInnerHTML={{__html: "5"}} /></div><div><b>Файл</b><span dangerouslySetInnerHTML={{__html: "<code>iiot/analytics.py</code>"}} /></div></div>
      <div className="goals"><b>Мета роботи</b><p dangerouslySetInnerHTML={{__html: "Реалізувати прості інтерпретовані методи предиктивного обслуговування та застосувати їх до даних вашого симулятора."}} /></div>
      <h2 dangerouslySetInnerHTML={{__html: "Завдання"}} />
      <p dangerouslySetInnerHTML={{__html: "У <code>iiot/analytics.py</code>:"}} />
      <ol><li dangerouslySetInnerHTML={{__html: "<code>ewma(values, alpha=0.3) -&gt; list[float]</code> — експоненційне згладжування; перший елемент = першому значенню."}} /><li><p dangerouslySetInnerHTML={{__html: "<code>RollingZ(window=30, min_samples=10)</code> з методом <code>update(x) -&gt; float | None</code>:"}} /><ul><li dangerouslySetInnerHTML={{__html: "повертає <code>None</code>, поки у вікні менше <code>min_samples</code> значень;"}} /><li dangerouslySetInnerHTML={{__html: "z-оцінка обчислюється за <b>попереднім</b> вікном (поточне значення додається <b>після</b> обчислення); стандартне відхилення — популяційне, з нижньою межею <code>1e-6</code>."}} /></ul></li><li dangerouslySetInnerHTML={{__html: "<code>detect_anomalies(values, window=30, threshold=3.5) -&gt; list[int]</code> — індекси значень із <code>|z| &gt; threshold</code>."}} /><li dangerouslySetInnerHTML={{__html: "<code>linear_trend(ts, values) -&gt; (slope, intercept)</code> — МНК, <code>sxx == 0</code> → <code>slope = 0</code>."}} /><li><p dangerouslySetInnerHTML={{__html: "<code>estimate_rul(ts, values, limit) -&gt; float | None</code>:"}} /><ul><li dangerouslySetInnerHTML={{__html: "<code>0.0</code>, якщо останнє значення вже <code>≥ limit</code>;"}} /><li dangerouslySetInnerHTML={{__html: "<code>None</code>, якщо нахил <code>≤ 1e-12</code>;"}} /><li dangerouslySetInnerHTML={{__html: "інакше <code>max((limit − intercept)/slope − ts[-1], 0)</code> у тих самих одиницях, що й <code>ts</code>."}} /></ul></li></ol>
      <h2 dangerouslySetInnerHTML={{__html: "Експеримент"}} />
      <p dangerouslySetInnerHTML={{__html: "Напишіть <code>run_experiment.py</code> (або ноутбук):"}} />
      <ol><li dangerouslySetInnerHTML={{__html: "Згенеруйте 600 кроків симулятора з <code>wear_rate=0.001</code> (<code>now = крок</code>)."}} /><li dangerouslySetInnerHTML={{__html: "Побудуйте сирий сигнал вібрації та <code>ewma</code>."}} /><li dangerouslySetInnerHTML={{__html: "Знайдіть аномалії; додайте штучні викиди й перевірте, що вони виявляються."}} /><li dangerouslySetInnerHTML={{__html: "Кожні 50 кроків оцініть RUL до межі 4,5 мм/с за останніми 100 точками. Побудуйте графік «оцінка RUL у часі» та порівняйте з фактичним моментом перетину межі."}} /></ol>
      <p dangerouslySetInnerHTML={{__html: "Зробіть <b>висновок</b> (3–5 речень): наскільки точна лінійна оцінка, чому вона відхиляється, що б ви змінили."}} />
      <h2 dangerouslySetInnerHTML={{__html: "Перевірка"}} />
      <pre className="code"><code>{"python -m pytest tests/test_lab5_analytics.py -v"}</code></pre>
      <h2 dangerouslySetInnerHTML={{__html: "Захист"}} />
      <ol><li dangerouslySetInnerHTML={{__html: "Чому z-оцінка не ловить повільний дрейф?"}} /><li dangerouslySetInnerHTML={{__html: "Чому лінійний RUL оптимістичний для прискореної деградації?"}} /><li dangerouslySetInnerHTML={{__html: "Де в архітектурі (edge/сервер) ви запускали б ці алгоритми й чому?"}} /></ol>
      <div className="callout"><b>Перевірка:</b> автотести <code>tests/test_lab5_*.py</code> у вашому форку шаблону; на захисті — демонстрація та відповіді на питання вище.</div>
      <Quiz questions={QUIZ.lr5} />
    </article>
  )
}
