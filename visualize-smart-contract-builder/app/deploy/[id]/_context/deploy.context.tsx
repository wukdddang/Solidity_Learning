"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import {
  ContractProject,
  DeploymentConfig,
  DeploymentResult,
} from "@/types/contract";
import { ApiResponse } from "@/types/api";

interface GasEstimate {
  gasLimit: number;
  gasPrice: string;
  estimatedCost: string;
  network: string;
}

interface DeployContextType {
  // 데이터 상태
  project: ContractProject | null;
  gasEstimate: GasEstimate | null;
  loading: boolean;
  error: string | null;
  isDeploying: boolean;
  isEstimating: boolean;

  // 액션 함수들
  프로젝트를_로드_한다: (projectId: string) => Promise<void>;
  가스비를_추정_한다: (network: string) => Promise<void>;
  컨트랙트를_배포_한다: (
    config: DeploymentConfig
  ) => Promise<DeploymentResult | null>;

  // 상태 업데이트 함수들
  setProject: React.Dispatch<React.SetStateAction<ContractProject | null>>;
  setGasEstimate: React.Dispatch<React.SetStateAction<GasEstimate | null>>;
}

const DeployContext = createContext<DeployContextType | undefined>(undefined);

export const DeployProvider: React.FC<{
  children: React.ReactNode;
  projectId: string;
}> = ({ children, projectId }) => {
  // 데이터 상태
  const [project, setProject] = useState<ContractProject | null>(null);
  const [gasEstimate, setGasEstimate] = useState<GasEstimate | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDeploying, setIsDeploying] = useState(false);
  const [isEstimating, setIsEstimating] = useState(false);

  // 프로젝트 로드
  const 프로젝트를_로드_한다 = useCallback(async (projectId: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/projects/${projectId}`);
      const result: ApiResponse<ContractProject> = await response.json();

      if (result.success && result.data) {
        setProject(result.data);

        // 프로젝트가 컴파일되지 않은 경우 에러
        if (result.data.status !== "COMPILED") {
          throw new Error("컴파일되지 않은 프로젝트는 배포할 수 없습니다.");
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

  // 가스비 추정
  const 가스비를_추정_한다 = useCallback(
    async (network: string) => {
      if (!project) return;

      setIsEstimating(true);
      setError(null);

      try {
        const response = await fetch("/api/deploy/estimate", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            projectId: project.id,
            network,
          }),
        });

        const result = await response.json();

        if (result.success) {
          setGasEstimate(result.data);
        } else {
          throw new Error(result.error || "가스비 추정에 실패했습니다.");
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다."
        );
        console.error("가스비 추정 오류:", err);
      } finally {
        setIsEstimating(false);
      }
    },
    [project]
  );

  // 컨트랙트 배포
  const 컨트랙트를_배포_한다 = useCallback(
    async (config: DeploymentConfig): Promise<DeploymentResult | null> => {
      if (!project) return null;

      setIsDeploying(true);
      setError(null);

      try {
        const response = await fetch(`/api/deploy/${project.id}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(config),
        });

        const result = await response.json();

        if (result.success) {
          // 프로젝트 상태 업데이트
          setProject((prev) =>
            prev
              ? {
                  ...prev,
                  status: config.network.includes("mainnet")
                    ? "DEPLOYED_MAINNET"
                    : "DEPLOYED_TESTNET",
                  deployedAddress: result.data.contractAddress,
                  network: config.network,
                }
              : null
          );

          return result.data;
        } else {
          throw new Error(result.error || "배포에 실패했습니다.");
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다."
        );
        console.error("배포 오류:", err);
        return null;
      } finally {
        setIsDeploying(false);
      }
    },
    [project]
  );

  // 컴포넌트 마운트 시 프로젝트 로드 및 기본 가스비 추정
  useEffect(() => {
    if (projectId) {
      프로젝트를_로드_한다(projectId);
    }
  }, [projectId, 프로젝트를_로드_한다]);

  // 프로젝트 로드 후 기본 네트워크로 가스비 추정
  useEffect(() => {
    if (project && project.status === "COMPILED") {
      가스비를_추정_한다("sepolia"); // 기본적으로 Sepolia 테스트넷으로 추정
    }
  }, [project, 가스비를_추정_한다]);

  const contextValue: DeployContextType = {
    project,
    gasEstimate,
    loading,
    error,
    isDeploying,
    isEstimating,
    프로젝트를_로드_한다,
    가스비를_추정_한다,
    컨트랙트를_배포_한다,
    setProject,
    setGasEstimate,
  };

  return (
    <DeployContext.Provider value={contextValue}>
      {children}
    </DeployContext.Provider>
  );
};

export const useDeploy = () => {
  const context = useContext(DeployContext);
  if (context === undefined) {
    throw new Error("useDeploy must be used within a DeployProvider");
  }
  return context;
};
