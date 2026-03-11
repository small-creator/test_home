// 네이버부동산 API 직접 호출 테스트
async function testNaverAPI() {
  const apiUrl = 'https://fin.land.naver.com/front-api/v1/complex/article/list';

  // 그라시움 매매 25평 (pyeongTypes: 1,2,3,4는 4개 타입)
  const requestBody = {
    size: 30,
    complexNumber: '113907',
    tradeTypes: ['A1'], // A1 = 매매, B1 = 전세
    pyeongTypes: [1, 2, 3, 4], // 25평의 4개 타입
    dongNumbers: [],
    userChannelType: 'PC',
    articleSortType: 'PRICE_ASC',
    seed: '',
    lastInfo: []
  };

  console.log('📡 네이버부동산 API 호출 테스트\n');
  console.log('요청 URL:', apiUrl);
  console.log('요청 Body:', JSON.stringify(requestBody, null, 2));
  console.log('\n=== 테스트 1: 쿠키 없이 호출 ===');

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'accept': 'application/json, text/plain, */*',
        'accept-language': 'ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7',
        'content-type': 'application/json',
        'origin': 'https://fin.land.naver.com',
        'referer': 'https://fin.land.naver.com/complexes/113907',
        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      },
      body: JSON.stringify(requestBody)
    });

    console.log('응답 상태:', response.status, response.statusText);
    console.log('Content-Type:', response.headers.get('content-type'));

    if (response.ok) {
      const data = await response.json();
      console.log('\n✅ 성공! 쿠키 없이 API 호출 가능합니다!\n');
      console.log('응답 데이터 구조:');
      console.log('- 키:', Object.keys(data).join(', '));

      if (data.articleList || data.articles || data.list) {
        const articles = data.articleList || data.articles || data.list;
        console.log(`- 매물 개수: ${articles.length}개`);

        if (articles.length > 0) {
          console.log('\n📄 첫 번째 매물 데이터:');
          console.log(JSON.stringify(articles[0], null, 2));

          // 가격 필드 찾기
          const firstArticle = articles[0];
          const priceFields = Object.keys(firstArticle).filter(k =>
            k.toLowerCase().includes('price') ||
            k.toLowerCase().includes('amount') ||
            k.toLowerCase().includes('prc')
          );

          if (priceFields.length > 0) {
            console.log('\n💰 가격 관련 필드:');
            priceFields.forEach(field => {
              console.log(`   - ${field}: ${firstArticle[field]}`);
            });
          }

          // 평형 정보 찾기
          const areaFields = Object.keys(firstArticle).filter(k =>
            k.toLowerCase().includes('area') ||
            k.toLowerCase().includes('pyeong') ||
            k.toLowerCase().includes('size')
          );

          if (areaFields.length > 0) {
            console.log('\n📐 평형 관련 필드:');
            areaFields.forEach(field => {
              console.log(`   - ${field}: ${firstArticle[field]}`);
            });
          }
        } else {
          console.log('\n⚠️ 현재 해당 조건의 매물이 없습니다.');
        }
      } else {
        console.log('\n⚠️ 매물 목록을 찾을 수 없습니다.');
        console.log('전체 응답:', JSON.stringify(data, null, 2).substring(0, 1000));
      }
    } else {
      const errorText = await response.text();
      console.log('\n❌ 실패! 응답 내용:');
      console.log(errorText.substring(0, 500));

      if (response.status === 401 || response.status === 403) {
        console.log('\n⚠️ 인증이 필요한 API입니다. 쿠키가 필요할 수 있습니다.');
      }
    }
  } catch (error) {
    console.error('\n❌ 에러 발생:', error.message);
  }

  // 다른 평형대 테스트 (34평)
  console.log('\n\n=== 테스트 2: 34평 매물 조회 ===');
  const requestBody34 = {
    ...requestBody,
    pyeongTypes: [5, 6, 7, 8] // 34평의 타입 번호 (추정)
  };

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'accept': 'application/json, text/plain, */*',
        'content-type': 'application/json',
        'origin': 'https://fin.land.naver.com',
        'referer': 'https://fin.land.naver.com/complexes/113907',
        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      body: JSON.stringify(requestBody34)
    });

    if (response.ok) {
      const data = await response.json();
      const articles = data.articleList || data.articles || data.list || [];
      console.log(`34평 매물 개수: ${articles.length}개`);
    }
  } catch (error) {
    console.error('34평 조회 에러:', error.message);
  }
}

testNaverAPI();
