# 스마트 컨트랙트 빌더 (Smart Contract Builder)

코딩 없이 드래그 앤 드롭으로 나만의 스마트 컨트랙트를 만들 수 있는 비주얼 에디터입니다.

## 🚀 주요 기능

### 💫 핵심 가치

- **쉬움**: 비주얼 블록 에디터로 누구나 쉽게 사용
- **안전함**: OpenZeppelin 검증된 표준 코드 기반
- **빠름**: 아이디어에서 배포까지 단 5분

### 🎯 주요 페이지

1. **랜딩 페이지**: 서비스 소개 및 주요 기능 안내
2. **대시보드**: 내 프로젝트 목록 관리
3. **템플릿 선택**: 미리 준비된 템플릿으로 빠른 시작
4. **메인 에디터**: React Flow 기반 시각적 블록 에디터
5. **배포 확인**: 배포 전 최종 확인 및 가스비 추정
6. **배포 완료**: 배포된 컨트랙트 관리 및 상호작용

### 🧩 지원 템플릿

- **기본 NFT (ERC-721)**: 아트워크, 멤버십 NFT
- **커뮤니티 토큰 (ERC-20)**: 커뮤니티 포인트 시스템
- **간단한 투표**: 홀더 기반 투표 시스템

## 🛠 기술 스택

- **Frontend**: Next.js 14, React 18, TypeScript
- **UI Framework**: Tailwind CSS
- **Flow Editor**: React Flow
- **Icons**: Lucide React
- **Package Manager**: pnpm

## 📋 프로젝트 구조

```
visualize-smart-contract-builder/
├── app/                          # Next.js App Router
│   ├── page.tsx                 # 랜딩 페이지
│   ├── dashboard/               # 대시보드
│   │   ├── _context/           # Context 관리
│   │   ├── _ui/                # UI 컴포넌트
│   │   └── page.tsx
│   ├── templates/               # 템플릿 선택
│   ├── editor/[id]/            # 메인 에디터
│   ├── deploy/[id]/            # 배포 확인
│   ├── deployed/[id]/          # 배포 완료
│   └── api/                    # API 라우트
│       ├── projects/           # 프로젝트 관련 API
│       ├── templates/          # 템플릿 관련 API
│       ├── contracts/          # 컨트랙트 생성 API
│       └── deploy/             # 배포 관련 API
├── types/                      # TypeScript 타입 정의
├── lib/                        # 유틸리티 함수
└── components/                 # 공통 컴포넌트
```

## 🚀 시작하기

### 1. 저장소 클론

```bash
git clone [repository-url]
cd visualize-smart-contract-builder
```

### 2. 의존성 설치

```bash
pnpm install
```

### 3. 개발 서버 실행

```bash
pnpm dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 확인하세요.

### 4. 프로덕션 빌드

```bash
pnpm build
pnpm start
```

## 🎮 사용법

### 1. 프로젝트 생성

1. 대시보드에서 "새 프로젝트" 클릭
2. 템플릿 선택 또는 빈 페이지에서 시작
3. 프로젝트 이름과 설명 입력

### 2. 에디터에서 편집

1. 왼쪽 블록 라이브러리에서 블록 선택
2. 캔버스에 드래그 앤 드롭으로 배치
3. 오른쪽 설정 패널에서 세부 옵션 조정
4. 블록들을 연결하여 로직 구성

### 3. 컴파일 및 배포

1. "컴파일 및 검증" 버튼으로 솔리디티 코드 생성
2. "배포하기" 버튼으로 배포 페이지 이동
3. 네트워크 선택 및 가스비 확인
4. 최종 확인 후 배포 실행

### 4. 배포된 컨트랙트 관리

1. 배포 완료 페이지에서 컨트랙트 주소 확인
2. 간단한 상호작용 테스트
3. Etherscan 링크로 블록체인에서 확인

## 🏗 아키텍처

### Context 패턴

각 페이지는 React Context 패턴을 사용하여 상태를 관리합니다:

- `DashboardContext`: 프로젝트 목록 관리
- `TemplatesContext`: 템플릿 데이터 관리
- `EditorContext`: 에디터 상태 및 블록 관리
- `DeployContext`: 배포 프로세스 관리
- `DeployedContext`: 배포된 컨트랙트 관리

### API 구조

REST API는 다음과 같은 패턴을 따릅니다:

- `GET /api/{resource}/mount` - 목록 조회
- `GET/PUT/DELETE /api/{resource}/[id]` - 개별 리소스 CRUD
- `POST /api/{resource}/{action}` - 특정 액션 실행

### 컴포넌트 명명 규칙

- `.panel/` - 전체 화면을 차지하는 큰 컴포넌트
- `.section/` - 페이지 내 특정 섹션
- `.module.tsx` - 재사용 가능한 기능 단위
- `.component.tsx` - 기본 UI 컴포넌트

## 🔮 향후 계획

### 단기 계획

- [ ] 실제 Web3 지갑 연동 (MetaMask, WalletConnect)
- [ ] 실제 블록체인 배포 기능 구현
- [ ] 더 많은 블록 타입 추가
- [ ] 코드 편집기 개선

### 중기 계획

- [ ] 다중 체인 지원 (Polygon, BSC, Arbitrum)
- [ ] 고급 블록 (Oracle, DeFi 통합)
- [ ] 프로젝트 협업 기능
- [ ] 템플릿 마켓플레이스

### 장기 계획

- [ ] AI 기반 스마트 컨트랙트 추천
- [ ] 노코드 dApp 빌더
- [ ] 교육 플랫폼 통합

## 🤝 기여하기

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 라이선스

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 문의

프로젝트에 대한 질문이나 제안사항이 있으시면 언제든지 연락해주세요.

---

**스마트 컨트랙트 빌더** - Web3의 민주화를 위한 첫 걸음 🚀
