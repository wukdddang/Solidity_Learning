"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useTemplates } from "../_context/templates.context";
import TemplateCard from "./template-card.component";
import TemplateSelectionModal from "./template-selection-modal.component";
import {
  Blocks,
  Search,
  Filter,
  Loader2,
  AlertCircle,
  Plus,
  ArrowLeft,
  Sparkles,
  FileText,
} from "lucide-react";
import { ContractTemplate } from "@/frontend/types/contract";

export default function TemplatesContent() {
  const router = useRouter();
  const { templates, loading, error, 템플릿으로_프로젝트를_생성_한다 } =
    useTemplates();

  const [selectedTemplate, setSelectedTemplate] =
    useState<ContractTemplate | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<string>("all");

  // 템플릿 필터링
  const filteredTemplates = templates.filter((template) => {
    const matchesSearch =
      template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === "all" || template.type === filterType;

    return matchesSearch && matchesFilter;
  });

  const handleSelectTemplate = (template: ContractTemplate) => {
    setSelectedTemplate(template);
    setIsModalOpen(true);
  };

  const handleCreateProject = async (
    templateId: string,
    projectName: string,
    projectDescription?: string
  ) => {
    return await 템플릿으로_프로젝트를_생성_한다(
      templateId,
      projectName,
      projectDescription
    );
  };

  const handleStartFromScratch = () => {
    // 빈 페이지에서 시작하기 - 기본 프로젝트 생성 후 에디터로 이동
    router.push("/dashboard?action=new");
  };

  if (loading && templates.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">템플릿을 불러오는 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2">
              <Blocks className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">
                스마트 컨트랙트 빌더
              </span>
            </Link>

            <nav className="hidden md:flex space-x-8">
              <Link
                href="/dashboard"
                className="text-gray-600 hover:text-gray-900"
              >
                내 프로젝트
              </Link>
              <Link href="/templates" className="text-blue-600 font-medium">
                템플릿
              </Link>
              <Link href="/docs" className="text-gray-600 hover:text-gray-900">
                가이드
              </Link>
            </nav>

            <Link
              href="/dashboard"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              대시보드로
            </Link>
          </div>
        </div>
      </header>

      {/* 메인 콘텐츠 */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* 타이틀 섹션 */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="h-8 w-8 text-blue-600" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            어떤 종류의 컨트랙트를 만들고 싶으신가요?
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            가장 인기 있는 스마트 컨트랙트 유형들을 미리 준비해두었습니다.
            템플릿을 선택하여 빠르게 시작하거나, 빈 페이지에서 처음부터
            만들어보세요.
          </p>
        </div>

        {/* 검색 및 필터 */}
        <div className="bg-white rounded-lg border p-4 mb-8">
          <div className="flex flex-col sm:flex-row gap-4 sm:items-center">
            {/* 검색 */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="템플릿 검색..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* 필터 */}
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-gray-400" />
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">모든 유형</option>
                <option value="ERC721">NFT (ERC-721)</option>
                <option value="ERC20">토큰 (ERC-20)</option>
                <option value="VOTING">투표</option>
              </select>
            </div>
          </div>
        </div>

        {/* 에러 표시 */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-red-500" />
              <p className="text-red-800">{error}</p>
            </div>
          </div>
        )}

        {/* 템플릿 그리드 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12 items-stretch">
          {filteredTemplates.map((template) => (
            <TemplateCard
              key={template.id}
              template={template}
              onSelectTemplate={handleSelectTemplate}
            />
          ))}
        </div>

        {/* 검색 결과가 없을 때 */}
        {filteredTemplates.length === 0 && !loading && (
          <div className="text-center py-12">
            <div className="text-4xl mb-4">🔍</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              검색 결과가 없습니다
            </h3>
            <p className="text-gray-600">다른 검색어나 필터를 시도해보세요</p>
          </div>
        )}

        {/* 빈 페이지에서 시작하기 */}
        <div className="bg-white rounded-xl border-2 border-dashed border-gray-300 p-8 text-center">
          <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            빈 페이지에서 시작하기
          </h3>
          <p className="text-gray-600 mb-6">
            템플릿 없이 처음부터 나만의 스마트 컨트랙트를 만들어보세요
          </p>
          <button
            onClick={handleStartFromScratch}
            className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors inline-flex items-center gap-2"
          >
            <Plus className="h-5 w-5" />새 프로젝트 시작
          </button>
        </div>
      </main>

      {/* 템플릿 선택 모달 */}
      <TemplateSelectionModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedTemplate(null);
        }}
        template={selectedTemplate}
        onCreateProject={handleCreateProject}
      />
    </div>
  );
}
