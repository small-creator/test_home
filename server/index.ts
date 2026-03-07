import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { backupDatabase } from './db';
import newsRouter from './routes/news';
import uploadRouter from './routes/upload';
import marketTrendsRouter from './routes/marketTrends';
import featuredRouter from './routes/featured';

// ES module __dirname equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Ensure uploads directory exists (inside data volume)
const dataDir = process.env.DATA_DIR || path.join(process.cwd(), 'data');
const uploadDir = path.join(dataDir, 'uploads');

// Serve static files (uploaded images)
app.use('/uploads', express.static(uploadDir));

// API Routes
app.use('/api/news', newsRouter);
app.use('/api/upload', uploadRouter);
app.use('/api/market-trends', marketTrendsRouter);
app.use('/api/featured', featuredRouter);

// Production: Serve frontend static files
if (process.env.NODE_ENV === 'production') {
  // Serve static files from dist directory
  app.use(express.static(path.join(__dirname, '../dist')));

  // Handle client-side routing - send all non-API requests to index.html
  app.get('*', (req: Request, res: Response) => {
    res.sendFile(path.join(__dirname, '../dist/index.html'));
  });
}

// Health check endpoint
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('Server error:', err);
  res.status(500).json({
    success: false,
    error: '서버 오류가 발생했습니다.'
  });
});

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    error: '요청한 리소스를 찾을 수 없습니다.'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📁 Uploads directory: ${uploadDir}`);

  // Backup database on startup in production
  if (process.env.NODE_ENV === 'production') {
    backupDatabase();
  }
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down gracefully...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT received. Shutting down gracefully...');
  process.exit(0);
});
