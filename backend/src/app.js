import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './config/swagger.js';
import healthRoutes from './routes/health.routes.js';
import { notFound, errorHandler } from './middlewares/errorHandler.js';

const app = express();

// Security and utility middlewares
app.use(
  helmet({
    contentSecurityPolicy: false, // Required for Swagger UI inline scripts/styles
  })
);
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Swagger Documentation
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Base Routes
app.use('/api/health', healthRoutes);

app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to Cafe Ordering System API',
    docs: '/api/docs',
    health: '/api/health',
  });
});

// 404 & Centralized Error Handlers
app.use(notFound);
app.use(errorHandler);

export default app;

