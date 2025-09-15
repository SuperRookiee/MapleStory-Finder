# MapleStory Finder

<img src="./public/Reheln.png" width="120" alt="Finder logo" />

[![Next.js](https://img.shields.io/badge/Next.js-000?logo=nextdotjs&logoColor=fff)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=fff)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?logo=tailwindcss&logoColor=fff)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-3ecf8e?logo=supabase&logoColor=000)](https://supabase.com/)

Finder is a Next.js application for exploring MapleStory character information using the official Nexon Open API. Search for characters, manage favourites and view detailed stats with a fast, responsive interface.

## Features
- 🔍 Search MapleStory characters by name or OCID
- ⭐ Save favourite characters and access them quickly
- 📊 Detailed character stats with responsive UI
- 🔒 Supabase authentication for secure data storage
- 🌙 Dark‑mode friendly design

## Tech Stack
- **Next.js 15** & **React 19**
- **TypeScript**
- **Tailwind CSS 4** & **Radix UI** components
- **Supabase** for authentication & storage
- Zustand, Recharts and other utilities

## Getting Started

### Prerequisites
- Node.js 18+
- npm

### Installation
```bash
# Clone the repository
 git clone <repo-url>
 cd MapleStory-Finder

# Install dependencies
 npm install
```

### Environment Variables
Create a `.env.local` file in the project root and provide the following values:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_NEXON_API_KEY=your_nexon_open_api_key
```

### Development
Start the development server:

```bash
npm run dev
```
Visit <http://localhost:3000> to view the app.

### Linting
Run ESLint to check for issues:

```bash
npm run lint
```

## Contributing
Contributions are welcome! Feel free to open issues and pull requests to help improve the project.

---

*MapleStory and the MapleStory logo are trademarks of Nexon.*

