import { Router, Request, Response } from 'express';
import { getDb } from '../db';
import { authMiddleware } from '../middleware/auth';

const router = Router();
const db = getDb();

// GET all listings
router.get('/', (req: Request, res: Response) => {
  try {
    const listings = db.prepare('SELECT * FROM listings ORDER BY created_at DESC').all();

    // Parse tags from JSON string
    const parsedListings = listings.map((listing: any) => ({
      ...listing,
      specs: {
        size: listing.size,
        bed: listing.bed,
        bath: listing.bath
      },
      tags: JSON.parse(listing.tags)
    }));

    res.json({
      success: true,
      data: parsedListings
    });
  } catch (error) {
    console.error('Error fetching listings:', error);
    res.status(500).json({
      success: false,
      error: '매물 목록을 불러오는데 실패했습니다.'
    });
  }
});

// GET single listing by ID
router.get('/:id', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const listing: any = db.prepare('SELECT * FROM listings WHERE id = ?').get(id);

    if (!listing) {
      return res.status(404).json({
        success: false,
        error: '매물을 찾을 수 없습니다.'
      });
    }

    const parsedListing = {
      ...listing,
      specs: {
        size: listing.size,
        bed: listing.bed,
        bath: listing.bath
      },
      tags: JSON.parse(listing.tags)
    };

    res.json({
      success: true,
      data: parsedListing
    });
  } catch (error) {
    console.error('Error fetching listing:', error);
    res.status(500).json({
      success: false,
      error: '매물을 불러오는데 실패했습니다.'
    });
  }
});

// POST create new listing (requires auth)
router.post('/', authMiddleware, (req: Request, res: Response) => {
  try {
    const { image, price, title, type, specs, tags } = req.body;

    // Validation
    if (!image || !price || !title || !type || !specs || !tags) {
      return res.status(400).json({
        success: false,
        error: '필수 필드가 누락되었습니다.'
      });
    }

    if (!['매매', '전세'].includes(type)) {
      return res.status(400).json({
        success: false,
        error: '타입은 "매매" 또는 "전세"여야 합니다.'
      });
    }

    const stmt = db.prepare(`
      INSERT INTO listings (image, price, title, type, size, bed, bath, tags)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const result = stmt.run(
      image,
      price,
      title,
      type,
      specs.size,
      specs.bed,
      specs.bath,
      JSON.stringify(tags)
    );

    res.status(201).json({
      success: true,
      data: {
        id: result.lastInsertRowid,
        message: '매물이 성공적으로 등록되었습니다.'
      }
    });
  } catch (error) {
    console.error('Error creating listing:', error);
    res.status(500).json({
      success: false,
      error: '매물 등록에 실패했습니다.'
    });
  }
});

// PUT update listing (requires auth)
router.put('/:id', authMiddleware, (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { image, price, title, type, specs, tags } = req.body;

    // Check if listing exists
    const existing = db.prepare('SELECT id FROM listings WHERE id = ?').get(id);
    if (!existing) {
      return res.status(404).json({
        success: false,
        error: '매물을 찾을 수 없습니다.'
      });
    }

    // Validation
    if (type && !['매매', '전세'].includes(type)) {
      return res.status(400).json({
        success: false,
        error: '타입은 "매매" 또는 "전세"여야 합니다.'
      });
    }

    const stmt = db.prepare(`
      UPDATE listings
      SET image = COALESCE(?, image),
          price = COALESCE(?, price),
          title = COALESCE(?, title),
          type = COALESCE(?, type),
          size = COALESCE(?, size),
          bed = COALESCE(?, bed),
          bath = COALESCE(?, bath),
          tags = COALESCE(?, tags),
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `);

    stmt.run(
      image || null,
      price || null,
      title || null,
      type || null,
      specs?.size || null,
      specs?.bed || null,
      specs?.bath || null,
      tags ? JSON.stringify(tags) : null,
      id
    );

    res.json({
      success: true,
      data: { message: '매물이 성공적으로 수정되었습니다.' }
    });
  } catch (error) {
    console.error('Error updating listing:', error);
    res.status(500).json({
      success: false,
      error: '매물 수정에 실패했습니다.'
    });
  }
});

// DELETE listing (requires auth)
router.delete('/:id', authMiddleware, (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const result = db.prepare('DELETE FROM listings WHERE id = ?').run(id);

    if (result.changes === 0) {
      return res.status(404).json({
        success: false,
        error: '매물을 찾을 수 없습니다.'
      });
    }

    res.json({
      success: true,
      data: { message: '매물이 성공적으로 삭제되었습니다.' }
    });
  } catch (error) {
    console.error('Error deleting listing:', error);
    res.status(500).json({
      success: false,
      error: '매물 삭제에 실패했습니다.'
    });
  }
});

export default router;
