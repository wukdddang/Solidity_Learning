## 코드 생성: IR와 템플릿

### 입문자를 위한 초간단 요약

- IR는 블록 구성을 기계가 다루기 쉬운 "중간 설계도"입니다.
- 템플릿은 설계도를 코드로 찍어내는 "금형"입니다. 같은 설계도 → 같은 코드가 나옵니다.

### IR(중간 표현) 목적

- 블록 구성을 표준화된 구조로 정규화하여 템플릿 로직을 단순화.
- 결정적 생성: 같은 IR → 같은 코드.

### IR 핵심 필드

- `kind`(ERC721/20 등), `name`, `symbol`.
- `inherits`/`imports`: 상속/임포트 목록(중복 제거).
- `features`: `ownable`, `mintable`, `burnable`, `enumerable`, `pausable` 등.
- `variables`: `maxSupply`, `priceWei` 등 구성 값.
- `functions`: `mint` 옵션(가시성/payable/onlyOwner).

### 템플릿 원칙

- 공통 파트(license/pragma/imports)와 기능 파트를 분리하여 조립.
- 파트 삽입 순서: 헤더 → 상태/상수 → 생성자 → 기능 → 유틸.
- 들여쓰기/개행/정렬 유틸로 출력 안정화.

### 충돌 처리

- 상속 충돌(다중 상속 오버라이드)은 표준 예시를 우선 적용.
- 불필요한 import/inherit는 제거하여 간결성 유지.
