"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { ContractProject } from "@/frontend/types/contract";
import { ApiResponse } from "@/frontend/types/api";

interface DeployedContextType {
  // 데이터 상태
  project: ContractProject | null;
  loading: boolean;
  error: string | null;
  isInteracting: boolean;

  // 액션 함수들
  프로젝트를_로드_한다: (projectId: string) => Promise<void>;
  컨트랙트와_상호작용_한다: (
    functionName: string,
    args?: unknown[]
  ) => Promise<unknown>;

  // 상태 업데이트 함수들
  setProject: React.Dispatch<React.SetStateAction<ContractProject | null>>;
}

const DeployedContext = createContext<DeployedContextType | undefined>(
  undefined
);

export const DeployedProvider: React.FC<{
  children: React.ReactNode;
  projectId: string;
}> = ({ children, projectId }) => {
  // 데이터 상태
  const [project, setProject] = useState<ContractProject | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isInteracting, setIsInteracting] = useState(false);

  // 프로젝트 로드
  const 프로젝트를_로드_한다 = useCallback(async (projectId: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/projects/${projectId}`);
      const result: ApiResponse<ContractProject> = await response.json();

      if (result.success && result.data) {
        setProject(result.data);

        // 배포되지 않은 프로젝트인 경우 에러
        if (
          !["DEPLOYED_TESTNET", "DEPLOYED_MAINNET"].includes(result.data.status)
        ) {
          throw new Error("배포되지 않은 프로젝트입니다.");
        }
      } else {
        throw new Error(result.error || "프로젝트를 불러올 수 없습니다.");
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다."
      );
      console.error("프로젝트 로드 오류:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  // 컨트랙트 상호작용 (Mock 구현)
  const 컨트랙트와_상호작용_한다 = useCallback(
    async (functionName: string): Promise<unknown> => {
      if (!project?.deployedAddress) return null;

      setIsInteracting(true);
      setError(null);

      try {
        // TODO: 실제 Web3/ethers.js를 사용한 컨트랙트 상호작용 구현
        // 지금은 Mock 응답
        await new Promise((resolve) => setTimeout(resolve, 1000)); // 로딩 시뮬레이션

        const mockResults: Record<string, unknown> = {
          name: "MyEpicNFT",
          symbol: "EPIC",
          totalSupply: "42",
          owner: "0x1234567890123456789012345678901234567890",
          price: "0.1",
          maxSupply: "1000",
        };

        return mockResults[functionName] || `Mock result for ${functionName}`;
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "상호작용 중 오류가 발생했습니다."
        );
        console.error("컨트랙트 상호작용 오류:", err);
        return null;
      } finally {
        setIsInteracting(false);
      }
    },
    [project]
  );

  // 컴포넌트 마운트 시 프로젝트 로드
  useEffect(() => {
    if (projectId) {
      프로젝트를_로드_한다(projectId);
    }
  }, [projectId, 프로젝트를_로드_한다]);

  const contextValue: DeployedContextType = {
    project,
    loading,
    error,
    isInteracting,
    프로젝트를_로드_한다,
    컨트랙트와_상호작용_한다,
    setProject,
  };

  return (
    <DeployedContext.Provider value={contextValue}>
      {children}
    </DeployedContext.Provider>
  );
};

export const useDeployed = () => {
  const context = useContext(DeployedContext);
  if (context === undefined) {
    throw new Error("useDeployed must be used within a DeployedProvider");
  }
  return context;
};
