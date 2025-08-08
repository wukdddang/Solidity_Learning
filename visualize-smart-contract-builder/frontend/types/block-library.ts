import { FileText, Settings, Shield, Zap, Plus } from "lucide-react";

// 블록 템플릿 타입 정의
export interface BlockTemplate {
  id: string;
  type: string;
  name: string;
  description: string;
  category: "basic" | "function" | "access" | "variable";
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}

// API에서 받는 블록 템플릿 타입 (아이콘은 문자열)
export interface BlockTemplateApi {
  id: string;
  type: string;
  name: string;
  description: string;
  category: "basic" | "function" | "access" | "variable";
  icon: string;
}

// 블록 라이브러리 데이터 타입
export interface BlockLibraryData {
  blockTemplates: BlockTemplateApi[];
  categoryLabels: Record<string, string>;
  categoryColors: Record<string, string>;
}

// 아이콘 매핑
export const iconMapping = {
  FileText,
  Settings,
  Shield,
  Zap,
  Plus,
} as const;

// 아이콘 이름 타입
export type IconName = keyof typeof iconMapping;
