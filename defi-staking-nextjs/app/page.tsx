"use client";

import { useState, useEffect } from "react";

// Window 인터페이스 확장
declare global {
  interface Window {
    ethereum?: any;
  }
}

export default function Home() {
  const [accounts, setAccounts] = useState<string[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string>("");

  const connectWallet = async () => {
    try {
      // Web3가 설치되어 있는지 확인
      if (
        typeof window !== "undefined" &&
        typeof window.ethereum !== "undefined"
      ) {
        // MetaMask 또는 다른 Web3 제공자 요청
        const requestedAccounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });

        setAccounts(requestedAccounts);
        setIsConnected(true);
        setError("");

        // 콘솔에 계정들 출력
        console.log("연결된 계정들:", requestedAccounts);

        // Ganache 계정들도 가져오기 (Web3 인스턴스 생성)
        const Web3 = (await import("web3")).default;
        const web3 = new Web3(window.ethereum);

        // 모든 계정 가져오기
        const allAccounts = await web3.eth.getAccounts();
        console.log("Ganache에서 생성된 모든 계정들:", allAccounts);
      } else {
        setError("Web3 제공자를 찾을 수 없습니다. MetaMask를 설치해주세요.");
      }
    } catch (err) {
      console.error("지갑 연결 오류:", err);
      setError("지갑 연결에 실패했습니다.");
    }
  };

  const disconnectWallet = () => {
    setAccounts([]);
    setIsConnected(false);
    setError("");
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
          Web3 Ethereum 계정 관리
        </h1>

        <div className="bg-white rounded-lg shadow-md p-6">
          {!isConnected ? (
            <div className="text-center">
              <button
                onClick={connectWallet}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
              >
                지갑 연결하기
              </button>
            </div>
          ) : (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  연결된 계정들
                </h2>
                <button
                  onClick={disconnectWallet}
                  className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition-colors"
                >
                  연결 해제
                </button>
              </div>

              <div className="space-y-3">
                {accounts.map((account, index) => (
                  <div key={index} className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-700 font-medium">
                      계정 {index + 1}:
                    </p>
                    <p className="font-mono text-sm break-all text-gray-900 mt-1">
                      {account}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-900 font-medium">
                  💡 개발자 도구의 콘솔을 확인하여 Ganache에서 생성된 모든
                  계정들을 확인할 수 있습니다.
                </p>
              </div>
            </div>
          )}

          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-900 font-medium">{error}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
