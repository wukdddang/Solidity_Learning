"use client";

import { useState } from "react";
import { useEditor } from "../_context/editor.context";
import {
  Search,
  Filter,
  FileText,
  Settings,
  Shield,
  Zap,
  Plus,
  GripVertical,
} from "lucide-react";

interface BlockTemplate {
  id: string;
  type: string;
  name: string;
  description: string;
  category: "basic" | "function" | "access" | "variable";
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}

const blockTemplates: BlockTemplate[] = [
  {
    id: "contract-info",
    type: "CONTRACT_INFO",
    name: "컨트랙트 정보",
    description: "컨트랙트 기본 정보 설정",
    category: "basic",
    icon: FileText,
  },
  {
    id: "mint-function",
    type: "MINT_FUNCTION",
    name: "새로 만들기 기능",
    description: "NFT나 토큰을 새로 만드는 기능",
    category: "function",
    icon: Plus,
  },
  {
    id: "burn-function",
    type: "BURN_FUNCTION",
    name: "소각 기능",
    description: "NFT나 토큰을 소각하는 기능",
    category: "function",
    icon: Zap,
  },
  {
    id: "access-control",
    type: "ACCESS_CONTROL",
    name: "접근 제어",
    description: "소유자만 실행 가능하게 설정",
    category: "access",
    icon: Shield,
  },
  {
    id: "variable",
    type: "VARIABLE",
    name: "변수",
    description: "가격, 최대 발행량 등 변수 설정",
    category: "variable",
    icon: Settings,
  },
];

const categoryLabels = {
  basic: "기본 정보",
  function: "기능 블록",
  access: "접근 제어",
  variable: "변수",
};

const categoryColors = {
  basic: "text-blue-600 bg-blue-50 border-blue-200",
  function: "text-green-600 bg-green-50 border-green-200",
  access: "text-purple-600 bg-purple-50 border-purple-200",
  variable: "text-orange-600 bg-orange-50 border-orange-200",
};

export default function BlockLibrary() {
  const { 블록을_추가_한다 } = useEditor();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const filteredBlocks = blockTemplates.filter((block) => {
    const matchesSearch =
      block.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      block.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || block.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const handleDragStart = (event: React.DragEvent, blockType: string) => {
    event.dataTransfer.setData("blockType", blockType);
    event.dataTransfer.effectAllowed = "copy";
  };

  const handleAddBlock = (blockType: string) => {
    // 캔버스 중앙에 블록 추가
    const position = {
      x: Math.random() * 300 + 100,
      y: Math.random() * 300 + 100,
    };
    블록을_추가_한다(blockType, position);
  };

  return (
    <div className="w-80 bg-white border-r border-gray-200 flex flex-col h-full">
      {/* 헤더 */}
      <div className="flex-shrink-0 p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          블록 라이브러리
        </h2>

        {/* 검색 */}
        <div className="relative mb-3">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="블록 검색..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* 카테고리 필터 */}
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-gray-400" />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="flex-1 text-sm border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">모든 카테고리</option>
            <option value="basic">기본 정보</option>
            <option value="function">기능 블록</option>
            <option value="access">접근 제어</option>
            <option value="variable">변수</option>
          </select>
        </div>
      </div>

      {/* 블록 목록 */}
      <div className="flex-1 overflow-y-auto scrollbar-thin p-4">
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

        {/* 검색 결과가 없을 때 */}
        {filteredBlocks.length === 0 && (
          <div className="text-center py-8">
            <div className="text-4xl mb-2">🔍</div>
            <p className="text-gray-500 text-sm">블록을 찾을 수 없습니다</p>
          </div>
        )}
      </div>

      {/* 도움말 */}
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
