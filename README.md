# Проєктування індустріальних інтернет речей — інтерактивний портал

Інтерактивний навчальний портал до курсу для спеціальності 174, 3 курс (React + Vite).
Матеріали курсу та автотести лабораторних: репозиторій `iiot-design-kurs-template` (публічний шаблон для студентів).

## Структура
```
content/        markdown-джерела лекцій і лабораторних (єдине джерело правди)
scripts/gen.py  генерує src/lectures/*.jsx та src/labs/*.jsx із content/*.md
src/
├── App.jsx, quizzes.js, components/Quiz.jsx
├── lectures/ (7), labs/ (7)    # генеруються
└── widgets/
    ├── LayersExplorer.jsx   Device/Edge/Fog/Cloud та вибір шару за затримкою (Л1)
    ├── TopicMatcher.jsx     підписки MQTT на простір топіків plant/... (Л2)
    ├── SizingCalculator.jsx оцінка обсягів часових рядів (Л3)
    ├── AlertSimulator.jsx   поріг, гістерезис, debounce (Л4)
    ├── RulEstimator.jsx     EWMA, лінійний тренд і RUL (Л5)
    ├── HmacDemo.jsx         підпис HMAC, tamper/expired/replay (Л6)
    └── TcoCalculator.jsx    TCO та термін окупності (Л7)
```

## Розробка
```bash
npm install
npm run gen      # після змін у content/*.md
npm run dev
npm run build
```
Розгортання: збірка `dist/` публікується у гілку `gh-pages` (Settings → Pages → Source: *Deploy from a branch* → `gh-pages` / root).
Для автоматичного деплою на кожен push скопіюйте `deploy.yml.example` у `.github/workflows/deploy.yml` (через веб-інтерфейс GitHub або токеном зі scope `workflow`) і оберіть у Pages джерело *GitHub Actions*.
