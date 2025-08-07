"use client";

import { useState } from "react";
import { getAccountFromPrivateKey } from "../web3";

interface AccountImporterProps {
  customRpcUrl: string;
  onError: (error: string) => void;
}

export default function AccountImporter({
  customRpcUrl,
  onError,
}: AccountImporterProps) {
  const [privateKey, setPrivateKey] = useState("");
  const [accountInfo, setAccountInfo] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleImport = async () => {
    if (!privateKey.trim()) {
      onError("비밀키를 입력해주세요.");
      return;
    }

    try {
      setLoading(true);
      onError("");

      const account = await getAccountFromPrivateKey(privateKey, customRpcUrl);
      setAccountInfo(account);
    } catch (error: any) {
      onError(`계정 가져오기 실패: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">
        Ganache 테스트 계정 가져오기
      </h2>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          계정 비밀키
        </label>
        <input
          type="password"
          value={privateKey}
          onChange={(e) => setPrivateKey(e.target.value)}
          placeholder="0x로 시작하는 64자리 비밀키"
          className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <p className="text-xs text-gray-500 mt-1">
          Ganache 계정의 비밀키를 입력하세요
        </p>
      </div>

      <button
        onClick={handleImport}
        disabled={loading || !privateKey.trim()}
        className="w-full px-4 py-2 bg-blue-500 text-white rounded text-sm font-medium hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? "가져오는 중..." : "계정 가져오기"}
      </button>

      {accountInfo && (
        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <h3 className="font-medium text-gray-900 mb-2">계정 정보</h3>
          <div className="space-y-1 text-sm">
            <p className="text-gray-700">
              <span className="font-medium">주소:</span> {accountInfo.address}
            </p>
            <p className="text-gray-700">
              <span className="font-medium">ETH 잔액:</span>{" "}
              {accountInfo.ethBalance} ETH
            </p>
            <p className="text-gray-700">
              <span className="font-medium">Tether 잔액:</span>{" "}
              {accountInfo.tetherBalance} USDT
            </p>
            <p className="text-gray-700">
              <span className="font-medium">RWD 잔액:</span>{" "}
              {accountInfo.rwdBalance} RWD
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
