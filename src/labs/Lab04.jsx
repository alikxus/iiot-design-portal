// Згенеровано scripts/gen.py з content/*.md - редагуйте markdown, потім `npm run gen`
import Quiz from '../components/Quiz.jsx'
import { QUIZ } from '../quizzes.js'

export default function Lab04() {
  return (
    <article>
      <div className="kicker">Лабораторна робота 4</div>
      <h1>Рушій сповіщень: поріг, гістерезис, debounce</h1>
      <div className="lab-meta"><div><b>Обсяг</b><span dangerouslySetInnerHTML={{__html: "2 академічні години"}} /></div><div><b>Лекція</b><span dangerouslySetInnerHTML={{__html: "4"}} /></div><div><b>Файл</b><span dangerouslySetInnerHTML={{__html: "<code>iiot/alerts.py</code>"}} /></div></div>
      <div className="goals"><b>Мета роботи</b><p dangerouslySetInnerHTML={{__html: "Реалізувати конфігурований рушій правил, який не «дрижить» біля порога, і підключити його до шини."}} /></div>
      <h2 dangerouslySetInnerHTML={{__html: "Завдання"}} />
      <p dangerouslySetInnerHTML={{__html: "У <code>iiot/alerts.py</code>:"}} />
      <ol><li dangerouslySetInnerHTML={{__html: "<code>@dataclass Rule(name, metric, high, hysteresis=0.0, debounce=3, severity=\"warning\")</code>."}} /><li><p dangerouslySetInnerHTML={{__html: "<code>AlertEngine(rules)</code> з методом <code>process(msg) -&gt; list[dict]</code>:"}} /><ul><li dangerouslySetInnerHTML={{__html: "стан зберігається <b>окремо для кожної пари (device_id, rule.name)</b>;"}} /><li dangerouslySetInnerHTML={{__html: "<b>raised</b>: після <code>debounce</code> вимірів <b>поспіль</b>, у яких <code>value &gt; high</code>; будь-який вимір не вище порога скидає лічильник;"}} /><li dangerouslySetInnerHTML={{__html: "<b>cleared</b>: коли активне сповіщення і <code>value &lt; high − hysteresis</code>;"}} /><li dangerouslySetInnerHTML={{__html: "подія генерується <b>лише при переходах</b>;"}} /><li dangerouslySetInnerHTML={{__html: "якщо метрики немає в повідомленні — правило пропускається;"}} /><li><p dangerouslySetInnerHTML={{__html: "формат події:"}} /><pre className="code"><code>{"{\"rule\":\"high_vibration\",\"device_id\":\"pump-01\",\"metric\":\"vibration_mm_s\",\n \"state\":\"raised\",\"value\":5.1,\"ts\":1760000123.4,\"severity\":\"critical\"}"}</code></pre></li></ul></li><li dangerouslySetInnerHTML={{__html: "<code>DEFAULT_RULES</code>: <code>high_vibration</code> (поріг 4,5, гістерезис 0,5, debounce 3, critical) та <code>high_temperature</code> (поріг 80, гістерезис 3, debounce 5, warning)."}} /></ol>
      <h2 dangerouslySetInnerHTML={{__html: "Запуск"}} />
      <p dangerouslySetInnerHTML={{__html: "<code>run_alerts.py</code>: підписка на телеметрію; для кожної події — публікація в топік, у якого останній сегмент замінено на <code>alerts</code> (<code>plant/.../pump-01/alerts</code>), QoS 1. Викличте у симуляторі <code>inject_fault(\"bearing\")</code> і переконайтеся, що подія <code>raised</code> з'явилась, а після <code>running=False</code>/ремонту (скид <code>wear</code>) — <code>cleared</code>."}} />
      <h2 dangerouslySetInnerHTML={{__html: "Перевірка"}} />
      <pre className="code"><code>{"python -m pytest tests/test_lab4_alerts.py -v"}</code></pre>
      <h2 dangerouslySetInnerHTML={{__html: "Додатково"}} />
      <p dangerouslySetInnerHTML={{__html: "Додайте правило «відсутність даних понад 30 с» (потрібен таймер, а не лише <code>process</code>) та зобразіть пороги на графіку (matplotlib) по даних із <code>iiot.db</code>."}} />
      <h2 dangerouslySetInnerHTML={{__html: "Захист"}} />
      <ol><li dangerouslySetInnerHTML={{__html: "Покажіть на послідовності значень, чим debounce відрізняється від гістерезису."}} /><li dangerouslySetInnerHTML={{__html: "Як зменшити кількість хибних спрацювань, не втративши реальні?"}} /><li dangerouslySetInnerHTML={{__html: "Які поля події потрібні оператору для дії?"}} /></ol>
      <div className="callout"><b>Перевірка:</b> автотести <code>tests/test_lab4_*.py</code> у вашому форку шаблону; на захисті — демонстрація та відповіді на питання вище.</div>
      <Quiz questions={QUIZ.lr4} />
    </article>
  )
}
