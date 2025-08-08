import { NextResponse } from "next/server";
import { ApiResponse } from "@/frontend/types/api";

interface GasEstimate {
  gasLimit: number;
  gasPrice: string;
  estimatedCost: string;
  network: string;
}

// 가스비 추정
export async function POST(
  request: Request
): Promise<NextResponse<ApiResponse<GasEstimate>>> {
  try {
    const body = await request.json();
    const { projectId, network } = body;

    if (!projectId || !network) {
      return NextResponse.json(
        { success: false, error: "프로젝트 ID와 네트워크는 필수입니다." },
        { status: 400 }
      );
    }

    // TODO: 실제 가스비 추정 로직 구현
    const mockEstimate: GasEstimate = {
      gasLimit: 2100000,
      gasPrice: "20000000000", // 20 gwei
      estimatedCost: "0.042", // ETH
      network,
    };

    return NextResponse.json({
      success: true,
      data: mockEstimate,
      message: "가스비가 성공적으로 추정되었습니다.",
    });
  } catch (error) {
    console.error("가스비 추정 중 오류 발생:", error);
    return NextResponse.json(
      { success: false, error: "가스비를 추정하는 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
