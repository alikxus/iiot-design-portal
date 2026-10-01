import { useState } from 'react'

const LAYERS = [
  { id: 'device', name: 'Device / ПЛК', lat: 'мс', tasks: 'вимірювання, контур регулювання, первинна фільтрація', ex: 'ПЛК зупиняє насос при аварійному тиску' },
  { id: 'edge', name: 'Edge', lat: '10–100 мс', tasks: 'трансляція протоколів, буферизація, локальні правила й ML', ex: 'шлюз з буфером і правилом вібрації' },
  { id: 'fog', name: 'Fog / on-prem', lat: '0,1–1 с', tasks: 'збереження, дашборди, інтеграція з MES/SCADA', ex: 'сервер підприємства з TSDB та Grafana' },
  { id: 'cloud', name: 'Cloud', lat: 'кілька с', tasks: 'довгостроковий архів, навчання моделей, аналітика парку майданчиків', ex: 'порівняння 50 станцій, перенавчання моделі RUL' },
]

function recommend(ms) {
  if (ms <= 20) return 'device'
  if (ms <= 200) return 'edge'
  if (ms <= 2000) return 'fog'
  return 'cloud'
}

export default function LayersExplorer() {
  const [sel, setSel] = useState('edge')
  const [ms, setMs] = useState(50)
  const L = LAYERS.find((x) => x.id === sel)
  const rec = recommend(ms)

  return (
    <div className="widget">
      <h3>Де обробляти дані: Device / Edge / Fog / Cloud</h3>
      <div className="tabs">
        {LAYERS.map((l) => (
          <button key={l.id} className={`tab ${sel === l.id ? 'active' : ''}`} onClick={() => setSel(l.id)}>{l.name}</button>
        ))}
      </div>
      <p><b>Затримка:</b> {L.lat}</p>
      <p><b>Типові задачі:</b> {L.tasks}</p>
      <p><b>Приклад:</b> {L.ex}</p>

      <div className="field" style={{ marginTop: 14 }}>
        <label>Потрібен час реакції: {ms} мс</label>
        <input type="range" min="1" max="5000" value={ms} onChange={(e) => setMs(+e.target.value)} />
      </div>
      <div className="verdict ok">
        Для такої вимоги обробку краще розміщувати на шарі: <b>{LAYERS.find((x) => x.id === rec).name}</b>
      </div>
      <p className="hint">Спрощене правило: чим жорсткіша вимога до затримки й автономності, тим ближче до джерела. Для великих обсягів сирих даних — також ближче до джерела.</p>
    </div>
  )
}
