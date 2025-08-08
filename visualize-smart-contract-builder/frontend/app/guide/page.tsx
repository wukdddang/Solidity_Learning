import Link from "next/link";
import {
  Blocks,
  Play,
  ArrowRight,
  FileText,
  Zap,
  Shield,
  Code,
  Rocket,
  CheckCircle,
  Clock,
  Target,
  Lightbulb,
  Star,
  ChevronRight,
} from "lucide-react";

export default function GuidePage() {
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
            <Play className="h-10 w-10 text-green-600" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            5분 빠른 시작 가이드
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            처음부터 배포까지, 첫 번째 스마트 컨트랙트를 만드는 완전한
            가이드입니다.
          </p>
          <div className="inline-flex items-center gap-2 bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium">
            <Clock className="h-4 w-4" />
            소요 시간: 약 5분
          </div>
        </div>

        {/* 단계별 가이드 */}
        <div className="space-y-8">
          {/* 1단계 */}
          <div className="bg-white rounded-xl shadow-sm border p-8">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-lg">
                1
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  템플릿 선택하기
                </h2>
                <p className="text-gray-600 mb-6">
                  빈 화면의 막막함을 없애기 위해 미리 준비된 템플릿 중 하나를
                  선택하세요. 각 템플릿은 검증된 기능들로 구성되어 있어 안전하게
                  시작할 수 있습니다.
                </p>

                <div className="grid md:grid-cols-3 gap-4 mb-6">
                  <div className="border border-blue-200 rounded-lg p-4 bg-blue-50">
                    <div className="text-2xl mb-2">🎨</div>
                    <h3 className="font-semibold text-gray-900 mb-1">
                      기본 NFT
                    </h3>
                    <p className="text-sm text-gray-600">
                      디지털 아트나 멤버십용
                    </p>
                  </div>
                  <div className="border border-green-200 rounded-lg p-4 bg-green-50">
                    <div className="text-2xl mb-2">🪙</div>
                    <h3 className="font-semibold text-gray-900 mb-1">
                      커뮤니티 토큰
                    </h3>
                    <p className="text-sm text-gray-600">
                      커뮤니티 포인트 시스템
                    </p>
                  </div>
                  <div className="border border-purple-200 rounded-lg p-4 bg-purple-50">
                    <div className="text-2xl mb-2">🗳️</div>
                    <h3 className="font-semibold text-gray-900 mb-1">
                      투표 시스템
                    </h3>
                    <p className="text-sm text-gray-600">탈중앙화 의사결정</p>
                  </div>
                </div>

                <Link
                  href="/templates"
                  className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Target className="h-4 w-4" />
                  템플릿 선택하러 가기
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>

          {/* 2단계 */}
          <div className="bg-white rounded-xl shadow-sm border p-8">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-green-600 text-white rounded-full flex items-center justify-center font-bold text-lg">
                2
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  블록으로 기능 조립하기
                </h2>
                <p className="text-gray-600 mb-6">
                  에디터에서 왼쪽 블록 라이브러리의 기능들을 중앙 캔버스로
                  드래그하여 원하는 기능을 조립하세요. 마치 레고 블록을 조립하듯
                  쉽고 직관적입니다.
                </p>

                <div className="bg-gray-50 rounded-lg p-6 mb-6">
                  <h3 className="font-semibold text-gray-900 mb-4">
                    주요 블록 카테고리
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                        <FileText className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">
                          기본 정보
                        </div>
                        <div className="text-sm text-gray-600">
                          컨트랙트 이름, 심볼 설정
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                        <Zap className="h-4 w-4 text-green-600" />
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">
                          기능 블록
                        </div>
                        <div className="text-sm text-gray-600">
                          민팅, 소각, 전송 기능
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                        <Shield className="h-4 w-4 text-purple-600" />
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">
                          접근 제어
                        </div>
                        <div className="text-sm text-gray-600">
                          소유자, 권한 설정
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                        <Target className="h-4 w-4 text-orange-600" />
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">변수</div>
                        <div className="text-sm text-gray-600">
                          가격, 최대 발행량
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-green-600">
                  <Lightbulb className="h-5 w-5" />
                  <span className="font-medium">
                    꿀팁: 블록을 연결하면 자동으로 코드가 생성됩니다!
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* 3단계 */}
          <div className="bg-white rounded-xl shadow-sm border p-8">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold text-lg">
                3
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  세부 설정 및 코드 확인
                </h2>
                <p className="text-gray-600 mb-6">
                  각 블록을 클릭하여 오른쪽 설정 패널에서 세부 옵션을
                  조정하세요. 실시간으로 생성되는 솔리디티 코드도 확인할 수
                  있습니다.
                </p>

                <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-6 mb-6">
                  <div className="flex items-center gap-2 mb-3">
                    <Star className="h-5 w-5 text-purple-600" />
                    <h3 className="font-semibold text-gray-900">
                      와우 모먼트!
                    </h3>
                  </div>
                  <p className="text-gray-700">
                    코드 뷰어를 열면 여러분이 조립한 블록들이 실제 솔리디티
                    코드로 실시간 변환되는 마법 같은 순간을 경험할 수 있습니다.
                    🪄
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span className="text-gray-700">
                      블록 클릭 → 오른쪽 패널에서 설정
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span className="text-gray-700">
                      코드 뷰어 토글로 실시간 코드 확인
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span className="text-gray-700">
                      컴파일 버튼으로 코드 검증
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 4단계 */}
          <div className="bg-white rounded-xl shadow-sm border p-8">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-orange-600 text-white rounded-full flex items-center justify-center font-bold text-lg">
                4
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  안전한 배포하기
                </h2>
                <p className="text-gray-600 mb-6">
                  컴파일이 성공했다면 이제 블록체인에 배포할 차례입니다.
                  처음에는 무료 테스트넷에서 테스트해보세요.
                </p>

                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div className="border border-green-200 rounded-lg p-4 bg-green-50">
                    <h3 className="font-semibold text-green-900 mb-2">
                      🧪 테스트넷 (권장)
                    </h3>
                    <ul className="text-sm text-green-800 space-y-1">
                      <li>• 무료로 테스트 가능</li>
                      <li>• 실제와 동일한 환경</li>
                      <li>• 안전한 실험 공간</li>
                    </ul>
                  </div>
                  <div className="border border-blue-200 rounded-lg p-4 bg-blue-50">
                    <h3 className="font-semibold text-blue-900 mb-2">
                      🚀 메인넷
                    </h3>
                    <ul className="text-sm text-blue-800 space-y-1">
                      <li>• 실제 이더리움 네트워크</li>
                      <li>• 가스비 발생</li>
                      <li>• 최종 배포용</li>
                    </ul>
                  </div>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                  <div className="flex items-center gap-2 mb-2">
                    <Shield className="h-5 w-5 text-yellow-600" />
                    <span className="font-semibold text-yellow-900">
                      안전 보장
                    </span>
                  </div>
                  <p className="text-sm text-yellow-800">
                    모든 코드는 OpenZeppelin 표준을 기반으로 생성되며, 알려진
                    보안 취약점을 자동으로 차단합니다.
                  </p>
                </div>

                <button className="inline-flex items-center gap-2 bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 transition-colors">
                  <Rocket className="h-4 w-4" />
                  배포 시작하기
                </button>
              </div>
            </div>
          </div>

          {/* 5단계 */}
          <div className="bg-white rounded-xl shadow-sm border p-8">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-green-600 text-white rounded-full flex items-center justify-center font-bold text-lg">
                5
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  🎉 축하합니다!
                </h2>
                <p className="text-gray-600 mb-6">
                  첫 번째 스마트 컨트랙트가 성공적으로 배포되었습니다! 이제
                  실제로 컨트랙트와 상호작용하거나 웹사이트에 연동할 수
                  있습니다.
                </p>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span className="text-gray-700">
                      컨트랙트 주소 복사하여 저장
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span className="text-gray-700">
                      Etherscan에서 컨트랙트 확인
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span className="text-gray-700">
                      실시간 상호작용 테스트
                    </span>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-6">
                  <h3 className="font-semibold text-gray-900 mb-2">
                    다음 단계
                  </h3>
                  <p className="text-gray-600 mb-4">
                    웹사이트 연동 방법을 알아보거나, 더 복잡한 기능을 가진
                    컨트랙트에 도전해보세요!
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Link
                      href="/docs"
                      className="inline-flex items-center gap-2 bg-white text-gray-700 px-4 py-2 rounded-lg border hover:bg-gray-50 transition-colors"
                    >
                      <FileText className="h-4 w-4" />
                      상세 문서 보기
                    </Link>
                    <Link
                      href="/templates"
                      className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <Code className="h-4 w-4" />더 많은 템플릿 탐색
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-8 text-white text-center">
          <h2 className="text-2xl font-bold mb-4">지금 바로 시작해보세요!</h2>
          <p className="text-blue-100 mb-6">
            5분만 투자하면 여러분만의 첫 번째 스마트 컨트랙트를 만들 수
            있습니다.
          </p>
          <Link
            href="/templates"
            className="bg-white text-blue-600 px-8 py-4 rounded-lg hover:bg-gray-100 transition-colors inline-flex items-center gap-2 font-semibold"
          >
            <Play className="h-5 w-5" />
            지금 시작하기
            <ChevronRight className="h-5 w-5" />
          </Link>
        </div>
      </main>
    </div>
  );
}
