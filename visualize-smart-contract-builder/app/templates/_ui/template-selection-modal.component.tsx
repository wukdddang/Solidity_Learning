"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ContractTemplate } from "@/types/contract";
import { X, Loader2 } from "lucide-react";

interface TemplateSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  template: ContractTemplate | null;
  onCreateProject: (
    templateId: string,
    projectName: string,
    projectDescription?: string
  ) => Promise<string | null>;
}

export default function TemplateSelectionModal({
  isOpen,
  onClose,
  template,
  onCreateProject,
}: TemplateSelectionModalProps) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || !template) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) return;

    setIsSubmitting(true);

    const projectId = await onCreateProject(
      template.id,
      formData.name,
      formData.description || undefined
    );

    if (projectId) {
      setFormData({ name: "", description: "" });
      onClose();
      router.push(`/editor/${projectId}`);
    }

    setIsSubmitting(false);
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setFormData({ name: "", description: "" });
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        {/* 헤더 */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center gap-3">
            <div className="text-2xl">{template.icon}</div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                {template.name}
              </h2>
              <p className="text-sm text-gray-600">{template.type}</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            disabled={isSubmitting}
            className="text-gray-400 hover:text-gray-600 disabled:opacity-50"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* 템플릿 정보 */}
        <div className="p-6 border-b bg-gray-50">
          <p className="text-gray-700 mb-4">{template.description}</p>

          <div>
            <h4 className="font-medium text-gray-900 mb-2">포함된 기능:</h4>
            <div className="grid grid-cols-1 gap-2">
              {template.blocks.map((block) => (
                <div
                  key={block.id}
                  className="flex items-center gap-2 text-sm text-gray-600"
                >
                  <div className="w-2 h-2 bg-blue-500 rounded-full" />
                  <span className="font-medium">{block.name}</span>
                  <span className="text-gray-500">- {block.description}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 폼 */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* 프로젝트 이름 */}
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              프로젝트 이름 *
            </label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, name: e.target.value }))
              }
              placeholder={`예: 내 ${template.name} 프로젝트`}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
              disabled={isSubmitting}
            />
          </div>

          {/* 설명 */}
          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              설명 (선택사항)
            </label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              placeholder="프로젝트에 대한 간단한 설명을 입력하세요"
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              disabled={isSubmitting}
            />
          </div>

          {/* 버튼들 */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
              disabled={isSubmitting}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              취소
            </button>
            <button
              type="submit"
              disabled={!formData.name || isSubmitting}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  생성 중...
                </>
              ) : (
                "프로젝트 생성하기"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
