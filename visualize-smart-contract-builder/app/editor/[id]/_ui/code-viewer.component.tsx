"use client";

import { useState, useEffect } from "react";
import { useEditor } from "../_context/editor.context";
import {
  Copy,
  Download,
  Code,
  CheckCircle,
  RefreshCw,
  AlertTriangle,
} from "lucide-react";

export default function CodeViewer() {
  const { generatedCode, project, 컨트랙트를_컴파일_한다, isCompiling } =
    useEditor();
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (generatedCode) {
      await navigator.clipboard.writeText(generatedCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownload = () => {
    if (generatedCode) {
      const blob = new Blob([generatedCode], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${project?.name || "contract"}.sol`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  const handleRefresh = () => {
    컨트랙트를_컴파일_한다();
  };

  return (
    <div className="w-96 bg-gray-900 text-gray-100 flex flex-col h-full">
      {/* 헤더 */}
      <div className="p-4 border-b border-gray-700">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Code className="h-5 w-5 text-blue-400" />
            <h2 className="text-lg font-semibold">생성된 코드</h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleRefresh}
              disabled={isCompiling}
              className="p-2 text-gray-400 hover:text-gray-200 disabled:opacity-50"
              title="코드 새로고침"
            >
              <RefreshCw
                className={`h-4 w-4 ${isCompiling ? "animate-spin" : ""}`}
              />
            </button>

            {generatedCode && (
              <>
                <button
                  onClick={handleCopy}
                  className="p-2 text-gray-400 hover:text-gray-200"
                  title="코드 복사"
                >
                  {copied ? (
                    <CheckCircle className="h-4 w-4 text-green-400" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </button>

                <button
                  onClick={handleDownload}
                  className="p-2 text-gray-400 hover:text-gray-200"
                  title="코드 다운로드"
                >
                  <Download className="h-4 w-4" />
                </button>
              </>
            )}
          </div>
        </div>

        {/* 상태 표시 */}
        <div className="flex items-center gap-2 text-sm">
          {isCompiling ? (
            <>
              <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse" />
              <span className="text-yellow-400">컴파일 중...</span>
            </>
          ) : generatedCode ? (
            <>
              <div className="w-2 h-2 bg-green-400 rounded-full" />
              <span className="text-green-400">컴파일 완료</span>
            </>
          ) : (
            <>
              <div className="w-2 h-2 bg-gray-400 rounded-full" />
              <span className="text-gray-400">코드 생성 대기 중</span>
            </>
          )}
        </div>
      </div>

      {/* 코드 영역 */}
      <div className="flex-1 overflow-hidden">
        {generatedCode ? (
          <div className="h-full overflow-auto">
            <pre className="p-4 text-sm font-mono leading-relaxed">
              <code className="text-gray-100 whitespace-pre-wrap">
                {generatedCode}
              </code>
            </pre>
          </div>
        ) : (
          <div className="h-full flex items-center justify-center p-6">
            <div className="text-center">
              {isCompiling ? (
                <>
                  <div className="w-8 h-8 border-2 border-blue-400 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                  <p className="text-gray-400">코드를 생성하는 중...</p>
                </>
              ) : (
                <>
                  <Code className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                  <h3 className="text-gray-400 mb-2">
                    코드가 생성되지 않았습니다
                  </h3>
                  <p className="text-sm text-gray-500 mb-4">
                    블록을 배치하고 '컴파일 및 검증' 버튼을 누르면 여기에
                    솔리디티 코드가 표시됩니다
                  </p>
                  <button
                    onClick={handleRefresh}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    지금 컴파일하기
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>

      {/* 푸터 정보 */}
      <div className="p-4 border-t border-gray-700 bg-gray-800">
        <div className="flex items-center gap-2 text-xs text-gray-400">
          <AlertTriangle className="h-3 w-3" />
          <span>OpenZeppelin 표준 라이브러리 기반</span>
        </div>
        {generatedCode && (
          <div className="mt-2 text-xs text-gray-500">
            라인 수: {generatedCode.split("\n").length}줄
          </div>
        )}
      </div>
    </div>
  );
}
