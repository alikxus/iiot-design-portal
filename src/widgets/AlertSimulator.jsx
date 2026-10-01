import { useMemo, useState } from 'react'

// Той самий алгоритм, що й в iiot/alerts.py
function run(values, high, hyst, debounce) {
  let active = false
  let count = 0
  return values.map((v) => {
    let event = null
    if (!active) {
      count = v > high ? count + 1 : 0
      if (count >= debounce) { active = true; count = 0; event = 'raised' }
    } else if (v < high - hyst) {
      active = false
      event = 'cleared'
    }
    return { v, count, active, event }
  })
}

const PRESET = '4.4, 4.6, 4.4, 4.6, 4.8, 4.9, 4.4, 4.2, 3.9'

export default function AlertSimulator() {
  const [text, setText] = useState(PRESET)
  const [high, setHigh] = useState(4.5)
  const [hyst, setHyst] = useState(0.5)
  const [deb, setDeb] = useState(3)

  const values = useMemo(() => text.split(/[\s,;]+/).map(Number).filter((x) => Number.isFinite(x) && x === x), [text])
  const rows = useMemo(() => run(values, high, hyst, deb), [values, high, hyst, deb])
  const naive = useMemo(() => run(values, high, 0, 1).filter((r) => r.event).length, [values, high])
  const smart = rows.filter((r) => r.event).length

  return (
    <div className="widget">
      <h3>Симулятор правила: поріг, гістерезис, debounce</h3>
      <div className="field"><label>Послідовність вимірів (через кому)</label>
        <textarea rows="2" value={text} onChange={(e) => setText(e.target.value)} /></div>
      <div className="controls">
        <div className="field"><label>Поріг high</label><input type="number" step="0.1" value={high} onChange={(e) => setHigh(+e.target.value)} /></div>
        <div className="field"><label>Гістерезис</label><input type="number" step="0.1" min="0" value={hyst} onChange={(e) => setHyst(Math.max(0, +e.target.value))} /></div>
        <div className="field"><label>Debounce (вимірів поспіль)</label><input type="number" min="1" value={deb} onChange={(e) => setDeb(Math.max(1, +e.target.value || 1))} /></div>
      </div>
      <div className="resp"><table className="data">
        <thead><tr><th>#</th><th>Значення</th><th>Лічильник</th><th>Активне</th><th>Подія</th></tr></thead>
        <tbody>{rows.map((r, i) => (
          <tr key={i} className={r.event ? `ev-${r.event}` : ''}>
            <td>{i + 1}</td><td>{r.v}</td><td>{r.count}</td><td>{r.active ? 'так' : 'ні'}</td><td>{r.event || ''}</td>
          </tr>))}</tbody>
      </table></div>
      <div className="verdict ok">Переходів з вашими параметрами: <b>{smart}</b>; без захисту (debounce=1, гістерезис=0): <b>{naive}</b>.</div>
    </div>
  )
}
