import Link from "next/link";
import {
  Blocks,
  Plus,
  ArrowRight,
  FileText,
  Zap,
  Shield,
  Play,
  Sparkles,
} from "lucide-react";

export default function EditorPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="border-b bg-white/50 backdrop-blur-sm">
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
                가이드
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-6">
            <Sparkles className="h-10 w-10 text-blue-600" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            스마트 컨트랙트 에디터
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            비주얼 인터페이스로 스마트 컨트랙트를 만들고 편집하세요. 프로젝트를
            선택하여 시작하거나, 새로운 프로젝트를 만들어보세요.
          </p>
        </div>

        {/* 시작 옵션들 */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* 새 프로젝트 시작 */}
          <div className="bg-white rounded-xl border-2 border-dashed border-blue-300 p-8 text-center hover:border-blue-400 transition-colors">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Plus className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              새 프로젝트 시작
            </h3>
            <p className="text-gray-600 mb-6">
              템플릿을 선택하거나 빈 프로젝트로 시작하세요
            </p>
            <Link
              href="/templates"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center gap-2"
            >
              템플릿 선택하기
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {/* 기존 프로젝트 열기 */}
          <div className="bg-white rounded-xl border border-gray-200 p-8 text-center hover:shadow-lg transition-shadow">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              기존 프로젝트 열기
            </h3>
            <p className="text-gray-600 mb-6">
              이전에 만든 프로젝트를 불러와서 계속 작업하세요
            </p>
            <Link
              href="/dashboard"
              className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors inline-flex items-center gap-2"
            >
              내 프로젝트 보기
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        {/* 에디터 기능 소개 */}
        <div className="bg-white rounded-xl shadow-sm border p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            강력한 에디터 기능
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Blocks className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">
                드래그 앤 드롭
              </h3>
              <p className="text-sm text-gray-600">
                블록을 끌어다 놓기만 하면 코드가 자동으로 생성됩니다
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">
                실시간 미리보기
              </h3>
              <p className="text-sm text-gray-600">
                변경사항이 실시간으로 코드에 반영되는 것을 확인하세요
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">안전한 배포</h3>
              <p className="text-sm text-gray-600">
                검증된 코드만 생성되어 안전하게 블록체인에 배포됩니다
              </p>
            </div>
          </div>
        </div>

        {/* 빠른 시작 가이드 */}
        <div className="mt-12 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            처음 사용하시나요?
          </h2>
          <p className="text-gray-600 mb-6">
            5분만에 첫 번째 스마트 컨트랙트를 만들어보세요
          </p>
          <Link
            href="/guide"
            className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors inline-flex items-center gap-2"
          >
            <Play className="h-4 w-4" />
            빠른 시작 가이드 보기
          </Link>
        </div>
      </main>
    </div>
  );
}
