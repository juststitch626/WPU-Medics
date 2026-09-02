# WPU Digital Clinic Book 🩺

A mobile-first clinic management app for **Western Pacific University's campus clinic** (Ialibu), built with **Angular 18** (standalone components + signals). Patients can book appointments, view diagnoses, and track medical history; nurses can manage the patient roster, confirm appointments, and monitor clinic workflow — all inside a phone-frame UI in a midnight-blue and gold theme.

This is an Angular rebuild of an earlier vanilla HTML/CSS/JS prototype, developed as part of **CMP324 Computer Project II- Implementation and Development** coursework at Western Pacific University.

![Angular](https://img.shields.io/badge/Angular-18-DD0031?logo=angular&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.5-3178C6?logo=typescript&logoColor=white)
![Status](https://img.shields.io/badge/status-in%20development-yellow)

---

## Features

**Patient**
- Role-based login with demo credentials
- Book an appointment (provider, reason, date, time)
- View and track appointment status (Pending / Confirmed)
- View latest diagnosis, vitals, and prescriptions
- Browse full medical history timeline

**Nurse**
- Searchable patient records roster
- View any patient's detail, diagnosis, and history
- Confirm pending appointments
- Live "System Workflow" clinic-status dashboard

---

## Screenshots

> _Add screenshots here once the app is running — e.g. `docs/screenshots/login.png`, `docs/screenshots/patient-dashboard.png`._

| Login | Patient Dashboard | Nurse Dashboard |
|---|---|---|
| ![login](docs/screenshots/login.png) | ![patient](docs/screenshots/patient-dashboard.png) | ![nurse](docs/screenshots/nurse-dashboard.png) |

---

## Tech stack

- **Angular 18** — standalone components, signals, new `@if`/`@for` control flow
- **TypeScript 5.5**
- **Angular Router** — lazy-loaded routes, functional `canMatch` guards
- Plain CSS (no framework) — custom theme in `src/styles.css`

No backend: all data lives in an in-memory `DataService` (Angular signals), matching the original static prototype's behaviour — data resets on page reload.

---

##  Getting started

### Prerequisites
- [Node.js](https://nodejs.org/) 18+ and npm
- [Angular CLI](https://angular.dev/tools/cli) (optional, `npx` works without a global install)

### Install & run

```bash
git clone https://github.com/<your-username>/wpu-digital-clinic-book.git
cd wpu-digital-clinic-book
npm install
npm start
```

Open **http://localhost:4200**.

### Demo logins

| Role    | Email               | Password    |
|---------|---------------------|-------------|
| Patient | patient@wpu.ac.pg   | patient123  |
| Nurse   | nurse@wpu.ac.pg     | nurse123    |

---

##  Project structure

```
src/
├── app/
│   ├── guards/           # Route guards (role-based access)
│   ├── models/           # Shared TypeScript interfaces
│   ├── services/         # DataService, AuthService, ToastService
│   ├── shared/           # Reusable UI components (appbar, bottom-nav, tile, chip, toast)
│   ├── pages/             # One folder per screen
│   │   ├── login/
│   │   ├── patient-dashboard/
│   │   ├── nurse-dashboard/
│   │   ├── appointments/
│   │   ├── records/
│   │   ├── patient-detail/
│   │   ├── diagnosis/
│   │   ├── history/
│   │   └── workflow/
│   ├── app.component.ts   # Root shell (phone-frame wrapper)
│   ├── app.config.ts      # App-wide providers
│   └── app.routes.ts      # Route table
├── styles.css              # Global theme (midnight blue / gold / white)
├── index.html
└── main.ts
public/
└── wpu-logo.png
```

##  Routes

```
/login
/patient          Patient dashboard
/nurse             Nurse dashboard
/appointments      Role-aware: booking form (patient) or schedule + confirm (nurse)
/diagnosis         Patient only
/records            Nurse only — searchable roster
/records/:id       Nurse only — one patient's detail
/history           Any logged-in role (nurse gets a patient picker)
/workflow           Nurse only
```

---

##  Course context

| | |
|---|---|
| **Course** | CMP324 |
| **Institution** | Western Pacific University |
| **Assignment** | Software Development & Testing Project — WPU Digital Clinic Book |
| **This repo covers** | Task 3: rebuilding the Task 1/2 prototype in Angular |

See `CHANGELOG.md` for how this build progressed across submission milestones.

---

##  License

Academic project — for coursework purposes. No license granted for external reuse unless stated otherwise.
