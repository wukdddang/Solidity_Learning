"use client";

import Link from "next/link";
import { useState, useEffect, useMemo } from "react";
import {
  Blocks,
  Shield,
  Zap,
  Play,
  ArrowRight,
  Palette,
  CheckCircle,
  X,
  Mail,
  Phone,
  MapPin,
  Building,
  Calendar,
  FileText,
  Users,
} from "lucide-react";

export default function Home() {
  const [showModal, setShowModal] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Unsplash 이미지 컬렉션 (blockchain, technology, digital 관련)
  const heroImages = useMemo(
    () => [
      "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=1920&h=1080&fit=crop&crop=center", // blockchain
      "https://images.unsplash.com/photo-1518186285589-2f7649de83e0?w=1920&h=1080&fit=crop&crop=center", // circuit board
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1920&h=1080&fit=crop&crop=center", // data visualization
      "https://images.unsplash.com/photo-1563770660941-20978e870e26?w=1920&h=1080&fit=crop&crop=center", // digital network
      "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1920&h=1080&fit=crop&crop=center", // space tech
      "https://images.unsplash.com/photo-1526628953301-3e589a6a8b74?w=1920&h=1080&fit=crop&crop=center", // robot hand
    ],
    []
  );

  const openModal = (type: string) => {
    setShowModal(type);
  };

  const closeModal = () => {
    setShowModal(null);
  };

  // 이미지 변경 효과
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) =>
        prev === heroImages.length - 1 ? 0 : prev + 1
      );
    }, 5000); // 5초마다 이미지 변경

    return () => clearInterval(interval);
  }, [heroImages.length]);

  // 이미지 프리로딩
  useEffect(() => {
    heroImages.forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }, [heroImages]);
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="absolute top-0 left-0 right-0 z-20 border-b border-white/20 bg-black/20 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <Blocks className="h-8 w-8 text-blue-400" />
              <span className="text-xl font-bold text-white">
                스마트 컨트랙트 빌더
              </span>
            </div>
            <nav className="hidden md:flex space-x-8">
              <Link
                href="/templates"
                className="text-gray-200 hover:text-white transition-colors"
              >
                템플릿
              </Link>
              <Link
                href="/dashboard"
                className="text-gray-200 hover:text-white transition-colors"
              >
                내 프로젝트
              </Link>
              <Link
                href="/docs"
                className="text-gray-200 hover:text-white transition-colors"
              >
                가이드
              </Link>
            </nav>
            <div className="flex items-center gap-4">
              <Link
                href="/dashboard"
                className="bg-blue-600/90 backdrop-blur-sm text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all duration-300 border border-blue-500/50"
              >
                시작하기
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 min-h-screen flex items-center overflow-hidden">
        {/* 동적 배경 이미지 */}
        <div className="absolute inset-0 z-0">
          {/* 모든 배경 이미지들 */}
          {heroImages.map((image, index) => (
            <div
              key={index}
              className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-1000 ease-in-out"
              style={{
                backgroundImage: `url(${image})`,
                opacity: index === currentImageIndex ? 1 : 0,
              }}
            />
          ))}
          {/* 어두운 오버레이 */}
          <div className="absolute inset-0 bg-black/60" />
          {/* 그라디언트 오버레이 */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900/30 via-transparent to-purple-900/30" />
          {/* 애니메이션 파티클 효과 */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-white rounded-full animate-pulse"></div>
            <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-blue-400 rounded-full animate-bounce delay-300"></div>
            <div className="absolute bottom-1/4 left-1/3 w-1.5 h-1.5 bg-white rounded-full animate-pulse delay-700"></div>
            <div className="absolute top-2/3 right-1/4 w-1 h-1 bg-blue-300 rounded-full animate-bounce delay-1000"></div>
          </div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 drop-shadow-lg">
            코딩 없이 드래그 앤 드롭으로,
            <br />
            <span className="text-blue-400">나만의 스마트 컨트랙트</span>를
            만드세요
          </h1>
          <p className="text-xl text-gray-200 mb-8 max-w-3xl mx-auto drop-shadow-md">
            복잡한 솔리디티 코드는 잊으세요. 검증된 블록들을 조립하여 5분 만에
            안전한 스마트 컨트랙트를 배포할 수 있습니다.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link
              href="/templates"
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-300 flex items-center gap-2 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              <Play className="h-5 w-5" />
              지금 바로 시작하기
            </Link>
            <Link
              href="/templates"
              className="border-2 border-white/50 bg-white/10 backdrop-blur-sm text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-white/20 transition-all duration-300 flex items-center gap-2 transform hover:scale-105"
            >
              <Palette className="h-5 w-5" />
              템플릿 둘러보기
            </Link>
          </div>

          {/* Demo Video Placeholder */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 max-w-4xl mx-auto border border-white/20">
            <div className="aspect-video bg-black/30 rounded-lg flex items-center justify-center backdrop-blur-sm">
              <div className="text-center">
                <Play className="h-16 w-16 text-white/80 mx-auto mb-4" />
                <p className="text-white/90 font-medium">
                  실제 에디터 화면 데모 영상
                </p>
                <p className="text-sm text-white/70 mt-2">(곧 추가 예정)</p>
              </div>
            </div>
          </div>
        </div>

        {/* 이미지 인디케이터 */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10">
          <div className="flex space-x-3">
            {heroImages.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  if (index !== currentImageIndex) {
                    setCurrentImageIndex(index);
                  }
                }}
                className={`relative w-3 h-3 rounded-full transition-all duration-300 transform ${
                  index === currentImageIndex
                    ? "bg-white scale-125 shadow-lg"
                    : "bg-white/50 hover:bg-white/75 hover:scale-110"
                }`}
              >
                {index === currentImageIndex && (
                  <div className="absolute inset-0 rounded-full bg-white animate-ping opacity-50"></div>
                )}
              </button>
            ))}
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
                  <button
                    onClick={() => openModal("about")}
                    className="hover:text-white"
                  >
                    소개
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => openModal("contact")}
                    className="hover:text-white"
                  >
                    연락처
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => openModal("privacy")}
                    className="hover:text-white"
                  >
                    개인정보처리방침
                  </button>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 스마트 컨트랙트 빌더. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* 모달들 */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* 회사 소개 모달 */}
            {showModal === "about" && (
              <>
                <div className="flex items-center justify-between p-6 border-b">
                  <div className="flex items-center gap-3">
                    <Building className="h-6 w-6 text-blue-600" />
                    <h2 className="text-xl font-semibold text-gray-900">
                      회사 소개
                    </h2>
                  </div>
                  <button
                    onClick={closeModal}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>
                <div className="p-6">
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">
                        스마트 컨트랙트 빌더
                      </h3>
                      <p className="text-gray-600 leading-relaxed mb-4">
                        저희는 블록체인 기술의 진입장벽을 낮추고, 누구나 쉽게
                        스마트 컨트랙트를 만들 수 있는 혁신적인 플랫폼을
                        제공합니다. 복잡한 코딩 없이도 드래그 앤 드롭만으로
                        안전하고 검증된 스마트 컨트랙트를 생성할 수 있습니다.
                      </p>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">미션</h4>
                      <p className="text-gray-600 mb-4">
                        Web3 세상의 진입장벽을 낮춰 더 많은 사람들이 블록체인
                        기술의 혜택을 누릴 수 있도록 돕습니다.
                      </p>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">비전</h4>
                      <p className="text-gray-600 mb-4">
                        누구나 5분 만에 자신만의 스마트 컨트랙트를 만들 수 있는
                        세상을 만들고자 합니다.
                      </p>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">
                        핵심 가치
                      </h4>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span className="text-gray-600">
                            접근성: 코딩 지식 없이도 사용 가능
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span className="text-gray-600">
                            안전성: OpenZeppelin 표준 기반
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span className="text-gray-600">
                            투명성: 모든 과정이 공개되고 검증됨
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span className="text-gray-600">
                            혁신성: 지속적인 기술 발전과 개선
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-blue-50 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Calendar className="h-4 w-4 text-blue-600" />
                        <h4 className="font-semibold text-blue-900">
                          설립 정보
                        </h4>
                      </div>
                      <div className="text-sm text-blue-800 space-y-1">
                        <p>설립년도: 2024년</p>
                        <p>위치: 서울, 대한민국</p>
                        <p>팀 규모: 15명 (개발자, 디자이너, 블록체인 전문가)</p>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* 연락처 모달 */}
            {showModal === "contact" && (
              <>
                <div className="flex items-center justify-between p-6 border-b">
                  <div className="flex items-center gap-3">
                    <Mail className="h-6 w-6 text-green-600" />
                    <h2 className="text-xl font-semibold text-gray-900">
                      연락처
                    </h2>
                  </div>
                  <button
                    onClick={closeModal}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>
                <div className="p-6">
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        문의하기
                      </h3>
                      <p className="text-gray-600 mb-6">
                        궁금한 점이나 지원이 필요하시면 언제든 연락주세요.
                        최대한 빠른 시간 내에 답변드리겠습니다.
                      </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div className="flex items-start gap-3">
                          <Mail className="h-5 w-5 text-blue-600 mt-0.5" />
                          <div>
                            <h4 className="font-semibold text-gray-900">
                              이메일
                            </h4>
                            <p className="text-gray-600">
                              support@smartcontract-builder.com
                            </p>
                            <p className="text-sm text-gray-500 mt-1">
                              일반 문의 및 지원
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start gap-3">
                          <Phone className="h-5 w-5 text-green-600 mt-0.5" />
                          <div>
                            <h4 className="font-semibold text-gray-900">
                              전화
                            </h4>
                            <p className="text-gray-600">02-1234-5678</p>
                            <p className="text-sm text-gray-500 mt-1">
                              평일 9:00 - 18:00
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start gap-3">
                          <MapPin className="h-5 w-5 text-red-600 mt-0.5" />
                          <div>
                            <h4 className="font-semibold text-gray-900">
                              주소
                            </h4>
                            <p className="text-gray-600">
                              서울특별시 강남구 테헤란로 123
                              <br />
                              스마트빌딩 10층
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="bg-gray-50 rounded-lg p-4">
                        <h4 className="font-semibold text-gray-900 mb-3">
                          부서별 연락처
                        </h4>
                        <div className="space-y-3 text-sm">
                          <div>
                            <p className="font-medium text-gray-900">
                              기술 지원
                            </p>
                            <p className="text-gray-600">
                              tech@smartcontract-builder.com
                            </p>
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">
                              사업 제휴
                            </p>
                            <p className="text-gray-600">
                              business@smartcontract-builder.com
                            </p>
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">
                              미디어 문의
                            </p>
                            <p className="text-gray-600">
                              press@smartcontract-builder.com
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-blue-50 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Users className="h-4 w-4 text-blue-600" />
                        <h4 className="font-semibold text-blue-900">
                          커뮤니티
                        </h4>
                      </div>
                      <p className="text-sm text-blue-800 mb-3">
                        개발자 커뮤니티에 참여하여 다른 사용자들과 소통하세요.
                      </p>
                      <div className="flex gap-3 text-sm">
                        <button className="text-blue-600 hover:text-blue-700 font-medium">
                          Discord
                        </button>
                        <button className="text-blue-600 hover:text-blue-700 font-medium">
                          Telegram
                        </button>
                        <button className="text-blue-600 hover:text-blue-700 font-medium">
                          GitHub
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* 개인정보처리방침 모달 */}
            {showModal === "privacy" && (
              <>
                <div className="flex items-center justify-between p-6 border-b">
                  <div className="flex items-center gap-3">
                    <FileText className="h-6 w-6 text-purple-600" />
                    <h2 className="text-xl font-semibold text-gray-900">
                      개인정보처리방침
                    </h2>
                  </div>
                  <button
                    onClick={closeModal}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>
                <div className="p-6">
                  <div className="space-y-6 text-sm">
                    <div>
                      <p className="text-gray-600 mb-4">
                        <strong>시행일자:</strong> 2024년 1월 1일
                        <br />
                        <strong>최종 업데이트:</strong> 2024년 12월 15일
                      </p>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">
                        1. 개인정보 수집 및 이용 목적
                      </h3>
                      <p className="text-gray-600 mb-2">
                        저희는 다음 목적을 위해 개인정보를 수집합니다:
                      </p>
                      <ul className="list-disc pl-6 text-gray-600 space-y-1">
                        <li>서비스 제공 및 계정 관리</li>
                        <li>프로젝트 저장 및 관리</li>
                        <li>고객 지원 및 문의 응답</li>
                        <li>서비스 개선 및 개발</li>
                      </ul>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">
                        2. 수집하는 개인정보 항목
                      </h3>
                      <div className="space-y-2">
                        <div>
                          <p className="font-medium text-gray-700">
                            필수 정보:
                          </p>
                          <p className="text-gray-600">이메일 주소, 사용자명</p>
                        </div>
                        <div>
                          <p className="font-medium text-gray-700">
                            선택 정보:
                          </p>
                          <p className="text-gray-600">
                            프로필 이미지, 지갑 주소
                          </p>
                        </div>
                        <div>
                          <p className="font-medium text-gray-700">
                            자동 수집 정보:
                          </p>
                          <p className="text-gray-600">
                            IP 주소, 접속 로그, 쿠키
                          </p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">
                        3. 개인정보 보관 및 이용 기간
                      </h3>
                      <p className="text-gray-600 mb-2">
                        수집된 개인정보는 목적 달성 시까지 보관하며, 계정 삭제
                        요청 시 즉시 삭제됩니다.
                      </p>
                      <ul className="list-disc pl-6 text-gray-600 space-y-1">
                        <li>계정 정보: 계정 삭제 시까지</li>
                        <li>프로젝트 데이터: 사용자 요청 시 삭제</li>
                        <li>접속 로그: 3개월</li>
                      </ul>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">
                        4. 개인정보 제3자 제공
                      </h3>
                      <p className="text-gray-600">
                        저희는 사용자의 동의 없이 개인정보를 제3자에게 제공하지
                        않습니다. 단, 법적 요구가 있을 경우 예외로 합니다.
                      </p>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">
                        5. 개인정보 보호 조치
                      </h3>
                      <ul className="list-disc pl-6 text-gray-600 space-y-1">
                        <li>암호화를 통한 안전한 데이터 저장</li>
                        <li>접근 권한 관리 및 모니터링</li>
                        <li>정기적인 보안 점검</li>
                        <li>직원 보안 교육</li>
                      </ul>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">
                        6. 쿠키 사용
                      </h3>
                      <p className="text-gray-600">
                        저희는 서비스 개선을 위해 쿠키를 사용합니다. 브라우저
                        설정을 통해 쿠키 사용을 거부할 수 있습니다.
                      </p>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">
                        7. 이용자 권리
                      </h3>
                      <p className="text-gray-600 mb-2">
                        사용자는 다음 권리를 가집니다:
                      </p>
                      <ul className="list-disc pl-6 text-gray-600 space-y-1">
                        <li>개인정보 열람 요구</li>
                        <li>개인정보 정정·삭제 요구</li>
                        <li>개인정보 처리 정지 요구</li>
                        <li>손해배상 청구</li>
                      </ul>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-4">
                      <h4 className="font-semibold text-gray-900 mb-2">
                        문의처
                      </h4>
                      <p className="text-gray-600">
                        개인정보 관련 문의사항이 있으시면 아래 연락처로
                        문의해주세요.
                      </p>
                      <p className="text-gray-600 mt-2">
                        <strong>개인정보보호 담당자:</strong>{" "}
                        privacy@smartcontract-builder.com
                        <br />
                        <strong>전화:</strong> 02-1234-5678
                      </p>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
