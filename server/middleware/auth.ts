import { Request, Response, NextFunction } from 'express';

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      error: '인증이 필요합니다.'
    });
  }

  const token = authHeader.substring(7);
  let decodedToken = token;
  try {
    decodedToken = decodeURIComponent(escape(Buffer.from(token, 'base64').toString('utf8')));
  } catch (e) {
  }
  const adminPassword = process.env.ADMIN_PASSWORD || '코중사admin2026';

  if (decodedToken !== adminPassword) {
    return res.status(401).json({
      success: false,
      error: '인증에 실패했습니다.'
    });
  }

  next();
}
