"use client";

import { memo } from "react";
import { Handle, Position, NodeProps } from "reactflow";
import { useEditor } from "../_context/editor.context";
import { ContractBlock, BlockConfig } from "@/frontend/types/contract";
import {
  Settings,
  Trash2,
  FileText,
  Plus,
  Zap,
  Shield,
  Variable,
} from "lucide-react";

interface CustomBlockNodeData {
  block: ContractBlock;
  label: string;
  type: string;
  config: BlockConfig;
}

const getBlockIcon = (type: string) => {
  switch (type) {
    case "CONTRACT_INFO":
      return FileText;
    case "MINT_FUNCTION":
      return Plus;
    case "BURN_FUNCTION":
      return Zap;
    case "ACCESS_CONTROL":
      return Shield;
    case "VARIABLE":
      return Variable;
    default:
      return Settings;
  }
};

const getBlockColor = (type: string) => {
  switch (type) {
    case "CONTRACT_INFO":
      return "border-blue-400 bg-blue-50 text-blue-900";
    case "MINT_FUNCTION":
    case "BURN_FUNCTION":
      return "border-green-400 bg-green-50 text-green-900";
    case "ACCESS_CONTROL":
      return "border-purple-400 bg-purple-50 text-purple-900";
    case "VARIABLE":
      return "border-orange-400 bg-orange-50 text-orange-900";
    default:
      return "border-gray-400 bg-gray-50 text-gray-900";
  }
};

function CustomBlockNode({
  id,
  data,
  selected,
}: NodeProps<CustomBlockNodeData>) {
  const { 블록을_삭제_한다, setSelectedNode } = useEditor();

  const IconComponent = getBlockIcon(data.type);
  const colorClass = getBlockColor(data.type);

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    블록을_삭제_한다(id);
  };

  const handleClick = () => {
    setSelectedNode({
      id,
      type: "customBlock",
      position: { x: 0, y: 0 },
      data,
    });
  };

  return (
    <div
      onClick={handleClick}
      className={`
        relative min-w-[200px] p-4 rounded-lg border-2 transition-all duration-200 cursor-pointer
        ${colorClass}
        ${selected ? "ring-2 ring-blue-500 ring-offset-2" : ""}
        hover:shadow-md
      `}
    >
      {/* 입력 핸들 */}
      {data.block.inputs.map((input, index) => (
        <Handle
          key={input.id}
          type="target"
          position={Position.Left}
          id={input.id}
          style={{
            top: `${30 + index * 25}px`,
            background: "#6366f1",
            width: "8px",
            height: "8px",
          }}
        />
      ))}

      {/* 출력 핸들 */}
      {data.block.outputs.map((output, index) => (
        <Handle
          key={output.id}
          type="source"
          position={Position.Right}
          id={output.id}
          style={{
            top: `${30 + index * 25}px`,
            background: "#10b981",
            width: "8px",
            height: "8px",
          }}
        />
      ))}

      {/* 헤더 */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <IconComponent className="h-5 w-5" />
          <span className="font-semibold text-sm">{data.label}</span>
        </div>

        <button
          onClick={handleDelete}
          className="p-1 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
          title="삭제"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>

      {/* 설명 */}
      <p className="text-xs text-gray-600 mb-3">{data.block.description}</p>

      {/* 설정 미리보기 */}
      {Object.keys(data.config).length > 0 && (
        <div className="space-y-1">
          {Object.entries(data.config)
            .slice(0, 2)
            .map(([key, value]) => (
              <div
                key={key}
                className="flex justify-between items-center text-xs"
              >
                <span className="text-gray-600">{key}:</span>
                <span className="font-medium text-gray-900 truncate max-w-[80px]">
                  {String(value) || "미설정"}
                </span>
              </div>
            ))}
          {Object.keys(data.config).length > 2 && (
            <div className="text-xs text-gray-500">
              +{Object.keys(data.config).length - 2}개 더...
            </div>
          )}
        </div>
      )}

      {/* 선택됨 표시 */}
      {selected && (
        <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full" />
      )}
    </div>
  );
}

export default memo(CustomBlockNode);
