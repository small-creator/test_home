// 네이버부동산 HTML 구조 상세 분석
async function testNaverHTML() {
  const url = 'https://fin.land.naver.com/complexes/113907?articleSortingType=PRICE_ASC&articleTradeTypes=A1&tab=article&transactionPyeongTypeNumber=3&transactionTradeType=A1&articlePyeongTypeNumbers=1-2-3-4';

  try {
    console.log('📡 네이버부동산 페이지 요청 중...\n');
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7',
      }
    });

    const html = await response.text();

    // article-list 부분 추출
    const articleListMatch = html.match(/<div[^>]*id="article-list"[^>]*>(.*?)<\/div>/s);

    if (articleListMatch) {
      console.log('✅ article-list div 발견!');
      console.log('📄 내용 (처음 2000자):');
      console.log(articleListMatch[1].substring(0, 2000));
      console.log('\n');
    } else {
      console.log('⚠️ article-list div를 정확히 찾을 수 없음');
    }

    // <li> 태그 찾기
    const liMatches = html.match(/<li[^>]*>(.*?)<\/li>/gs);
    if (liMatches) {
      console.log(`📋 <li> 태그 개수: ${liMatches.length}`);
      console.log('📄 첫 번째 <li> 내용 (처음 1000자):');
      console.log(liMatches[0].substring(0, 1000));
    }

    // React 앱인지 확인
    if (html.includes('id="__next"') || html.includes('id="root"')) {
      console.log('\n⚠️ React SPA 감지! 클라이언트 사이드 렌더링입니다.');
      console.log('   → Cheerio로는 매물 데이터를 추출할 수 없습니다.');
      console.log('   → Playwright가 필요합니다.\n');

      // root div 내용 확인
      const rootMatch = html.match(/<div id="(__next|root)"[^>]*>(.*?)<\/div>/s);
      if (rootMatch) {
        console.log('📦 React 루트 div 내용:');
        console.log(rootMatch[2].trim() || '(비어있음 - JavaScript로 렌더링됨)');
      }
    }

    // API 호출 힌트 찾기
    console.log('\n🔍 잠재적 API 엔드포인트 검색:');
    const apiPatterns = [
      /api\/[a-zA-Z0-9\/\-]+/g,
      /\/complexes\/\d+\/articles/g,
      /graphql/gi
    ];

    apiPatterns.forEach(pattern => {
      const matches = html.match(pattern);
      if (matches && matches.length > 0) {
        const unique = [...new Set(matches)];
        console.log(`  ${pattern}: ${unique.join(', ')}`);
      }
    });

  } catch (error) {
    console.error('❌ 에러:', error.message);
  }
}

testNaverHTML();
