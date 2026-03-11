// 실제 데이터 추출 확인 테스트
const { chromium } = require('playwright');

async function testDataExtraction() {
  console.log('🔍 실제 데이터 추출 테스트...\n');

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    locale: 'ko-KR'
  });

  const page = await context.newPage();

  try {
    // 고덕그라시움 - 모든 매물 (필터 없이)
    console.log('📊 테스트 1: 고덕그라시움 - 전체 매물');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    await page.goto('https://fin.land.naver.com/complexes/113907?tab=article', {
      waitUntil: 'networkidle',
      timeout: 30000
    });

    await page.waitForSelector('#article-list', { timeout: 10000 });
    await page.waitForTimeout(2000); // 렌더링 대기

    const articleCount = await page.locator('#article-list > ul > li').count();
    console.log(`📋 매물 개수: ${articleCount}개\n`);

    if (articleCount > 0) {
      console.log('✅ 매물 발견! 데이터 추출 시작...\n');

      // 첫 5개 매물 정보 추출
      const articles = await page.locator('#article-list > ul > li').all();
      const extractedData = [];

      for (let i = 0; i < Math.min(articles.length, 5); i++) {
        try {
          const article = articles[i];

          // 가격
          const priceElement = await article.locator('[class*="area-price"] span').first();
          const price = await priceElement.textContent();

          // 전체 텍스트
          const fullText = await article.textContent();

          // 거래 유형과 평형대 추출 시도
          const lines = fullText.split('\n').map(l => l.trim()).filter(l => l);

          extractedData.push({
            index: i + 1,
            price: price.trim(),
            lines: lines.slice(0, 6) // 처음 6줄
          });

        } catch (e) {
          console.log(`⚠️ 매물 ${i + 1} 추출 실패: ${e.message}`);
        }
      }

      console.log('📄 추출된 매물 정보:\n');
      extractedData.forEach(item => {
        console.log(`${item.index}. 가격: ${item.price}`);
        console.log(`   정보: ${item.lines.join(' | ')}`);
        console.log('');
      });

      // 스크린샷
      await page.screenshot({ path: 'data-extraction-test.png', fullPage: false });
      console.log('📸 스크린샷 저장: data-extraction-test.png\n');

      // 필터링 테스트: 매매만
      console.log('\n📊 테스트 2: 매매만 필터링');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

      await page.goto('https://fin.land.naver.com/complexes/113907?articleTradeTypes=A1&tab=article&articleSortingType=PRICE_ASC', {
        waitUntil: 'networkidle',
        timeout: 30000
      });

      await page.waitForTimeout(2000);
      const saleCount = await page.locator('#article-list > ul > li').count();
      console.log(`📋 매매 매물 개수: ${saleCount}개`);

      if (saleCount > 0) {
        const firstPrice = await page.locator('#article-list > ul > li:nth-child(1) [class*="area-price"] span').first().textContent();
        console.log(`💰 최저가: ${firstPrice.trim()}\n`);
      }

      // 전세만
      console.log('\n📊 테스트 3: 전세만 필터링');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

      await page.goto('https://fin.land.naver.com/complexes/113907?articleTradeTypes=B1&tab=article&articleSortingType=PRICE_ASC', {
        waitUntil: 'networkidle',
        timeout: 30000
      });

      await page.waitForTimeout(2000);
      const jeonseCount = await page.locator('#article-list > ul > li').count();
      console.log(`📋 전세 매물 개수: ${jeonseCount}개`);

      if (jeonseCount > 0) {
        const firstPrice = await page.locator('#article-list > ul > li:nth-child(1) [class*="area-price"] span').first().textContent();
        console.log(`💰 최저가: ${firstPrice.trim()}\n`);
      }

      console.log('\n✅ 데이터 추출 테스트 완료!');
      console.log('\n결과:');
      console.log(`- 전체 매물: ${articleCount}개`);
      console.log(`- 매매 매물: ${saleCount}개`);
      console.log(`- 전세 매물: ${jeonseCount}개`);
      console.log('- 데이터 추출: ✅ 성공');

    } else {
      console.log('❌ 매물이 전혀 없습니다.');
      console.log('   다른 단지로 테스트해보겠습니다...\n');

      // 다른 유명 단지 테스트
      const otherComplexes = [
        { name: '헬리오시티', id: '107465' },
        { name: '래미안강동팰리스', id: '16982' },
        { name: '강일리버파크', id: '113908' }
      ];

      for (const complex of otherComplexes) {
        console.log(`\n📊 ${complex.name} 테스트...`);
        await page.goto(`https://fin.land.naver.com/complexes/${complex.id}?tab=article`, {
          waitUntil: 'networkidle',
          timeout: 30000
        });

        await page.waitForTimeout(2000);
        const count = await page.locator('#article-list > ul > li').count();
        console.log(`   매물 개수: ${count}개`);

        if (count > 0) {
          const firstPrice = await page.locator('#article-list > ul > li:nth-child(1) [class*="area-price"] span').first().textContent();
          console.log(`   최저가: ${firstPrice.trim()}`);
          console.log(`   ✅ ${complex.name}에서 데이터 추출 성공!\n`);
          break;
        }
      }
    }

  } catch (error) {
    console.error('❌ 에러:', error.message);
    console.error(error.stack);
  } finally {
    await browser.close();
    console.log('\n🔚 브라우저 종료');
  }
}

testDataExtraction();
