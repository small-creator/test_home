import fs from 'fs';
import path from 'path';

const dataDir = path.join(process.cwd(), 'data');

export function getJsonPath(filename: string): string {
  return path.join(dataDir, `${filename}.json`);
}

export function readJson(filename: string): any[] {
  const filePath = getJsonPath(filename);
  try {
    if (!fs.existsSync(filePath)) {
      return [];
    }
    const content = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(content);
  } catch (error) {
    console.error(error);
    return [];
  }
}

export async function writeJson(filename: string, data: any[]): Promise<void> {
  const filePath = getJsonPath(filename);
  const content = JSON.stringify(data, null, 2);

  if (process.env.NODE_ENV === 'development') {
    fs.writeFileSync(filePath, content, 'utf8');
    return;
  }

  if (process.env.VERCEL && !process.env.GITHUB_TOKEN) {
    throw new Error('Vercel 배포 환경에서 데이터를 수정하려면 GITHUB_TOKEN 환경 변수 설정이 필요합니다.');
  }

  if (!process.env.GITHUB_TOKEN) {
    fs.writeFileSync(filePath, content, 'utf8');
    return;
  }

  const token = process.env.GITHUB_TOKEN;
  const owner = process.env.GITHUB_REPO_OWNER || 'small-creator';
  const repo = process.env.GITHUB_REPO_NAME || 'keunmun';
  const apiUrl = `https://api.github.com/repos/${owner}/${repo}/contents/data/${filename}.json`;

  try {
    const fileRes = await fetch(apiUrl, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'User-Agent': 'Vercel-Serverless-Function'
      }
    });

    let sha: string | undefined;
    if (fileRes.ok) {
      const fileData = await fileRes.json() as { sha: string };
      sha = fileData.sha;
    }

    const encodedContent = Buffer.from(content).toString('base64');
    const updateRes = await fetch(apiUrl, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'User-Agent': 'Vercel-Serverless-Function'
      },
      body: JSON.stringify({
        message: `Update ${filename}.json via Admin Panel`,
        content: encodedContent,
        sha
      })
    });

    if (!updateRes.ok) {
      const errorData = await updateRes.json() as { message?: string };
      throw new Error(errorData.message || `GitHub API error ${updateRes.status}`);
    }
  } catch (error) {
    console.error(error);
    fs.writeFileSync(filePath, content, 'utf8');
  }
}

export function initDatabase() {}
export function getDb() {
  return {
    prepare: (...args: any[]) => ({
      all: (...args: any[]) => [] as any[],
      get: (...args: any[]) => null as any,
      run: (...args: any[]) => ({ lastInsertRowid: 0, changes: 0 })
    })
  };
}
export function backupDatabase() {}
export function closeDatabase() {}
