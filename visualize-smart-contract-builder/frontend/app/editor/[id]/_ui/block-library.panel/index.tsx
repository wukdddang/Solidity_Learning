"use client";

import { useState } from "react";
import { useEditor } from "../../_context/editor.context";
import { Search, Filter, GripVertical, Loader2 } from "lucide-react";

export default function BlockLibraryPanel() {
  // Context의 커스텀 훅을 호출하여 Route Handler에서 받은 데이터 사용
  const {
    블록을_추가_한다,
    blockTemplates,
    categoryLabels,
    categoryColors,
    loading,
    error,
  } = useEditor();

  // 페이지 UI 상태들 (Context와 분리)
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  // 검색 및 필터링된 블록 목록
  const filteredBlocks = blockTemplates.filter((block) => {
    const matchesSearch =
      block.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      block.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || block.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  // 드래그 시작 핸들러
  const handleDragStart = (event: React.DragEvent, blockType: string) => {
    event.dataTransfer.setData("blockType", blockType);
    event.dataTransfer.effectAllowed = "copy";
  };

  // 블록 추가 핸들러
  const handleAddBlock = (blockType: string) => {
    // 캔버스 중앙에 블록 추가
    const position = {
      x: Math.random() * 300 + 100,
      y: Math.random() * 300 + 100,
    };
    블록을_추가_한다(blockType, position);
  };

  // 재시도 핸들러
  const handleRetry = () => {
    // projectId가 필요하므로 context에서 가져와서 전체 데이터를 다시 로드
    // 실제로는 context에서 projectId를 expose하거나 다른 방법으로 처리
    window.location.reload(); // 임시 방편
  };

  return (
    <div className="w-80 bg-white border-r border-gray-200 flex flex-col h-full">
      {/* 헤더 섹션 */}
      <div className="flex-shrink-0 p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          블록 라이브러리
        </h2>

        {/* 검색 입력 */}
        <div className="relative mb-3">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="블록 검색..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            disabled={loading}
          />
        </div>

        {/* 카테고리 필터 */}
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-gray-400" />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="flex-1 text-sm border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            disabled={loading}
          >
            <option value="all">모든 카테고리</option>
            <option value="basic">기본 정보</option>
            <option value="function">기능 블록</option>
            <option value="access">접근 제어</option>
            <option value="variable">변수</option>
          </select>
        </div>
      </div>

      {/* 블록 목록 섹션 */}
      <div className="flex-1 overflow-y-auto scrollbar-thin p-4">
        {/* 로딩 상태 */}
        {loading && (
          <div className="flex items-center justify-center py-8">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin text-blue-500 mx-auto mb-2" />
              <p className="text-gray-500 text-sm">
                에디터 데이터를 불러오는 중...
              </p>
            </div>
          </div>
        )}

        {/* 에러 상태 */}
        {error && !loading && (
          <div className="text-center py-8">
            <div className="text-4xl mb-2">⚠️</div>
            <p className="text-gray-500 text-sm mb-3">{error}</p>
            <button
              onClick={handleRetry}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600 transition-colors"
            >
              다시 시도
            </button>
          </div>
        )}

        {/* 블록 목록 */}
        {!loading && !error && (
          <div className="space-y-3">
            {filteredBlocks.map((block) => {
              const IconComponent = block.icon;
              return (
                <div
                  key={block.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, block.type)}
                  onClick={() => handleAddBlock(block.type)}
                  className={`
                    p-4 rounded-lg border-2 border-dashed cursor-pointer transition-all duration-200
                    hover:shadow-md hover:scale-105 active:scale-95
                    ${categoryColors[block.category]}
                  `}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0">
                      <div className="flex items-center gap-1">
                        <GripVertical className="h-4 w-4 text-gray-400" />
                        <IconComponent className="h-5 w-5" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-semibold text-gray-900 mb-1">
                        {block.name}
                      </h3>
                      <p className="text-xs text-gray-600 leading-relaxed">
                        {block.description}
                      </p>
                      <div className="mt-2">
                        <span className="text-xs px-2 py-1 rounded-full bg-white bg-opacity-50 font-medium">
                          {categoryLabels[block.category]}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* 검색 결과가 없을 때 */}
        {!loading && !error && filteredBlocks.length === 0 && (
          <div className="text-center py-8">
            <div className="text-4xl mb-2">🔍</div>
            <p className="text-gray-500 text-sm">블록을 찾을 수 없습니다</p>
          </div>
        )}
      </div>

      {/* 도움말 섹션 */}
      <div className="flex-shrink-0 p-4 border-t border-gray-200 bg-gray-50">
        <div className="text-xs text-gray-600">
          <p className="mb-1">
            💡 <strong>사용법:</strong>
          </p>
          <p>• 블록을 클릭하여 캔버스에 추가</p>
          <p>• 드래그하여 원하는 위치에 배치</p>
        </div>
      </div>
    </div>
  );
}
