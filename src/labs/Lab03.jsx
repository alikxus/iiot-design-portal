// Згенеровано scripts/gen.py з content/*.md - редагуйте markdown, потім `npm run gen`
import Quiz from '../components/Quiz.jsx'
import { QUIZ } from '../quizzes.js'

export default function Lab03() {
  return (
    <article>
      <div className="kicker">Лабораторна робота 3</div>
      <h1>Збереження телеметрії: SQLite, агрегація, retention</h1>
      <div className="lab-meta"><div><b>Лекція</b><span dangerouslySetInnerHTML={{__html: "3"}} /></div><div><b>Файл</b><span dangerouslySetInnerHTML={{__html: "<code>iiot/storage.py</code>"}} /></div></div>
      <div className="goals"><b>Мета роботи</b><p dangerouslySetInnerHTML={{__html: "Побудувати конвеєр «MQTT → база» із пакетним записом, хвилинною агрегацією та очищенням старих даних."}} /></div>
      <h2 dangerouslySetInnerHTML={{__html: "Завдання"}} />
      <p dangerouslySetInnerHTML={{__html: "У <code>iiot/storage.py</code> реалізуйте (довга схема, див. лекцію 3):"}} />
      <ol><li><p dangerouslySetInnerHTML={{__html: "<code>init_db(path=\":memory:\") -&gt; sqlite3.Connection</code> — створює таблиці та індекс:"}} /><ul><li dangerouslySetInnerHTML={{__html: "<code>telemetry(ts REAL, device_id TEXT, metric TEXT, value REAL)</code> + індекс <code>(device_id, metric, ts)</code>;"}} /><li dangerouslySetInnerHTML={{__html: "<code>telemetry_1m(bucket INTEGER, device_id TEXT, metric TEXT, avg REAL, min REAL, max REAL, n INTEGER, PRIMARY KEY(bucket, device_id, metric))</code>."}} /><li dangerouslySetInnerHTML={{__html: "З'єднання має працювати з різних потоків (<code>check_same_thread=False</code>) — callback paho виконується в іншому потоці."}} /></ul></li><li dangerouslySetInnerHTML={{__html: "<code>insert_batch(conn, msgs) -&gt; int</code> — одна транзакція; повертає кількість доданих <b>рядків</b> (повідомлення × метрики)."}} /><li dangerouslySetInnerHTML={{__html: "<code>last_n(conn, device_id, metric, n) -&gt; list[(ts, value)]</code> — останні <code>n</code> значень у <b>зростаючому</b> порядку часу."}} /><li dangerouslySetInnerHTML={{__html: "<code>downsample_1m(conn, before_ts)</code> — агрегує сирі дані з <code>ts &lt; before_ts</code> у хвилинні відра (<code>bucket</code> = початок хвилини). <b>Повторний виклик не має створювати дублікатів.</b> Повертає кількість рядків у <code>telemetry_1m</code>."}} /><li dangerouslySetInnerHTML={{__html: "<code>purge_older_than(conn, ts) -&gt; int</code> — видаляє сирі дані з <code>ts &lt; ts</code>, повертає кількість видалених рядків."}} /><li dangerouslySetInnerHTML={{__html: "<code>Ingestor(conn, decoder, batch_size=20)</code> — <code>on_message(client, userdata, message)</code> декодує <code>decoder(message.payload, message.topic)</code>, додає в пачку; помилкові повідомлення <b>пропускає</b>, не зупиняючи роботу; при досягненні <code>batch_size</code> викликає <code>flush()</code>; <code>flush()</code> повертає кількість записаних рядків (0, якщо пачка порожня)."}} /></ol>
      <h2 dangerouslySetInnerHTML={{__html: "Запуск"}} />
      <p dangerouslySetInnerHTML={{__html: "Напишіть <code>run_ingest.py</code>: підписка на <code>plant/+/+/+/telemetry</code> (QoS 1), <code>Ingestor(init_db(\"iiot.db\"), lambda raw, topic: decode(raw))</code>, у головному циклі <code>flush()</code> раз на секунду. Запустіть разом зі шлюзом із лаб. 2 і дайте попрацювати 2–3 хвилини."}} />
      <p dangerouslySetInnerHTML={{__html: "Перевірте SQL-запитами (<code>sqlite3 iiot.db</code>):"}} />
      <pre className="code"><code>{"SELECT COUNT(*) FROM telemetry;\nSELECT metric, AVG(value) FROM telemetry GROUP BY metric;"}</code></pre>
      <h2 dangerouslySetInnerHTML={{__html: "Розрахункове завдання"}} />
      <p dangerouslySetInnerHTML={{__html: "Для вашого ТЗ (кількість агрегатів — ваш варіант, не менше 20) оцініть обсяг сирих і агрегованих даних на рік; запишіть у <code>docs/sizing.md</code> з припущеннями."}} />
      <h2 dangerouslySetInnerHTML={{__html: "Перевірка"}} />
      <pre className="code"><code>{"python -m pytest tests/test_lab3_storage.py -v"}</code></pre>
      <h2 dangerouslySetInnerHTML={{__html: "Захист"}} />
      <ol><li dangerouslySetInnerHTML={{__html: "Чому пишемо пачками? Який ризик більшої пачки?"}} /><li dangerouslySetInnerHTML={{__html: "Чому агрегація ідемпотентна і як це забезпечено?"}} /><li dangerouslySetInnerHTML={{__html: "Яка політика retention підходить вашому ТЗ?"}} /></ol>
      <div className="callout"><b>Перевірка:</b> автотести <code>tests/test_lab3_*.py</code> у вашому форку шаблону; на захисті — демонстрація та відповіді на питання вище.</div>
      <Quiz questions={QUIZ.lr3} />
    </article>
  )
}
