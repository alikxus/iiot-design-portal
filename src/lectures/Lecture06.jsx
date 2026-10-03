// Згенеровано scripts/gen.py з content/*.md - редагуйте markdown, потім `npm run gen`
import Quiz from '../components/Quiz.jsx'
import { QUIZ } from '../quizzes.js'
import HmacDemo from '../widgets/HmacDemo.jsx'

export default function Lecture06() {
  return (
    <article>
      <div className="kicker">Лекція 6</div>
      <h1>Кібербезпека та надійність IIoT</h1>
      <div className="lab-meta"><div><b>Лабораторна</b><span dangerouslySetInnerHTML={{__html: "автентифікація, ACL, підпис повідомлень, reconnect"}} /></div></div>
      <div className="goals"><b>Цілі заняття</b><p dangerouslySetInnerHTML={{__html: "Навчитися будувати модель загроз для IIoT, застосовувати базові механізми захисту (автентифікація, авторизація, шифрування, цілісність) та проєктувати відмовостійкі клієнти."}} /></div>
      <h2 dangerouslySetInnerHTML={{__html: "1. Чому IIoT вразливий"}} />
      <ul><li dangerouslySetInnerHTML={{__html: "Довгий життєвий цикл обладнання → застаріле ПЗ без оновлень."}} /><li dangerouslySetInnerHTML={{__html: "Раніше «ізольовані» мережі отримали вихід у IT/хмару."}} /><li dangerouslySetInnerHTML={{__html: "Пріоритет доступності над конфіденційністю: не можна просто «перезавантажити»."}} /><li dangerouslySetInnerHTML={{__html: "Наслідки — фізичні (аварії, екологія, безпека людей)."}} /></ul>
      <p dangerouslySetInnerHTML={{__html: "<b>Тріада CIA</b> + для OT важливо <b>Safety</b>: пріоритет — доступність і цілісність, потім конфіденційність."}} />
      <h2 dangerouslySetInnerHTML={{__html: "2. Стандарти та сегментація"}} />
      <p dangerouslySetInnerHTML={{__html: "<b>IEC 62443</b> — серія стандартів з безпеки промислових систем: ключові поняття — <b>зони</b> (групи активів із однаковими вимогами) та <b>канали/conduits</b> (контрольовані зв'язки між зонами), рівні безпеки SL 1–4."}} />
      <p dangerouslySetInnerHTML={{__html: "<b>Модель Перде / ISA-95 + DMZ</b>: між OT (рівні 0–3) та IT (4–5) — демілітаризована зона; <b>односпрямовані</b> шлюзи (data diode) для найкритичніших ділянок. IIoT-шлюз — це точка контрольованого переходу, тому його захищають особливо."}} />
      <h2 dangerouslySetInnerHTML={{__html: "3. Модель загроз (STRIDE)"}} />
      <div className="resp"><table className="data"><thead><tr><th dangerouslySetInnerHTML={{__html: "Загроза"}} /><th dangerouslySetInnerHTML={{__html: "Приклад в нашій системі"}} /><th dangerouslySetInnerHTML={{__html: "Контрзахід"}} /></tr></thead><tbody><tr><td dangerouslySetInnerHTML={{__html: "Spoofing (підміна)"}} /><td dangerouslySetInnerHTML={{__html: "зловмисник видає себе за pump-01"}} /><td dangerouslySetInnerHTML={{__html: "автентифікація (пароль/сертифікат)"}} /></tr><tr><td dangerouslySetInnerHTML={{__html: "Tampering (зміна)"}} /><td dangerouslySetInnerHTML={{__html: "змінено значення вібрації «в дорозі»"}} /><td dangerouslySetInnerHTML={{__html: "TLS, підпис повідомлень"}} /></tr><tr><td dangerouslySetInnerHTML={{__html: "Repudiation (відмова)"}} /><td dangerouslySetInnerHTML={{__html: "«я не надсилав команду»"}} /><td dangerouslySetInnerHTML={{__html: "журнал, підпис"}} /></tr><tr><td dangerouslySetInnerHTML={{__html: "Information disclosure"}} /><td dangerouslySetInnerHTML={{__html: "прослуховування Wi-Fi"}} /><td dangerouslySetInnerHTML={{__html: "TLS"}} /></tr><tr><td dangerouslySetInnerHTML={{__html: "Denial of service"}} /><td dangerouslySetInnerHTML={{__html: "флуд брокера"}} /><td dangerouslySetInnerHTML={{__html: "ліміти, квоти, сегментація"}} /></tr><tr><td dangerouslySetInnerHTML={{__html: "Elevation of privilege"}} /><td dangerouslySetInnerHTML={{__html: "пристрій пише у чужий топік"}} /><td dangerouslySetInnerHTML={{__html: "ACL (мінімальні права)"}} /></tr></tbody></table></div>
      <h2 dangerouslySetInnerHTML={{__html: "4. Автентифікація й авторизація в MQTT"}} />
      <p dangerouslySetInnerHTML={{__html: "<b>Автентифікація</b>: логін/пароль (мінімум), <b>сертифікати X.509 (mTLS)</b> (краще для флоту), токени (MQTT 5 enhanced auth). <b>Авторизація (ACL)</b>: кожен клієнт — лише своє. Мінімальні права:"}} />
      <pre className="code"><code>{"user pump-01\ntopic write plant/+/+/pump-01/#\n\nuser ingest\ntopic read plant/#\n\nuser alerts\ntopic read plant/+/+/+/telemetry\ntopic write plant/+/+/+/alerts"}</code></pre>
      <p dangerouslySetInnerHTML={{__html: "Конфіг Mosquitto:"}} />
      <pre className="code"><code>{"listener 1883\nallow_anonymous false\npassword_file /mosquitto/config/passwd\nacl_file /mosquitto/config/acl"}</code></pre>
      <p dangerouslySetInnerHTML={{__html: "Створення пароля: <code>mosquitto_passwd -b passwd pump-01 &lt;пароль&gt;</code>. Для продакшену — <b>TLS на порту 8883</b> (<code>cafile</code>, <code>certfile</code>, <code>keyfile</code>), унікальні секрети на пристрій, ротація."}} />
      <div className="callout" dangerouslySetInnerHTML={{__html: "Попередження: у навчальних прикладах пароль = <code>ім'я-pw</code>. У реальній системі секрети <b>не зберігаються в коді та репозиторії</b> — лише у менеджері секретів/змінних середовища."}} />
      <h2 dangerouslySetInnerHTML={{__html: "5. Цілісність і захист від replay на рівні застосунку"}} />
      <p dangerouslySetInnerHTML={{__html: "TLS захищає канал «клієнт—брокер», але не «пристрій—споживач» наскрізно (брокер бачить усе). Додатковий шар — <b>HMAC-підпис</b> повідомлення спільним секретом:"}} />
      <p dangerouslySetInnerHTML={{__html: "<code>sig = HMAC-SHA256(secret, topic ‖ ts ‖ nonce ‖ canonical_json(payload))</code>"}} />
      <p dangerouslySetInnerHTML={{__html: "Перевірка: (1) підпис збігається (порівняння <b>сталого часу</b>, <code>hmac.compare_digest</code>); (2) <code>|now − ts| ≤ max_age</code>; (3) <code>nonce</code> не бачили в межах TTL (захист від повтору перехопленого повідомлення)."}} />
      <pre className="code"><code>{"import hmac, hashlib, json\n\ndef canon(payload):\n    return json.dumps(payload, separators=(\",\", \":\"), sort_keys=True)\n\ndef mac(secret: bytes, topic, ts, nonce, payload):\n    data = f\"{topic}\\n{ts}\\n{nonce}\\n{canon(payload)}\".encode()\n    return hmac.new(secret, data, hashlib.sha256).hexdigest()\n\nok = hmac.compare_digest(received_sig, mac(secret, topic, ts, nonce, payload))"}</code></pre>
      <p dangerouslySetInnerHTML={{__html: "Підпис включає <b>топік</b>: так повідомлення від pump-01 не можна «перекинути» у топік pump-02."}} />
      <p dangerouslySetInnerHTML={{__html: "Обмеження HMAC: спільний секрет → хто може перевірити, той може й підробити; для неспростовності потрібні асиметричні підписи (Ed25519/ECDSA)."}} />
      <h2 dangerouslySetInnerHTML={{__html: "6. Надійність і відмовостійкість"}} />
      <p dangerouslySetInnerHTML={{__html: "<b>Доступність у числах</b>: 99,9 % → ≈ 8,76 год простою на рік; 99,99 % → ≈ 52,6 хв; 99,999 % → ≈ 5,3 хв."}} />
      <p dangerouslySetInnerHTML={{__html: "<b>Патерни:</b>"}} />
      <ul><li dangerouslySetInnerHTML={{__html: "<b>Store-and-forward</b> на edge (лекція 2)."}} /><li dangerouslySetInnerHTML={{__html: "<b>Reconnect з експоненційною затримкою та джитером</b>: затримки 1, 2, 4, 8 … до стелі; джитер ±20 % розносить у часі «шторм» одночасних перепідключень після відновлення брокера."}} /><li dangerouslySetInnerHTML={{__html: "<b>Ідемпотентність</b> споживачів (QoS 1 → дублікати)."}} /><li dangerouslySetInnerHTML={{__html: "<b>Health-check</b> кожного сервісу; перезапуск за політикою (<code>restart: unless-stopped</code>)."}} /><li dangerouslySetInnerHTML={{__html: "<b>Деградація</b>: втрата аналітики не повинна зупиняти збір."}} /><li dangerouslySetInnerHTML={{__html: "<b>Резервування брокера</b>: кластер/міст (bridge) для критичних майданчиків."}} /></ul>
      <pre className="code"><code>{"import random\n\ndef backoff_delays(base=1.0, factor=2.0, cap=60.0, jitter=0.0, rng=None):\n    rng = rng or random\n    d = base\n    while True:\n        yield min(d, cap) * (1 + rng.uniform(-jitter, jitter)) if jitter else min(d, cap)\n        d = min(d * factor, cap)"}</code></pre>
      <h2 dangerouslySetInnerHTML={{__html: "7. Чек-ліст «мінімально безпечного» IIoT"}} />
      <ol><li dangerouslySetInnerHTML={{__html: "Немає анонімного доступу; унікальні облікові дані на пристрій."}} /><li dangerouslySetInnerHTML={{__html: "ACL за принципом мінімальних прав."}} /><li dangerouslySetInnerHTML={{__html: "TLS між усіма зонами."}} /><li dangerouslySetInnerHTML={{__html: "Секрети поза репозиторієм; можливість ротації."}} /><li dangerouslySetInnerHTML={{__html: "Підпис/перевірка критичних повідомлень і команд."}} /><li dangerouslySetInnerHTML={{__html: "Журнал подій безпеки; моніторинг невдалих входів."}} /><li dangerouslySetInnerHTML={{__html: "Сегментація мережі; відсутність прямого виходу пристроїв в інтернет."}} /><li dangerouslySetInnerHTML={{__html: "Процес оновлення ПЗ пристроїв."}} /></ol>
      <h2 dangerouslySetInnerHTML={{__html: "Інтерактив"}} />
      <HmacDemo />
      <Quiz questions={QUIZ.l6} />
      <p className="footer-note">Лабораторна цього тижня — ЛР6. Наступна лекція — №7.</p>
    </article>
  )
}
