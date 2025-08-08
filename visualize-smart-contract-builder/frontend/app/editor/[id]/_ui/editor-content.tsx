"use client";

import { useState } from "react";
import { useEditor } from "../_context/editor.context";
import EditorToolbar from "./editor-toolbar.component";
import BlockLibraryPanel from "./block-library.panel";
import EditorCanvas from "./editor-canvas.component";
import BlockSettingsPanel from "./block-settings-panel.component";
import CodeViewer from "./code-viewer.component";
import { Loader2, AlertCircle } from "lucide-react";

export default function EditorContent() {
  const { project, loading, error } = useEditor();
  const [showCodePanel, setShowCodePanel] = useState(false);

  const handleToggleCodePanel = () => {
    setShowCodePanel(!showCodePanel);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">프로젝트를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (error && !project) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h1 className="text-xl font-semibold text-gray-900 mb-2">
            프로젝트를 불러올 수 없습니다
          </h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => window.history.back()}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            돌아가기
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-gray-50 flex flex-col overflow-hidden">
      {/* 툴바 */}
      <div className="flex-shrink-0">
        <EditorToolbar
          showCodePanel={showCodePanel}
          onToggleCodePanel={handleToggleCodePanel}
        />
      </div>

      {/* 메인 레이아웃 */}
      <div className="flex-1 flex overflow-hidden">
        {/* 왼쪽: 블록 라이브러리 */}
        <div className="flex-shrink-0">
          <BlockLibraryPanel />
        </div>

        {/* 중앙: 캔버스 */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <EditorCanvas />
        </div>

        {/* 오른쪽: 설정 패널 또는 코드 뷰어 */}
        <div className="flex-shrink-0">
          {showCodePanel ? <CodeViewer /> : <BlockSettingsPanel />}
        </div>
      </div>

      {/* 하단 상태바 (선택사항) */}
      <div className="flex-shrink-0 bg-white border-t border-gray-200 px-4 py-2">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <div className="flex items-center gap-4">
            <span>
              프로젝트: <strong>{project?.name}</strong>
            </span>
            <span>
              타입: <strong>{project?.contractType}</strong>
            </span>
            <span>
              상태:{" "}
              <strong>
                {project?.status === "DRAFT" && "작업 중"}
                {project?.status === "COMPILED" && "컴파일 완료"}
                {project?.status === "DEPLOYED_TESTNET" && "테스트넷 배포 완료"}
                {project?.status === "DEPLOYED_MAINNET" && "메인넷 배포 완료"}
                {project?.status === "ERROR" && "오류"}
              </strong>
            </span>
          </div>

          <div className="flex items-center gap-4">
            <span>
              블록 수: <strong>{project?.blocks.length || 0}</strong>
            </span>
            <span>
              연결 수: <strong>{project?.connections.length || 0}</strong>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
