import { Router, Request, Response } from 'express';
import { readJson, writeJson } from '../db';
import { authMiddleware } from '../middleware/auth';

const router = Router();

router.get('/', (req: Request, res: Response) => {
  try {
    const news = readJson('news').sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    res.json({
      success: true,
      data: news
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error: '뉴스 목록을 불러오는데 실패했습니다.'
    });
  }
});

router.get('/:id', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const news = readJson('news').find(item => item.id === Number(id));

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
    console.error(error);
    res.status(500).json({
      success: false,
      error: '뉴스를 불러오는데 실패했습니다.'
    });
  }
});

router.post('/', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { category, image, title, description } = req.body;

    if (!category || !title || !description) {
      return res.status(400).json({
        success: false,
        error: '필수 필드가 누락되었습니다.'
      });
    }

    if (!['뉴스', '팁'].includes(category)) {
      return res.status(400).json({
        success: false,
        error: '카테고리는 "뉴스", "팁" 중 하나여야 합니다.'
      });
    }

    const newsList = readJson('news');
    const maxId = newsList.reduce((max, item) => item.id > max ? item.id : max, 0);
    const newId = maxId + 1;
    const now = new Date().toISOString().replace('T', ' ').substring(0, 19);

    const newItem = {
      id: newId,
      category,
      image: image || '',
      title,
      description,
      created_at: now,
      updated_at: now
    };

    newsList.push(newItem);
    await writeJson('news', newsList);

    res.status(201).json({
      success: true,
      data: {
        id: newId,
        message: '뉴스가 성공적으로 등록되었습니다.'
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error: '뉴스 등록에 실패했습니다.'
    });
  }
});

router.put('/:id', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { category, image, title, description } = req.body;

    if (category && !['뉴스', '팁'].includes(category)) {
      return res.status(400).json({
        success: false,
        error: '카테고리는 "뉴스", "팁" 중 하나여야 합니다.'
      });
    }

    const newsList = readJson('news');
    const index = newsList.findIndex(item => item.id === Number(id));

    if (index === -1) {
      return res.status(404).json({
        success: false,
        error: '뉴스를 찾을 수 없습니다.'
      });
    }

    const existing = newsList[index];
    const now = new Date().toISOString().replace('T', ' ').substring(0, 19);

    newsList[index] = {
      ...existing,
      category: category !== undefined ? category : existing.category,
      image: image !== undefined ? image : existing.image,
      title: title !== undefined ? title : existing.title,
      description: description !== undefined ? description : existing.description,
      updated_at: now
    };

    await writeJson('news', newsList);

    res.json({
      success: true,
      data: { message: '뉴스가 성공적으로 수정되었습니다.' }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error: '뉴스 수정에 실패했습니다.'
    });
  }
});

router.delete('/:id', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const newsList = readJson('news');
    const filtered = newsList.filter(item => item.id !== Number(id));

    if (filtered.length === newsList.length) {
      return res.status(404).json({
        success: false,
        error: '뉴스를 찾을 수 없습니다.'
      });
    }

    await writeJson('news', filtered);

    res.json({
      success: true,
      data: { message: '뉴스가 성공적으로 삭제되었습니다.' }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error: '뉴스 삭제에 실패했습니다.'
    });
  }
});

export default router;
