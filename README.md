# Bingeflix

A Netflix-inspired streaming web app with intelligent personalization and gamification.

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Bingeflix-red?style=for-the-badge&logo=vercel)](https://prekshaaggarwal.github.io/bingeflix/)

**Live Demo:** [https://prekshaaggarwal.github.io/bingeflix/](https://prekshaaggarwal.github.io/bingeflix/)

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
