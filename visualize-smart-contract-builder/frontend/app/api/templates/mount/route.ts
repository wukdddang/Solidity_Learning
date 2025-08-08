import { NextResponse } from "next/server";
import { ContractTemplate } from "@/frontend/types/contract";
import { ApiListResponse } from "@/frontend/types/api";

// 템플릿 목록 조회
export async function GET(): Promise<
  NextResponse<ApiListResponse<ContractTemplate>>
> {
  try {
    // TODO: 실제 데이터베이스에서 조회하도록 변경
    const mockTemplates: ContractTemplate[] = [
      {
        id: "basic-nft",
        name: "기본 NFT",
        description: "나만의 아트워크나 멤버십을 위한 NFT를 만듭니다.",
        type: "ERC721",
        icon: "🎨",
        blocks: [
          {
            id: "contract-info",
            type: "CONTRACT_INFO",
            name: "컨트랙트 정보",
            description: "컨트랙트 기본 정보 설정",
            category: "basic",
            inputs: [
              {
                id: "name",
                name: "컨트랙트 이름",
                type: "string",
                required: true,
              },
              { id: "symbol", name: "심볼", type: "string", required: true },
            ],
            outputs: [],
            config: {},
          },
          {
            id: "mint-function",
            type: "MINT_FUNCTION",
            name: "새로 만들기 기능",
            description: "NFT를 새로 만드는 기능",
            category: "function",
            inputs: [
              {
                id: "price",
                name: "가격",
                type: "number",
                required: false,
                defaultValue: 0,
              },
              {
                id: "maxSupply",
                name: "최대 발행량",
                type: "number",
                required: false,
              },
            ],
            outputs: [],
            config: {},
          },
        ],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "community-token",
        name: "커뮤니티 토큰",
        description: "우리 커뮤니티에서 사용할 포인트를 만듭니다.",
        type: "ERC20",
        icon: "🪙",
        blocks: [
          {
            id: "contract-info",
            type: "CONTRACT_INFO",
            name: "토큰 정보",
            description: "토큰 기본 정보 설정",
            category: "basic",
            inputs: [
              { id: "name", name: "토큰 이름", type: "string", required: true },
              { id: "symbol", name: "심볼", type: "string", required: true },
              {
                id: "decimals",
                name: "소수점 자리",
                type: "number",
                required: true,
                defaultValue: 18,
              },
            ],
            outputs: [],
            config: {},
          },
        ],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "voting-contract",
        name: "간단한 투표",
        description: "특정 안건에 대해 홀더들이 투표하게 합니다.",
        type: "VOTING",
        icon: "🗳️",
        blocks: [
          {
            id: "contract-info",
            type: "CONTRACT_INFO",
            name: "투표 정보",
            description: "투표 기본 정보 설정",
            category: "basic",
            inputs: [
              {
                id: "title",
                name: "투표 제목",
                type: "string",
                required: true,
              },
              {
                id: "description",
                name: "투표 설명",
                type: "string",
                required: false,
              },
            ],
            outputs: [],
            config: {},
          },
        ],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];

    return NextResponse.json({
      items: mockTemplates,
      total: mockTemplates.length,
      lastUpdated: new Date().toISOString(),
    });
  } catch (error) {
    console.error("템플릿 목록 조회 오류:", error);
    return NextResponse.json(
      {
        items: [],
        total: 0,
        lastUpdated: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
