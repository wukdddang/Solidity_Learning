"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useDeploy } from "../_context/deploy.context";
import {
  ArrowLeft,
  Rocket,
  Shield,
  Zap,
  AlertTriangle,
  CheckCircle,
  Loader2,
  Eye,
  FileText,
  Network,
  DollarSign,
  Clock,
} from "lucide-react";

const networkOptions = [
  {
    value: "sepolia",
    label: "Sepolia 테스트넷",
    description: "무료 테스트 네트워크 (권장)",
    color: "text-blue-600 bg-blue-50 border-blue-200",
    recommended: true,
  },
  {
    value: "goerli",
    label: "Goerli 테스트넷",
    description: "또 다른 테스트 네트워크",
    color: "text-purple-600 bg-purple-50 border-purple-200",
    recommended: false,
  },
  {
    value: "mainnet",
    label: "Ethereum 메인넷",
    description: "실제 이더리움 네트워크 (실제 비용 발생)",
    color: "text-red-600 bg-red-50 border-red-200",
    recommended: false,
  },
];

export default function DeployContent() {
  const router = useRouter();
  const {
    project,
    gasEstimate,
    loading,
    error,
    isDeploying,
    isEstimating,
    가스비를_추정_한다,
    컨트랙트를_배포_한다,
  } = useDeploy();

  const [selectedNetwork, setSelectedNetwork] = useState("sepolia");
  const [confirmed, setConfirmed] = useState(false);
  const [showCode, setShowCode] = useState(false);

  const handleNetworkChange = async (network: string) => {
    setSelectedNetwork(network);
    await 가스비를_추정_한다(network);
  };

  const handleDeploy = async () => {
    if (!project || !confirmed) return;

    const result = await 컨트랙트를_배포_한다({
      network: selectedNetwork,
      gasLimit: gasEstimate?.gasLimit,
      gasPrice: gasEstimate?.gasPrice,
    });

    if (result?.success) {
      router.push(`/deployed/${project.id}`);
    }
  };

  const getProjectFeatures = () => {
    if (!project) return [];

    return project.blocks.map((block) => ({
      name: block.name,
      description: block.description,
    }));
  };

  const selectedNetworkInfo = networkOptions.find(
    (n) => n.value === selectedNetwork
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">프로젝트 정보를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <header className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link
              href={`/editor/${project?.id}`}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>에디터로 돌아가기</span>
            </Link>

            <div className="flex items-center gap-2">
              <Rocket className="h-6 w-6 text-orange-500" />
              <h1 className="text-xl font-bold text-gray-900">배포 확인</h1>
            </div>
          </div>
        </div>
      </header>

      {/* 메인 콘텐츠 */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 에러 표시 */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              <p className="text-red-800">{error}</p>
            </div>
          </div>
        )}

        {/* 배포 안내 */}
        <div className="bg-white rounded-xl shadow-sm border p-8 mb-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Rocket className="h-8 w-8 text-orange-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              아래 내용으로 컨트랙트를 배포합니다
            </h2>
            <p className="text-gray-600">
              배포하기 전에 모든 정보를 확인해주세요
            </p>
          </div>

          {/* 프로젝트 정보 */}
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <FileText className="h-5 w-5" />
                컨트랙트 정보
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">컨트랙트 이름:</span>
                  <span className="font-medium text-gray-900">
                    {project?.name}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">종류:</span>
                  <span className="font-medium text-gray-900">
                    {project?.contractType}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">블록 수:</span>
                  <span className="font-medium text-gray-900">
                    {project?.blocks.length}개
                  </span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Zap className="h-5 w-5" />
                주요 기능
              </h3>
              <div className="space-y-2">
                {getProjectFeatures()
                  .slice(0, 4)
                  .map((feature, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full" />
                      <span className="text-sm text-gray-700">
                        {feature.name}
                      </span>
                    </div>
                  ))}
                {getProjectFeatures().length > 4 && (
                  <div className="text-sm text-gray-500 pl-4">
                    +{getProjectFeatures().length - 4}개 더...
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* 네트워크 선택 */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Network className="h-5 w-5" />
              배포 네트워크 선택
            </h3>
            <div className="grid md:grid-cols-3 gap-4">
              {networkOptions.map((network) => (
                <label
                  key={network.value}
                  className={`relative block p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    selectedNetwork === network.value
                      ? network.color
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <input
                    type="radio"
                    name="network"
                    value={network.value}
                    checked={selectedNetwork === network.value}
                    onChange={(e) => handleNetworkChange(e.target.value)}
                    className="sr-only"
                  />
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-900">
                        {network.label}
                      </h4>
                      {network.recommended && (
                        <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                          권장
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600">
                      {network.description}
                    </p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* 가스비 정보 */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              예상 배포 비용
              {isEstimating && (
                <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
              )}
            </h3>

            {gasEstimate ? (
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">가스 한도</p>
                    <p className="font-medium text-gray-900">
                      {gasEstimate.gasLimit?.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">가스 가격</p>
                    <p className="font-medium text-gray-900">
                      {(Number(gasEstimate.gasPrice) / 1e9).toFixed(2)} Gwei
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">예상 비용</p>
                    <p className="font-medium text-gray-900">
                      {gasEstimate.estimatedCost} ETH
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-gray-50 rounded-lg p-4 text-center">
                <Clock className="h-6 w-6 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-600">가스비를 계산하는 중...</p>
              </div>
            )}
          </div>

          {/* 생성된 코드 미리보기 */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Eye className="h-5 w-5" />
                생성된 코드
              </h3>
              <button
                onClick={() => setShowCode(!showCode)}
                className="text-blue-600 hover:text-blue-700 text-sm"
              >
                {showCode ? "숨기기" : "코드 보기"}
              </button>
            </div>

            {showCode && project?.generatedCode && (
              <div className="bg-gray-900 text-gray-100 rounded-lg p-4 max-h-64 overflow-y-auto">
                <pre className="text-sm font-mono">
                  <code>{project.generatedCode}</code>
                </pre>
              </div>
            )}
          </div>

          {/* 확인 체크박스 */}
          <div className="mb-8">
            <label className="flex items-start gap-3 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <input
                type="checkbox"
                checked={confirmed}
                onChange={(e) => setConfirmed(e.target.checked)}
                className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <div>
                <p className="font-medium text-gray-900">
                  내용을 모두 확인했으며, 배포에 동의합니다
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  배포 후에는 컨트랙트를 수정할 수 없습니다.
                  {selectedNetworkInfo?.value === "mainnet" &&
                    " 메인넷 배포 시 실제 이더리움이 소모됩니다."}
                </p>
              </div>
            </label>
          </div>

          {/* 배포 버튼 */}
          <div className="flex gap-4">
            <Link
              href={`/editor/${project?.id}`}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-center"
            >
              취소
            </Link>
            <button
              onClick={handleDeploy}
              disabled={!confirmed || isDeploying || !gasEstimate}
              className="flex-1 px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
            >
              {isDeploying ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  배포 중...
                </>
              ) : (
                <>
                  <Rocket className="h-5 w-5" />
                  {selectedNetworkInfo?.label}에 배포하기
                </>
              )}
            </button>
          </div>
        </div>

        {/* 신뢰 표시 */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex items-center gap-3 mb-4">
            <Shield className="h-6 w-6 text-green-500" />
            <h3 className="text-lg font-semibold text-gray-900">안전한 배포</h3>
          </div>
          <div className="space-y-2 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span>OpenZeppelin 표준 라이브러리 기반</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span>코드 자동 검증 완료</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span>보안 취약점 검사 통과</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
