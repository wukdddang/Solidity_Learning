"use client";

import Link from "next/link";
import { ContractProject } from "@/frontend/types/contract";
import { formatDate } from "@/frontend/src/lib/utils";
import {
  Calendar,
  Settings,
  Trash2,
  Edit3,
  ExternalLink,
  AlertCircle,
  CheckCircle,
  Clock,
} from "lucide-react";

interface ProjectCardProps {
  project: ContractProject;
  onDelete: (projectId: string) => Promise<void>;
}

const getStatusIcon = (status: ContractProject["status"]) => {
  switch (status) {
    case "DRAFT":
      return <Clock className="h-4 w-4 text-yellow-500" />;
    case "COMPILED":
      return <CheckCircle className="h-4 w-4 text-blue-500" />;
    case "DEPLOYED_TESTNET":
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    case "DEPLOYED_MAINNET":
      return <CheckCircle className="h-4 w-4 text-purple-500" />;
    case "ERROR":
      return <AlertCircle className="h-4 w-4 text-red-500" />;
    default:
      return <Clock className="h-4 w-4 text-gray-400" />;
  }
};

const getStatusText = (status: ContractProject["status"]) => {
  switch (status) {
    case "DRAFT":
      return "작업 중";
    case "COMPILED":
      return "컴파일 완료";
    case "DEPLOYED_TESTNET":
      return "테스트넷 배포 완료";
    case "DEPLOYED_MAINNET":
      return "메인넷 배포 완료";
    case "ERROR":
      return "오류";
    default:
      return "알 수 없음";
  }
};

const getContractTypeIcon = (type: ContractProject["contractType"]) => {
  switch (type) {
    case "ERC721":
      return "🎨";
    case "ERC20":
      return "🪙";
    case "VOTING":
      return "🗳️";
    default:
      return "📄";
  }
};

export default function ProjectCard({ project, onDelete }: ProjectCardProps) {
  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (confirm("정말로 이 프로젝트를 삭제하시겠습니까?")) {
      await onDelete(project.id);
    }
  };

  return (
    <Link href={`/editor/${project.id}`}>
      <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all duration-200 hover:border-blue-300 group">
        {/* 헤더 */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="text-2xl">
              {getContractTypeIcon(project.contractType)}
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                {project.name}
              </h3>
              <p className="text-sm text-gray-500">{project.contractType}</p>
            </div>
          </div>

          {/* 액션 버튼들 */}
          <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={handleDelete}
              className="p-2 text-gray-400 hover:text-red-500 transition-colors"
              title="삭제"
            >
              <Trash2 className="h-4 w-4" />
            </button>
            <Link
              href={`/editor/${project.id}/settings`}
              onClick={(e) => e.stopPropagation()}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
              title="설정"
            >
              <Settings className="h-4 w-4" />
            </Link>
          </div>
        </div>

        {/* 설명 */}
        {project.description && (
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
            {project.description}
          </p>
        )}

        {/* 상태 */}
        <div className="flex items-center gap-2 mb-4">
          {getStatusIcon(project.status)}
          <span className="text-sm font-medium text-gray-700">
            {getStatusText(project.status)}
          </span>
        </div>

        {/* 배포된 주소 (있을 경우) */}
        {project.deployedAddress && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-green-600 font-medium">
                  배포된 주소
                </p>
                <p className="text-sm text-green-800 font-mono">
                  {project.deployedAddress.slice(0, 10)}...
                  {project.deployedAddress.slice(-8)}
                </p>
              </div>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  window.open(
                    `https://etherscan.io/address/${project.deployedAddress}`,
                    "_blank"
                  );
                }}
                className="text-green-600 hover:text-green-800"
                title="Etherscan에서 보기"
              >
                <ExternalLink className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {/* 푸터 */}
        <div className="flex items-center justify-between text-xs text-gray-500 border-t pt-4">
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            <span>마지막 수정: {formatDate(project.updatedAt)}</span>
          </div>
          <div className="flex items-center gap-1 text-blue-600 group-hover:text-blue-700">
            <Edit3 className="h-3 w-3" />
            <span>편집하기</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
