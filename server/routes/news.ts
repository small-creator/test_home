import { Router, Request, Response } from 'express';
import { getDb } from '../db';
import { authMiddleware } from '../middleware/auth';

const router = Router();
const db = getDb();

// GET all news
router.get('/', (req: Request, res: Response) => {
  try {
    const news = db.prepare('SELECT * FROM news ORDER BY created_at DESC').all();

    res.json({
      success: true,
      data: news
    });
  } catch (error) {
    console.error('Error fetching news:', error);
    res.status(500).json({
      success: false,
      error: '뉴스 목록을 불러오는데 실패했습니다.'
    });
  }
});

// GET single news by ID
router.get('/:id', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const news = db.prepare('SELECT * FROM news WHERE id = ?').get(id);

    if (!news) {
      return res.status(404).json({
        success: false,
        error: '뉴스를 찾을 수 없습니다.'
      });
    }

    res.json({
      success: true,
      data: news
    });
  } catch (error) {
    console.error('Error fetching news:', error);
    res.status(500).json({
      success: false,
      error: '뉴스를 불러오는데 실패했습니다.'
    });
  }
});

// POST create new news (requires auth)
router.post('/', authMiddleware, (req: Request, res: Response) => {
  try {
    const { category, image, title, description } = req.body;

    // Validation
    if (!category || !image || !title || !description) {
      return res.status(400).json({
        success: false,
        error: '필수 필드가 누락되었습니다.'
      });
    }

    if (!['뉴스', '가이드', '커뮤니티'].includes(category)) {
      return res.status(400).json({
        success: false,
        error: '카테고리는 "뉴스", "가이드", "커뮤니티" 중 하나여야 합니다.'
      });
    }

    const stmt = db.prepare(`
      INSERT INTO news (category, image, title, description)
      VALUES (?, ?, ?, ?)
    `);

    const result = stmt.run(category, image, title, description);

    res.status(201).json({
      success: true,
      data: {
        id: result.lastInsertRowid,
        message: '뉴스가 성공적으로 등록되었습니다.'
      }
    });
  } catch (error) {
    console.error('Error creating news:', error);
    res.status(500).json({
      success: false,
      error: '뉴스 등록에 실패했습니다.'
    });
  }
});

// PUT update news (requires auth)
router.put('/:id', authMiddleware, (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { category, image, title, description } = req.body;

    // Check if news exists
    const existing = db.prepare('SELECT id FROM news WHERE id = ?').get(id);
    if (!existing) {
      return res.status(404).json({
        success: false,
        error: '뉴스를 찾을 수 없습니다.'
      });
    }

    // Validation
    if (category && !['뉴스', '가이드', '커뮤니티'].includes(category)) {
      return res.status(400).json({
        success: false,
        error: '카테고리는 "뉴스", "가이드", "커뮤니티" 중 하나여야 합니다.'
      });
    }

    const stmt = db.prepare(`
      UPDATE news
      SET category = COALESCE(?, category),
          image = COALESCE(?, image),
          title = COALESCE(?, title),
          description = COALESCE(?, description),
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `);

    stmt.run(
      category || null,
      image || null,
      title || null,
      description || null,
      id
    );

    res.json({
      success: true,
      data: { message: '뉴스가 성공적으로 수정되었습니다.' }
    });
  } catch (error) {
    console.error('Error updating news:', error);
    res.status(500).json({
      success: false,
      error: '뉴스 수정에 실패했습니다.'
    });
  }
});

// DELETE news (requires auth)
router.delete('/:id', authMiddleware, (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const result = db.prepare('DELETE FROM news WHERE id = ?').run(id);

    if (result.changes === 0) {
      return res.status(404).json({
        success: false,
        error: '뉴스를 찾을 수 없습니다.'
      });
    }

    res.json({
      success: true,
      data: { message: '뉴스가 성공적으로 삭제되었습니다.' }
    });
  } catch (error) {
    console.error('Error deleting news:', error);
    res.status(500).json({
      success: false,
      error: '뉴스 삭제에 실패했습니다.'
    });
  }
});

export default router;
