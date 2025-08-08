## 민팅, 총발행량(Max Supply), 가격(페이먼트)

### 입문자를 위한 초간단 요약

- 민팅은 "새 토큰을 만드는 행위"입니다. NFT면 새 번호의 작품이, ERC-20이면 수량이 늘어납니다.
- 최대 발행량(Max Supply)은 만들 수 있는 총 개수의 상한선입니다.
- 가격은 민팅 1회에 필요한 비용입니다(대개 ETH). 무료 민팅도 가능합니다.

### 민팅 기본

- 민팅 기능이 활성화되면 `mint()` 구현이 필요.
- 접근 제어: 기본 `onlyOwner` 권장, 필요 시 공개/외부로 완화.

### 총발행량 관리 패턴

- **카운터 기반**: 내부 카운터 증가 → 민팅 가드(`require(current < maxSupply)`).
- **Enumerable 기반**: `ERC721Enumerable` 상속 시 `totalSupply()` 제공(가스 비용 고려).

### 가격/결제

- **단위**: 내부적으로 `wei` 사용(문자열 또는 `uint256`).
- **검증**: `require(msg.value >= price, "Insufficient payment")`.
- **가격 변경**: `setPrice(uint256 newPrice)`는 기본 `onlyOwner`.

### 환불/인출

- 과지불 환불은 선택(가스/UX 고려). 보통 수익은 `withdraw()`에서 일괄 인출.
