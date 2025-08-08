## 컨트랙트 코드 생성 가이드라인 (Blocks → IR → Solidity)

이 문서는 에디터에서 구성한 블록 정보를 기반으로 표준화된 중간 표현(IR)로 변환하고, 이를 템플릿으로 조립해 최종 Solidity 코드를 생성하는 전체 흐름을 정의합니다. 목표는 “복잡함을 숨기고, 안전하고 빠르게” 코드를 만들어내는 것입니다.

### 핵심 원칙

- **표준 기반**: OpenZeppelin 표준을 최대한 활용합니다.
- **조합 가능성**: 기능을 작은 스니펫(블록)으로 쪼개어 On/Off 조합으로 생성합니다.
- **예측 가능성**: 같은 블록 구성은 항상 같은 코드가 나와야 합니다(결정적 생성, deterministic).
- **확장 용이성**: 새 블록 추가 시 “매퍼 1개 + 템플릿 1~N개”만 추가하면 됩니다.

## 아키텍처 개요

입력과 출력은 다음과 같습니다.

- **입력**: `ContractProject` (블록/연결/프로젝트 메타)
- **중간표현(IR)**: `NormalizedContractSpec` (타입, 상속, 기능 플래그, 변수, 제어)
- **출력**: Solidity 단일 소스 문자열(필요 시 ABI/메타 정보 포함)

### 디렉터리 구조 제안

```
src/lib/contract-generator/
  index.ts                 # 퍼블릭 API (블록 → IR → 코드)
  ir.ts                    # IR 타입, 기본값/검증 로직
  mappers/
    erc721.mapper.ts       # ERC721 블록 → IR 변환
    erc20.mapper.ts        # ERC20 블록 → IR 변환 (추가 예정)
  templates/
    erc721/
      base.sol.hbs         # 기본 템플릿(Handlebars 예시; 템플릿 엔진은 자유)
      parts/
        ownable.sol.part
        mintable.sol.part
        burnable.sol.part
        cap.sol.part       # MaxSupply 관련 로직
        pricing.sol.part   # 가격/지불 관련 로직
    common/
      license.part
      pragma.part
      imports.part
  utils/
    text.ts                # 들여쓰기/개행/정렬 유틸
    solidity.ts            # import/inheritance 조합 유틸
```

> 템플릿 엔진은 Handlebars/EJS/단순 템플릿 문자열 중 자유롭게 선택합니다. 초기에는 템플릿 문자열 + 유틸 조합으로 시작해도 충분합니다.

### 퍼블릭 API 시그니처

```ts
// src/lib/contract-generator/index.ts
import { ContractProject } from "@/types/contract";

export interface GeneratedContract {
  code: string; // 최종 Solidity 소스
  imports: string[]; // 사용된 import 목록 (선택)
  contractName: string; // 생성된 컨트랙트명
  metadata?: Record<string, unknown>;
}

export async function generateSolidity(
  project: ContractProject
): Promise<GeneratedContract> {
  // 1) 블록 → IR 변환
  // 2) IR 검증/보정
  // 3) IR → 템플릿 조립
  // 4) 포맷팅/정리
}
```

> API는 `app/api/editor/[id]/compile/route.ts`에서 호출합니다. 현재 모의 코드 대신 `generateSolidity`를 사용하도록 교체합니다.

## 1) 블록 → IR 변환 (Mapper)

에디터가 전달하는 블록/엣지 데이터(`ContractProject.blocks`, `ContractProject.connections`)를 검증하고, 컨트랙트 타입별 매퍼로 IR을 생성합니다.

### IR 타입 (제안)

```ts
// src/lib/contract-generator/ir.ts
export type ContractKind = "ERC721" | "ERC20" | "VOTING" | "CUSTOM";

export interface NormalizedContractSpec {
  kind: ContractKind;
  name: string; // 컨트랙트명 (예: MyNFT)
  symbol?: string; // 토큰 심볼 (ERC721/20)

  // 상속/임포트
  inherits: string[]; // ["ERC721", "Ownable", ...]
  imports: string[]; // ["@openzeppelin/.../ERC721.sol", ...]

  // 기능 플래그
  features: {
    ownable?: boolean;
    mintable?: boolean;
    burnable?: boolean;
    enumerable?: boolean;
    pausable?: boolean;
  };

  // 변수/상수/설정값
  variables: {
    maxSupply?: number; // 총 발행량 상한
    priceWei?: string; // 민팅 가격(wei 문자열)
  };

  // 함수 옵션
  functions: {
    mint?: {
      payable?: boolean;
      onlyOwner?: boolean;
      visibility?: "public" | "external";
    };
  };
}
```

### 블록 매핑 규칙

- **CONTRACT_INFO**: `name`, `symbol`, `kind`을 IR에 설정.
- **VARIABLE**: `maxSupply`, `price` 등 숫자/불리언/문자열 입력을 `variables`에 반영.
- **MINT_FUNCTION**: `features.mintable = true`, `functions.mint.*` 옵션 반영, 가격/지불/접근 제어 연결.
- **BURN_FUNCTION**: `features.burnable = true` → 상속/임포트에 `ERC721Burnable` 또는 ERC20Burnable 추가.
- **ACCESS_CONTROL**: `features.ownable = true` 및 특정 함수에 `onlyOwner` 적용.
- **TRANSFER_FUNCTION**: 기본 표준 전송은 표준 상속으로 충족. 특수 로직이 있으면 별도 스니펫화.

> Edges(연결)는 “의존성 만족 여부” 검증에 사용합니다. 예: `MINT_FUNCTION`이 존재하는데 `CONTRACT_INFO`가 없으면 오류.

## 2) IR 검증/보정

생성 전 다음을 체크합니다.

- **필수 값**: ERC721/20은 `name`, `symbol`이 필수.
- **충돌 방지**: 예) `mintable=false`인데 가격 변수가 설정된 경우 경고 또는 무시 처리.
- **상속 정리**: `features`에 따라 `inherits`/`imports` 목록을 중복 없이 구성.

검증 실패 시 컴파일 API는 400/422로 사용자에게 즉시 피드백합니다.

## 3) 템플릿 조립 (IR → Solidity)

생성 순서는 다음과 같습니다.

1. 라이선스/프라그마 헤더 삽입
2. 필요한 `import` 생성 (OpenZeppelin 경로 포함)
3. `contract {Name} is ERC721, Ownable, ... {` 헤더 구성
4. 상태변수/상수 선언 (`MAX_SUPPLY`, `price` 등)
5. 생성자(constructor) 조립 (`ERC721(name, symbol)`, 초기값 세팅)
6. 기능별 함수 스니펫 삽입 (mint/burn/totalSupply 등)
7. 보일러플레이트/유틸 함수 삽입
8. `}` 마감 및 포맷팅

### 예시 스니펫 규칙 (요약)

- **Ownable**: `import "@openzeppelin/contracts/access/Ownable.sol";` 및 상속 추가.
- **Burnable(ERC721)**: `import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";` 및 상속 추가.
- **Enumerable(ERC721)**: `ERC721Enumerable` 상속과 관련 오버라이드 포함.
- **MaxSupply**: 민팅 시 `require(totalSupply < maxSupply)` 혹은 커스텀 카운터로 체크.
- **Payable Mint**: `require(msg.value >= price, "Insufficient payment");`

## 4) 컴파일 라우트 연동

파일: `app/api/editor/[id]/compile/route.ts`

- 현재 모의 문자열을 반환하는 부분을 `generateSolidity(project)` 호출로 대체합니다.
- 요청 바디에서 `blocks` 뿐 아니라 `connections` 도 수신하도록 확장합니다.
- 프로젝트/블록 유효성 검사 후, 실패 시 400/422 응답을 반환합니다.
- 성공 시 `{ code, abi? }` 형태로 반환합니다. (ABI는 후속 단계에서 solc-js 또는 Foundry/Hardhat 빌드 파이프에 위임)

간단한 예시 흐름:

```ts
// (요약 예시) route.ts 내부
import { generateSolidity } from "@/src/lib/contract-generator";

const { blocks, connections } = await request.json();
const project = { ...loadedProject, blocks, connections };
const { code } = await generateSolidity(project);
return NextResponse.json({ success: true, data: { code } });
```

## 5) 품질 가이드 (검증/테스트)

- **정적 검증**: IR 검증 시 필수값/충돌을 선제 차단.
- **스냅샷 테스트**: 블록 구성 샘플 → 생성된 코드 문자열을 스냅샷으로 비교.
- **샌드박스 컴파일**: 추후 `solc-js`로 빠른 구문 체크(옵션). 실패 시 오류 메시지를 사용자에게 가독성 있게 변환해 전달.
- **보안 기본값**: 민팅은 기본 `onlyOwner`로 시작하고, 사용자가 풀어주는 방향으로 옵션화.

## 6) 블록별 매핑 상세 (ERC721 기준)

- **CONTRACT_INFO**

  - inputs: `name:string`, `symbol:string`
  - IR: `spec.name`, `spec.symbol`, `inherits += ["ERC721"]`, `imports += ["@openzeppelin/contracts/token/ERC721/ERC721.sol"]`

- **MINT_FUNCTION**

  - inputs: `payable:boolean`, `onlyOwner:boolean`, `visibility:select`
  - IR: `features.mintable = true`, `functions.mint = { ... }`

- **BURN_FUNCTION**

  - IR: `features.burnable = true`, `inherits += ["ERC721Burnable"]`, 해당 import 추가

- **VARIABLE (MaxSupply, Price)**

  - IR: `variables.maxSupply`, `variables.priceWei`
  - 템플릿: 상수/변수 선언 + 민팅 가드/가격 체크 반영

- **ACCESS_CONTROL (Ownable)**
  - IR: `features.ownable = true`, `imports/inherits` 반영, mint/setter에 `onlyOwner` 적용

## 7) 구현 체크리스트

1. `src/lib/contract-generator/ir.ts`

- `NormalizedContractSpec` 타입/기본값/검증 구현

2. `src/lib/contract-generator/mappers/erc721.mapper.ts`

- `ContractProject`를 받아 IR로 변환하는 함수 구현

3. `src/lib/contract-generator/templates/erc721/*`

- `base` + 기능별 `parts` 템플릿 작성

4. `src/lib/contract-generator/index.ts`

- 블록→IR→코드의 파이프라인 구현

5. `app/api/editor/[id]/compile/route.ts`

- 모의 코드 제거, `generateSolidity` 연동

6. 테스트

- 샘플 블록 구성으로 스냅샷 테스트 추가 (간단히 문자열 비교부터 시작)

## 8) 향후 확장

- **ERC20/Voting**: 동일 패턴으로 매퍼/템플릿 추가
- **역할(Role) 기반 제어**: `AccessControl` 지원(다중 역할) 블록 도입
- **코드 포매터**: prettier-plugin-solidity 도입 검토
- **ABI/바이트코드**: 별도 `compile` 서비스(Foundry/Hardhat/solc-js) 연동

---

이 가이드에 따라 “블록 → IR → 템플릿” 파이프라인을 구현하면, 사용자는 블록을 조립하는 것만으로 신뢰성 높은 표준 기반 컨트랙트 코드를 얻을 수 있습니다.
