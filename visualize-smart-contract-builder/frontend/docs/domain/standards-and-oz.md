## 토큰 표준과 OpenZeppelin 요약

### 입문자를 위한 초간단 요약

- ERC는 "Ethereum Request for Comments"의 약자입니다. 이더리움에서 토큰이 어떻게 동작해야 하는지에 대한 약속(규칙)입니다.
- **ERC-20**: 포인트나 현금처럼 서로 구분되지 않는 "동등한 토큰"(대체 가능, Fungible). 1개 = 다른 1개.
- **ERC-721**: 수집품처럼 각각 고유한 "서로 다른 토큰"(대체 불가능, Non‑Fungible). 고유 ID(토큰ID)를 가짐.
- 표준을 따르면 지갑/거래소/마켓플레이스가 당신의 토큰을 바로 이해하고 쓸 수 있습니다.
- OpenZeppelin은 이 표준을 "안전하게" 구현해둔 검증된 코드 모음입니다.

### 표준 개요

- **ERC-721 (NFT)**: 고유 토큰. 필수 인터페이스와 메타데이터 확장 지원.
- **ERC-20 (FT)**: 대체 가능 토큰. 발행/전송/승인 등 기본 인터페이스.

### 자주 쓰는 OZ 확장(ERC-721 기준)

- **Ownable**: `onlyOwner` 접근 제어 제공.
- **ERC721Burnable**: 홀더가 소각 가능.
- **ERC721Enumerable**: 전체/보유자별 토큰 열거(totalSupply, tokenByIndex 등) 지원.
- **Pausable**: 일시 중지 기능 제공.

### 임포트/상속 이름 예시

- `@openzeppelin/contracts/token/ERC721/ERC721.sol` → `ERC721`
- `@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol` → `ERC721Burnable`
- `@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol` → `ERC721Enumerable`
- `@openzeppelin/contracts/access/Ownable.sol` → `Ownable`

### 권장 사용 원칙

- 가능한 한 표준 상속으로 기능을 충족하고, 커스텀 코드는 최소화.
- 상속 조합 시 충돌 오버라이드는 공식 문서 예시를 따름.
- 새로운 기능은 먼저 [OpenZeppelin Wizard](https://docs.openzeppelin.com/contracts/5.x/wizard)로 가능 여부를 확인.
