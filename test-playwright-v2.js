// Playwright 성능 테스트 - 실제 매물로 시간 측정
const { chromium } = require('playwright');

async function testPerformance() {
  console.log('⏱️ Playwright 성능 테스트 시작...\n');

  const startTime = Date.now();
  const browser = await chromium.launch({ headless: true });
  const browserTime = Date.now() - startTime;
  console.log(`✅ 브라우저 시작: ${browserTime}ms\n`);

  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    locale: 'ko-KR'
  });

  const page = await context.newPage();

  try {
    // 여러 조건 테스트 (매물이 있을 때까지)
    const testCases = [
      {
        name: '그라시움 매매 전체',
        url: 'https://fin.land.naver.com/complexes/113907?articleSortingType=PRICE_ASC&articleTradeTypes=A1&tab=article',
        selector: '#article-list > ul > li:nth-child(1) > div > div[class*="area-price"] > span'
      },
      {
        name: '그라시움 전세 전체',
        url: 'https://fin.land.naver.com/complexes/113907?articleSortingType=PRICE_ASC&articleTradeTypes=B1&tab=article',
        selector: '#article-list > ul > li:nth-child(1) > div > div[class*="area-price"] > span'
      },
      {
        name: '아르테온 매매 전체',
        url: 'https://fin.land.naver.com/complexes/105309?articleSortingType=PRICE_ASC&articleTradeTypes=A1&tab=article',
        selector: '#article-list > ul > li:nth-child(1) > div > div[class*="area-price"] > span'
      }
    ];

    for (const testCase of testCases) {
      console.log(`\n📊 테스트: ${testCase.name}`);
      console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);

      const pageStartTime = Date.now();

      // 페이지 로딩
      await page.goto(testCase.url, { waitUntil: 'networkidle', timeout: 30000 });
      const pageLoadTime = Date.now() - pageStartTime;

      // 매물 목록 대기
      const selectorStartTime = Date.now();
      await page.waitForSelector('#article-list', { timeout: 10000 });
      await page.waitForTimeout(1000); // 추가 렌더링 대기

      const articleCount = await page.locator('#article-list > ul > li').count();
      const selectorTime = Date.now() - selectorStartTime;

      console.log(`⏱️ 페이지 로딩: ${pageLoadTime}ms`);
      console.log(`⏱️ 데이터 렌더링: ${selectorTime}ms`);
      console.log(`⏱️ 총 시간: ${pageLoadTime + selectorTime}ms`);
      console.log(`📊 매물 개수: ${articleCount}개`);

      if (articleCount > 0) {
        try {
          const priceElement = await page.locator(testCase.selector).first();
          const priceText = await priceElement.textContent();
          console.log(`💰 최저가: ${priceText}`);

          // 전체 매물 정보 추출
          const articles = await page.locator('#article-list > ul > li').all();
          const prices = [];

          for (let i = 0; i < Math.min(articles.length, 5); i++) {
            try {
              const priceSpan = await articles[i].locator('div[class*="area-price"] > span').first();
              const price = await priceSpan.textContent();
              prices.push(price);
            } catch (e) {
              // 스킵
            }
          }

          console.log(`📋 상위 5개 가격: ${prices.join(', ')}`);
          console.log(`✅ 데이터 추출 성공!\n`);

          // 첫 번째 성공한 케이스로 충분
          break;

        } catch (e) {
          console.log(`⚠️ 가격 추출 실패: ${e.message}`);
        }
      } else {
        console.log(`⚠️ 매물 없음\n`);
      }
    }

    const totalTime = Date.now() - startTime;
    console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
    console.log(`⏱️ 전체 실행 시간: ${totalTime}ms (${(totalTime / 1000).toFixed(2)}초)`);
    console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`);

    console.log('💡 중요 포인트:');
    console.log('   - 이 시간은 백그라운드에서 24시간마다 실행됩니다');
    console.log('   - 사용자는 캐시된 데이터를 즉시 봅니다 (0ms)');
    console.log('   - MARKET TRENDS와 동일한 방식입니다');
    console.log('   - UX에 영향 없습니다!\n');

  } catch (error) {
    console.error('❌ 에러:', error.message);
  } finally {
    await browser.close();
    console.log('🔚 브라우저 종료');
  }
}

testPerformance();
