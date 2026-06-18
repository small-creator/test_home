import { Router, Request, Response } from 'express';
import { readJson, writeJson } from '../db.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();

router.get('/', (req: Request, res: Response) => {
  try {
    const settings = readJson('featured');
    res.json({
      success: true,
      data: settings
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error: '추천 매물 시세를 불러오는데 실패했습니다.'
    });
  }
});

router.put('/', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { settings } = req.body;

    if (!Array.isArray(settings)) {
      return res.status(400).json({
        success: false,
        error: '올바른 데이터 형식이 아닙니다.'
      });
    }

    const currentSettings = readJson('featured');
    for (const update of settings) {
      const index = currentSettings.findIndex(item => item.id === update.id);
      if (index !== -1) {
        currentSettings[index] = {
          ...currentSettings[index],
          price_25: update.price_25 !== undefined ? update.price_25 : currentSettings[index].price_25,
          price_34: update.price_34 !== undefined ? update.price_34 : currentSettings[index].price_34
        };
      }
    }

    await writeJson('featured', currentSettings);

    res.json({
      success: true,
      data: { message: '추천 매물 시세가 성공적으로 업데이트되었습니다.' }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : '추천 매물 시세 업데이트에 실패했습니다.'
    });
  }
});

export default router;
