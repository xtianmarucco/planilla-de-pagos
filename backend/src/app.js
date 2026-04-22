import express from 'express';
import cors from 'cors';
import session from 'express-session';
import connectPgSimple from 'connect-pg-simple';
import pg from 'pg';
import { errorHandler } from './middlewares/errorHandler.js';
import { notFound } from './middlewares/notFound.js';
import healthRouter from './routes/health.routes.js';
import paymentRouter from './routes/payment.routes.js';
import clientRouter from './routes/client.routes.js';
import authRouter from './routes/auth.routes.js';

if (process.env.NODE_ENV === 'production' && !process.env.SESSION_SECRET) {
  throw new Error('SESSION_SECRET must be set in production');
}

const PgSession = connectPgSimple(session);
const sessionPool = new pg.Pool({ connectionString: process.env.DATABASE_URL });

const app = express();

app.use(cors({
  origin: process.env.CORS_ORIGIN,
  credentials: true,
}));
app.use(express.json());

app.use(session({
  store: new PgSession({
    pool: sessionPool,
    createTableIfMissing: true,
  }),
  secret: process.env.SESSION_SECRET || 'dev-secret-change-in-prod',
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
}));

app.use('/health', healthRouter);
app.use('/api/auth', authRouter);
app.use('/api/payments', paymentRouter);
app.use('/api/clients', clientRouter);

app.use(notFound);
app.use(errorHandler);

export default app;
