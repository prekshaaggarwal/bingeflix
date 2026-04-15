# Bingeflix

A Netflix-inspired streaming web app engineered to feel like a real product, not just a clone. Bingeflix combines polished UI, intelligent personalization, gamified engagement, and production-style deployment practices to demonstrate both frontend craftsmanship and product thinking.

## Why It Stands Out

- **Product-grade experience:** cinematic splash screen, auto-rotating hero, hover-rich cards, animated modals, smooth micro-interactions, keyboard shortcuts, and mobile-first responsive navigation.
- **Advanced personalization engine:** mood-based filtering, smart recommendation rows ("Because you watched...", "Trending for you"), surprise picker, continue watching, and recently browsed history.
- **Gamified user journey:** badge system, watch streak tracker, watch-time stats, and profile analytics with visual genre radar.
- **Recruiter-ready deployment:** live on Render with GitHub Pages fallback, automated CI/CD for Pages, and a shareable portfolio URL for instant review.
- **Strong architecture choices:** Context API state separation (Auth, Mood, Stats, Browse History, Toasts), protected routes, reusable components, and local persistence for real user flows.

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Bingeflix-red?style=for-the-badge&logo=render)](https://bingeflix-bc94.onrender.com)

**Primary Live Demo (Render):** [https://bingeflix-bc94.onrender.com](https://bingeflix-bc94.onrender.com)

**Backup Live Demo (GitHub Pages):** [https://prekshaaggarwal.github.io/bingeflix/](https://prekshaaggarwal.github.io/bingeflix/)

## Tech Stack

- **React 18** with Vite
- **Tailwind CSS 3** for styling
- **React Router 6** for navigation
- **Context API** for state management
- **localStorage** for data persistence

## Features

- Dark Netflix-style UI with hero banners, horizontal scrolling rows, and hover animations
- Mood-based movie filtering via navbar selector
- My List — save/remove movies, persisted across sessions
- Smart recommendations: "Because you watched X" and "Trending for You"
- Gamified profile dashboard with watch stats, badges, and achievements
- Full auth flow (signup/login) stored in localStorage
- Protected routes for profile page

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Project Structure

```
src/
├── components/    # Navbar, HeroBanner, MovieCard, MovieRow, ProtectedRoute
├── context/       # AuthContext, MoodContext, UserStatsContext
├── data/          # movies.json (static movie catalog)
├── pages/         # Home, Login, MovieDetails, Profile
├── App.jsx        # Root component with routing
├── main.jsx       # Entry point
└── index.css      # Tailwind directives + base styles
```
