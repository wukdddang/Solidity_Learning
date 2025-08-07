"use client";

import { useState, useEffect } from "react";
import {
  getStakingInfo,
  approveTether,
  stakeTokens,
  unstakeTokens,
  getTetherBalance,
  IStakingInfo,
} from "./web3-utils";

interface StakingManagerProps {
  customRpcUrl: string;
  onError: (error: string) => void;
}

export default function StakingManager({
  customRpcUrl,
  onError,
}: StakingManagerProps) {
  const [privateKey, setPrivateKey] = useState("");
  const [stakingAmount, setStakingAmount] = useState("");
  const [accountInfo, setAccountInfo] = useState<{
    address: string;
    tetherBalance: string;
    stakingInfo: IStakingInfo | null;
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [transactionHash, setTransactionHash] = useState("");
  const [isApproved, setIsApproved] = useState(false);

  // 계정 정보 조회
  const loadAccountInfo = async () => {
    if (!privateKey.trim()) return;

    try {
      setLoading(true);
      onError("");

      // 비밀키로 계정 주소 생성
      const Web3 = (await import("web3")).default;
      let cleanPrivateKey = privateKey.trim();
      if (cleanPrivateKey.startsWith("0x")) {
        cleanPrivateKey = cleanPrivateKey.substring(2);
      }
      const tempWeb3 = new Web3();
      const account = tempWeb3.eth.accounts.privateKeyToAccount(
        "0x" + cleanPrivateKey
      );

      // Tether 잔액 조회
      const tetherBalance = await getTetherBalance(
        account.address,
        customRpcUrl
      );

      // 스테이킹 정보 조회
      const stakingInfo = await getStakingInfo(account.address, customRpcUrl);

      setAccountInfo({
        address: account.address,
        tetherBalance,
        stakingInfo,
      });
    } catch (error: any) {
      onError(`계정 정보 조회 실패: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Tether 승인
  const handleApprove = async () => {
    if (!privateKey.trim() || !stakingAmount.trim()) {
      onError("비밀키와 스테이킹 금액을 입력해주세요.");
      return;
    }

    try {
      setLoading(true);
      onError("");
      setTransactionHash("");

      const hash = await approveTether(privateKey, stakingAmount, customRpcUrl);
      setTransactionHash(hash);
      setIsApproved(true);

      // 승인 후 계정 정보 새로고침
      setTimeout(loadAccountInfo, 2000);
    } catch (error: any) {
      onError(`Tether 승인 실패: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // 토큰 스테이킹
  const handleStake = async () => {
    if (!privateKey.trim() || !stakingAmount.trim()) {
      onError("비밀키와 스테이킹 금액을 입력해주세요.");
      return;
    }

    try {
      setLoading(true);
      onError("");
      setTransactionHash("");

      const hash = await stakeTokens(privateKey, stakingAmount, customRpcUrl);
      setTransactionHash(hash);

      // 스테이킹 후 계정 정보 새로고침
      setTimeout(loadAccountInfo, 2000);
    } catch (error: any) {
      onError(`토큰 스테이킹 실패: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // 토큰 언스테이킹
  const handleUnstake = async () => {
    if (!privateKey.trim()) {
      onError("비밀키를 입력해주세요.");
      return;
    }

    try {
      setLoading(true);
      onError("");
      setTransactionHash("");

      const hash = await unstakeTokens(privateKey, customRpcUrl);
      setTransactionHash(hash);

      // 언스테이킹 후 계정 정보 새로고침
      setTimeout(loadAccountInfo, 2000);
    } catch (error: any) {
      onError(`토큰 언스테이킹 실패: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // 계정 정보 자동 새로고침
  useEffect(() => {
    if (privateKey.trim()) {
      loadAccountInfo();
    }
  }, [privateKey, customRpcUrl]);

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">
        토큰 스테이킹 관리
      </h2>

      {/* 비밀키 입력 */}
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

      {/* 계정 정보 표시 */}
      {accountInfo && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg relative">
          <button
            onClick={loadAccountInfo}
            disabled={loading}
            className="absolute top-2 right-2 p-1 text-gray-500 hover:text-gray-700 disabled:opacity-50"
            title="계정 정보 새로고침"
          >
            <svg
              className={`w-4 h-4 ${loading ? "animate-spin" : ""}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
          </button>
          <h3 className="font-medium text-gray-900 mb-2">계정 정보</h3>
          <div className="space-y-1 text-sm">
            <p className="text-gray-700">
              <span className="font-medium">주소:</span> {accountInfo.address}
            </p>
            <p className="text-gray-700">
              <span className="font-medium">Tether 잔액:</span>{" "}
              {accountInfo.tetherBalance} USDT
            </p>
            {accountInfo.stakingInfo && (
              <>
                <div className="flex items-center justify-between">
                  <p className="text-gray-700">
                    <span className="font-medium">스테이킹 잔액:</span>{" "}
                    {accountInfo.stakingInfo.stakingBalance} USDT
                  </p>
                  {accountInfo.stakingInfo.isStaking && (
                    <button
                      onClick={handleUnstake}
                      disabled={loading}
                      className="ml-2 px-3 py-1 bg-red-500 text-white rounded text-xs font-medium hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? "처리 중..." : "언스테이킹"}
                    </button>
                  )}
                </div>
                <p className="text-gray-700">
                  <span className="font-medium">RWD 잔액:</span>{" "}
                  {accountInfo.stakingInfo.rwdBalance} RWD
                </p>
                <p className="text-gray-700">
                  <span className="font-medium">스테이킹 상태:</span>
                  <span
                    className={`ml-1 px-2 py-1 rounded text-xs ${
                      accountInfo.stakingInfo.isStaking
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {accountInfo.stakingInfo.isStaking
                      ? "스테이킹 중"
                      : "스테이킹 안함"}
                  </span>
                </p>
              </>
            )}
          </div>
        </div>
      )}

      {/* 스테이킹 금액 입력 */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          스테이킹 금액 (USDT)
        </label>
        <input
          type="number"
          value={stakingAmount}
          onChange={(e) => setStakingAmount(e.target.value)}
          placeholder="스테이킹할 Tether 금액"
          className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* 액션 버튼들 */}
      <div className="space-y-3">
        {/* 승인 버튼 - 항상 표시 */}
        <button
          onClick={handleApprove}
          disabled={loading || !privateKey.trim() || !stakingAmount.trim()}
          className="w-full px-4 py-2 bg-yellow-500 text-white rounded text-sm font-medium hover:bg-yellow-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "처리 중..." : "Tether 승인"}
        </button>

        {/* 스테이킹 버튼 - 승인 후에만 표시 */}
        {isApproved && (
          <button
            onClick={handleStake}
            disabled={loading || !privateKey.trim() || !stakingAmount.trim()}
            className="w-full px-4 py-2 bg-blue-500 text-white rounded text-sm font-medium hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "처리 중..." : "토큰 스테이킹"}
          </button>
        )}
      </div>

      {/* 트랜잭션 해시 표시 */}
      {transactionHash && (
        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-green-900 text-sm font-medium mb-1">
            트랜잭션 성공!
          </p>
          <p className="text-green-800 text-xs break-all">
            해시: {transactionHash}
          </p>
        </div>
      )}

      {/* 사용법 안내 */}
      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h4 className="font-medium text-blue-900 mb-2">사용법</h4>
        <ol className="text-sm text-blue-800 space-y-1">
          <li>1. 계정 비밀키를 입력하세요</li>
          <li>2. 스테이킹할 Tether 금액을 입력하세요</li>
          <li>
            3. "Tether 승인" 버튼을 클릭하여 DecentralBank 컨트랙트에 토큰 사용
            권한을 부여하세요
          </li>
          <li>4. "토큰 스테이킹" 버튼을 클릭하여 토큰을 스테이킹하세요</li>
          <li>
            5. 스테이킹된 토큰을 인출하려면 "토큰 언스테이킹" 버튼을 클릭하세요
          </li>
        </ol>
      </div>
    </div>
  );
}
