// 더 긴 대기 시간으로 테스트
const { chromium } = require('playwright');

async function testWithLongerWait() {
  console.log('🔍 긴 대기 시간으로 테스트...\n');

  const browser = await chromium.launch({
    headless: false, // 실제 브라우저 표시
    slowMo: 100 // 느린 모션
  });

  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    locale: 'ko-KR',
    viewport: { width: 1920, height: 1080 }
  });

  const page = await context.newPage();

  try {
    console.log('📡 페이지 이동: 고덕그라시움 전체 매물\n');

    await page.goto('https://fin.land.naver.com/complexes/113907?tab=article', {
      waitUntil: 'networkidle',
      timeout: 60000
    });

    console.log('⏳ 5초 대기...\n');
    await page.waitForTimeout(5000);

    // HTML 구조 확인
    const articleListExists = await page.locator('#article-list').count();
    console.log(`article-list 존재: ${articleListExists > 0 ? '✅' : '❌'}\n`);

    // 매물 리스트 확인
    const articleCount = await page.locator('#article-list > ul > li').count();
    console.log(`매물 개수: ${articleCount}개\n`);

    // 전체 HTML 구조 확인
    const articleListHTML = await page.locator('#article-list').innerHTML();
    console.log('article-list HTML 샘플:');
    console.log(articleListHTML.substring(0, 500));
    console.log('\n');

    if (articleCount === 0) {
      console.log('⚠️ 매물이 0개입니다. 페이지 스크린샷을 확인하세요.\n');
      await page.screenshot({ path: 'browser-screenshot.png', fullPage: true });
      console.log('📸 스크린샷 저장: browser-screenshot.png\n');

      // 매물 없음 메시지 확인
      const noArticleText = await page.textContent('body');
      if (noArticleText.includes('매물이 없습니다') || noArticleText.includes('매물 0')) {
        console.log('✅ 실제로 매물이 없는 것이 맞습니다.\n');
      }

      console.log('💡 브라우저를 30초간 열어둡니다. 직접 확인해주세요...');
      await page.waitForTimeout(30000);
    } else {
      console.log('✅ 매물 발견!');

      const firstArticle = page.locator('#article-list > ul > li:nth-child(1)');
      const articleText = await firstArticle.textContent();
      console.log('첫 번째 매물 정보:');
      console.log(articleText);
      console.log('\n');

      // 가격 추출
      try {
        const priceSpan = await firstArticle.locator('[class*="area-price"] span').first();
        const price = await priceSpan.textContent();
        console.log(`💰 가격: ${price}\n`);
      } catch (e) {
        console.log('⚠️ 가격 추출 실패:', e.message);
      }

      await page.screenshot({ path: 'success-screenshot.png' });
      console.log('📸 스크린샷 저장: success-screenshot.png\n');
    }

  } catch (error) {
    console.error('❌ 에러:', error.message);
    await page.screenshot({ path: 'error-screenshot.png' });
  } finally {
    console.log('\n브라우저를 10초 후 종료합니다...');
    await page.waitForTimeout(10000);
    await browser.close();
  }
}

testWithLongerWait();
