"use client";

import { ContractTemplate } from "@/types/contract";
import { ArrowRight, Clock, Users, Zap } from "lucide-react";

interface TemplateCardProps {
  template: ContractTemplate;
  onSelectTemplate: (template: ContractTemplate) => void;
}

const getComplexityInfo = (type: ContractTemplate["type"]) => {
  switch (type) {
    case "ERC721":
      return { level: "초급", color: "text-green-600", icon: Zap };
    case "ERC20":
      return { level: "초급", color: "text-green-600", icon: Zap };
    case "VOTING":
      return { level: "중급", color: "text-yellow-600", icon: Clock };
    default:
      return { level: "고급", color: "text-red-600", icon: Users };
  }
};

const getEstimatedTime = (type: ContractTemplate["type"]) => {
  switch (type) {
    case "ERC721":
      return "3-5분";
    case "ERC20":
      return "2-3분";
    case "VOTING":
      return "5-7분";
    default:
      return "10분+";
  }
};

export default function TemplateCard({
  template,
  onSelectTemplate,
}: TemplateCardProps) {
  const complexity = getComplexityInfo(template.type);
  const estimatedTime = getEstimatedTime(template.type);
  const ComplexityIcon = complexity.icon;

  return (
    <div className="bg-white rounded-xl border-2 border-gray-200 hover:border-blue-300 transition-all duration-200 hover:shadow-lg group">
      <div className="p-6">
        {/* 아이콘과 제목 */}
        <div className="flex items-start gap-4 mb-4">
          <div className="text-4xl">{template.icon}</div>
          <div className="flex-1">
            <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
              {template.name}
            </h3>
            <p className="text-gray-600 leading-relaxed">
              {template.description}
            </p>
          </div>
        </div>

        {/* 메타 정보 */}
        <div className="flex items-center gap-4 mb-6 text-sm">
          <div className="flex items-center gap-1">
            <ComplexityIcon className={`h-4 w-4 ${complexity.color}`} />
            <span className={`font-medium ${complexity.color}`}>
              {complexity.level}
            </span>
          </div>
          <div className="flex items-center gap-1 text-gray-500">
            <Clock className="h-4 w-4" />
            <span>{estimatedTime}</span>
          </div>
        </div>

        {/* 주요 기능 */}
        <div className="mb-6">
          <h4 className="text-sm font-medium text-gray-700 mb-2">
            포함된 기능:
          </h4>
          <div className="space-y-1">
            {template.blocks.slice(0, 3).map((block) => (
              <div
                key={block.id}
                className="flex items-center gap-2 text-sm text-gray-600"
              >
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                {block.name}
              </div>
            ))}
            {template.blocks.length > 3 && (
              <div className="text-xs text-gray-500 pl-3">
                +{template.blocks.length - 3}개 더...
              </div>
            )}
          </div>
        </div>

        {/* 액션 버튼 */}
        <button
          onClick={() => onSelectTemplate(template)}
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 group-hover:bg-blue-700"
        >
          이 템플릿 사용하기
          <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      {/* 카드 하단 표시줄 */}
      <div
        className={`h-1 bg-gradient-to-r ${
          template.type === "ERC721"
            ? "from-pink-400 to-purple-500"
            : template.type === "ERC20"
            ? "from-blue-400 to-indigo-500"
            : template.type === "VOTING"
            ? "from-green-400 to-teal-500"
            : "from-gray-400 to-gray-500"
        } rounded-b-xl`}
      />
    </div>
  );
}
