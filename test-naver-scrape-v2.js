// 네이버부동산 __NEXT_DATA__ 파싱 테스트
async function testNaverNextData() {
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

    // __NEXT_DATA__ 추출
    const nextDataMatch = html.match(/<script id="__NEXT_DATA__" type="application\/json">(.*?)<\/script>/s);

    if (!nextDataMatch) {
      console.log('❌ __NEXT_DATA__를 찾을 수 없습니다.');
      return;
    }

    console.log('✅ __NEXT_DATA__ 발견!\n');
    const nextData = JSON.parse(nextDataMatch[1]);

    // 구조 탐색
    console.log('📦 최상위 키:', Object.keys(nextData).join(', '));

    if (nextData.props?.pageProps) {
      console.log('📦 pageProps 키:', Object.keys(nextData.props.pageProps).join(', '));

      const pageProps = nextData.props.pageProps;

      // articles 또는 articleList 찾기
      const possibleKeys = ['articles', 'articleList', 'data', 'initialData', 'dehydratedState'];

      for (const key of possibleKeys) {
        if (pageProps[key]) {
          console.log(`\n✅ "${key}" 발견!`);
          console.log(`   타입: ${typeof pageProps[key]}, 길이: ${Array.isArray(pageProps[key]) ? pageProps[key].length : 'N/A'}`);

          if (Array.isArray(pageProps[key]) && pageProps[key].length > 0) {
            console.log('\n📄 첫 번째 매물 데이터:');
            console.log(JSON.stringify(pageProps[key][0], null, 2).substring(0, 1500));

            // 가격 정보 찾기
            const firstArticle = pageProps[key][0];
            const priceFields = Object.keys(firstArticle).filter(k =>
              k.toLowerCase().includes('price') ||
              k.toLowerCase().includes('amount') ||
              k === 'dealOrWarrantPrc'
            );

            if (priceFields.length > 0) {
              console.log('\n💰 가격 관련 필드:', priceFields.join(', '));
              priceFields.forEach(field => {
                console.log(`   ${field}: ${firstArticle[field]}`);
              });
            }
          }
        }
      }

      // dehydratedState 확인 (React Query)
      if (pageProps.dehydratedState?.queries) {
        console.log('\n🔍 React Query 데이터 발견!');
        const queries = pageProps.dehydratedState.queries;
        console.log(`   쿼리 개수: ${queries.length}`);

        queries.forEach((query, idx) => {
          if (query.state?.data?.articleList || query.state?.data?.articles) {
            console.log(`\n✅ 쿼리 ${idx}에서 매물 목록 발견!`);
            const articles = query.state.data.articleList || query.state.data.articles;
            console.log(`   매물 개수: ${articles.length}`);

            if (articles.length > 0) {
              console.log('\n📄 첫 번째 매물:');
              console.log(JSON.stringify(articles[0], null, 2).substring(0, 1000));
            }
          }
        });
      }
    }

  } catch (error) {
    console.error('❌ 에러:', error.message);
    console.error(error.stack);
  }
}

testNaverNextData();
