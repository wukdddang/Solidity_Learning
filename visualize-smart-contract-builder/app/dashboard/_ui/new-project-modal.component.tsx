"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { ContractType } from "@/types/contract";

interface NewProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateProject: (data: {
    name: string;
    description?: string;
    contractType: string;
    templateId?: string;
  }) => Promise<boolean>;
}

const contractTypes: {
  value: ContractType;
  label: string;
  icon: string;
  description: string;
}[] = [
  {
    value: "ERC721",
    label: "기본 NFT",
    icon: "🎨",
    description: "나만의 아트워크나 멤버십을 위한 NFT",
  },
  {
    value: "ERC20",
    label: "커뮤니티 토큰",
    icon: "🪙",
    description: "우리 커뮤니티에서 사용할 포인트",
  },
  {
    value: "VOTING",
    label: "간단한 투표",
    icon: "🗳️",
    description: "특정 안건에 대해 홀더들이 투표",
  },
];

export default function NewProjectModal({
  isOpen,
  onClose,
  onCreateProject,
}: NewProjectModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    contractType: "" as ContractType | "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.contractType) return;

    setIsSubmitting(true);

    const success = await onCreateProject({
      name: formData.name,
      description: formData.description || undefined,
      contractType: formData.contractType,
    });

    if (success) {
      setFormData({ name: "", description: "", contractType: "" });
      onClose();
    }

    setIsSubmitting(false);
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setFormData({ name: "", description: "", contractType: "" });
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* 헤더 */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">
            새 프로젝트 만들기
          </h2>
          <button
            onClick={handleClose}
            disabled={isSubmitting}
            className="text-gray-400 hover:text-gray-600 disabled:opacity-50"
          >
            <X className="h-6 w-6" />
          </button>
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
              placeholder="예: 내 첫 NFT 컬렉션"
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

          {/* 컨트랙트 타입 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              컨트랙트 종류 선택 *
            </label>
            <div className="space-y-3">
              {contractTypes.map((type) => (
                <label
                  key={type.value}
                  className={`block p-4 border rounded-lg cursor-pointer transition-all ${
                    formData.contractType === type.value
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300"
                  } ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  <input
                    type="radio"
                    name="contractType"
                    value={type.value}
                    checked={formData.contractType === type.value}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        contractType: e.target.value as ContractType,
                      }))
                    }
                    className="sr-only"
                    disabled={isSubmitting}
                  />
                  <div className="flex items-start gap-3">
                    <div className="text-2xl">{type.icon}</div>
                    <div>
                      <h3 className="font-medium text-gray-900">
                        {type.label}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {type.description}
                      </p>
                    </div>
                  </div>
                </label>
              ))}
            </div>
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
              disabled={
                !formData.name || !formData.contractType || isSubmitting
              }
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  생성 중...
                </>
              ) : (
                "프로젝트 생성"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
