import { NextResponse } from "next/server";
import { ContractProject } from "@/types/contract";
import { ApiListResponse } from "@/types/api";

// 프로젝트 목록 조회
export async function GET(): Promise<
  NextResponse<ApiListResponse<ContractProject>>
> {
  try {
    // TODO: 실제 데이터베이스에서 조회하도록 변경
    const mockProjects: ContractProject[] = [
      {
        id: "1",
        name: "내 첫 NFT 프로젝트",
        description: "ERC-721 기반 NFT 컬렉션",
        templateId: "basic-nft",
        contractType: "ERC721",
        status: "DRAFT",
        blocks: [],
        connections: [],
        createdAt: new Date(Date.now() - 86400000).toISOString(),
        updatedAt: new Date(Date.now() - 3600000).toISOString(),
      },
      {
        id: "2",
        name: "커뮤니티 토큰",
        description: "ERC-20 기반 커뮤니티 토큰",
        templateId: "community-token",
        contractType: "ERC20",
        status: "COMPILED",
        blocks: [],
        connections: [],
        createdAt: new Date(Date.now() - 172800000).toISOString(),
        updatedAt: new Date(Date.now() - 7200000).toISOString(),
      },
    ];

    return NextResponse.json({
      items: mockProjects,
      total: mockProjects.length,
      lastUpdated: new Date().toISOString(),
    });
  } catch (error) {
    console.error("프로젝트 목록 조회 오류:", error);
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
