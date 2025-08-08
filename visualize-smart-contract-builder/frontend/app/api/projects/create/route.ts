import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { ContractProject } from "@/frontend/types/contract";
import { ApiResponse } from "@/frontend/types/api";

// 새 프로젝트 생성
export async function POST(
  request: Request
): Promise<NextResponse<ApiResponse<ContractProject>>> {
  try {
    const body = await request.json();
    const { name, description, templateId, contractType } = body;

    if (!name || !contractType) {
      return NextResponse.json(
        {
          success: false,
          error: "프로젝트 이름과 컨트랙트 타입은 필수입니다.",
        },
        { status: 400 }
      );
    }

    // TODO: 실제 데이터베이스에 저장하도록 변경
    const newProject: ContractProject = {
      id: uuidv4(),
      name,
      description,
      templateId,
      contractType,
      status: "DRAFT",
      blocks: [],
      connections: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    return NextResponse.json({
      success: true,
      data: newProject,
      message: "새 프로젝트가 성공적으로 생성되었습니다.",
    });
  } catch (error) {
    console.error("프로젝트 생성 중 오류 발생:", error);
    return NextResponse.json(
      { success: false, error: "프로젝트를 생성하는 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
