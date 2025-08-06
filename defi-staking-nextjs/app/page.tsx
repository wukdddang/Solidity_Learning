"use client";

import { useState } from "react";
import AccountImporter from "./components/account-importer";

export default function Home() {
  const [error, setError] = useState<string>("");
  const [customRpcUrl, setCustomRpcUrl] = useState<string>(
    "http://127.0.0.1:7545"
  );

  const handleError = (error: string) => {
    setError(error);
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
          Ganache 테스트 계정 관리
        </h1>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              RPC URL 설정
            </h2>
            <div className="flex space-x-2">
              <input
                type="text"
                value={customRpcUrl}
                onChange={(e) => setCustomRpcUrl(e.target.value)}
                placeholder="http://127.0.0.1:7545"
                className="flex-1 px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Ganache가 실행 중인 RPC URL을 입력하세요
            </p>
          </div>

          <AccountImporter customRpcUrl={customRpcUrl} onError={handleError} />

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
