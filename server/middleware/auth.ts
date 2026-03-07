import { Request, Response, NextFunction } from 'express';

// Simple password-based authentication middleware
export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      error: '인증이 필요합니다.'
    });
  }

  const token = authHeader.substring(7); // Remove "Bearer " prefix
  const adminPassword = process.env.ADMIN_PASSWORD || '큰문admin2024';

  if (token !== adminPassword) {
    return res.status(401).json({
      success: false,
      error: '인증에 실패했습니다.'
    });
  }

  next();
}
