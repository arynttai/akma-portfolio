import {asset} from '@/lib/base'
export type Provenance = 'live' | 'demo' | 'local' | 'materials' | 'concept' | 'recon' | 'photo'
export const provenanceText: Record<Provenance, string> = {
  live: 'Public page of the live product',
  demo: 'Real product, public demo mode with demo data',
  local: 'Real app, run locally',
  materials: 'From project materials',
  concept: 'Concept illustration',
  recon: 'Recreated from the source code with demo data, not a screenshot',
  photo: 'Real photo'
}

export type Shot = {src: string; alt: string; w: number; h: number; device: 'laptop' | 'phone' | 'photo'; label: string; source: Provenance}
export type LinkOut = {label: string; href: string; note?: string}

export type Project = {
  id: string
  name: string
  kicker: string
  year: string
  accent: 'sky' | 'mint' | 'butter' | 'cherry' | 'lilac' | 'peach'
  tile: 'wide' | 'tall' | 'square'
  oneLiner: string
  what: string
  mine: string[]
  spark: string
  stack: string[]
  shots: Shot[]
  links: LinkOut[]
  team?: string
  demo?: 'room' | 'attendance' | 'arnaai'
  linksNote?: string
}

const d = (src: string, alt: string, label: string, source: Provenance): Shot => ({src, alt, w: 1440, h: 900, device: 'laptop', label, source})
const g = (src: string, alt: string, label: string, h: number): Shot => ({src, alt, w: 1268, h, device: 'laptop', label, source: 'materials'})
const m = (src: string, alt: string, label: string, source: Provenance, h = 1298, w = 600): Shot => ({src, alt, w, h, device: 'phone', label, source})

export const projects: Project[] = [
  {
    id: 'attendance', name: 'Attendance Control', kicker: 'University app', year: '2024 – 25', accent: 'cherry', tile: 'tall',
    oneLiner: 'Roll call without paper: scan the room’s QR, type the lesson PIN, done.',
    what: 'A cross-platform .NET MAUI app for Astana IT University. Teachers open a lesson, students prove they are in the room, everyone gets statistics.',
    mine: [
      'Built the app, the PostgreSQL model and the QR + PIN verification flow.',
      'Worked with the university administration and rolled it into the teaching process.'
    ],
    spark: 'The QR proves the room, a short PIN proves the moment. The CV version adds geolocation; the code I reviewed uses QR, PIN and campus Wi-Fi.',
    stack: ['.NET MAUI', 'C#', 'PostgreSQL', 'ZXing'],
    demo: 'attendance',
    shots: [
      m(asset('/media/work/attendance-signin.webp'), 'Attendance Control sign-in with the Astana IT University logo and a teacher or student switch', 'Sign-in', 'recon'),
      m(asset('/media/work/attendance-lesson.webp'), 'Teacher view of an open lesson with the room QR code and a four-digit PIN', 'Teacher: open lesson', 'recon'),
      m(asset('/media/work/attendance-checkin.webp'), 'Student check-in after scanning the room code, entering the lesson PIN', 'Student: check in', 'recon'),
      m(asset('/media/work/attendance-stats.webp'), 'Attendance statistics with a weekly line chart and a present, late and absent donut', 'Statistics', 'recon')
    ],
    links: []
  },
  {
    id: 'zheztyrnak', name: 'Zheztyrnak', kicker: 'Unity horror game', year: '2024', accent: 'lilac', tile: 'square',
    oneLiner: 'A night village, a flashlight and five runes before Zheztyrnak finds you.',
    what: 'A first-person horror game in Unity built around Zheztyrnak, the copper-clawed witch from Kazakh folklore. You walk through a dark aul and the forest behind it with a flashlight and collect five runes.',
    mine: [
      'Built the location: the terrain, the village houses, the overgrown yards and the forest edge.',
      'Laid out the map so the five runes sit along one route through the village and the forest.',
      'Tuned the night: dark scenes, cold window light and grass thick enough to hide things.'
    ],
    spark: 'Most of the fear comes from the map: tall weeds right at eye level, a flashlight circle and lit windows you never reach.',
    stack: ['Unity', 'C#', 'Terrain tools'],
    team: 'Team project. My part was the location and the map.',
    linksNote: 'No public build here. The screens are from the game itself.',
    shots: [
      g(asset('/media/work/zhez-house.webp'), 'Night village yard in the flashlight beam, a house with lit blue windows and the line about finding all five runes', 'The village', 636),
      g(asset('/media/work/zhez-forest.webp'), 'Dark pine forest at the edge of the village with one lit window far away', 'Forest edge', 639),
      g(asset('/media/work/zhez-rune.webp'), 'A carved rune stone in tall grass under the flashlight', 'Rune in the grass', 642),
      g(asset('/media/work/zhez-monster.webp'), 'Zheztyrnak jump scare: a pale creature with a wide toothed mouth', 'Zheztyrnak', 644),
      {src: asset('/media/work/zhez-buildnight.webp'), alt: 'Late night in bed with a laptop open on the Unity terrain editor', w: 960, h: 1280, device: 'photo', label: 'Building the map at night', source: 'photo'}
    ],
    links: []
  },
  {
    id: 'myroom', name: 'MyRoom', kicker: 'Panorama → 3D room', year: '2025', accent: 'peach', tile: 'square',
    oneLiner: 'Take one 360° photo of your room. Get a 3D room you can orbit and furnish.',
    what: 'A FastAPI + React app: a layout network reads the room’s shape from a panorama, Python turns it into geometry, and React Three Fiber renders it in the browser.',
    mine: [
      'FastAPI backend with uploads and background tasks.',
      'Pipeline from HorizonNet / DMH-Net output to room.json (floor polygon + height) and an OBJ mesh.',
      'Rule-based furniture placement (centroid, longest wall) and the React Three Fiber viewer.'
    ],
    spark: 'The AI half and the 3D half only share a tiny file: corners in metres and one height. Try it below with the repo’s real data.',
    stack: ['FastAPI', 'Python', 'HorizonNet / DMH-Net', 'React', 'React Three Fiber'],
    demo: 'room',
    shots: [{src: asset('/media/work/myroom-panorama-2k.webp'), alt: 'Equirectangular 360° panorama of an empty room with a window', w: 2048, h: 1024, device: 'laptop', label: 'Sample input panorama from the repo', source: 'materials'}],
    links: [{label: 'GitHub', href: 'https://github.com/arynttai/myroom'}]
  },
  {
    id: 'arnasmart', name: 'ArnaSmart', kicker: 'IoT metering + AI assistant', year: '2026', accent: 'sky', tile: 'wide',
    oneLiner: 'Smart water, gas and heat metering for utilities, with an AI assistant that answers questions about the devices.',
    what: 'ArnaSmart is Freedom Satellite’s IoT platform for utility meters on LoRaWAN and NB-IoT. Operators manage cities, buildings, apartments and devices on a map and react to alarms.',
    mine: [
      'ArnaAI: an assistant on a local LLM (Ollama) with a knowledge base built from the docs, language detection, intent resolution and a chat that knows device telemetry and alarms.',
      'The ArnaAI mascot panel: presets, hints, resizing, and docking on mobile so it never blocks scrolling.',
      'The map on MapLibre: clustering, filters, popups with device details and address search.',
      'Real-time alarms over WebSocket: a badge with unaccepted alarms and accepting them in bulk.',
      'NestJS endpoints for meters, modems, telemetry and water balance, the city → district → building hierarchy, and reports filtered by address.',
      'System admin: user import from Excel, daily backups, CRUD logs and a forced password change.',
      'Mobile layout and light / dark theme tokens for the Angular client.'
    ],
    spark: 'The assistant answers from the product’s own documentation, chunked and indexed, and logs response time for every reply. Reporter shows those logs to the team.',
    stack: ['Angular 20', 'NestJS', 'MongoDB', 'Ollama LLM', 'MQTT', 'MapLibre'],
    team: 'Team product at Freedom Cloud Holding Ltd. About 300 of my commits, Apr–Sep 2026.',
    demo: 'arnaai',
    shots: [
      d(asset('/media/work/arnasmart-map.webp'), 'ArnaSmart map with object tree, meter clusters and the ArnaAI panel with analytic presets', 'Map + ArnaAI presets', 'recon'),
      d(asset('/media/work/arnasmart-chat.webp'), 'ArnaSmart device table with the ArnaAI chat answering which meters are offline', 'Devices + ArnaAI chat', 'recon'),
      d(asset('/media/work/arnasmart-login.webp'), 'ArnaSmart sign-in page with a green planet horizon and the ARNA SMART logo', 'Sign-in, arnasmart.astel.kz', 'live'),
      m(asset('/media/work/arnasmart-mobile-m.webp'), 'ArnaSmart mobile map with the ArnaAI mascot docked in the corner', 'Mobile + docked mascot', 'recon'),
      m(asset('/media/work/tools-tasks-m.webp'), 'Arna Tools installer app with a list of installation tasks and progress', 'Arna Tools installer', 'recon'),
      m(asset('/media/work/arnasmart-login-m.webp'), 'ArnaSmart sign-in page on a phone', 'Mobile sign-in', 'live')
    ],
    links: [{label: 'arnasmart.astel.kz', href: 'https://arnasmart.astel.kz', note: 'Sign-in only'}]
  },
  {
    id: 'djailay', name: 'Digital Jailay', kicker: 'Livestock tracking (AgroLink)', year: '2026', accent: 'mint', tile: 'wide',
    oneLiner: 'Where are my horses? GPS collars, pastures, a heatmap of where the herd grazes, and a Telegram bot for alerts.',
    what: 'Digital Jailay (internally AgroLink) helps farmers track animals with GPS collars: a farm dashboard, pasture boundaries, a grazing heatmap, animal cards and alerts for lost signal or low battery.',
    mine: [
      'The grazing heatmap with a legend, and the map with base layers, the user’s location and last known points.',
      'Animals: cards, forms with photos and weight, tasks, tracking on the map and attention filters.',
      'Pastures and geo fences: drawing, editing and deleting them on the map.',
      'Telegram: web-app login with one-time codes, alert delivery, and a bot monitoring module with heartbeat and audit logs.',
      'Push notifications with Firebase, and a Bluetooth GATT bridge on Android for the Flutter app.',
      'The public demo mode: seeded users and animals, sessions and access guards.'
    ],
    spark: 'A farmer can log in from Telegram with a one-time code and get collar alerts there, without installing anything new.',
    stack: ['Angular 22', 'NestJS', 'MongoDB', 'Flutter', 'Android BLE', 'Firebase', 'MapLibre', 'Telegram Bot API'],
    team: 'Team product at Freedom Cloud Holding Ltd. About 75 of my commits, Sep–Nov 2026.',
    shots: [
      d(asset('/media/work/djailay-map.webp'), 'Digital Jailay map with pasture polygons and animal markers on satellite imagery', 'Pastures and animals', 'demo'),
      d(asset('/media/work/djailay-heatmap.webp'), 'Digital Jailay grazing heatmap over pastures', 'Grazing heatmap', 'demo'),
      d(asset('/media/work/djailay-home.webp'), 'Digital Jailay farm dashboard with cards for animals without signal, without coordinates and with low battery', 'Farm dashboard', 'demo'),
      d(asset('/media/work/djailay-animals.webp'), 'Digital Jailay animal list with collar IDs', 'Animals', 'demo'),
      m(asset('/media/work/djailay-home-m.webp'), 'Digital Jailay farm dashboard on a phone', 'Mobile dashboard', 'demo'),
      m(asset('/media/work/djailay-map-m.webp'), 'Digital Jailay map on a phone', 'Mobile map', 'demo')
    ],
    links: [{label: 'djailay.astel.kz', href: 'https://djailay.astel.kz', note: 'Has a public demo: “Войти в demo”'}]
  },
  {
    id: 'arnalight', name: 'ArnaLight', kicker: 'Smart street lighting', year: '2026', accent: 'butter', tile: 'tall',
    oneLiner: 'Street-light cabinets, lines and 300 luminaires on one map, with schedules, commands and alarms.',
    what: 'ArnaLight controls city street lighting: cabinets (ШУНО), lighting lines and luminaires, power consumption, schedules, a command log and alarms. The public demo runs on demonstration data.',
    mine: [
      'Part of the same Freedom Cloud Holding Ltd. product family. The git history I reviewed does not show my commits here, so I show it as a team product.'
    ],
    spark: 'The API is honest about hardware: a write confirms the protocol response, never the physical state of a lamp.',
    stack: ['Angular 22', 'NestJS', 'MongoDB', 'Modbus RTU', 'TCP / LTE'],
    team: 'Team product. My exact role here is not confirmed in git.',
    shots: [
      d(asset('/media/work/arnalight-dashboard.webp'), 'ArnaLight control panel with cabinet, luminaire and alarm counters', 'Control panel', 'demo'),
      d(asset('/media/work/arnalight-map.webp'), 'ArnaLight map of a city with cabinet markers', 'Map', 'demo'),
      d(asset('/media/work/arnalight-cabinet.webp'), 'ArnaLight cabinet page with voltage, current and power measurements', 'Cabinet', 'demo'),
      d(asset('/media/work/arnalight-schedules.webp'), 'ArnaLight lighting schedules', 'Schedules', 'demo'),
      m(asset('/media/work/arnalight-dashboard-m.webp'), 'ArnaLight control panel on a phone', 'Mobile panel', 'demo'),
      m(asset('/media/work/arnalight-map-m.webp'), 'ArnaLight map on a phone', 'Mobile map', 'demo')
    ],
    links: [{label: 'testiot.astel.kz', href: 'https://testiot.astel.kz', note: 'Test environment, press “Демо”'}]
  },
  {
    id: 'reporter', name: 'Reporter', kicker: 'Ops console for IoT products', year: '2026', accent: 'lilac', tile: 'square',
    oneLiner: 'The team’s back office: who gets which alert in Telegram, what the AI said, and which import went wrong.',
    what: 'Reporter is the internal console around ArnaSmart, Digital Jailay and the lighting product: user activity, CRUD logs, reports, Telegram alert routing and AI chat logs.',
    mine: [
      'Telegram management: alerts, actions and subscribers, with role rules and alert restoration.',
      'Geocoding: a worker that cleans up addresses, finds coordinates inside Kazakhstan and lets you fix them by hand on a MapLibre map.',
      'Integration monitoring: last sent and failed data per user, colour-coded, with search and sorting.',
      'Logs: AI chat logs with response time, CRUD and action logs, Digital Jailay Telegram logs.',
      'Deleted-user backups with restore, and import job reports in CSV and XLSX.',
      'Mobile layout and the light / dark theme.'
    ],
    spark: 'Addresses arrive in any shape. The geocoder normalises them, groups devices by address and keeps only results inside Kazakhstan.',
    stack: ['Angular 19', 'Express 5', 'MongoDB', 'MapLibre', 'Telegram Bot API'],
    team: 'Internal team tool. About 135 of my commits, Apr–Nov 2026.',
    shots: [
      d(asset('/media/work/reporter-telegram.webp'), 'Reporter Telegram management: alert types, sources, subscribers and on/off status', 'Telegram management', 'recon'),
      d(asset('/media/work/reporter-ailogs.webp'), 'Reporter AI request logs with average response time and an open conversation', 'AI request logs', 'recon'),
      d(asset('/media/work/reporter-login.webp'), 'Reporter sign-in card on a grey gradient', 'Sign-in, reporter.astel.kz', 'live')
    ],
    links: [{label: 'reporter.astel.kz', href: 'https://reporter.astel.kz', note: 'Internal, sign-in only'}]
  },
  {
    id: 'agriprom', name: 'Agriprom', kicker: 'Agritech platform', year: '2025', accent: 'mint', tile: 'square',
    oneLiner: 'A fast, findable catalogue of European dairy-farm equipment for Kazakhstan.',
    what: 'An information platform on Next.js 16 with a categorised catalogue, instant search and dashboards.',
    mine: [
      'Architecture on Next.js 16 and TypeScript, SEO and fast rendering.',
      'Interactive Recharts dashboards and the Tailwind / shadcn interface.',
      'Refactor towards a read-only content model for faster pages.'
    ],
    spark: 'Search answers while you type across a long technical catalogue.',
    stack: ['Next.js 16', 'TypeScript', 'Tailwind', 'shadcn/ui', 'Recharts'],
    shots: [
      d(asset('/media/work/agri-home.webp'), 'Agriprom home page: European solutions for cow comfort in Kazakhstan', 'Home', 'local'),
      d(asset('/media/work/agri-catalog.webp'), 'Agriprom product catalogue with category sidebar', 'Catalogue', 'local'),
      d(asset('/media/work/agri-search.webp'), 'Agriprom catalogue filtered by the search term brush', 'Search', 'local')
    ],
    links: []
  },
]

export type More = {name: string; what: string; stack: string; year: string; href?: string; linkLabel?: string}
export const more: More[] = [
  {name: 'Arna Tools', what: 'Installer app for ArnaSmart field teams (task pages and details).', stack: 'Angular 19 · Capacitor', year: '2026', href: 'https://tools.astel.kz', linkLabel: 'tools.astel.kz · sign-in'},
  {name: 'AituBalance', what: 'An AI psychology assistant for AITU students.', stack: 'Next.js · Gemini', year: '2025'},
  {name: 'NomadAI', what: 'An AI travel concierge with a “lux digital” look.', stack: 'Next.js · Tailwind', year: '2025'},
  {name: 'Constella', what: 'Forms hackathon teams as “constellations”: cores, bridges, skill balance.', stack: 'Node.js · WebSocket · Canvas', year: '2025'},
  {name: 'Qolda', what: 'Mentors for newcomers in IT: profiles, news, messages.', stack: 'Swift · UIKit · MVVM · Firebase', year: '2024'},
  {name: 'NeoDent', what: 'Dental clinic booking: doctors, filters, calendar, history.', stack: 'Swift · UIKit · MVVM', year: '2024'},
  {name: 'Azura Vending', what: 'Real-time vending machine monitoring. Service time −20%.', stack: 'SwiftUI', year: '2024'},
  {name: 'Music Hub', what: 'Book musicians and organise events.', stack: 'FastAPI · PostgreSQL', year: '2024', href: 'https://github.com/arynttai/music_hub', linkLabel: 'GitHub'},
  {name: 'PetHack MVP', what: 'Team lead, mobile MVP in eight hours. Won Best Mobile Application.', stack: 'Mobile', year: '2024'}
]

export type Job = {when: string; org: string; role: string; color: string; points: string[]; projects?: string[]; logo?: 'freedom' | 'aitu'}
export const jobs: Job[] = [
  {when: 'Apr 2026 — now', org: 'Freedom Cloud Holding Ltd.', role: 'Software Engineer', color: 'sky', logo: 'freedom',
    points: ['ArnaSmart: the ArnaAI assistant, the map, real-time alarms, NestJS endpoints and admin tools.', 'Digital Jailay: heatmap, animals, geo fences, Telegram and push alerts, Android BLE bridge.', 'Reporter: Telegram alert routing, geocoding, integration monitoring and logs.'],
    projects: ['arnasmart', 'djailay', 'reporter', 'arnalight']},
  {when: '2025 — now', org: 'Agriprom.kz', role: 'Fullstack Developer · remote', color: 'mint', points: ['Next.js 16 platform, Recharts dashboards, SEO, read-only refactor.'], projects: ['agriprom']},
  {when: '2024 — now', org: 'Freelance', role: 'Fullstack Developer', color: 'peach', points: ['Websites and mobile apps, MVPs for startups: architecture and REST APIs.']},
  {when: '2024 — 2025', org: 'Astana IT University', role: 'Fullstack Mobile Developer', color: 'cherry', logo: 'aitu', points: ['Attendance Control, from idea to daily use.'], projects: ['attendance']},
  {when: '2024 — 2025', org: 'IT Step Academy', role: 'Teacher & mentor', color: 'butter', points: ['OOP in C++ and Java, mobile and web development, AI basics.']},
  {when: '2024', org: 'Azura Vending', role: 'Fullstack Mobile Developer', color: 'lilac', points: ['SwiftUI app for real-time machine monitoring. Service time −20%.']}
]

export type Win = {title: string; meta: string; cert?: string}
export const wins: Win[] = [
  {title: 'Winner, Best Mobile Application', meta: 'PetHack by GDG & Neobook · 2024', cert: 'pethack'},
  {title: '3rd place, Web Development Hackathon', meta: 'Code Girl Summer · NU ACM-W · 2023', cert: 'nu-code-girl'},
  {title: 'Develop in Swift', meta: 'Apple Authorised Training · Astana Hub · 2024', cert: 'apple'},
  {title: 'Application development for iOS', meta: 'IT Step Academy · 2023 — 2024 · excellent', cert: 'itstep'},
  {title: 'Mobile Application Development', meta: 'Samsung Innovation Campus · 2022 — 2023', cert: 'samsung'},
  {title: 'Lego Scrum & Data Driven BI', meta: 'Beeline Bootcamp · 2024', cert: 'beeline'}
]

export const skills: [string, string[]][] = [
  ['Web', ['Angular', 'React', 'Next.js', 'TypeScript', 'Tailwind', 'shadcn/ui']],
  ['Backend', ['NestJS', 'Node.js', 'Express', 'FastAPI', 'Django', 'WebSocket', 'MQTT']],
  ['Mobile', ['Swift', 'SwiftUI', 'UIKit', 'Flutter', '.NET MAUI', 'Capacitor']],
  ['Data & AI', ['MongoDB', 'PostgreSQL', 'Firebase', 'LLMs / Ollama', 'Computer vision']],
  ['3D & tools', ['Three.js', 'React Three Fiber', 'Figma', 'Docker', 'Git', 'Playwright']]
]

export const links = {
  github: 'https://github.com/arynttai',
  linkedin: 'https://www.linkedin.com/in/aryntay/',
  email: 'arynttai@gmail.com',
  telegram: 'https://t.me/sindugahvon',
  telegramHandle: '@sindugahvon',
  cv: asset('/Akmaral_Aryntay_CV.pdf')
}
