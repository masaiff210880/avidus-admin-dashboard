# Avidus Frontend Dashboard

A role-based admin dashboard for managing users, tasks, and activity logs. Built with React and connected to a REST API via Redux Toolkit.

## Live Demo

| | URL |
|---|-----|
| **Frontend** | [https://avidus-admin-dashboard.vercel.app/](https://avidus-admin-dashboard.vercel.app/) |
| **Backend API** | [https://avidus-backend-799e.onrender.com/api/](https://avidus-backend-799e.onrender.com/api/) |

## Presentation

Watch the project walkthrough: [Admin and User Dashboard Role-Based Access](https://www.loom.com/share/3f0cdd6a66094f4697f4ebab8e0a73a9) (Loom)

## Backend Repository

This frontend connects to the [Avidus Backend API](https://github.com/masaiff210880/avidus-backend) — a Node.js + Express + MongoDB REST API with JWT auth, role-based access control, and activity tracking.

**Repo:** [https://github.com/masaiff210880/avidus-backend](https://github.com/masaiff210880/avidus-backend)

## Tech Stack

| Category | Technology |
|----------|------------|
| Framework | React 19 |
| Build Tool | Vite |
| Routing | React Router |
| State & API | Redux Toolkit (RTK Query) |
| Styling | Tailwind CSS v4 |
| Linting | ESLint |

## Features

- **Authentication** — Login, signup, and protected routes
- **Dashboard** — Overview stats, recent tasks, and activity
- **User Management** — Create, activate/deactivate, delete users (admin)
- **User Tasks** — View and manage tasks for a specific user
- **Task Monitoring** — Create, view, edit, and delete tasks
- **Activity Logs** — View platform activity history (admin)
- **404 Page** — Custom not-found page with auto-redirect

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
npm install
```

### Environment Variables

Create a `.env` file in the project root:

```env
VITE_BASE_URL=https://avidus-backend-799e.onrender.com/api/
```

### Development

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Project Structure

```
src/
├── components/       # Reusable UI components
├── context/          # Auth & toast providers
├── hooks/            # Custom hooks
├── layouts/          # Auth & dashboard layouts
├── modals/           # Modal forms (create/edit/view)
├── pages/            # Route pages
├── redux-toolkit/    # RTK Query API & store
└── utils/            # Helpers (validation, dates, actions)
```

## API Integration

API calls are handled with **RTK Query** in `src/redux-toolkit/service.js`. Endpoints are defined as queries and mutations, with automatic caching and tag-based invalidation.

Auth tokens are stored in cookies and attached to requests via `prepareHeaders`.

## Styling

The UI uses **Tailwind CSS** utility classes. Global styles live in `src/index.css`. Shared components (buttons, badges, modals, tables) keep the design consistent across pages.

## Deployment

The project includes a `vercel.json` for SPA routing so client-side routes work correctly on Vercel.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |
