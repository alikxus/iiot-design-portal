import { useState } from 'react'

const fmt = (x) => Math.round(x).toLocaleString('uk-UA')

export default function TcoCalculator() {
  const [n, setN] = useState(20)
  const [sensor, setSensor] = useState(12000)
  const [gw, setGw] = useState(25000)
  const [integr, setIntegr] = useState(250000)
  const [infra, setInfra] = useState(60000)
  const [support, setSupport] = useState(120000)
  const [years, setYears] = useState(5)
  const [hours, setHours] = useState(3)
  const [cost, setCost] = useState(150000)
  const [repair, setRepair] = useState(150000)

  const capex = n * sensor + Math.ceil(n / 10) * gw + integr
  const opexYear = infra + support
  const tco = capex + opexYear * years
  const effect = hours * cost + repair
  const payback = effect > opexYear ? capex / (effect - opexYear) : null

  const f = (label, v, set) => (
    <div className="field"><label>{label}</label><input type="number" min="0" value={v} onChange={(e) => set(+e.target.value || 0)} /></div>
  )
  return (
    <div className="widget">
      <h3>TCO та термін окупності пілотного проєкту (грн)</h3>
      <div className="controls">
        {f('Агрегатів', n, setN)}{f('Комплект датчиків на агрегат', sensor, setSensor)}{f('Шлюз (1 на 10 агрегатів)', gw, setGw)}
        {f('Інтеграція та розробка', integr, setIntegr)}{f('Інфраструктура, на рік', infra, setInfra)}{f('Супровід, на рік', support, setSupport)}
        {f('Строк оцінки, років', years, setYears)}{f('Уникнені простої, год/рік', hours, setHours)}{f('Вартість години простою', cost, setCost)}
        {f('Заощадження на аварійних ремонтах, на рік', repair, setRepair)}
      </div>
      <table className="data"><tbody>
        <tr><th>CAPEX</th><td>{fmt(capex)}</td></tr>
        <tr><th>OPEX, на рік</th><td>{fmt(opexYear)}</td></tr>
        <tr><th>TCO за {years} р.</th><td>{fmt(tco)}</td></tr>
        <tr><th>Річний ефект</th><td>{fmt(effect)}</td></tr>
        <tr><th>Термін окупності</th><td>{payback === null ? 'не окупається за таких припущень' : `${payback.toFixed(1)} р.`}</td></tr>
      </tbody></table>
      <p className="hint">Числа за замовчуванням умовні. Завжди показуйте припущення окремо від результату. Окупність = CAPEX / (річний ефект − OPEX).</p>
    </div>
  )
}
