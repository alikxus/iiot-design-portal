import { useMemo, useState } from 'react'

function rng(seed) { // детермінований генератор
  let s = seed >>> 0
  return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296 }
}
function gauss(r) { return Math.sqrt(-2 * Math.log(r() + 1e-12)) * Math.cos(2 * Math.PI * r()) }

function series(n, rate, accel) {
  const r = rng(7)
  return Array.from({ length: n }, (_, t) => {
    const wear = Math.min(1, rate * t * (1 + accel * (t / n)))
    return 1.8 + 6 * wear + gauss(r) * 0.15
  })
}

function trend(ts, vs) {
  const n = ts.length
  const mt = ts.reduce((a, b) => a + b, 0) / n
  const mv = vs.reduce((a, b) => a + b, 0) / n
  const sxx = ts.reduce((a, t) => a + (t - mt) ** 2, 0)
  const slope = sxx ? ts.reduce((a, t, i) => a + (t - mt) * (vs[i] - mv), 0) / sxx : 0
  return { slope, icpt: mv - slope * mt }
}

export default function RulEstimator() {
  const [rate, setRate] = useState(0.001)
  const [accel, setAccel] = useState(0)
  const [win, setWin] = useState(100)
  const [alpha, setAlpha] = useState(0.2)
  const [now, setNow] = useState(400)
  const LIMIT = 4.5
  const N = 600

  const data = useMemo(() => series(N, rate, accel), [rate, accel])
  const smooth = useMemo(() => { let s = null; return data.map((v) => (s = s === null ? v : alpha * v + (1 - alpha) * s)) }, [data, alpha])

  const from = Math.max(0, now - win)
  const ts = Array.from({ length: now - from }, (_, i) => from + i)
  const { slope, icpt } = trend(ts, data.slice(from, now))
  const cross = slope > 1e-9 ? (LIMIT - icpt) / slope : null
  const rul = cross === null ? null : Math.max(0, cross - now)
  const actual = data.findIndex((v) => v >= LIMIT)

  const W = 640, H = 220, P = 28
  const x = (t) => P + (t / (N - 1)) * (W - 2 * P)
  const y = (v) => H - P - ((v - 0) / 10) * (H - 2 * P)
  const path = (arr) => arr.map((v, i) => `${i ? 'L' : 'M'}${x(i).toFixed(1)},${y(Math.min(v, 10)).toFixed(1)}`).join('')

  return (
    <div className="widget">
      <h3>Тренд вібрації та оцінка залишкового ресурсу (RUL)</h3>
      <div className="controls">
        <div className="field"><label>Швидкість зносу: {rate}</label><input type="range" min="0.0004" max="0.002" step="0.0001" value={rate} onChange={(e) => setRate(+e.target.value)} /></div>
        <div className="field"><label>Прискорення деградації: {accel}</label><input type="range" min="0" max="2" step="0.1" value={accel} onChange={(e) => setAccel(+e.target.value)} /></div>
        <div className="field"><label>Вікно регресії: {win} точок</label><input type="range" min="20" max="300" step="10" value={win} onChange={(e) => setWin(+e.target.value)} /></div>
        <div className="field"><label>α EWMA: {alpha}</label><input type="range" min="0.05" max="1" step="0.05" value={alpha} onChange={(e) => setAlpha(+e.target.value)} /></div>
        <div className="field"><label>Поточний момент t = {now}</label><input type="range" min="60" max="590" step="10" value={now} onChange={(e) => setNow(+e.target.value)} /></div>
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} className="sim-chart" style={{ height: 'auto' }}>
        <line x1={P} x2={W - P} y1={y(LIMIT)} y2={y(LIMIT)} stroke="#c0392b" strokeDasharray="5 4" />
        <text x={W - P} y={y(LIMIT) - 4} fontSize="11" textAnchor="end" fill="#c0392b">межа {LIMIT} мм/с</text>
        <path d={path(data)} fill="none" stroke="#9aa8bd" strokeWidth="1" />
        <path d={path(smooth)} fill="none" stroke="#0a5f9c" strokeWidth="2" />
        <line x1={x(now)} x2={x(now)} y1={P / 2} y2={H - P} stroke="#e8a13a" />
        {slope > 1e-9 && <line x1={x(from)} y1={y(icpt + slope * from)} x2={x(Math.min(cross, N - 1))} y2={y(Math.min(icpt + slope * Math.min(cross, N - 1), 10))} stroke="#0e7a5f" strokeWidth="2" strokeDasharray="6 3" />}
      </svg>
      <div className="legend"><span style={{ color: '#9aa8bd' }}>сирий сигнал</span><span style={{ color: '#0a5f9c' }}>EWMA</span><span style={{ color: '#0e7a5f' }}>лінійний прогноз</span><span style={{ color: '#e8a13a' }}>зараз</span></div>
      <div className="verdict ok">
        Оцінка RUL: <b>{rul === null ? 'тренду до межі немає' : `${Math.round(rul)} кроків`}</b>
        {actual >= 0 && <> · фактичний перетин межі: t = <b>{actual}</b>{actual > now ? ` (залишилось ${actual - now})` : ' (вже відбувся)'}</>}
      </div>
      <p className="hint">Збільшіть «прискорення деградації» — лінійна оцінка стане оптимістичною: реальна межа настає раніше, ніж обіцяє пряма.</p>
    </div>
  )
}
