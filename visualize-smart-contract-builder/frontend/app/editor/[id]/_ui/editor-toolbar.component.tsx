"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useEditor } from "../_context/editor.context";
import {
  ArrowLeft,
  Save,
  Play,
  Rocket,
  Wallet,
  Loader2,
  CheckCircle,
  AlertCircle,
  Code,
  Eye,
  EyeOff,
} from "lucide-react";

interface EditorToolbarProps {
  showCodePanel: boolean;
  onToggleCodePanel: () => void;
}

export default function EditorToolbar({
  showCodePanel,
  onToggleCodePanel,
}: EditorToolbarProps) {
  const router = useRouter();
  const {
    project,
    프로젝트를_저장_한다,
    컨트랙트를_컴파일_한다,
    isSaving,
    isCompiling,
    error,
  } = useEditor();

  const [isWalletConnected, setIsWalletConnected] = useState(false);

  const handleSave = async () => {
    await 프로젝트를_저장_한다();
  };

  const handleCompile = async () => {
    await 컨트랙트를_컴파일_한다();
  };

  const handleDeploy = () => {
    if (project?.status === "COMPILED") {
      router.push(`/deploy/${project.id}`);
    } else {
      alert("먼저 컨트랙트를 컴파일해주세요.");
    }
  };

  const handleConnectWallet = () => {
    // TODO: 실제 지갑 연결 로직 구현
    setIsWalletConnected(!isWalletConnected);
  };

  const getStatusIcon = () => {
    if (error) {
      return <AlertCircle className="h-4 w-4 text-red-500" />;
    }
    if (project?.status === "COMPILED") {
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    }
    if (isCompiling) {
      return <Loader2 className="h-4 w-4 animate-spin text-blue-500" />;
    }
    return null;
  };

  const getStatusText = () => {
    if (error) return "오류 발생";
    if (project?.status === "COMPILED") return "컴파일 완료";
    if (isCompiling) return "컴파일 중...";
    if (isSaving) return "저장 중...";
    return "작업 중";
  };

  return (
    <div className="bg-white border-b border-gray-200 px-4 py-3">
      <div className="flex items-center justify-between">
        {/* 왼쪽: 네비게이션과 프로젝트 정보 */}
        <div className="flex items-center gap-4">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            <span className="hidden sm:inline">대시보드</span>
          </Link>

          <div className="h-6 w-px bg-gray-300" />

          <div>
            <h1 className="text-lg font-semibold text-gray-900">
              {project?.name || "프로젝트 로딩 중..."}
            </h1>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              {getStatusIcon()}
              <span>{getStatusText()}</span>
            </div>
          </div>
        </div>

        {/* 오른쪽: 액션 버튼들 */}
        <div className="flex items-center gap-3">
          {/* 코드 패널 토글 */}
          <button
            onClick={onToggleCodePanel}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
              showCodePanel
                ? "bg-blue-100 text-blue-700 border border-blue-200"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
            title="코드 보기 토글"
          >
            <Code className="h-4 w-4" />
            {showCodePanel ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
            <span className="hidden sm:inline">코드</span>
          </button>

          {/* 저장 버튼 */}
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isSaving ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            <span className="hidden sm:inline">
              {isSaving ? "저장 중..." : "저장"}
            </span>
          </button>

          {/* 컴파일 버튼 */}
          <button
            onClick={handleCompile}
            disabled={isCompiling}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isCompiling ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Play className="h-4 w-4" />
            )}
            <span className="hidden sm:inline">
              {isCompiling ? "컴파일 중..." : "컴파일 및 검증"}
            </span>
          </button>

          {/* 배포 버튼 */}
          <button
            onClick={handleDeploy}
            disabled={project?.status !== "COMPILED"}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Rocket className="h-4 w-4" />
            <span className="hidden sm:inline">배포하기</span>
          </button>

          <div className="h-6 w-px bg-gray-300" />

          {/* 지갑 연결 버튼 */}
          <button
            onClick={handleConnectWallet}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              isWalletConnected
                ? "bg-green-100 text-green-700 border border-green-200"
                : "bg-orange-100 text-orange-700 border border-orange-200 hover:bg-orange-200"
            }`}
          >
            <Wallet className="h-4 w-4" />
            <span className="hidden sm:inline">
              {isWalletConnected ? "지갑 연결됨" : "지갑 연결"}
            </span>
          </button>
        </div>
      </div>

      {/* 에러 메시지 */}
      {error && (
        <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-red-500" />
            <p className="text-sm text-red-800">{error}</p>
          </div>
        </div>
      )}
    </div>
  );
}
