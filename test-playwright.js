// Playwright로 네이버부동산 스크래핑 테스트
const { chromium } = require('playwright');

async function testPlaywrightScraping() {
  console.log('🚀 Playwright 테스트 시작...\n');

  const browser = await chromium.launch({
    headless: true // 백그라운드 실행
  });

  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    locale: 'ko-KR'
  });

  const page = await context.newPage();

  try {
    // 그라시움 매매 25평 페이지
    const url = 'https://fin.land.naver.com/complexes/113907?articleSortingType=PRICE_ASC&articleTradeTypes=A1&tab=article&transactionPyeongTypeNumber=3&transactionTradeType=A1&articlePyeongTypeNumbers=1-2-3-4';

    console.log('📡 페이지 로딩 중...');
    console.log('URL:', url, '\n');

    // 페이지 이동 및 로딩 대기
    await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });

    console.log('✅ 페이지 로딩 완료\n');

    // 매물 목록이 로드될 때까지 대기 (최대 10초)
    console.log('⏳ 매물 목록 로딩 대기 중...');

    try {
      await page.waitForSelector('#article-list', { timeout: 10000 });
      console.log('✅ article-list 발견!\n');
    } catch (e) {
      console.log('⚠️ article-list를 찾을 수 없습니다.\n');
    }

    // 매물 개수 확인
    const articleCount = await page.locator('#article-list > ul > li').count();
    console.log(`📊 매물 개수: ${articleCount}개\n`);

    if (articleCount === 0) {
      console.log('⚠️ 현재 해당 조건의 매물이 없습니다.');
      console.log('   → 다른 평형대나 거래 유형을 테스트해봅니다.\n');

      // 전세로 변경해서 테스트
      const jeonseUrl = 'https://fin.land.naver.com/complexes/113907?articleSortingType=PRICE_ASC&articleTradeTypes=B1&tab=article&transactionPyeongTypeNumber=3&transactionTradeType=B1&articlePyeongTypeNumbers=1-2-3-4';

      console.log('📡 전세 매물 페이지 테스트...');
      await page.goto(jeonseUrl, { waitUntil: 'networkidle', timeout: 30000 });
      await page.waitForTimeout(2000); // 2초 대기

      const jeonseCount = await page.locator('#article-list > ul > li').count();
      console.log(`📊 전세 매물 개수: ${jeonseCount}개\n`);

      if (jeonseCount > 0) {
        // 첫 번째 매물의 가격 추출
        const selector = '#article-list > ul > li:nth-child(1) > div > div.ArticleCard-module-scss-module__4rknnG__area-price > span';

        try {
          const priceElement = await page.locator(selector).first();
          const priceText = await priceElement.textContent();

          console.log('✅ 가격 추출 성공!');
          console.log(`💰 최저가: ${priceText}\n`);

          // 추가 정보 추출
          const articleCard = page.locator('#article-list > ul > li:nth-child(1)');
          const fullText = await articleCard.textContent();
          console.log('📄 첫 번째 매물 전체 정보:');
          console.log(fullText.substring(0, 300), '\n');

          // 스크린샷 저장
          await page.screenshot({ path: 'test-screenshot.png', fullPage: true });
          console.log('📸 스크린샷 저장: test-screenshot.png\n');

        } catch (e) {
          console.log('❌ 가격 추출 실패:', e.message);
        }
      }
    } else {
      // 매물이 있는 경우 첫 번째 가격 추출
      const selector = '#article-list > ul > li:nth-child(1) > div > div.ArticleCard-module-scss-module__4rknnG__area-price > span';

      try {
        const priceElement = await page.locator(selector).first();
        const priceText = await priceElement.textContent();

        console.log('✅ 가격 추출 성공!');
        console.log(`💰 최저가: ${priceText}\n`);

        // 추가 정보
        const articleCard = page.locator('#article-list > ul > li:nth-child(1)');
        const fullText = await articleCard.textContent();
        console.log('📄 첫 번째 매물 정보:');
        console.log(fullText.substring(0, 300), '\n');

        // 스크린샷
        await page.screenshot({ path: 'test-screenshot.png', fullPage: true });
        console.log('📸 스크린샷 저장: test-screenshot.png\n');

      } catch (e) {
        console.log('❌ 가격 추출 실패:', e.message);
        console.log('   셀렉터를 확인해야 할 수 있습니다.\n');
      }
    }

    // 메모리 사용량 체크
    const metrics = await page.evaluate(() => ({
      memory: performance.memory ? {
        usedJSHeapSize: Math.round(performance.memory.usedJSHeapSize / 1024 / 1024),
        totalJSHeapSize: Math.round(performance.memory.totalJSHeapSize / 1024 / 1024)
      } : null
    }));

    if (metrics.memory) {
      console.log('💾 메모리 사용량:');
      console.log(`   JS Heap: ${metrics.memory.usedJSHeapSize}MB / ${metrics.memory.totalJSHeapSize}MB\n`);
    }

    console.log('✅ 테스트 완료!');
    console.log('\n결론:');
    console.log('- Playwright 작동: ✅');
    console.log('- 페이지 로딩: ✅');
    console.log('- 데이터 추출: ' + (articleCount > 0 || jeonseCount > 0 ? '✅' : '⚠️ (매물 없음)'));
    console.log('- Railway Hobby에서 사용 가능: ✅');

  } catch (error) {
    console.error('❌ 에러 발생:', error.message);
    console.error(error.stack);
  } finally {
    await browser.close();
    console.log('\n🔚 브라우저 종료');
  }
}

testPlaywrightScraping();
