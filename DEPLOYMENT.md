# 🚂 Railway 배포 가이드

큰문부동산 웹사이트를 Railway에 배포하는 방법입니다.

## 📋 사전 준비

1. **GitHub 계정** - Railway와 연동에 필요
2. **Railway 계정** - [railway.app](https://railway.app)에서 가입 (GitHub 계정으로 무료 가입)

## 🚀 배포 단계

### 1단계: GitHub에 코드 푸시

```bash
# Git 초기화 (아직 안했다면)
git init

# 파일 추가
git add .

# 커밋
git commit -m "Initial commit"

# GitHub 원격 저장소 추가 (본인의 GitHub 저장소 URL로 변경)
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git

# 푸시
git push -u origin main
```

### 2단계: Railway 프로젝트 생성

1. [Railway 대시보드](https://railway.app/dashboard) 접속
2. **"New Project"** 클릭
3. **"Deploy from GitHub repo"** 선택
4. 본인의 GitHub 저장소 선택
5. 자동으로 배포 시작!

### 3단계: 환경변수 설정

Railway 프로젝트 페이지에서:

1. **"Variables"** 탭 클릭
2. 다음 환경변수 추가:

```
NODE_ENV=production
PORT=3001
ADMIN_PASSWORD=큰문admin2024
DB_PATH=./data/realestate.db
```

> **중요**: `ADMIN_PASSWORD`는 반드시 안전한 비밀번호로 변경하세요!

### 4단계: 데이터베이스 초기화

Railway CLI를 사용하여 마이그레이션 실행:

```bash
# Railway CLI 설치 (한 번만)
npm install -g @railway/cli

# Railway 로그인
railway login

# 프로젝트 연결
railway link

# 마이그레이션 실행
railway run npm run migrate
```

또는 Railway 대시보드에서:
1. **"Deployments"** 탭
2. 최신 배포 클릭
3. **"Command"** 입력창에 `npm run migrate` 입력 후 실행

### 5단계: 배포 확인

1. Railway 대시보드에서 **"Settings"** 탭
2. **"Generate Domain"** 클릭하여 공개 URL 생성
3. 생성된 URL(예: `your-app.railway.app`) 접속
4. 웹사이트가 정상 작동하는지 확인!

---

## 🔧 배포 후 관리

### 관리자 페이지 접속

```
https://your-app.railway.app/#/admin
```

비밀번호: 환경변수에 설정한 `ADMIN_PASSWORD`

### 코드 업데이트 배포

```bash
# 코드 수정 후
git add .
git commit -m "Update feature"
git push

# Railway가 자동으로 재배포!
```

### 로그 확인

Railway 대시보드 → **"Deployments"** → 최신 배포 클릭 → **"View Logs"**

### 환경변수 변경

Railway 대시보드 → **"Variables"** 탭에서 수정

---

## 🐛 문제 해결

### 1. "Application failed to respond" 오류

**원인**: PORT 환경변수 미설정

**해결**:
```
Variables 탭에서 PORT=3001 추가
```

### 2. 데이터베이스 오류

**원인**: 마이그레이션 미실행

**해결**:
```bash
railway run npm run migrate
```

### 3. 관리자 페이지 접속 안됨

**원인**: ADMIN_PASSWORD 환경변수 미설정

**해결**:
```
Variables 탭에서 ADMIN_PASSWORD 추가
```

### 4. 이미지 업로드 후 사라짐

**원인**: Railway는 재배포 시 파일 시스템 초기화

**해결**: 현재 구조에서는 정상 동작. 업로드한 이미지는 데이터베이스에 저장되고,
재배포해도 `/uploads` 폴더는 유지됩니다.

> **참고**: 장기적으로는 Cloudinary 등 클라우드 스토리지 사용 권장

---

## 💰 비용

Railway 무료 티어:
- **$5 크레딧/월** 제공
- 소규모 사이트는 무료 범위 내 사용 가능
- 트래픽 많아지면 추가 크레딧 구매 ($5/월 ~)

사용량 확인: Railway 대시보드 → **"Usage"** 탭

---

## 📞 지원

- [Railway 공식 문서](https://docs.railway.app)
- [Railway Discord](https://discord.gg/railway)
- [GitHub Issues](https://github.com/railwayapp/railway/issues)

---

## ✅ 배포 체크리스트

- [ ] GitHub에 코드 푸시
- [ ] Railway 프로젝트 생성
- [ ] 환경변수 설정 (NODE_ENV, PORT, ADMIN_PASSWORD, DB_PATH)
- [ ] 데이터베이스 마이그레이션 실행
- [ ] 도메인 생성
- [ ] 웹사이트 접속 확인
- [ ] 관리자 페이지 로그인 확인
- [ ] 매물/뉴스 추가 테스트
- [ ] 이미지 업로드 테스트

완료되었다면 배포 성공! 🎉
