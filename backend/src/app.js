import express from 'express';
import cors from 'cors';
import { errorHandler } from './middlewares/errorHandler.js';
import { notFound } from './middlewares/notFound.js';
import healthRouter from './routes/health.routes.js';
import paymentRouter from './routes/payment.routes.js';
import clientRouter from './routes/client.routes.js';

const app = express();

app.use(cors({ origin: process.env.CORS_ORIGIN }));
app.use(express.json());

app.use('/health', healthRouter);
app.use('/api/payments', paymentRouter);
app.use('/api/clients', clientRouter);

app.use(notFound);
app.use(errorHandler);

export default app;
