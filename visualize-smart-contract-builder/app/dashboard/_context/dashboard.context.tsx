"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { ContractProject } from "@/types/contract";
import { ApiListResponse } from "@/types/api";

interface DashboardContextType {
  // 데이터 상태
  projects: ContractProject[];
  loading: boolean;
  error: string | null;

  // 액션 함수들
  프로젝트_목록을_조회_한다: () => Promise<void>;
  프로젝트를_생성_한다: (projectData: {
    name: string;
    description?: string;
    templateId?: string;
    contractType: string;
  }) => Promise<boolean>;
  프로젝트를_삭제_한다: (projectId: string) => Promise<boolean>;

  // 상태 업데이트 함수들
  setProjects: React.Dispatch<React.SetStateAction<ContractProject[]>>;
}

const DashboardContext = createContext<DashboardContextType | undefined>(
  undefined
);

export const DashboardProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  // 데이터 상태
  const [projects, setProjects] = useState<ContractProject[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 프로젝트 목록 조회
  const 프로젝트_목록을_조회_한다 = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/projects/mount");
      const result: ApiListResponse<ContractProject> = await response.json();

      if (response.ok) {
        setProjects(result.items);
      } else {
        throw new Error("프로젝트 목록 조회에 실패했습니다.");
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다."
      );
      console.error("프로젝트 목록 조회 오류:", err);
    } finally {
      setLoading(false);
    }
  };

  // 새 프로젝트 생성
  const 프로젝트를_생성_한다 = async (projectData: {
    name: string;
    description?: string;
    templateId?: string;
    contractType: string;
  }) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/projects/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(projectData),
      });

      const result = await response.json();

      if (result.success) {
        // 새 프로젝트를 목록에 추가
        setProjects((prev) => [result.data, ...prev]);
        return true;
      } else {
        throw new Error(result.error || "프로젝트 생성에 실패했습니다.");
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다."
      );
      console.error("프로젝트 생성 오류:", err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // 프로젝트 삭제
  const 프로젝트를_삭제_한다 = async (projectId: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/projects/${projectId}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (result.success) {
        // 목록에서 삭제된 프로젝트 제거
        setProjects((prev) => prev.filter((p) => p.id !== projectId));
        return true;
      } else {
        throw new Error(result.error || "프로젝트 삭제에 실패했습니다.");
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다."
      );
      console.error("프로젝트 삭제 오류:", err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // 컴포넌트 마운트 시 데이터 로드
  useEffect(() => {
    프로젝트_목록을_조회_한다();
  }, []);

  const contextValue: DashboardContextType = {
    projects,
    loading,
    error,
    프로젝트_목록을_조회_한다,
    프로젝트를_생성_한다,
    프로젝트를_삭제_한다,
    setProjects,
  };

  return (
    <DashboardContext.Provider value={contextValue}>
      {children}
    </DashboardContext.Provider>
  );
};

export const useDashboard = () => {
  const context = useContext(DashboardContext);
  if (context === undefined) {
    throw new Error("useDashboard must be used within a DashboardProvider");
  }
  return context;
};
