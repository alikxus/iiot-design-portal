import { useState } from 'react'

const fmt = (x) => x.toLocaleString('uk-UA', { maximumFractionDigits: 1 })

export default function SizingCalculator() {
  const [devices, setDevices] = useState(100)
  const [metrics, setMetrics] = useState(4)
  const [period, setPeriod] = useState(1)
  const [bytes, setBytes] = useState(40)
  const [rawDays, setRawDays] = useState(14)

  const perDayMsg = devices * (86400 / period)
  const perDayRows = perDayMsg * metrics
  const gbDay = (perDayRows * bytes) / 1e9
  const gbYear = gbDay * 365
  const gbRetained = gbDay * rawDays
  // хвилинні агрегати: 1440 відер/добу * пристрої * метрики * ~56 байт
  const aggYear = (1440 * devices * metrics * 56 * 365) / 1e9

  const num = (label, v, set, min = 1) => (
    <div className="field"><label>{label}</label>
      <input type="number" min={min} value={v} onChange={(e) => set(Math.max(min, +e.target.value || min))} /></div>
  )

  return (
    <div className="widget">
      <h3>Оцінка обсягів даних (довга схема)</h3>
      <div className="controls">
        {num('Кількість пристроїв', devices, setDevices)}
        {num('Метрик на пристрій', metrics, setMetrics)}
        {num('Період, с', period, setPeriod)}
        {num('Байт на рядок (з індексом)', bytes, setBytes)}
        {num('Зберігання сирих, діб', rawDays, setRawDays)}
      </div>
      <table className="data"><tbody>
        <tr><th>Повідомлень на добу</th><td>{fmt(perDayMsg)}</td></tr>
        <tr><th>Рядків на добу</th><td>{fmt(perDayRows)}</td></tr>
        <tr><th>Сирі дані, ГБ/добу</th><td>{fmt(gbDay)}</td></tr>
        <tr><th>Сирі дані за рік без retention, ГБ</th><td>{fmt(gbYear)}</td></tr>
        <tr><th>Сирі дані при retention {rawDays} діб, ГБ</th><td>{fmt(gbRetained)}</td></tr>
        <tr><th>Хвилинні агрегати за рік, ГБ</th><td>{fmt(aggYear)}</td></tr>
      </tbody></table>
      <p className="hint">Оцінка наближена: реальний розмір залежить від СУБД, індексів і стиснення. Хвилинні агрегати — припущення ≈ 56 байт на рядок.</p>
    </div>
  )
}
