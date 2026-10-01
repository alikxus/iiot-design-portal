// Згенеровано scripts/gen.py з content/*.md - редагуйте markdown, потім `npm run gen`
import Quiz from '../components/Quiz.jsx'
import { QUIZ } from '../quizzes.js'
import RulEstimator from '../widgets/RulEstimator.jsx'

export default function Lecture05() {
  return (
    <article>
      <div className="kicker">Лекція 5</div>
      <h1>Цифровий двійник та предиктивне обслуговування</h1>
      <div className="lab-meta"><div><b>Тиждень</b><span dangerouslySetInnerHTML={{__html: "5"}} /></div><div><b>Обсяг</b><span dangerouslySetInnerHTML={{__html: "2 академічні години"}} /></div><div><b>Лабораторна</b><span dangerouslySetInnerHTML={{__html: "аномалії та оцінка залишкового ресурсу"}} /></div></div>
      <div className="goals"><b>Цілі заняття</b><p dangerouslySetInnerHTML={{__html: "Ознайомитися з рівнями цифрового двійника, стратегіями обслуговування та реалізувати прості, інтерпретовані методи виявлення аномалій та оцінки RUL."}} /></div>
      <h2 dangerouslySetInnerHTML={{__html: "1. Стратегії обслуговування"}} />
      <ol><li dangerouslySetInnerHTML={{__html: "<b>Реактивне</b> — ремонт після поломки. Дешево, поки не стається аварія."}} /><li dangerouslySetInnerHTML={{__html: "<b>Планово-попереджувальне</b> — за календарем/напрацюванням. Ремонтуємо те, що ще справне."}} /><li dangerouslySetInnerHTML={{__html: "<b>За станом</b> (condition-based) — за вимірами (вібрація, температура)."}} /><li dangerouslySetInnerHTML={{__html: "<b>Предиктивне</b> — прогнозуємо, <b>коли</b> параметр досягне межі, і ремонтуємо у зручне вікно."}} /></ol>
      <h2 dangerouslySetInnerHTML={{__html: "2. Цифровий двійник: три рівні"}} />
      <ul><li dangerouslySetInnerHTML={{__html: "<b>Цифрова модель</b> — опис без зв'язку з реальним об'єктом (креслення, симуляція)."}} /><li dangerouslySetInnerHTML={{__html: "<b>Цифрова тінь</b> — дані з об'єкта надходять у модель (односторонній зв'язок). <i>Наш симулятор + конвеєр — це тінь.</i>"}} /><li dangerouslySetInnerHTML={{__html: "<b>Цифровий двійник</b> — двосторонній зв'язок: модель впливає на реальний об'єкт (уставки, рекомендації)."}} /></ul>
      <p dangerouslySetInnerHTML={{__html: "Практичний патерн «device shadow»: для кожного пристрою зберігаємо <code>reported</code> (що пристрій повідомив) і <code>desired</code> (що хочемо) та розбіжність між ними."}} />
      <h2 dangerouslySetInnerHTML={{__html: "3. Вібрація як індикатор стану"}} />
      <p dangerouslySetInnerHTML={{__html: "Інтегральна швидкість вібрації (мм/с RMS) — класичний показник стану підшипників і дисбалансу. Стандарт ISO 10816-3 (замінений ISO 20816-3) визначає зони стану: A — новий, B — допустимо тривало, C — обмежено, D — небезпечно. Для машин групи 2 (15–300 кВт) на жорсткому фундаменті межі зон приблизно: 1,4 / 2,8 / 4,5 мм/с (перевіряйте за актуальним стандартом для свого обладнання). Звідси наш поріг 4,5 мм/с для critical."}} />
      <p dangerouslySetInnerHTML={{__html: "Типовий сценарій деградації (крива P–F): тривалий період «норми» → поява перших ознак (P) → прискорене зростання → функціональна відмова (F). Інтервал P–F — вікно для планування ремонту."}} />
      <h2 dangerouslySetInnerHTML={{__html: "4. Виявлення аномалій простими методами"}} />
      <h3 dangerouslySetInnerHTML={{__html: "4.1 Експоненційне згладжування (EWMA)"}} />
      <p dangerouslySetInnerHTML={{__html: "Прибирає шум, залишаючи тренд: <code>s_t = α·x_t + (1−α)·s_{t−1}</code>; малий α — сильніше згладжування."}} />
      <pre className="code"><code>{"def ewma(values, alpha=0.3):\n    out, s = [], None\n    for v in values:\n        s = v if s is None else alpha * v + (1 - alpha) * s\n        out.append(s)\n    return out"}</code></pre>
      <h3 dangerouslySetInnerHTML={{__html: "4.2 Ковзна z-оцінка"}} />
      <p dangerouslySetInnerHTML={{__html: "Порівнюємо нове значення з середнім і стандартним відхиленням <b>попереднього вікна</b>:"}} />
      <p dangerouslySetInnerHTML={{__html: "<code>z = (x − mean) / std</code>; аномалія, якщо <code>|z| &gt; поріг</code> (типово 3–4)."}} />
      <pre className="code"><code>{"from collections import deque\nimport math\n\nclass RollingZ:\n    def __init__(self, window=30, min_samples=10):\n        self.buf, self.min_samples = deque(maxlen=window), min_samples\n    def update(self, x):\n        z = None\n        if len(self.buf) >= self.min_samples:\n            mean = sum(self.buf) / len(self.buf)\n            std = math.sqrt(sum((v - mean) ** 2 for v in self.buf) / len(self.buf))\n            z = (x - mean) / max(std, 1e-6)\n        self.buf.append(x)       # додаємо ПІСЛЯ обчислення\n        return z"}</code></pre>
      <p dangerouslySetInnerHTML={{__html: "Важливі нюанси: «розігрів» (до накопичення вікна повертаємо <code>None</code>); нове значення не входить у власне вікно; повільний дрейф z-оцінка <b>не</b> ловить — тому поруч потрібен трендовий метод."}} />
      <h2 dangerouslySetInnerHTML={{__html: "5. Оцінка залишкового ресурсу (RUL)"}} />
      <p dangerouslySetInnerHTML={{__html: "Лінійна регресія методом найменших квадратів: <code>v ≈ a·t + b</code>, де <code>a = Σ(t−t̄)(v−v̄) / Σ(t−t̄)²</code>, <code>b = v̄ − a·t̄</code>."}} />
      <p dangerouslySetInnerHTML={{__html: "Час перетину межі <code>L</code>: <code>t* = (L − b)/a</code>; RUL = <code>t* − t_now</code>."}} />
      <pre className="code"><code>{"def linear_trend(ts, values):\n    n = len(ts); mt, mv = sum(ts)/n, sum(values)/n\n    sxx = sum((t - mt) ** 2 for t in ts)\n    slope = sum((t - mt) * (v - mv) for t, v in zip(ts, values)) / sxx if sxx else 0.0\n    return slope, mv - slope * mt\n\ndef estimate_rul(ts, values, limit):\n    if values[-1] >= limit: return 0.0           # межу вже перевищено\n    slope, icpt = linear_trend(ts, values)\n    if slope <= 1e-12: return None               # тренду до межі немає\n    return max((limit - icpt) / slope - ts[-1], 0.0)"}</code></pre>
      <p dangerouslySetInnerHTML={{__html: "<b>Обмеження</b>: деградація зазвичай нелінійна (прискорюється) → лінійна оцінка <b>оптимістична</b>; використовуйте короткі вікна (останні години), показуйте користувачу <b>невизначеність</b> (діапазон, а не одне число), а в критичних випадках — експоненційні/фізичні моделі чи ML."}} />
      <h2 dangerouslySetInnerHTML={{__html: "6. Місце ML"}} />
      <p dangerouslySetInnerHTML={{__html: "Прості методи — інтерпретовані й не потребують розмічених даних. Далі за потреби: Isolation Forest / автоенкодер (аномалії без розмітки), градієнтний бустинг/LSTM (RUL при наявності історії відмов). Правило: <b>спочатку базова лінія</b> (поріг + тренд), потім ML — і лише якщо він її перевершує на історичних даних."}} />
      <h2 dangerouslySetInnerHTML={{__html: "7. Де це працює в архітектурі"}} />
      <ul><li dangerouslySetInnerHTML={{__html: "Затримко-критичне та прості методи — на <b>edge</b> (шлюз або окремий сервіс)."}} /><li dangerouslySetInnerHTML={{__html: "Навчання моделей та аналіз флоту — у <b>хмарі/дата-центрі</b>."}} /><li dangerouslySetInnerHTML={{__html: "Результати публікуються як події/метрики (<code>.../analytics</code>) у ту ж шину."}} /></ul>
      <h2 dangerouslySetInnerHTML={{__html: "Інтерактив"}} />
      <RulEstimator />
      <Quiz questions={QUIZ.l5} />
      <p className="footer-note">Лабораторна цього тижня — ЛР5. Наступна лекція — №6.</p>
    </article>
  )
}
