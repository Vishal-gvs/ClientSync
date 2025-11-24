import jsonServer from 'json-server';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const server = jsonServer.create();
const router = jsonServer.router(path.join(__dirname, 'db.json'));
const middlewares = jsonServer.defaults();

// Allowed origins: localhost + Vercel (prod + preview)
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'http://127.0.0.1:5173',
  'https://client-sync-ten.vercel.app',            // your main site
  /\.vercel\.app$/,                                // ALL Vercel preview URLs
];

// 1) Main CORS middleware
server.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true); // mobile apps, curl, Postman
      if (
        allowedOrigins.includes(origin) ||
        allowedOrigins.some((o) => o instanceof RegExp && o.test(origin))
      ) {
        return callback(null, true);
      }
      console.warn('❌ CORS blocked:', origin);
      return callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
  })
);

// 2) Manual CORS headers (some browsers require both)
server.use((req, res, next) => {
  const origin = req.headers.origin;

  if (
    allowedOrigins.includes(origin) ||
    allowedOrigins.some((o) => o instanceof RegExp && o.test(origin))
  ) {
    res.header('Access-Control-Allow-Origin', origin);
  }

  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.header('Access-Control-Allow-Credentials', 'true');

  if (req.method === 'OPTIONS') return res.sendStatus(204);
  next();
});

// JSON Server
server.use(middlewares);
server.use(jsonServer.bodyParser);

// Disable caching to ensure realtime data on Vercel
server.use((req, res, next) => {
  res.setHeader('Cache-Control', 'no-store');
  next();
});

// Custom route: Delete user account with cascade delete of related data
server.delete('/users/:id', (req, res) => {
  try {
    const id = String(req.params.id);
    const db = router.db; // lowdb instance

    // Remove related clients and projects
    db.get('clients').remove((c) => String(c.userId) === id).write();
    db.get('projects').remove((p) => String(p.userId) === id).write();

    // Remove the user
    const removed = db.get('users').remove((u) => String(u.id) === id).write();

    if (!removed || removed.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    return res.status(204).end();
  } catch (err) {
    console.error('Failed to delete user:', err);
    return res.status(500).json({ error: 'Failed to delete user' });
  }
});

server.use(router);

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`🚀 JSON Server running at http://localhost:${PORT}`);
});
