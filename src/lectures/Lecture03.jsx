// Згенеровано scripts/gen.py з content/*.md - редагуйте markdown, потім `npm run gen`
import Quiz from '../components/Quiz.jsx'
import { QUIZ } from '../quizzes.js'
import SizingCalculator from '../widgets/SizingCalculator.jsx'

export default function Lecture03() {
  return (
    <article>
      <div className="kicker">Лекція 3</div>
      <h1>Збереження телеметрії: часові ряди</h1>
      <div className="lab-meta"><div><b>Тиждень</b><span dangerouslySetInnerHTML={{__html: "3"}} /></div><div><b>Обсяг</b><span dangerouslySetInnerHTML={{__html: "2 академічні години"}} /></div><div><b>Лабораторна</b><span dangerouslySetInnerHTML={{__html: "ingest у SQLite, агрегація, retention"}} /></div></div>
      <div className="goals"><b>Цілі заняття</b><p dangerouslySetInnerHTML={{__html: "Спроєктувати схему зберігання часових рядів, оцінити обсяги і побудувати конвеєр «MQTT → база» з пакетним записом, агрегацією та політикою зберігання."}} /></div>
      <h2 dangerouslySetInnerHTML={{__html: "1. Особливості часових рядів"}} />
      <ul><li dangerouslySetInnerHTML={{__html: "Запис майже завжди <b>append-only</b>, у порядку часу."}} /><li dangerouslySetInnerHTML={{__html: "Читання — <b>діапазонами часу</b> («остання година», «вчора») та агрегатами."}} /><li dangerouslySetInnerHTML={{__html: "Дані <b>старіють</b>: сирі потрібні тижні, агрегати — роки."}} /><li dangerouslySetInnerHTML={{__html: "Обсяги великі й передбачувані → можна оцінити заздалегідь."}} /></ul>
      <h2 dangerouslySetInnerHTML={{__html: "2. Вибір сховища"}} />
      <div className="resp"><table className="data"><thead><tr><th dangerouslySetInnerHTML={{__html: "Варіант"}} /><th dangerouslySetInnerHTML={{__html: "Коли обирати"}} /></tr></thead><tbody><tr><td dangerouslySetInnerHTML={{__html: "SQLite / PostgreSQL"}} /><td dangerouslySetInnerHTML={{__html: "прототип, невеликі обсяги, потрібен SQL і транзакції"}} /></tr><tr><td dangerouslySetInnerHTML={{__html: "TimescaleDB (розширення PostgreSQL)"}} /><td dangerouslySetInnerHTML={{__html: "SQL + автоматичне секціонування <code>hypertable</code>, стиснення, continuous aggregates"}} /></tr><tr><td dangerouslySetInnerHTML={{__html: "InfluxDB"}} /><td dangerouslySetInnerHTML={{__html: "вузькоспеціалізована TSDB, зручна модель <code>measurement/tags/fields</code>, власні мови запитів"}} /></tr><tr><td dangerouslySetInnerHTML={{__html: "Parquet/об'єктне сховище"}} /><td dangerouslySetInnerHTML={{__html: "довгий архів, аналітика пакетами"}} /></tr></tbody></table></div>
      <p dangerouslySetInnerHTML={{__html: "У лабораторній використовуємо <b>SQLite</b> (без встановлення сервера), але структуру проєктуємо так, щоб міграція була тривіальною."}} />
      <h3 dangerouslySetInnerHTML={{__html: "Приклад для InfluxDB (line protocol)"}} />
      <pre className="code"><code>{"telemetry,device=pump-01,site=kyiv vibration=1.82,temperature=55.3 1760000000000000000"}</code></pre>
      <p dangerouslySetInnerHTML={{__html: "Теги — індексовані (низька кардинальність: пристрій, майданчик); поля — значення. <b>Не кладіть у теги значення, що швидко змінюються</b> (кардинальність вибухає)."}} />
      <h3 dangerouslySetInnerHTML={{__html: "Приклад для TimescaleDB"}} />
      <pre className="code"><code>{"CREATE TABLE telemetry(ts timestamptz NOT NULL, device_id text NOT NULL, metric text NOT NULL, value double precision NOT NULL);\nSELECT create_hypertable('telemetry', 'ts');\nCREATE INDEX ON telemetry (device_id, metric, ts DESC);"}</code></pre>
      <h2 dangerouslySetInnerHTML={{__html: "3. Схема: «довга» чи «широка»"}} />
      <ul><li dangerouslySetInnerHTML={{__html: "<b>Довга</b> (<code>ts, device, metric, value</code>): гнучка, нові метрики без міграції, але більше рядків."}} /><li dangerouslySetInnerHTML={{__html: "<b>Широка</b> (<code>ts, device, vibration, temp, ...</code>): компактніша, швидша для читання кількох метрик разом, але зміна метрик = зміна схеми."}} /></ul>
      <p dangerouslySetInnerHTML={{__html: "У курсі — довга схема. Індекс: <code>(device_id, metric, ts)</code> відповідає основному запиту «останні N значень метрики пристрою»."}} />
      <pre className="code"><code>{"CREATE TABLE telemetry(ts REAL NOT NULL, device_id TEXT NOT NULL, metric TEXT NOT NULL, value REAL NOT NULL);\nCREATE INDEX ix_tel ON telemetry(device_id, metric, ts);"}</code></pre>
      <h2 dangerouslySetInnerHTML={{__html: "4. Оцінка обсягів (обов'язковий крок проєктування)"}} />
      <p dangerouslySetInnerHTML={{__html: "Приклад: 100 агрегатів × 1 повідомлення/с × 4 метрики."}} />
      <ul><li dangerouslySetInnerHTML={{__html: "Повідомлень на добу: 100 × 86 400 = 8,64 млн."}} /><li dangerouslySetInnerHTML={{__html: "Рядків (довга схема): 8,64 млн × 4 = 34,56 млн/добу."}} /><li dangerouslySetInnerHTML={{__html: "При ~40 байт/рядок (з індексом реально більше): ≈ 1,4 ГБ/добу ≈ 500 ГБ/рік <b>сирих</b> даних."}} /></ul>
      <p dangerouslySetInnerHTML={{__html: "Висновок: потрібні (а) агрегація, (б) retention, (в) стиснення/секціонування. Зменшення частоти запису до 1 раз на 10 с зменшує обсяг у 10 разів — часто достатньо для повільних величин (температура)."}} />
      <h2 dangerouslySetInnerHTML={{__html: "5. Пакетний запис (batching)"}} />
      <p dangerouslySetInnerHTML={{__html: "Вставка по одному рядку — головне «вузьке місце». Накопичуємо пачку (за кількістю <b>або</b> за часом) і пишемо однією транзакцією:"}} />
      <pre className="code"><code>{"with conn:\n    conn.executemany(\"INSERT INTO telemetry VALUES (?,?,?,?)\", rows)"}</code></pre>
      <p dangerouslySetInnerHTML={{__html: "Компроміс: більша пачка → вища пропускна здатність, але більша затримка і більший обсяг втрат при падінні процесу. Тому — і порогове значення, і періодичний <code>flush()</code>."}} />
      <p dangerouslySetInnerHTML={{__html: "<b>Ідемпотентність</b>: MQTT QoS 1 може дублювати. Варіанти: унікальний ключ <code>(device_id, metric, ts)</code> + <code>INSERT OR IGNORE</code>, або терпіти дублікати й усувати їх при агрегації."}} />
      <h2 dangerouslySetInnerHTML={{__html: "6. Агрегація (downsampling)"}} />
      <p dangerouslySetInnerHTML={{__html: "Хвилинні агрегати зберігають <code>avg, min, max, n</code> — достатньо для графіків і трендів."}} />
      <pre className="code"><code>{"INSERT OR REPLACE INTO telemetry_1m\nSELECT CAST(ts/60 AS INTEGER)*60, device_id, metric, AVG(value), MIN(value), MAX(value), COUNT(*)\nFROM telemetry WHERE ts < :before GROUP BY 1, device_id, metric;"}</code></pre>
      <p dangerouslySetInnerHTML={{__html: "<code>INSERT OR REPLACE</code> + первинний ключ <code>(bucket, device_id, metric)</code> робить завдання <b>ідемпотентним</b> — його безпечно запускати за розкладом повторно. Важливо агрегувати лише <b>закриті</b> відра (<code>ts &lt; before</code>), інакше неповна хвилина дасть хибне середнє."}} />
      <h2 dangerouslySetInnerHTML={{__html: "7. Retention (політика зберігання)"}} />
      <p dangerouslySetInnerHTML={{__html: "Приклад політики: сирі — 14 діб; хвилинні — 2 роки; погодинні — 10 років. Видалення старих сирих даних — окреме завдання <b>після</b> успішної агрегації."}} />
      <pre className="code"><code>{"def purge_older_than(conn, ts):\n    with conn:\n        return conn.execute(\"DELETE FROM telemetry WHERE ts < ?\", (ts,)).rowcount"}</code></pre>
      <h2 dangerouslySetInnerHTML={{__html: "8. Якість даних"}} />
      <ul><li dangerouslySetInnerHTML={{__html: "Час: зберігати UTC; перевіряти розбіжність годинників пристрою і сервера."}} /><li dangerouslySetInnerHTML={{__html: "Пропуски: відрізняти «немає даних» від «нуль»."}} /><li dangerouslySetInnerHTML={{__html: "Схема й одиниці: версія схеми в повідомленні, одиниці у назві метрики."}} /><li dangerouslySetInnerHTML={{__html: "Погані повідомлення не повинні зупиняти конвеєр: логувати й пропускати (але лічити)."}} /></ul>
      <h2 dangerouslySetInnerHTML={{__html: "Інтерактив"}} />
      <SizingCalculator />
      <Quiz questions={QUIZ.l3} />
      <p className="footer-note">Лабораторна цього тижня — ЛР3. Наступна лекція — №4.</p>
    </article>
  )
}
