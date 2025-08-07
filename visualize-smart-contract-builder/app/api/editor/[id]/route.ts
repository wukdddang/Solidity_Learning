import { NextResponse } from "next/server";
import { ContractProject } from "@/types/contract";
import { ApiResponse } from "@/types/api";

// 에디터용 프로젝트 상세 조회
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
): Promise<NextResponse<ApiResponse<ContractProject>>> {
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { success: false, error: "유효하지 않은 프로젝트 ID입니다." },
        { status: 400 }
      );
    }

    // TODO: 실제 데이터베이스에서 조회하도록 변경
    const mockProject: ContractProject = {
      id,
      name: "내 첫 NFT 프로젝트",
      description: "ERC-721 기반 NFT 컬렉션",
      templateId: "basic-nft",
      contractType: "ERC721",
      status: "DRAFT",
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
          config: {
            name: "MyNFT",
            symbol: "MNFT",
          },
          position: { x: 100, y: 100 },
        },
      ],
      connections: [],
      createdAt: new Date(Date.now() - 86400000).toISOString(),
      updatedAt: new Date().toISOString(),
    };

    return NextResponse.json({
      success: true,
      data: mockProject,
    });
  } catch (error) {
    console.error("에디터 프로젝트 조회 중 오류 발생:", error);
    return NextResponse.json(
      { success: false, error: "프로젝트를 조회하는 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}

// 에디터용 프로젝트 업데이트
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
): Promise<NextResponse<ApiResponse<ContractProject>>> {
  try {
    const { id } = params;
    const body = await request.json();

    if (!id) {
      return NextResponse.json(
        { success: false, error: "유효하지 않은 프로젝트 ID입니다." },
        { status: 400 }
      );
    }

    // TODO: 실제 데이터베이스 업데이트 로직
    const updatedProject: ContractProject = {
      ...body,
      id,
      updatedAt: new Date().toISOString(),
    };

    return NextResponse.json({
      success: true,
      data: updatedProject,
      message: "프로젝트가 성공적으로 업데이트되었습니다.",
    });
  } catch (error) {
    console.error("에디터 프로젝트 업데이트 중 오류 발생:", error);
    return NextResponse.json(
      {
        success: false,
        error: "프로젝트를 업데이트하는 중 오류가 발생했습니다.",
      },
      { status: 500 }
    );
  }
}
