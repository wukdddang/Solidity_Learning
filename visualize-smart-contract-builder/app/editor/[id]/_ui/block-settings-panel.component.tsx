"use client";

import { useState, useEffect } from "react";
import { useEditor } from "../_context/editor.context";
import { Settings, X, Save, AlertCircle, Info } from "lucide-react";

export default function BlockSettingsPanel() {
  const { selectedNode, 블록_설정을_업데이트_한다, setSelectedNode } =
    useEditor();
  const [config, setConfig] = useState<Record<string, any>>({});
  const [hasChanges, setHasChanges] = useState(false);

  // 선택된 노드가 변경될 때 설정 로드
  useEffect(() => {
    if (selectedNode) {
      setConfig(selectedNode.data.config || {});
      setHasChanges(false);
    }
  }, [selectedNode]);

  const handleConfigChange = (key: string, value: any) => {
    setConfig((prev) => ({ ...prev, [key]: value }));
    setHasChanges(true);
  };

  const handleSave = () => {
    if (selectedNode) {
      블록_설정을_업데이트_한다(selectedNode.id, config);
      setHasChanges(false);
    }
  };

  const handleClose = () => {
    setSelectedNode(null);
    setHasChanges(false);
  };

  if (!selectedNode) {
    return (
      <div className="w-80 bg-white border-l border-gray-200 flex items-center justify-center h-full">
        <div className="text-center p-6">
          <Settings className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">설정 패널</h3>
          <p className="text-gray-500 text-sm">
            블록을 선택하면 여기에서 세부 설정을 할 수 있습니다
          </p>
        </div>
      </div>
    );
  }

  const block = selectedNode.data.block;

  const renderInputField = (input: any) => {
    const value = config[input.id] || input.defaultValue || "";

    switch (input.type) {
      case "string":
        return (
          <input
            type="text"
            value={value}
            onChange={(e) => handleConfigChange(input.id, e.target.value)}
            placeholder={`${input.name} 입력...`}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required={input.required}
          />
        );

      case "number":
        return (
          <input
            type="number"
            value={value}
            onChange={(e) =>
              handleConfigChange(input.id, Number(e.target.value))
            }
            placeholder={`${input.name} 입력...`}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required={input.required}
          />
        );

      case "boolean":
        return (
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={value}
              onChange={(e) => handleConfigChange(input.id, e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label className="ml-2 text-sm text-gray-700">활성화</label>
          </div>
        );

      case "select":
        return (
          <select
            value={value}
            onChange={(e) => handleConfigChange(input.id, e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required={input.required}
          >
            <option value="">선택하세요</option>
            {input.options?.map((option: any) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );

      default:
        return (
          <input
            type="text"
            value={value}
            onChange={(e) => handleConfigChange(input.id, e.target.value)}
            placeholder={`${input.name} 입력...`}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required={input.required}
          />
        );
    }
  };

  return (
    <div className="w-80 bg-white border-l border-gray-200 flex flex-col h-full">
      {/* 헤더 */}
      <div className="flex-shrink-0 p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-semibold text-gray-900">블록 설정</h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex items-center gap-2">
          <div className="text-2xl">
            {selectedNode.data.type === "CONTRACT_INFO" && "📄"}
            {selectedNode.data.type === "MINT_FUNCTION" && "➕"}
            {selectedNode.data.type === "BURN_FUNCTION" && "⚡"}
            {selectedNode.data.type === "ACCESS_CONTROL" && "🛡️"}
            {selectedNode.data.type === "VARIABLE" && "⚙️"}
          </div>
          <div>
            <h3 className="font-medium text-gray-900">{block.name}</h3>
            <p className="text-sm text-gray-500">{block.description}</p>
          </div>
        </div>
      </div>

      {/* 설정 폼 */}
      <div className="flex-1 overflow-y-auto scrollbar-thin p-4">
        <div className="space-y-4">
          {block.inputs.map((input) => (
            <div key={input.id} className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                {input.name}
                {input.required && <span className="text-red-500 ml-1">*</span>}
              </label>

              {renderInputField(input)}

              {/* 도움말 텍스트 */}
              {input.description && (
                <div className="flex items-start gap-2 p-2 bg-blue-50 rounded-lg">
                  <Info className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                  <p className="text-xs text-blue-700">{input.description}</p>
                </div>
              )}
            </div>
          ))}

          {/* 입력 필드가 없는 경우 */}
          {block.inputs.length === 0 && (
            <div className="text-center py-6">
              <AlertCircle className="h-8 w-8 text-gray-300 mx-auto mb-2" />
              <p className="text-sm text-gray-500">
                이 블록에는 설정할 수 있는 옵션이 없습니다
              </p>
            </div>
          )}
        </div>
      </div>

      {/* 액션 버튼 */}
      {block.inputs.length > 0 && (
        <div className="flex-shrink-0 p-4 border-t border-gray-200">
          <div className="flex gap-2">
            <button
              onClick={handleClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              취소
            </button>
            <button
              onClick={handleSave}
              disabled={!hasChanges}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <Save className="h-4 w-4" />
              저장
            </button>
          </div>

          {hasChanges && (
            <p className="text-xs text-amber-600 mt-2 flex items-center gap-1">
              <AlertCircle className="h-3 w-3" />
              저장되지 않은 변경사항이 있습니다
            </p>
          )}
        </div>
      )}
    </div>
  );
}
