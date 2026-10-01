import { useEffect, useState } from 'react'
import Lecture01 from './lectures/Lecture01.jsx'
import Lecture02 from './lectures/Lecture02.jsx'
import Lecture03 from './lectures/Lecture03.jsx'
import Lecture04 from './lectures/Lecture04.jsx'
import Lecture05 from './lectures/Lecture05.jsx'
import Lecture06 from './lectures/Lecture06.jsx'
import Lecture07 from './lectures/Lecture07.jsx'
import Lab01 from './labs/Lab01.jsx'
import Lab02 from './labs/Lab02.jsx'
import Lab03 from './labs/Lab03.jsx'
import Lab04 from './labs/Lab04.jsx'
import Lab05 from './labs/Lab05.jsx'
import Lab06 from './labs/Lab06.jsx'
import Lab07 from './labs/Lab07.jsx'

const CONTENT = {
  l1: Lecture01, l2: Lecture02, l3: Lecture03, l4: Lecture04, l5: Lecture05, l6: Lecture06, l7: Lecture07,
  lr1: Lab01, lr2: Lab02, lr3: Lab03, lr4: Lab04, lr5: Lab05, lr6: Lab06, lr7: Lab07,
}

const LECTURES = [
  { id: 'l1', n: 1, title: 'Архітектура IIoT та вимоги' },
  { id: 'l2', n: 2, title: 'Протоколи IIoT та edge-шлюзи' },
  { id: 'l3', n: 3, title: 'Збереження телеметрії' },
  { id: 'l4', n: 4, title: 'Моніторинг і сповіщення' },
  { id: 'l5', n: 5, title: 'Цифровий двійник, предиктивне обслуговування' },
  { id: 'l6', n: 6, title: 'Кібербезпека та надійність' },
  { id: 'l7', n: 7, title: 'Розгортання, документація, TCO' },
]

const LABS = [
  { id: 'lr1', n: 1, title: 'ТЗ та симулятор насоса' },
  { id: 'lr2', n: 2, title: 'Edge-шлюз: MQTT, LWT, буфер' },
  { id: 'lr3', n: 3, title: 'SQLite, агрегація, retention' },
  { id: 'lr4', n: 4, title: 'Рушій сповіщень' },
  { id: 'lr5', n: 5, title: 'Аномалії та RUL' },
  { id: 'lr6', n: 6, title: 'Безпека конвеєра' },
  { id: 'lr7', n: 7, title: 'Інтеграція та захист проєкту' },
]

const fromHash = () => {
  const h = window.location.hash.replace('#', '')
  return CONTENT[h] ? h : 'l1'
}

export default function App() {
  const [active, setActive] = useState(fromHash)
  const Active = CONTENT[active]

  useEffect(() => {
    const on = () => setActive(fromHash())
    window.addEventListener('hashchange', on)
    return () => window.removeEventListener('hashchange', on)
  }, [])

  const go = (id) => {
    window.location.hash = id
    setActive(id)
    window.scrollTo(0, 0)
  }

  const group = (title, items, prefix) => (
    <div className="nav-group">
      <h4>{title}</h4>
      {items.map((l) => (
        <button key={l.id} className={`nav-item ${active === l.id ? 'active' : ''}`} onClick={() => go(l.id)}>
          <span className="num">{prefix}{l.n}</span>{l.title}
        </button>
      ))}
    </div>
  )

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="brand">
          <span className="brand-title">Проєктування індустріальних інтернет речей</span>
          <ul className="specs">
            <li><span className="spec-code">174</span> · 3 курс · 7 тижнів</li>
          </ul>
        </div>
        {group('Лекції', LECTURES, 'Л')}
        {group('Лабораторні', LABS, 'ЛР')}
      </aside>
      <main className="content">{Active && <Active />}</main>
    </div>
  )
}
