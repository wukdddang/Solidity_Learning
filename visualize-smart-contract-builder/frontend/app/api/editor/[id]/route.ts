import { NextResponse } from "next/server";
import { ContractProject } from "@/frontend/types/contract";
import { ApiResponse } from "@/frontend/types/api";
import { BlockLibraryData } from "@/frontend/types/block-library";

// 에디터 초기 데이터 타입 정의
interface EditorInitialData {
  project: ContractProject;
  blockLibrary: BlockLibraryData;
}

// 에디터용 프로젝트 상세 조회 (블록 라이브러리 데이터 포함)
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
): Promise<NextResponse<ApiResponse<EditorInitialData>>> {
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { success: false, error: "유효하지 않은 프로젝트 ID입니다." },
        { status: 400 }
      );
    }

    // TODO: 실제 백엔드 서비스 레이어 호출로 변경
    // 예시: const project = await projectService.getProjectById(id);
    // 예시: const blockLibrary = await blockLibraryService.getBlockLibrary();

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

    // 블록 라이브러리 데이터
    const mockBlockLibrary: BlockLibraryData = {
      blockTemplates: [
        {
          id: "contract-info",
          type: "CONTRACT_INFO",
          name: "컨트랙트 정보",
          description: "컨트랙트 기본 정보 설정",
          category: "basic",
          icon: "FileText",
        },
        {
          id: "mint-function",
          type: "MINT_FUNCTION",
          name: "새로 만들기 기능",
          description: "NFT나 토큰을 새로 만드는 기능",
          category: "function",
          icon: "Plus",
        },
        {
          id: "burn-function",
          type: "BURN_FUNCTION",
          name: "소각 기능",
          description: "NFT나 토큰을 소각하는 기능",
          category: "function",
          icon: "Zap",
        },
        {
          id: "access-control",
          type: "ACCESS_CONTROL",
          name: "접근 제어",
          description: "특정 조건에서만 실행 가능하게 제한",
          category: "access",
          icon: "Shield",
        },
        {
          id: "variable",
          type: "VARIABLE",
          name: "변수",
          description: "컨트랙트에서 사용할 변수 정의",
          category: "variable",
          icon: "Settings",
        },
      ],
      categoryLabels: {
        basic: "기본 정보",
        function: "기능 블록",
        access: "접근 제어",
        variable: "변수",
      },
      categoryColors: {
        basic: "text-blue-600 bg-blue-50 border-blue-200",
        function: "text-green-600 bg-green-50 border-green-200",
        access: "text-purple-600 bg-purple-50 border-purple-200",
        variable: "text-orange-600 bg-orange-50 border-orange-200",
      },
    };

    const editorInitialData: EditorInitialData = {
      project: mockProject,
      blockLibrary: mockBlockLibrary,
    };

    return NextResponse.json({
      success: true,
      data: editorInitialData,
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

    // TODO: 실제 백엔드 서비스 레이어 호출로 변경
    // 예시: const updatedProject = await projectService.updateProject(id, body);
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
