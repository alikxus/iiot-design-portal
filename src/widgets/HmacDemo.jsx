import { useState } from 'react'

const enc = new TextEncoder()
const hex = (buf) => [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, '0')).join('')
const canon = (obj) => JSON.stringify(sortKeys(obj))
function sortKeys(o) {
  if (Array.isArray(o)) return o.map(sortKeys)
  if (o && typeof o === 'object') return Object.fromEntries(Object.keys(o).sort().map((k) => [k, sortKeys(o[k])]))
  return o
}

async function mac(secret, topic, ts, nonce, payload) {
  const key = await crypto.subtle.importKey('raw', enc.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign'])
  const sig = await crypto.subtle.sign('HMAC', key, enc.encode(`${topic}\n${ts}\n${nonce}\n${canon(payload)}`))
  return hex(sig)
}

export default function HmacDemo() {
  const [secret, setSecret] = useState('super-secret')
  const [topic, setTopic] = useState('plant/kyiv/line1/pump-01/telemetry')
  const [payload, setPayload] = useState('{"device_id":"pump-01","metrics":{"vibration_mm_s":1.8}}')
  const [env, setEnv] = useState(null)
  const [recvTopic, setRecvTopic] = useState('')
  const [recvPayload, setRecvPayload] = useState('')
  const [age, setAge] = useState(0)
  const [seen, setSeen] = useState([])
  const [result, setResult] = useState(null)
  const [err, setErr] = useState('')

  const sign = async () => {
    try {
      const p = JSON.parse(payload)
      const ts = Math.floor(Date.now() / 1000)
      const nonce = crypto.getRandomValues(new Uint8Array(8)).reduce((a, b) => a + b.toString(16).padStart(2, '0'), '')
      const sig = await mac(secret, topic, ts, nonce, p)
      setEnv({ payload: p, ts, nonce, sig })
      setRecvTopic(topic); setRecvPayload(JSON.stringify(p)); setSeen([]); setResult(null); setErr('')
    } catch (e) { setErr('Помилка: ' + e.message) }
  }

  const verify = async () => {
    if (!env) return
    try {
      const p = JSON.parse(recvPayload)
      const expected = await mac(secret, recvTopic, env.ts, env.nonce, p)
      if (expected !== env.sig) return setResult({ ok: false, t: 'InvalidSignature — підпис не збігається (змінено дані, топік або ключ)' })
      if (Math.abs(age) > 30) return setResult({ ok: false, t: `ExpiredError — повідомлення старше за max_age=30 с (вік ${age} с)` })
      if (seen.includes(env.nonce)) return setResult({ ok: false, t: 'ReplayError — цей nonce уже використано' })
      setSeen([...seen, env.nonce])
      setResult({ ok: true, t: 'OK — повідомлення прийнято' })
    } catch (e) { setResult({ ok: false, t: 'InvalidSignature — некоректний JSON' }) }
  }

  return (
    <div className="widget">
      <h3>Підпис HMAC-SHA256: цілісність, час, replay</h3>
      <p className="hint">Працює у вашому браузері (WebCrypto). Алгоритм збігається з <code>iiot/security.py</code>.</p>
      <div className="controls">
        <div className="field"><label>Секрет</label><input value={secret} onChange={(e) => setSecret(e.target.value)} /></div>
        <div className="field"><label>Топік</label><input value={topic} onChange={(e) => setTopic(e.target.value)} /></div>
      </div>
      <div className="field"><label>Payload (JSON)</label><textarea rows="2" value={payload} onChange={(e) => setPayload(e.target.value)} /></div>
      <button className="btn" onClick={sign}>1. Підписати</button>
      {err && <div className="verdict bad">{err}</div>}
      {env && (<>
        <pre className="code"><code>{JSON.stringify(env, null, 2)}</code></pre>
        <h3>Що отримав споживач (можна «зламати»)</h3>
        <div className="controls">
          <div className="field"><label>Топік отримання</label><input value={recvTopic} onChange={(e) => setRecvTopic(e.target.value)} /></div>
          <div className="field"><label>Вік повідомлення, с: {age}</label><input type="range" min="0" max="120" value={age} onChange={(e) => setAge(+e.target.value)} /></div>
        </div>
        <div className="field"><label>Payload отримання</label><textarea rows="2" value={recvPayload} onChange={(e) => setRecvPayload(e.target.value)} /></div>
        <button className="btn" onClick={verify}>2. Перевірити (натисніть двічі — побачите replay)</button>
        {result && <div className={`verdict ${result.ok ? 'ok' : 'bad'}`}>{result.t}</div>}
        <p className="hint">Спробуйте: змінити значення в payload, змінити топік, посунути «вік» за 30 с, перевірити двічі поспіль.</p>
      </>)}
    </div>
  )
}
