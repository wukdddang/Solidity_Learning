import Link from "next/link";
import {
  Blocks,
  Book,
  ArrowRight,
  FileText,
  Zap,
  Shield,
  Code,
  Users,
  HelpCircle,
  ExternalLink,
  ChevronRight,
} from "lucide-react";

export default function DocsPage() {
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
              <Link href="/docs" className="text-blue-600 font-medium">
                문서
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-6">
            <Book className="h-10 w-10 text-blue-600" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            개발자 문서
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            스마트 컨트랙트 빌더를 효과적으로 사용하는 방법을 배우고, 고급
            기능들을 활용해보세요.
          </p>
        </div>

        {/* Quick Navigation */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Link
            href="/guide"
            className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow border"
          >
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <Zap className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">빠른 시작</h3>
            <p className="text-sm text-gray-600 mb-3">
              5분만에 첫 컨트랙트 만들기
            </p>
            <div className="flex items-center text-green-600 text-sm font-medium">
              가이드 보기 <ChevronRight className="h-4 w-4 ml-1" />
            </div>
          </Link>

          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <Code className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">API 레퍼런스</h3>
            <p className="text-sm text-gray-600 mb-3">
              모든 API 엔드포인트 문서
            </p>
            <div className="flex items-center text-blue-600 text-sm font-medium">
              API 문서 <ChevronRight className="h-4 w-4 ml-1" />
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              <FileText className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">예제 코드</h3>
            <p className="text-sm text-gray-600 mb-3">
              실제 사용 사례와 코드 샘플
            </p>
            <div className="flex items-center text-purple-600 text-sm font-medium">
              예제 보기 <ChevronRight className="h-4 w-4 ml-1" />
            </div>
          </div>

          <Link
            href="/faq"
            className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow border"
          >
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
              <HelpCircle className="h-6 w-6 text-orange-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">FAQ</h3>
            <p className="text-sm text-gray-600 mb-3">자주 묻는 질문과 답변</p>
            <div className="flex items-center text-orange-600 text-sm font-medium">
              FAQ 보기 <ChevronRight className="h-4 w-4 ml-1" />
            </div>
          </Link>
        </div>

        {/* Documentation Sections */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* 기본 사용법 */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                기본 사용법
              </h2>

              <div className="space-y-6">
                <div className="border-l-4 border-blue-500 pl-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    1. 프로젝트 생성
                  </h3>
                  <p className="text-gray-600 mb-3">
                    템플릿을 선택하거나 빈 프로젝트로 시작하여 새로운 스마트
                    컨트랙트 프로젝트를 만드세요.
                  </p>
                  <Link
                    href="/templates"
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium inline-flex items-center gap-1"
                  >
                    템플릿 둘러보기 <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>

                <div className="border-l-4 border-green-500 pl-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    2. 블록 조립
                  </h3>
                  <p className="text-gray-600 mb-3">
                    왼쪽 블록 라이브러리에서 필요한 기능 블록들을 캔버스로
                    드래그하여 컨트랙트를 구성하세요.
                  </p>
                  <span className="text-green-600 text-sm font-medium">
                    드래그 앤 드롭으로 간편하게
                  </span>
                </div>

                <div className="border-l-4 border-purple-500 pl-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    3. 설정 및 컴파일
                  </h3>
                  <p className="text-gray-600 mb-3">
                    각 블록의 세부 설정을 완료한 후 컴파일하여 실제 솔리디티
                    코드를 생성하세요.
                  </p>
                  <span className="text-purple-600 text-sm font-medium">
                    실시간 코드 미리보기 지원
                  </span>
                </div>

                <div className="border-l-4 border-orange-500 pl-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    4. 배포
                  </h3>
                  <p className="text-gray-600 mb-3">
                    테스트넷에서 검증한 후 메인넷에 안전하게 배포하세요.
                  </p>
                  <span className="text-orange-600 text-sm font-medium">
                    가스비 자동 계산
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* 사이드바 */}
          <div className="space-y-6">
            {/* 지원하는 컨트랙트 타입 */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                지원하는 컨트랙트
              </h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="text-2xl">🎨</div>
                  <div>
                    <div className="font-medium text-gray-900">ERC-721 NFT</div>
                    <div className="text-sm text-gray-600">
                      고유한 디지털 자산
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-2xl">🪙</div>
                  <div>
                    <div className="font-medium text-gray-900">ERC-20 토큰</div>
                    <div className="text-sm text-gray-600">
                      대체 가능한 토큰
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-2xl">🗳️</div>
                  <div>
                    <div className="font-medium text-gray-900">투표 시스템</div>
                    <div className="text-sm text-gray-600">
                      탈중앙화 의사결정
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 보안 정보 */}
            <div className="bg-blue-50 rounded-xl border border-blue-200 p-6">
              <div className="flex items-center gap-2 mb-3">
                <Shield className="h-5 w-5 text-blue-600" />
                <h3 className="font-semibold text-blue-900">보안 보장</h3>
              </div>
              <ul className="space-y-2 text-sm text-blue-800">
                <li>• OpenZeppelin 표준 라이브러리 사용</li>
                <li>• 코드 자동 검증 및 감사</li>
                <li>• 알려진 취약점 패턴 차단</li>
                <li>• 가스 최적화 자동 적용</li>
              </ul>
            </div>

            {/* 외부 리소스 */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                외부 리소스
              </h3>
              <div className="space-y-3">
                <a
                  href="https://docs.openzeppelin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <span className="text-sm font-medium text-gray-900">
                    OpenZeppelin 문서
                  </span>
                  <ExternalLink className="h-4 w-4 text-gray-400" />
                </a>
                <a
                  href="https://docs.soliditylang.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <span className="text-sm font-medium text-gray-900">
                    Solidity 문서
                  </span>
                  <ExternalLink className="h-4 w-4 text-gray-400" />
                </a>
                <a
                  href="https://ethereum.org/developers"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <span className="text-sm font-medium text-gray-900">
                    Ethereum 개발자 포털
                  </span>
                  <ExternalLink className="h-4 w-4 text-gray-400" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* 추가 도움 */}
        <div className="mt-12 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            추가 도움이 필요하신가요?
          </h2>
          <p className="text-gray-600 mb-6">
            문서에서 답을 찾지 못했다면 커뮤니티에 질문하거나 지원팀에
            문의하세요.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/faq"
              className="bg-white text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors inline-flex items-center gap-2"
            >
              <HelpCircle className="h-4 w-4" />
              FAQ 확인하기
            </Link>
            <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center gap-2">
              <Users className="h-4 w-4" />
              커뮤니티 참여
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
