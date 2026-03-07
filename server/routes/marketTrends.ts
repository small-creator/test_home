import { Router, Request, Response } from 'express';
import { getDb } from '../db';

const router = Router();

function getApiKey(): string {
  return process.env.DATA_GO_KR_API_KEY || '';
}
const API_ENDPOINTS = [
  'https://apis.data.go.kr/1613000/RTMSDataSvcAptTradeDev/getRTMSDataSvcAptTradeDev',
  'http://openapi.molit.go.kr/OpenAPI_ToolInstallPackage/service/rest/RTMSOBJSvc/getRTMSDataSvcAptTradeDev'
];

const GANGDONG_CODE = '11740';
const GRACIUM_NAMES = ['고덕그라시움', '그라시움', '고덕 그라시움'];

interface AptTransaction {
  dealAmount: string;
  dealYear: string;
  dealMonth: string;
  dealDay: string;
  aptNm: string;
  umdNm: string;
  excluUseAr: string;
  floor: string;
  aptDong: string;
}

interface MonthlyTrend {
  month: string;
  yearMonth: string;
  avgPrice: number;
  maxPrice: number;
  minPrice: number;
  transactions: number;
}

interface RecentTransaction {
  dong: string;
  floor: string;
  area: string;
  price: string;
  priceRaw: number;
  date: string;
}

interface MarketTrendData {
  monthlyData: MonthlyTrend[];
  recentTransactions: RecentTransaction[];
  statistics: {
    currentAvgPrice: number;
    currentMaxPrice: number;
    currentMinPrice: number;
    priceChange: string;
    priceChangePercent: string;
    totalTransactions: number;
    trend: 'up' | 'down' | 'flat';
    lastUpdated: string;
    baseArea: string;
  };
}

interface MarketTrendResponse {
  area84: MarketTrendData;
  area59: MarketTrendData;
}

function parseXmlValue(xml: string, tagName: string): string {
  const regex = new RegExp(`<${tagName}>([^<]*)</${tagName}>`);
  const match = xml.match(regex);
  return match ? match[1].trim() : '';
}

function isGraciumApartment(aptName: string): boolean {
  const normalized = aptName.replace(/\s+/g, '');
  return GRACIUM_NAMES.some(name => normalized.includes(name.replace(/\s+/g, '')));
}

function formatPrice(priceInEok: number): string {
  const manWon = Math.round(priceInEok * 10000);
  const eok = Math.floor(manWon / 10000);
  const remainder = manWon % 10000;

  if (eok === 0) return `${remainder.toLocaleString()}만`;
  if (remainder === 0) return `${eok}억`;

  return `${eok}억 ${remainder.toLocaleString()}만`;
}

function extractTransaction(itemXml: string): AptTransaction | null {
  let aptName = parseXmlValue(itemXml, '아파트');
  let umdNm = parseXmlValue(itemXml, '법정동');
  let dealAmount = parseXmlValue(itemXml, '거래금액');
  let dealYear = parseXmlValue(itemXml, '년');
  let dealMonth = parseXmlValue(itemXml, '월');
  let dealDay = parseXmlValue(itemXml, '일');
  let excluUseAr = parseXmlValue(itemXml, '전용면적');
  let floor = parseXmlValue(itemXml, '층');
  let aptDong = parseXmlValue(itemXml, '아파트동');

  if (!aptName) {
    aptName = parseXmlValue(itemXml, 'aptNm');
    umdNm = parseXmlValue(itemXml, 'umdNm');
    dealAmount = parseXmlValue(itemXml, 'dealAmount');
    dealYear = parseXmlValue(itemXml, 'dealYear');
    dealMonth = parseXmlValue(itemXml, 'dealMonth');
    dealDay = parseXmlValue(itemXml, 'dealDay');
    excluUseAr = parseXmlValue(itemXml, 'excluUseAr');
    floor = parseXmlValue(itemXml, 'floor');
    aptDong = parseXmlValue(itemXml, 'aptDong');
  }

  if (!aptName || !dealAmount) return null;

  return { dealAmount, dealYear, dealMonth, dealDay, aptNm: aptName, umdNm, excluUseAr, floor, aptDong };
}

async function fetchTransactionData(yearMonth: string): Promise<AptTransaction[]> {
  const apiKey = getApiKey();
  if (!apiKey) {
    console.error('❌ DATA_GO_KR_API_KEY가 설정되지 않았습니다.');
    return [];
  }

  for (const endpoint of API_ENDPOINTS) {
    try {
      const url = `${endpoint}?serviceKey=${encodeURIComponent(apiKey)}&LAWD_CD=${GANGDONG_CODE}&DEAL_YMD=${yearMonth}&pageNo=1&numOfRows=9999`;

      console.log(`📡 API 호출: ${yearMonth} → ${endpoint.includes('apis.data.go.kr') ? 'data.go.kr' : 'molit.go.kr'}`);
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 15000);

      const response = await fetch(url, { signal: controller.signal });
      clearTimeout(timeout);

      if (!response.ok) {
        console.warn(`⚠️ HTTP ${response.status} - 다음 엔드포인트 시도`);
        continue;
      }

      const xmlText = await response.text();

      const resultCode = parseXmlValue(xmlText, 'resultCode');
      if (resultCode && resultCode !== '00' && resultCode !== '000') {
        const errorMsg = parseXmlValue(xmlText, 'resultMsg');
        console.error(`❌ API 에러 [${resultCode}]: ${errorMsg}`);
        continue;
      }

      const items = xmlText.split('<item>').slice(1);
      const transactions: AptTransaction[] = [];

      for (const item of items) {
        const tx = extractTransaction(item);
        if (tx && isGraciumApartment(tx.aptNm)) {
          transactions.push(tx);
        }
      }

      console.log(`📊 ${yearMonth}: 전체 ${items.length}건 중 고덕그라시움 ${transactions.length}건`);
      return transactions;

    } catch (error: any) {
      if (error.name === 'AbortError') {
        console.warn(`⏱️ 타임아웃 - 다음 엔드포인트 시도`);
      } else {
        console.warn(`⚠️ 연결 실패: ${error.message} - 다음 엔드포인트 시도`);
      }
      continue;
    }
  }

  console.error(`❌ ${yearMonth}: 모든 엔드포인트 실패`);
  return [];
}

async function fetchMarketTrendData(): Promise<MarketTrendResponse> {
  const now = new Date();

  const allTransactions84: (AptTransaction & { yearMonth: string })[] = [];
  const allTransactions59: (AptTransaction & { yearMonth: string })[] = [];
  const monthlyData84: MonthlyTrend[] = [];
  const monthlyData59: MonthlyTrend[] = [];

  for (let i = 7; i >= 0; i--) {
    const targetDate = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const yearMonth = `${targetDate.getFullYear()}${String(targetDate.getMonth() + 1).padStart(2, '0')}`;
    const monthLabel = `${targetDate.getMonth() + 1}월`;

    const transactions = await fetchTransactionData(yearMonth);

    // 84 처리
    const tx84 = transactions.filter(t => {
      const area = parseFloat(t.excluUseAr);
      return area >= 84 && area < 85;
    });
    tx84.forEach(t => allTransactions84.push({ ...t, yearMonth }));

    if (tx84.length > 0) {
      const prices = tx84.map(t => parseFloat(t.dealAmount.replace(/,/g, '').trim()) / 10000);
      const avgPrice = prices.reduce((a, b) => a + b, 0) / prices.length;
      monthlyData84.push({
        month: monthLabel, yearMonth,
        avgPrice: Math.round(avgPrice * 10) / 10,
        maxPrice: Math.round(Math.max(...prices) * 10) / 10,
        minPrice: Math.round(Math.min(...prices) * 10) / 10,
        transactions: tx84.length
      });
    }

    // 59 처리
    const tx59 = transactions.filter(t => {
      const area = parseFloat(t.excluUseAr);
      return area >= 59 && area < 60;
    });
    tx59.forEach(t => allTransactions59.push({ ...t, yearMonth }));

    if (tx59.length > 0) {
      const prices = tx59.map(t => parseFloat(t.dealAmount.replace(/,/g, '').trim()) / 10000);
      const avgPrice = prices.reduce((a, b) => a + b, 0) / prices.length;
      monthlyData59.push({
        month: monthLabel, yearMonth,
        avgPrice: Math.round(avgPrice * 10) / 10,
        maxPrice: Math.round(Math.max(...prices) * 10) / 10,
        minPrice: Math.round(Math.min(...prices) * 10) / 10,
        transactions: tx59.length
      });
    }
  }

  function formatTx(t: AptTransaction): RecentTransaction {
    const priceRaw = parseFloat(t.dealAmount.replace(/,/g, '').trim()) / 10000;
    return {
      dong: t.aptDong || '',
      floor: `${t.floor}층`,
      area: `${parseFloat(t.excluUseAr).toFixed(0)}㎡`,
      price: formatPrice(priceRaw),
      priceRaw,
      date: `${t.dealYear}.${t.dealMonth.padStart(2, '0')}.${t.dealDay.padStart(2, '0')}`
    };
  }

  function buildData(allTx: any[], monthly: MonthlyTrend[], baseArea: string): MarketTrendData {
    const recentTransactions = allTx
      .sort((a, b) => {
        const dateA = `${a.dealYear}${a.dealMonth.padStart(2, '0')}${a.dealDay.padStart(2, '0')}`;
        const dateB = `${b.dealYear}${b.dealMonth.padStart(2, '0')}${b.dealDay.padStart(2, '0')}`;
        return dateB.localeCompare(dateA);
      })
      .slice(0, 5)
      .map(formatTx);

    const validMonths = monthly.filter(m => m.transactions > 0);
    const latestMonth = validMonths.length > 0 ? validMonths[validMonths.length - 1] : null;
    const previousMonth = validMonths.length > 1 ? validMonths[validMonths.length - 2] : null;

    let priceChange = 0;
    let priceChangePercent = '0.0';
    let trend: 'up' | 'down' | 'flat' = 'flat';

    if (latestMonth && previousMonth && previousMonth.avgPrice > 0) {
      priceChange = latestMonth.avgPrice - previousMonth.avgPrice;
      priceChangePercent = ((priceChange / previousMonth.avgPrice) * 100).toFixed(1);
      trend = priceChange > 0 ? 'up' : priceChange < 0 ? 'down' : 'flat';
    }

    return {
      monthlyData: monthly,
      recentTransactions,
      statistics: {
        currentAvgPrice: latestMonth ? latestMonth.avgPrice : 0,
        currentMaxPrice: latestMonth ? latestMonth.maxPrice : 0,
        currentMinPrice: latestMonth ? latestMonth.minPrice : 0,
        priceChange: priceChange > 0 ? `+${priceChange.toFixed(1)}억` : `${priceChange.toFixed(1)}억`,
        priceChangePercent: priceChange > 0 ? `+${priceChangePercent}%` : `${priceChangePercent}%`,
        totalTransactions: monthly.reduce((sum, d) => sum + d.transactions, 0),
        trend,
        lastUpdated: new Date().toISOString(),
        baseArea
      }
    };
  }

  return {
    area84: buildData(allTransactions84, monthlyData84, '전용 84㎡ 기준'),
    area59: buildData(allTransactions59, monthlyData59, '전용 59㎡ 기준')
  };
}

function initCacheTable() {
  const db = getDb();
  db.exec(`
    CREATE TABLE IF NOT EXISTS market_trends_cache (
      id INTEGER PRIMARY KEY CHECK (id = 1),
      data TEXT NOT NULL,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
}

function getCachedData(): MarketTrendResponse | null {
  const db = getDb();
  const row = db.prepare('SELECT data, updated_at FROM market_trends_cache WHERE id = 1').get() as { data: string; updated_at: string } | undefined;

  if (!row) return null;

  const updatedAt = new Date(row.updated_at);
  const now = new Date();
  const hoursDiff = (now.getTime() - updatedAt.getTime()) / (1000 * 60 * 60);

  if (hoursDiff > 24) return null;

  try {
    const parsed = JSON.parse(row.data);
    if (!parsed.monthlyData || !parsed.statistics) return null;
    return parsed;
  } catch {
    return null;
  }
}

function saveCachedData(data: MarketTrendResponse) {
  const db = getDb();
  const stmt = db.prepare(`
    INSERT OR REPLACE INTO market_trends_cache (id, data, updated_at)
    VALUES (1, ?, CURRENT_TIMESTAMP)
  `);
  stmt.run(JSON.stringify(data));
}

router.get('/', async (req: Request, res: Response) => {
  try {
    initCacheTable();

    let data = getCachedData();

    if (!data) {
      console.log('📊 공공데이터 API에서 최신 데이터 가져오는 중...');
      data = await fetchMarketTrendData();

      if (data.area84.monthlyData.length > 0 || data.area59.monthlyData.length > 0) {
        saveCachedData(data);
        console.log('✅ 데이터 캐시 저장 완료');
      } else {
        console.warn('⚠️ 데이터가 비어있어 캐시하지 않음');
      }
    } else {
      console.log('✅ 캐시된 데이터 사용 (24시간 유효)');
    }

    res.json({ success: true, data });
  } catch (error) {
    console.error('Market trends API error:', error);
    res.status(500).json({
      success: false,
      error: '시장 동향 데이터를 가져오는데 실패했습니다.'
    });
  }
});

router.post('/refresh', async (req: Request, res: Response) => {
  try {
    console.log('🔄 수동 데이터 갱신 요청...');
    initCacheTable();
    const data = await fetchMarketTrendData();

    if (data.area84.monthlyData.length > 0 || data.area59.monthlyData.length > 0) {
      saveCachedData(data);
    }

    res.json({ success: true, message: '데이터가 갱신되었습니다.', data });
  } catch (error) {
    console.error('Refresh error:', error);
    res.status(500).json({
      success: false,
      error: '데이터 갱신에 실패했습니다.'
    });
  }
});

export default router;
