// 네이버부동산 스크래핑 테스트
async function testNaverScraping() {
  const url = 'https://fin.land.naver.com/complexes/113907?articleSortingType=PRICE_ASC&articleTradeTypes=A1&tab=article&transactionPyeongTypeNumber=3&transactionTradeType=A1&articlePyeongTypeNumbers=1-2-3-4';

  try {
    console.log('📡 네이버부동산 페이지 요청 중...');
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7',
      }
    });

    console.log('📊 응답 상태:', response.status, response.statusText);
    console.log('📋 Content-Type:', response.headers.get('content-type'));

    const html = await response.text();
    console.log('📄 HTML 길이:', html.length, 'bytes');

    // HTML 구조 확인
    if (html.includes('article-list')) {
      console.log('✅ article-list 엘리먼트 발견!');
    } else {
      console.log('❌ article-list 엘리먼트 없음 - JavaScript 렌더링 페이지일 가능성 높음');
    }

    // 가격 패턴 검색
    const pricePatterns = [
      /\d+억/g,
      /\d+,\d+만/g,
      /price/gi,
      /article-list/gi
    ];

    console.log('\n🔍 HTML 내용 분석:');
    pricePatterns.forEach(pattern => {
      const matches = html.match(pattern);
      if (matches && matches.length > 0) {
        console.log(`  - ${pattern}: ${matches.slice(0, 3).join(', ')}... (총 ${matches.length}개)`);
      }
    });

    // __NEXT_DATA__ 확인 (Next.js SSR)
    if (html.includes('__NEXT_DATA__')) {
      console.log('\n✅ Next.js SSR 페이지 감지! JSON 데이터에서 파싱 가능할 수 있음');

      // __NEXT_DATA__ 추출 시도
      const nextDataMatch = html.match(/<script id="__NEXT_DATA__" type="application\/json">(.*?)<\/script>/s);
      if (nextDataMatch) {
        try {
          const nextData = JSON.parse(nextDataMatch[1]);
          console.log('📦 __NEXT_DATA__ 구조:', Object.keys(nextData).join(', '));

          // props 확인
          if (nextData.props?.pageProps) {
            console.log('📦 pageProps 키:', Object.keys(nextData.props.pageProps).join(', '));
          }
        } catch (e) {
          console.log('⚠️ __NEXT_DATA__ 파싱 실패:', e.message);
        }
      }
    }

    // 첫 1000자 출력
    console.log('\n📝 HTML 샘플 (처음 1000자):');
    console.log(html.substring(0, 1000));

  } catch (error) {
    console.error('❌ 에러 발생:', error.message);
  }
}

testNaverScraping();
