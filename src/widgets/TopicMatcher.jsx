import { useMemo, useState } from 'react'

const TOPICS = [
  'plant/kyiv/line1/pump-01/telemetry',
  'plant/kyiv/line1/pump-01/status',
  'plant/kyiv/line1/pump-02/telemetry',
  'plant/kyiv/line2/pump-03/telemetry',
  'plant/lviv/line1/pump-01/alerts',
  'plant/kyiv/line1/pump-01/cmd',
]

function matches(filter, topic) {
  const f = filter.split('/')
  const t = topic.split('/')
  for (let i = 0; i < f.length; i++) {
    if (f[i] === '#') return i === f.length - 1
    if (i >= t.length) return false
    if (f[i] === '+') continue
    if (f[i] !== t[i]) return false
  }
  return f.length === t.length
}

const PRESETS = ['plant/+/+/+/telemetry', 'plant/kyiv/#', 'plant/+/+/pump-01/#', 'plant/+/+/+/alerts']

export default function TopicMatcher() {
  const [filter, setFilter] = useState(PRESETS[0])
  const rows = useMemo(() => TOPICS.map((t) => ({ t, ok: matches(filter, t) })), [filter])
  return (
    <div className="widget">
      <h3>Підписка MQTT на простір топіків IIoT</h3>
      <p className="hint"><code>+</code> — рівно один рівень; <code>#</code> — решта, лише в кінці. Так працюють підписки ingest-сервісу (<code>plant/+/+/+/telemetry</code>) та ACL.</p>
      <div className="tabs">
        {PRESETS.map((p) => <button key={p} className={`tab ${filter === p ? 'active' : ''}`} onClick={() => setFilter(p)}>{p}</button>)}
      </div>
      <div className="field">
        <label>Фільтр підписки</label>
        <input value={filter} onChange={(e) => setFilter(e.target.value)} />
      </div>
      <div style={{ marginTop: 12 }}>
        {rows.map((r) => <div key={r.t} className={`topic-row ${r.ok ? 'match' : 'nomatch'}`}>{r.ok ? '✅' : '—'} {r.t}</div>)}
      </div>
    </div>
  )
}
