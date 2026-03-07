import { getDb } from './db';

const db = getDb();

// Hardcoded data from App.tsx
const listings = [
  {
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    price: "17억 5,000만",
    title: "고덕그라시움 105동 고층",
    type: "매매",
    size: "84㎡",
    bed: 3,
    bath: 2,
    tags: ["로얄동", "탁트인뷰", "올수리"]
  },
  {
    image: "https://images.unsplash.com/photo-1600607687931-cecebd808ce3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    price: "12억 8,000만",
    title: "고덕그라시움 112동 중층",
    type: "매매",
    size: "59㎡",
    bed: 3,
    bath: 2,
    tags: ["역세권", "초품아", "남향"]
  },
  {
    image: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    price: "8억 5,000만",
    title: "고덕그라시움 120동 로얄층",
    type: "전세",
    size: "84㎡",
    bed: 3,
    bath: 2,
    tags: ["융자없음", "즉시입주", "공원뷰"]
  }
];

const news = [
  {
    category: "뉴스",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuB7kGdbz147jaNt4yt4g__3zCOsdnVuCOBpWYqvQAOjzlN2Fro0MLrLc6RLS_dx82lQTX1Ng5SyyEe7zEwgZmefcokpJhp1gdDrlbFxRLVgrd0pDIwD3j-0Roege4JUkzGnb9FRl2x7VsBKPJI6nBlmXEj2R29OwRMu2A_VvVsbjtr3_7gNKEapC0bdWvbWrHddPzI2GUusKX6Uvf_hhT9HY8CWkZJ6PwOennUytUtzM1SXFjUvTQNfcdX4NH4mLNJBNdJZO8v2h0k",
    title: "지하철 9호선 연장 업데이트",
    description: "새로운 역 개통 일정에 대한 시의회의 최신 발표 내용입니다. 교통 호재가 시세에 미칠 영향을 분석했습니다."
  },
  {
    category: "가이드",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDDXwUKped2Y-Qzo-aym7qFFeVxePAW3iinLS_UJgOon_rDg0eljmDul4EG2ueoaHeYasBXhz9kS0zqeDRncjDHjLb8iNAJSkx2g8p4qoBqCOJcgPeBv8wysjB0xwXF9Q8tcjoF09aiNVao4uK8H5rUbjFuWCEXonAVnDOX29f0U1Lvxy01uTONnss8LyJ0D-amCfxxBXXrLjhg9HofAb8OdPVjVSb5CdKUb51D4_7LIcg8mpnbh8kCh3S0jen5gAS97smm1MKLLIU",
    title: "2024 부동산 세금 가이드",
    description: "다주택자를 위한 새로운 재산세 규정 이해 및 세금 최적화 방법. 절세를 위한 필독 가이드."
  },
  {
    category: "커뮤니티",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBWrISpklJNk_M-qhCpqo_HQaHMx4tbRXuwJgI3E8mQGw7ZG7nTQH9BGQ93y8i9MGF6YJcOLNFx8odVvGOSs3-_8te6Biu1T_AoH4IMEvLdaW9SNe7KO1ta8G2WSM-XE_3QjQzBDgQl-1WKVkfYXUV0uxUHQVqHrS5Ij8uzOGRmXws4ED8T8WWxjdIIgWn_971xO17OgYMYk9O0QAe5B2fOumzuZhUR74mJ5c_EBV83WOdPpKH_gHsEGWZk7_P8Ur4MseUMcw2shy8",
    title: "가족과 함께하기 좋은 동네 공원",
    description: "주말 가족 나들이에 완벽한 그라시움 주변의 숨겨진 명소와 놀이터를 발견하세요."
  }
];

async function migrate() {
  console.log('🚀 Starting data migration...');

  try {
    // Clear existing data
    db.prepare('DELETE FROM listings').run();
    db.prepare('DELETE FROM news').run();
    console.log('✅ Cleared existing data');

    // Insert listings
    const listingStmt = db.prepare(`
      INSERT INTO listings (image, price, title, type, size, bed, bath, tags)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);

    for (const listing of listings) {
      listingStmt.run(
        listing.image,
        listing.price,
        listing.title,
        listing.type,
        listing.size,
        listing.bed,
        listing.bath,
        JSON.stringify(listing.tags)
      );
    }
    console.log(`✅ Inserted ${listings.length} listings`);

    // Insert news
    const newsStmt = db.prepare(`
      INSERT INTO news (category, image, title, description)
      VALUES (?, ?, ?, ?)
    `);

    for (const item of news) {
      newsStmt.run(
        item.category,
        item.image,
        item.title,
        item.description
      );
    }
    console.log(`✅ Inserted ${news.length} news items`);

    console.log('🎉 Migration completed successfully!');
    console.log('');
    console.log('Database contents:');
    console.log('==================');

    // Display listings
    const listingsCount = db.prepare('SELECT COUNT(*) as count FROM listings').get() as { count: number };
    console.log(`📋 Listings: ${listingsCount.count}`);

    const allListings = db.prepare('SELECT id, title, type, price FROM listings').all();
    allListings.forEach((listing: any) => {
      console.log(`  - [${listing.id}] ${listing.title} (${listing.type}) - ${listing.price}`);
    });

    console.log('');

    // Display news
    const newsCount = db.prepare('SELECT COUNT(*) as count FROM news').get() as { count: number };
    console.log(`📰 News: ${newsCount.count}`);

    const allNews = db.prepare('SELECT id, category, title FROM news').all();
    allNews.forEach((item: any) => {
      console.log(`  - [${item.id}] [${item.category}] ${item.title}`);
    });

  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }

  process.exit(0);
}

// Run migration
migrate();
