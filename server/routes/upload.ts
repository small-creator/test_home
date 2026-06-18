import { Router, Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();

const storage = multer.memoryStorage();

const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedMimes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('이미지 파일만 업로드 가능합니다. (JPG, PNG, WEBP, GIF)'));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024
  }
});

const localUploadsDir = path.join(process.cwd(), 'public/uploads');
if (!fs.existsSync(localUploadsDir)) {
  fs.mkdirSync(localUploadsDir, { recursive: true });
}

async function uploadFileToGitOrLocal(file: Express.Multer.File): Promise<string> {
  const uniqueSuffix = Date.now();
  const ext = path.extname(file.originalname);
  const basename = path.basename(file.originalname, ext);
  const safeBasename = basename.replace(/[^a-zA-Z0-9가-힣]/g, '_');
  const filename = `${uniqueSuffix}-${safeBasename}${ext}`;

  if (process.env.NODE_ENV === 'development' || !process.env.GITHUB_TOKEN) {
    const filePath = path.join(localUploadsDir, filename);
    fs.writeFileSync(filePath, file.buffer);
    return `/uploads/${filename}`;
  }

  const token = process.env.GITHUB_TOKEN;
  const owner = process.env.GITHUB_REPO_OWNER || 'small-creator';
  const repo = process.env.GITHUB_REPO_NAME || 'keunmun';
  const apiUrl = `https://api.github.com/repos/${owner}/${repo}/contents/public/uploads/${filename}`;

  const encodedContent = file.buffer.toString('base64');

  const updateRes = await fetch(apiUrl, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      'User-Agent': 'Vercel-Serverless-Function'
    },
    body: JSON.stringify({
      message: `Upload image ${filename} via Admin Panel`,
      content: encodedContent
    })
  });

  if (!updateRes.ok) {
    const errorData = await updateRes.json() as { message?: string };
    throw new Error(errorData.message || `GitHub API error ${updateRes.status}`);
  }

  return `/uploads/${filename}`;
}

router.post('/', authMiddleware, upload.single('image'), async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: '이미지 파일을 선택해주세요.'
      });
    }

    const imageUrl = await uploadFileToGitOrLocal(req.file);

    res.json({
      success: true,
      data: {
        url: imageUrl,
        filename: req.file.originalname,
        size: req.file.size,
        mimetype: req.file.mimetype
      }
    });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({
      success: false,
      error: error.message || '이미지 업로드에 실패했습니다.'
    });
  }
});

router.post('/multiple', authMiddleware, upload.array('images', 20), async (req: Request, res: Response) => {
  try {
    const files = req.files as Express.Multer.File[];
    if (!files || files.length === 0) {
      return res.status(400).json({
        success: false,
        error: '이미지 파일을 선택해주세요.'
      });
    }

    const uploadedFiles = [];
    for (const file of files) {
      const imageUrl = await uploadFileToGitOrLocal(file);
      uploadedFiles.push({
        url: imageUrl,
        filename: file.originalname,
        size: file.size,
        mimetype: file.mimetype
      });
    }

    res.json({
      success: true,
      data: uploadedFiles
    });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({
      success: false,
      error: error.message || '이미지 업로드에 실패했습니다.'
    });
  }
});

router.use((err: any, req: Request, res: Response, next: any) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        error: '파일 크기는 10MB를 초과할 수 없습니다.'
      });
    }
    return res.status(400).json({
      success: false,
      error: `파일 업로드 오류: ${err.message}`
    });
  }
  if (err) {
    return res.status(400).json({
      success: false,
      error: err.message
    });
  }
  next();
});

export default router;
