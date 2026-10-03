// Згенеровано scripts/gen.py з content/*.md - редагуйте markdown, потім `npm run gen`
import Quiz from '../components/Quiz.jsx'
import { QUIZ } from '../quizzes.js'

export default function Lab02() {
  return (
    <article>
      <div className="kicker">Лабораторна робота 2</div>
      <h1>Edge-шлюз: MQTT, LWT, буферизація</h1>
      <div className="lab-meta"><div><b>Лекція</b><span dangerouslySetInnerHTML={{__html: "2"}} /></div><div><b>Файл</b><span dangerouslySetInnerHTML={{__html: "<code>iiot/gateway.py</code>"}} /></div></div>
      <div className="goals"><b>Мета роботи</b><p dangerouslySetInnerHTML={{__html: "Реалізувати шлюз, що публікує телеметрію симулятора в MQTT і не втрачає дані при розриві зв'язку."}} /></div>
      <h2 dangerouslySetInnerHTML={{__html: "Підготовка"}} />
      <p dangerouslySetInnerHTML={{__html: "Встановіть залежності <code>pip install -r requirements.txt</code> і запустіть брокер."}} />
      <p dangerouslySetInnerHTML={{__html: "<code>mosquitto.conf</code> для навчання:"}} />
      <pre className="code"><code>{"listener 1883\nallow_anonymous true"}</code></pre>
      <p dangerouslySetInnerHTML={{__html: "<code>mosquitto -c mosquitto.conf</code> або <code>docker run --rm -p 1883:1883 -v \"$PWD/mosquitto.conf:/mosquitto/config/mosquitto.conf\" eclipse-mosquitto:2</code>"}} />
      <p dangerouslySetInnerHTML={{__html: "Спостерігати за топіками зручно через MQTT Explorer або будь-яким клієнтом із підпискою на <code>plant/#</code>."}} />
      <h2 dangerouslySetInnerHTML={{__html: "Завдання"}} />
      <p dangerouslySetInnerHTML={{__html: "У <code>iiot/gateway.py</code> реалізуйте:"}} />
      <ol><li dangerouslySetInnerHTML={{__html: "<code>build_topic(site, line, device, kind=\"telemetry\") -&gt; str</code> → <code>plant/{site}/{line}/{device}/{kind}</code>."}} /><li dangerouslySetInnerHTML={{__html: "<code>encode(msg) -&gt; bytes</code> та <code>decode(raw) -&gt; dict</code> — компактний JSON (<code>separators=(\",\", \":\")</code>, <code>sort_keys=True</code>)."}} /><li dangerouslySetInnerHTML={{__html: "<code>OfflineBuffer(maxlen)</code> — кільцевий буфер: <code>push(item)</code>, <code>drain() -&gt; list</code> (повертає й очищає, у порядку надходження), <code>len()</code>, лічильник <code>dropped</code> (скільки найстаріших відкинуто при переповненні)."}} /><li><p dangerouslySetInnerHTML={{__html: "<code>Gateway(client, site, line, device_id, buffer_size=1000)</code>:"}} /><ul><li dangerouslySetInnerHTML={{__html: "у конструкторі викликає <code>client.will_set(&lt;status-топік&gt;, encode({\"state\":\"offline\"}), qos=1, retain=True)</code>;"}} /><li dangerouslySetInnerHTML={{__html: "<code>on_connect(*args, **kw)</code> — <code>connected=True</code>, публікує <code>{\"state\":\"online\"}</code> у status (qos=1, retain=True), потім скидає буфер у телеметрію <b>в порядку надходження</b>;"}} /><li dangerouslySetInnerHTML={{__html: "<code>on_disconnect(*args, **kw)</code> — <code>connected=False</code>;"}} /><li dangerouslySetInnerHTML={{__html: "<code>publish(msg)</code> — приймає <code>dict</code> або готові <code>bytes</code>; якщо підключено — <code>client.publish(topic, payload, qos=1)</code>, інакше — у буфер."}} /></ul></li><li dangerouslySetInnerHTML={{__html: "<code>make_client(client_id, username=None, password=None)</code> — створює <code>paho.mqtt.client.Client(CallbackAPIVersion.VERSION2, client_id=...)</code>."}} /></ol>
      <p dangerouslySetInnerHTML={{__html: "Клієнт передається ззовні (<i>dependency injection</i>) — тому шлюз тестується без мережі."}} />
      <h2 dangerouslySetInnerHTML={{__html: "Запуск (скрипт <code>run_gateway.py</code> — напишіть самі)"}} />
      <p dangerouslySetInnerHTML={{__html: "Створіть клієнта, прив'яжіть <code>on_connect/on_disconnect</code>, підключіться, <code>loop_start()</code>, у циклі <code>sim.step()</code> → <code>gw.publish(msg)</code> → <code>sleep(1)</code>. Перевірте, що в <code>plant/#</code> з'являються телеметрія та <code>status</code>."}} />
      <p dangerouslySetInnerHTML={{__html: "<b>Експеримент</b>: зупиніть брокер на 20 с, потім запустіть — переконайтеся, що пропущені повідомлення надійшли після відновлення (з урахуванням <code>dropped</code>)."}} />
      <h2 dangerouslySetInnerHTML={{__html: "Перевірка"}} />
      <pre className="code"><code>{"python -m pytest tests/test_lab2_gateway.py -v"}</code></pre>
      <p dangerouslySetInnerHTML={{__html: "Інтеграційний тест виконається автоматично, якщо брокер слухає <code>localhost:1883</code>."}} />
      <h2 dangerouslySetInnerHTML={{__html: "Захист"}} />
      <ol><li dangerouslySetInnerHTML={{__html: "Що станеться зі статусом при аварійному вимкненні шлюзу?"}} /><li dangerouslySetInnerHTML={{__html: "Чому QoS 1, а не 0? Яка ціна?"}} /><li dangerouslySetInnerHTML={{__html: "Яку політику переповнення ви обрали і чому?"}} /></ol>
      <div className="callout"><b>Перевірка:</b> автотести <code>tests/test_lab2_*.py</code> у вашому форку шаблону; на захисті — демонстрація та відповіді на питання вище.</div>
      <Quiz questions={QUIZ.lr2} />
    </article>
  )
}
