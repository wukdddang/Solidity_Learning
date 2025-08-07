"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useDeployed } from "../_context/deployed.context";
import { formatAddress } from "@/lib/utils";
import {
  ArrowLeft,
  ExternalLink,
  Copy,
  CheckCircle,
  Loader2,
  AlertCircle,
  Sparkles,
  Globe,
  FileCode,
  Zap,
  Share2,
  Download,
  Play,
  Book,
  ArrowRight,
} from "lucide-react";

export default function DeployedContent() {
  const { project, loading, error, isInteracting, 컨트랙트와_상호작용_한다 } =
    useDeployed();

  const [copied, setCopied] = useState(false);
  const [interactionResults, setInteractionResults] = useState<
    Record<string, any>
  >({});

  const handleCopyAddress = async () => {
    if (project?.deployedAddress) {
      await navigator.clipboard.writeText(project.deployedAddress);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleInteraction = async (functionName: string, args?: any[]) => {
    const result = await 컨트랙트와_상호작용_한다(functionName, args);
    if (result !== null) {
      setInteractionResults((prev) => ({ ...prev, [functionName]: result }));
    }
  };

  const getEtherscanUrl = () => {
    if (!project?.deployedAddress) return "";

    const baseUrl =
      project.network === "mainnet"
        ? "https://etherscan.io"
        : `https://${project.network}.etherscan.io`;

    return `${baseUrl}/address/${project.deployedAddress}`;
  };

  const getInteractionFunctions = () => {
    if (!project) return [];

    // 프로젝트 타입에 따른 기본 상호작용 함수들
    const baseFunctions = ["name", "symbol"];

    switch (project.contractType) {
      case "ERC721":
        return [...baseFunctions, "totalSupply", "owner", "price", "maxSupply"];
      case "ERC20":
        return [...baseFunctions, "totalSupply", "decimals", "owner"];
      case "VOTING":
        return [...baseFunctions, "owner", "votingPeriod", "proposalsCount"];
      default:
        return baseFunctions;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">배포 정보를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h1 className="text-xl font-semibold text-gray-900 mb-2">
            페이지를 불러올 수 없습니다
          </h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <Link
            href="/dashboard"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            대시보드로 돌아가기
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <header className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link
              href="/dashboard"
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>대시보드로</span>
            </Link>

            <div className="flex items-center gap-2">
              <CheckCircle className="h-6 w-6 text-green-500" />
              <h1 className="text-xl font-bold text-gray-900">배포 완료</h1>
            </div>
          </div>
        </div>
      </header>

      {/* 메인 콘텐츠 */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 축하 섹션 */}
        <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-8 mb-8 text-center">
          <div className="text-6xl mb-4">🎉</div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">축하합니다!</h1>
          <p className="text-xl text-gray-600 mb-6">
            <strong>{project?.name}</strong> 컨트랙트가 성공적으로
            배포되었습니다!
          </p>

          {/* 컨트랙트 주소 */}
          <div className="bg-white rounded-lg p-6 max-w-md mx-auto">
            <p className="text-sm text-gray-600 mb-2">컨트랙트 주소</p>
            <div className="flex items-center gap-2">
              <code className="flex-1 bg-gray-100 px-3 py-2 rounded text-sm font-mono">
                {project?.deployedAddress
                  ? formatAddress(project.deployedAddress)
                  : ""}
              </code>
              <button
                onClick={handleCopyAddress}
                className="p-2 text-gray-500 hover:text-gray-700"
                title="주소 복사"
              >
                {copied ? (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </button>
              <a
                href={getEtherscanUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-gray-500 hover:text-gray-700"
                title="Etherscan에서 보기"
              >
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* 컨트랙트 상호작용 */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex items-center gap-2 mb-6">
              <Play className="h-6 w-6 text-blue-500" />
              <h2 className="text-xl font-semibold text-gray-900">
                컨트랙트 상호작용
              </h2>
            </div>

            <p className="text-gray-600 mb-6">
              배포된 컨트랙트와 직접 상호작용해보세요
            </p>

            <div className="space-y-4">
              {getInteractionFunctions().map((functionName) => (
                <div key={functionName} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <code className="text-sm font-mono text-gray-700">
                      {functionName}()
                    </code>
                    <button
                      onClick={() => handleInteraction(functionName)}
                      disabled={isInteracting}
                      className="px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 disabled:opacity-50 text-sm"
                    >
                      {isInteracting ? (
                        <Loader2 className="h-3 w-3 animate-spin" />
                      ) : (
                        "실행"
                      )}
                    </button>
                  </div>

                  {interactionResults[functionName] && (
                    <div className="mt-2 p-2 bg-gray-50 rounded text-sm">
                      <span className="text-gray-600">결과: </span>
                      <code className="text-gray-900">
                        {String(interactionResults[functionName])}
                      </code>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* 다음 단계 */}
          <div className="space-y-6">
            {/* 프로젝트 정보 */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                프로젝트 정보
              </h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">이름:</span>
                  <span className="font-medium">{project?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">타입:</span>
                  <span className="font-medium">{project?.contractType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">네트워크:</span>
                  <span className="font-medium capitalize">
                    {project?.network}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">상태:</span>
                  <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                    <CheckCircle className="h-3 w-3" />
                    배포 완료
                  </span>
                </div>
              </div>
            </div>

            {/* 액션 버튼들 */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                빠른 액션
              </h2>
              <div className="space-y-3">
                <Link
                  href={`/editor/${project?.id}`}
                  className="w-full flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <FileCode className="h-5 w-5 text-blue-500" />
                    <span>에디터에서 편집</span>
                  </div>
                  <ArrowRight className="h-4 w-4 text-gray-400" />
                </Link>

                <button className="w-full flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <Share2 className="h-5 w-5 text-green-500" />
                    <span>프로젝트 공유</span>
                  </div>
                  <ArrowRight className="h-4 w-4 text-gray-400" />
                </button>

                <button className="w-full flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <Download className="h-5 w-5 text-purple-500" />
                    <span>코드 다운로드</span>
                  </div>
                  <ArrowRight className="h-4 w-4 text-gray-400" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 다음 단계 가이드 */}
        <div className="bg-white rounded-xl shadow-sm border p-8 mt-8">
          <div className="flex items-center gap-2 mb-6">
            <Book className="h-6 w-6 text-indigo-500" />
            <h2 className="text-xl font-semibold text-gray-900">다음 단계</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center p-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Globe className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="font-medium text-gray-900 mb-2">
                웹사이트에 연동
              </h3>
              <p className="text-sm text-gray-600 mb-3">
                이 컨트랙트 주소를 웹사이트에 연동하는 방법을 알아보세요
              </p>
              <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                가이드 보기 →
              </button>
            </div>

            <div className="text-center p-4">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Zap className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="font-medium text-gray-900 mb-2">기능 확장</h3>
              <p className="text-sm text-gray-600 mb-3">
                추가 기능을 개발하거나 업그레이드하는 방법을 알아보세요
              </p>
              <button className="text-green-600 hover:text-green-700 text-sm font-medium">
                튜토리얼 보기 →
              </button>
            </div>

            <div className="text-center p-4">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Sparkles className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="font-medium text-gray-900 mb-2">커뮤니티 참여</h3>
              <p className="text-sm text-gray-600 mb-3">
                다른 개발자들과 경험을 공유하고 도움을 받아보세요
              </p>
              <button className="text-purple-600 hover:text-purple-700 text-sm font-medium">
                커뮤니티 가입 →
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
