# Cloud Video Management System (CVMS)

A comprehensive cloud-based video management system for law enforcement, featuring real-time CCTV monitoring, AI-powered analytics, IoT integration, and incident management.

## Tech Stack

- **Frontend**: React 18 + TypeScript + Vite + Tailwind CSS
- **Backend**: Express.js + TypeScript (tsx)
- **Data**: In-memory store with realistic seed data (no external DB required)
- **Charts**: Recharts
- **Routing**: Wouter v3
- **State**: TanStack React Query (polling-based live updates)

## Running the App

```bash
npm run build && npx tsx server/index.ts
```

This builds the React frontend into `dist/public/` and starts the Express server on port 5000. The server serves both the API (`/api/*`) and the static frontend.

### Workflow

The **Start CVMS** workflow handles everything automatically.

## Project Structure

```
├── client/src/
│   ├── components/       # Reusable UI (Sidebar, AlertFeed, CameraCard, …)
│   ├── pages/            # Dashboard, Cameras, Incidents, Analytics, IoT, Evidence, Officers
│   ├── lib/              # api.ts (fetch wrapper), utils.ts (formatters, colour maps)
│   └── index.css         # Tailwind base styles
├── server/
│   ├── index.ts          # Express app, static file serving
│   ├── routes.ts         # REST API routes under /api
│   └── storage.ts        # In-memory data store + seed data + live simulation
├── shared/
│   └── schema.ts         # Shared TypeScript types (Camera, Incident, Event, …)
└── dist/public/          # Built frontend (auto-generated, do not edit)
```

## Features

- **Dashboard** — Live stats, alert feed, active incidents at a glance
- **Cameras** — Grid and list view of all CCTV cameras with simulated live feeds
- **Incidents** — Create, track, and advance incidents through workflow states
- **Analytics** — Events over time, severity breakdown, ANPR log, gender demographics
- **IoT / Traffic** — Smart traffic signal control + environmental sensor monitoring
- **Evidence** — Chain-of-custody evidence tracking with SHA-256 hashes
- **Officers** — Personnel registry with status and contact info

## Live Data Simulation

`server/storage.ts` runs a `setInterval` every 5 seconds to randomly mutate traffic light statuses and sensor readings, giving the IoT page a live feel. The React Query default `refetchInterval` is 10 s (5 s for alerts/IoT).

## User Preferences

- Dark monitoring-room aesthetic (slate-950 base, blue accents)
- No external database required — all data is in-memory with realistic seed content
