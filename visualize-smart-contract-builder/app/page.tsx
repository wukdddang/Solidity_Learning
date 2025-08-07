import Link from "next/link";
import {
  Blocks,
  Shield,
  Zap,
  Play,
  ArrowRight,
  Palette,
  CheckCircle,
} from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="border-b bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <Blocks className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">
                스마트 컨트랙트 빌더
              </span>
            </div>
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
                가이드
              </Link>
            </nav>
            <div className="flex items-center gap-4">
              <Link
                href="/dashboard"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                시작하기
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            코딩 없이 드래그 앤 드롭으로,
            <br />
            <span className="text-blue-600">나만의 스마트 컨트랙트</span>를
            만드세요
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            복잡한 솔리디티 코드는 잊으세요. 검증된 블록들을 조립하여 5분 만에
            안전한 스마트 컨트랙트를 배포할 수 있습니다.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link
              href="/templates"
              className="bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <Play className="h-5 w-5" />
              지금 바로 시작하기
            </Link>
            <Link
              href="/templates"
              className="border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-lg text-lg font-semibold hover:border-gray-400 transition-colors flex items-center gap-2"
            >
              <Palette className="h-5 w-5" />
              템플릿 둘러보기
            </Link>
          </div>

          {/* Demo Video Placeholder */}
          <div className="bg-gray-100 rounded-xl p-8 max-w-4xl mx-auto">
            <div className="aspect-video bg-gray-200 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <Play className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">실제 에디터 화면 데모 영상</p>
                <p className="text-sm text-gray-500 mt-2">(곧 추가 예정)</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-16">
            왜 우리 플랫폼을 선택해야 할까요?
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
                <Blocks className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">쉬움</h3>
              <p className="text-gray-600">
                비주얼 빌더로 누구나 쉽게 사용할 수 있습니다. 코딩 지식이 없어도
                블록을 연결하기만 하면 됩니다.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
                <Shield className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                안전함
              </h3>
              <p className="text-gray-600">
                OpenZeppelin의 검증된 표준 코드를 기반으로 생성됩니다. 보안
                취약점 걱정 없이 안전하게 사용하세요.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
                <Zap className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">빠름</h3>
              <p className="text-gray-600">
                아이디어에서 배포까지 단 5분. 빠른 프로토타이핑으로 아이디어를
                즉시 현실로 만드세요.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Templates Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-4">
            다양한 템플릿으로 시작하세요
          </h2>
          <p className="text-gray-600 text-center mb-16">
            가장 인기 있는 스마트 컨트랙트 유형들을 미리 준비해두었습니다
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="text-4xl mb-4">🎨</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                기본 NFT
              </h3>
              <p className="text-gray-600 mb-4">
                나만의 아트워크나 멤버십을 위한 NFT를 만듭니다.
              </p>
              <Link
                href="/templates?type=nft"
                className="text-blue-600 font-medium flex items-center gap-1 hover:gap-2 transition-all"
              >
                이 템플릿 사용하기 <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="text-4xl mb-4">🪙</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                커뮤니티 토큰
              </h3>
              <p className="text-gray-600 mb-4">
                우리 커뮤니티에서 사용할 포인트를 만듭니다.
              </p>
              <Link
                href="/templates?type=token"
                className="text-blue-600 font-medium flex items-center gap-1 hover:gap-2 transition-all"
              >
                이 템플릿 사용하기 <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="text-4xl mb-4">🗳️</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                간단한 투표
              </h3>
              <p className="text-gray-600 mb-4">
                특정 안건에 대해 홀더들이 투표하게 합니다.
              </p>
              <Link
                href="/templates?type=voting"
                className="text-blue-600 font-medium flex items-center gap-1 hover:gap-2 transition-all"
              >
                이 템플릿 사용하기 <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-20 bg-blue-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-8">
            신뢰할 수 있는 기술로 만들어집니다
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="flex items-center gap-4">
              <CheckCircle className="h-8 w-8 text-green-400 flex-shrink-0" />
              <div className="text-left">
                <h3 className="font-semibold mb-1">OpenZeppelin 표준</h3>
                <p className="text-blue-100">
                  업계에서 가장 신뢰받는 스마트 컨트랙트 라이브러리
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <CheckCircle className="h-8 w-8 text-green-400 flex-shrink-0" />
              <div className="text-left">
                <h3 className="font-semibold mb-1">코드 검증</h3>
                <p className="text-blue-100">
                  모든 생성된 코드는 자동으로 검증되어 안전을 보장
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            지금 바로 시작해보세요
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            5분 만에 나만의 스마트 컨트랙트를 배포하고 Web3 세상에 첫 발을
            내딛어보세요
          </p>
          <Link
            href="/templates"
            className="bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors inline-flex items-center gap-2"
          >
            무료로 시작하기 <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Blocks className="h-6 w-6" />
                <span className="font-bold">스마트 컨트랙트 빌더</span>
              </div>
              <p className="text-gray-400">
                누구나 쉽게 스마트 컨트랙트를 만들 수 있는 플랫폼
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">제품</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/templates" className="hover:text-white">
                    템플릿
                  </Link>
                </li>
                <li>
                  <Link href="/editor" className="hover:text-white">
                    에디터
                  </Link>
                </li>
                <li>
                  <Link href="/dashboard" className="hover:text-white">
                    대시보드
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">지원</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/docs" className="hover:text-white">
                    문서
                  </Link>
                </li>
                <li>
                  <Link href="/guide" className="hover:text-white">
                    가이드
                  </Link>
                </li>
                <li>
                  <Link href="/faq" className="hover:text-white">
                    FAQ
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">회사</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/about" className="hover:text-white">
                    소개
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-white">
                    연락처
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="hover:text-white">
                    개인정보처리방침
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 스마트 컨트랙트 빌더. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
