# Frontend Page Assignments (Option B)

We added an 8th page (Settings) so that four members can each own exactly two pages.

Pages:
- About, Clients, Dashboard, Home, Login, Projects, Register, Settings

Assignments (2 pages each):
- Team Leader (Build & Deployment owner): Dashboard, Settings
- Member 2: Clients, Home
- Member 3: Projects, About
- Member 4: Login, Register

Notes:
- Settings is a protected route and appears in the sidebar navigation.
- Team Leader also oversees Vercel build/deployment for the frontend (Vite):
  - Build Command: `npm run build`
  - Output: `dist`
  - Configure `VITE_API_BASE_URL` as needed.
