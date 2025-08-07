"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Blocks,
  HelpCircle,
  ArrowRight,
  Search,
  Plus,
  Minus,
  Shield,
  DollarSign,
  Code,
  Zap,
  Users,
  MessageCircle,
} from "lucide-react";

interface FAQItem {
  id: string;
  category: string;
  question: string;
  answer: string;
}

const faqData: FAQItem[] = [
  {
    id: "1",
    category: "기본 사용법",
    question: "코딩을 전혀 모르는데도 사용할 수 있나요?",
    answer:
      "네, 물론입니다! 저희 플랫폼은 코딩 지식이 없는 분들도 쉽게 사용할 수 있도록 설계되었습니다. 드래그 앤 드롭만으로 스마트 컨트랙트를 만들 수 있으며, 모든 전문 용어는 쉬운 말로 설명되어 있습니다.",
  },
  {
    id: "2",
    category: "기본 사용법",
    question: "첫 번째 컨트랙트를 만드는데 얼마나 걸리나요?",
    answer:
      "템플릿을 사용한다면 약 5분 정도면 첫 번째 스마트 컨트랙트를 완성하고 배포할 수 있습니다. 처음 사용하시는 분들도 15분 내외로 완성 가능합니다.",
  },
  {
    id: "3",
    category: "보안",
    question: "생성된 코드는 안전한가요?",
    answer:
      "네, 매우 안전합니다. 모든 코드는 업계 표준인 OpenZeppelin 라이브러리를 기반으로 생성되며, 알려진 보안 취약점들을 자동으로 차단합니다. 또한 코드 생성 전 자동 검증 과정을 거칩니다.",
  },
  {
    id: "4",
    category: "보안",
    question: "개인 키나 민감한 정보가 저장되나요?",
    answer:
      "아니요, 저희는 개인 키나 지갑 정보를 저장하지 않습니다. 모든 블록체인 상호작용은 사용자의 지갑을 통해 직접 이루어지며, 프로젝트 설정 정보만 안전하게 암호화하여 저장합니다.",
  },
  {
    id: "5",
    category: "비용",
    question: "플랫폼 사용 비용이 있나요?",
    answer:
      "기본적인 컨트랙트 생성 및 편집은 무료입니다. 실제 블록체인 배포 시에는 네트워크 가스비만 지불하면 됩니다. 테스트넷 사용은 완전 무료입니다.",
  },
  {
    id: "6",
    category: "비용",
    question: "가스비는 얼마나 나오나요?",
    answer:
      "가스비는 네트워크 상황과 컨트랙트 복잡도에 따라 달라집니다. 일반적으로 기본 NFT는 0.01-0.05 ETH, ERC-20 토큰은 0.005-0.02 ETH 정도입니다. 배포 전 정확한 가스비를 미리 계산해서 보여드립니다.",
  },
  {
    id: "7",
    category: "기술",
    question: "어떤 종류의 스마트 컨트랙트를 만들 수 있나요?",
    answer:
      "현재 ERC-721 NFT, ERC-20 토큰, 투표 시스템을 지원하며, 향후 DeFi, DAO, 게임파이 등 더 다양한 템플릿을 추가할 예정입니다. 빈 프로젝트로 시작하여 커스텀 컨트랙트도 만들 수 있습니다.",
  },
  {
    id: "8",
    category: "기술",
    question: "어떤 블록체인 네트워크를 지원하나요?",
    answer:
      "현재 이더리움 메인넷과 Sepolia, Goerli 테스트넷을 지원합니다. 향후 Polygon, BSC, Arbitrum 등 다양한 네트워크 지원을 추가할 계획입니다.",
  },
  {
    id: "9",
    category: "기술",
    question: "생성된 코드를 직접 수정할 수 있나요?",
    answer:
      "네, 코드 뷰어에서 생성된 솔리디티 코드를 확인하고 다운로드할 수 있습니다. 고급 사용자는 코드를 수정하여 직접 배포하는 것도 가능합니다.",
  },
  {
    id: "10",
    category: "문제해결",
    question: "컴파일 오류가 발생하면 어떻게 하나요?",
    answer:
      "대부분의 오류는 블록 연결이 잘못되었거나 필수 설정이 누락된 경우입니다. 오류 메시지를 확인하여 문제가 되는 블록을 수정하세요. 해결되지 않으면 지원팀에 문의해주세요.",
  },
  {
    id: "11",
    category: "문제해결",
    question: "배포가 실패하면 가스비를 잃나요?",
    answer:
      "배포가 실패해도 가스비는 소모됩니다. 하지만 저희 플랫폼에서는 배포 전 시뮬레이션을 통해 성공 가능성을 미리 확인하므로 실패 확률이 매우 낮습니다.",
  },
  {
    id: "12",
    category: "협업",
    question: "팀 프로젝트로 함께 작업할 수 있나요?",
    answer:
      "현재는 개인 프로젝트만 지원하지만, 향후 팀 협업 기능을 추가할 예정입니다. 프로젝트 공유 및 권한 관리 기능이 포함될 계획입니다.",
  },
];

const categories = [
  "전체",
  "기본 사용법",
  "보안",
  "비용",
  "기술",
  "문제해결",
  "협업",
];

export default function FAQPage() {
  const [selectedCategory, setSelectedCategory] = useState("전체");
  const [searchTerm, setSearchTerm] = useState("");
  const [openItems, setOpenItems] = useState<string[]>([]);

  const filteredFAQs = faqData.filter((item) => {
    const matchesCategory =
      selectedCategory === "전체" || item.category === selectedCategory;
    const matchesSearch =
      item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const toggleItem = (id: string) => {
    setOpenItems((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center gap-2">
              <Blocks className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">
                스마트 컨트랙트 빌더
              </span>
            </Link>
            <nav className="hidden md:flex space-x-8">
              <Link
                href="/templates"
                className="text-gray-600 hover:text-gray-900"
              >
                템플릿
              </Link>
              <Link
                href="/dashboard"
                className="text-gray-600 hover:text-gray-900"
              >
                내 프로젝트
              </Link>
              <Link href="/docs" className="text-gray-600 hover:text-gray-900">
                문서
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-6">
            <HelpCircle className="h-10 w-10 text-orange-600" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            자주 묻는 질문
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            스마트 컨트랙트 빌더 사용 중 궁금한 점들을 모았습니다. 찾고 있는
            답변이 없다면 언제든 문의해주세요.
          </p>
        </div>

        {/* 검색 및 필터 */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* 검색 */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="질문 검색..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* 카테고리 필터 */}
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedCategory === category
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* FAQ 목록 */}
        <div className="space-y-4 mb-12">
          {filteredFAQs.map((item) => (
            <div key={item.id} className="bg-white rounded-lg shadow-sm border">
              <button
                onClick={() => toggleItem(item.id)}
                className="w-full p-6 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full font-medium">
                      {item.category}
                    </span>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900">
                    {item.question}
                  </h3>
                </div>
                <div className="ml-4">
                  {openItems.includes(item.id) ? (
                    <Minus className="h-5 w-5 text-gray-500" />
                  ) : (
                    <Plus className="h-5 w-5 text-gray-500" />
                  )}
                </div>
              </button>

              {openItems.includes(item.id) && (
                <div className="px-6 pb-6">
                  <div className="pt-4 border-t border-gray-100">
                    <p className="text-gray-600 leading-relaxed">
                      {item.answer}
                    </p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* 검색 결과 없음 */}
        {filteredFAQs.length === 0 && (
          <div className="text-center py-12">
            <div className="text-4xl mb-4">🔍</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              검색 결과가 없습니다
            </h3>
            <p className="text-gray-600 mb-6">
              다른 검색어를 시도하거나 카테고리를 변경해보세요
            </p>
            <button
              onClick={() => {
                setSearchTerm("");
                setSelectedCategory("전체");
              }}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              전체 FAQ 보기
            </button>
          </div>
        )}

        {/* 도움이 더 필요한 경우 */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageCircle className="h-8 w-8 text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              찾는 답변이 없으신가요?
            </h2>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              FAQ에서 원하는 답변을 찾지 못했다면, 저희 지원팀이나 커뮤니티에서
              도움을 받아보세요.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center gap-2">
                <MessageCircle className="h-4 w-4" />
                지원팀 문의
              </button>
              <button className="bg-white text-gray-700 px-6 py-3 rounded-lg border hover:bg-gray-50 transition-colors inline-flex items-center gap-2">
                <Users className="h-4 w-4" />
                커뮤니티 참여
              </button>
            </div>
          </div>
        </div>

        {/* 카테고리별 통계 */}
        <div className="mt-12 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.slice(1).map((category) => {
            const count = faqData.filter(
              (item) => item.category === category
            ).length;
            const icons = {
              "기본 사용법": Zap,
              보안: Shield,
              비용: DollarSign,
              기술: Code,
              문제해결: HelpCircle,
              협업: Users,
            };
            const Icon = icons[category as keyof typeof icons] || HelpCircle;

            return (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className="bg-white p-4 rounded-lg border hover:shadow-md transition-all text-center"
              >
                <Icon className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                <div className="text-sm font-medium text-gray-900">
                  {category}
                </div>
                <div className="text-xs text-gray-500">{count}개 문항</div>
              </button>
            );
          })}
        </div>
      </main>
    </div>
  );
}
