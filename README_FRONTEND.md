# Global Esport Calendar — Frontend

Overview
- React + Vite UI for browsing tournament calendar, signup, and viewing user esports passports.

Quick run (development)
- Node 18+ recommended.

Commands:
```bash
cd Global-Esport-Calendar-Frontend
npm install
npm run dev
```

Configuration
- The frontend expects the backend at `http://localhost:8080` by default. Update `API_BASE` in `src/pages/Calendar.jsx` if needed.

Next steps (MVP)
- Wire the `Signup` form to call `POST /api/users` to create esports passports.
- Add login/auth and profile editing in follow-up iterations.
