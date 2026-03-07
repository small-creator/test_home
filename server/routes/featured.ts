import { Router, Request, Response } from 'express';
import { getDb } from '../db';
import { authMiddleware } from '../middleware/auth';

const router = Router();

// GET all featured settings
router.get('/', (req: Request, res: Response) => {
    try {
        const db = getDb();
        const settings = db.prepare('SELECT * FROM featured_settings').all();

        res.json({
            success: true,
            data: settings
        });
    } catch (error) {
        console.error('Error fetching featured settings:', error);
        res.status(500).json({
            success: false,
            error: '추천 매물 시세를 불러오는데 실패했습니다.'
        });
    }
});

// PUT update featured settings (requires auth)
router.put('/', authMiddleware, (req: Request, res: Response) => {
    try {
        const { settings } = req.body;

        if (!Array.isArray(settings)) {
            return res.status(400).json({
                success: false,
                error: '올바른 데이터 형식이 아닙니다.'
            });
        }

        const db = getDb();
        const updateStmt = db.prepare(`
      UPDATE featured_settings 
      SET price_25 = ?, price_34 = ? 
      WHERE id = ?
    `);

        db.transaction(() => {
            for (const item of settings) {
                if (item.id && item.price_25 !== undefined && item.price_34 !== undefined) {
                    updateStmt.run(item.price_25, item.price_34, item.id);
                }
            }
        })();

        res.json({
            success: true,
            data: { message: '추천 매물 시세가 성공적으로 업데이트되었습니다.' }
        });
    } catch (error) {
        console.error('Error updating featured settings:', error);
        res.status(500).json({
            success: false,
            error: '추천 매물 시세 업데이트에 실패했습니다.'
        });
    }
});

export default router;
