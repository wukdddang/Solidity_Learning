"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { ContractTemplate } from "@/types/contract";
import { ApiListResponse } from "@/types/api";

interface TemplatesContextType {
  // 데이터 상태
  templates: ContractTemplate[];
  loading: boolean;
  error: string | null;

  // 액션 함수들
  템플릿_목록을_조회_한다: () => Promise<void>;
  템플릿으로_프로젝트를_생성_한다: (
    templateId: string,
    projectName: string,
    projectDescription?: string
  ) => Promise<string | null>;

  // 상태 업데이트 함수들
  setTemplates: React.Dispatch<React.SetStateAction<ContractTemplate[]>>;
}

const TemplatesContext = createContext<TemplatesContextType | undefined>(
  undefined
);

export const TemplatesProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  // 데이터 상태
  const [templates, setTemplates] = useState<ContractTemplate[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 템플릿 목록 조회
  const 템플릿_목록을_조회_한다 = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/templates/mount");
      const result: ApiListResponse<ContractTemplate> = await response.json();

      if (response.ok) {
        setTemplates(result.items);
      } else {
        throw new Error("템플릿 목록 조회에 실패했습니다.");
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다."
      );
      console.error("템플릿 목록 조회 오류:", err);
    } finally {
      setLoading(false);
    }
  };

  // 템플릿으로 프로젝트 생성
  const 템플릿으로_프로젝트를_생성_한다 = async (
    templateId: string,
    projectName: string,
    projectDescription?: string
  ): Promise<string | null> => {
    setLoading(true);
    setError(null);

    try {
      const template = templates.find((t) => t.id === templateId);
      if (!template) {
        throw new Error("선택한 템플릿을 찾을 수 없습니다.");
      }

      const response = await fetch("/api/projects/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: projectName,
          description: projectDescription,
          templateId: templateId,
          contractType: template.type,
        }),
      });

      const result = await response.json();

      if (result.success) {
        return result.data.id; // 생성된 프로젝트 ID 반환
      } else {
        throw new Error(result.error || "프로젝트 생성에 실패했습니다.");
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다."
      );
      console.error("프로젝트 생성 오류:", err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // 컴포넌트 마운트 시 데이터 로드
  useEffect(() => {
    템플릿_목록을_조회_한다();
  }, []);

  const contextValue: TemplatesContextType = {
    templates,
    loading,
    error,
    템플릿_목록을_조회_한다,
    템플릿으로_프로젝트를_생성_한다,
    setTemplates,
  };

  return (
    <TemplatesContext.Provider value={contextValue}>
      {children}
    </TemplatesContext.Provider>
  );
};

export const useTemplates = () => {
  const context = useContext(TemplatesContext);
  if (context === undefined) {
    throw new Error("useTemplates must be used within a TemplatesProvider");
  }
  return context;
};
