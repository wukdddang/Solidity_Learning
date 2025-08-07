"use client";

import { useState, useEffect } from "react";
import {
  getTetherContractInfo,
  getRWDContractInfo,
  getDecentralBankInfo,
} from "../web3";

interface ContractInfoProps {
  customRpcUrl: string;
  onError: (error: string) => void;
}

export default function ContractInfo({
  customRpcUrl,
  onError,
}: ContractInfoProps) {
  const [tetherInfo, setTetherInfo] = useState<any>(null);
  const [rwdInfo, setRwdInfo] = useState<any>(null);
  const [decentralBankInfo, setDecentralBankInfo] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const loadContractInfo = async () => {
    try {
      setLoading(true);
      onError("");

      const [tether, rwd, decentralBank] = await Promise.all([
        getTetherContractInfo(customRpcUrl),
        getRWDContractInfo(customRpcUrl),
        getDecentralBankInfo(customRpcUrl),
      ]);

      setTetherInfo(tether);
      setRwdInfo(rwd);
      setDecentralBankInfo(decentralBank);
    } catch (error: any) {
      onError(`컨트랙트 정보 조회 실패: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (customRpcUrl) {
      loadContractInfo();
    }
  }, [customRpcUrl]);

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-900">컨트랙트 정보</h2>
        <button
          onClick={loadContractInfo}
          disabled={loading}
          className="px-3 py-1 bg-gray-500 text-white rounded text-sm font-medium hover:bg-gray-600 disabled:opacity-50"
        >
          {loading ? "로딩 중..." : "새로고침"}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Tether 컨트랙트 정보 */}
        <div className="p-4 bg-blue-50 rounded-lg">
          <h3 className="font-medium text-blue-900 mb-2">Tether (USDT)</h3>
          {tetherInfo ? (
            <div className="space-y-1 text-sm">
              <p className="text-blue-700">
                <span className="font-medium">이름:</span> {tetherInfo.name}
              </p>
              <p className="text-blue-700">
                <span className="font-medium">심볼:</span> {tetherInfo.symbol}
              </p>
              <p className="text-blue-700">
                <span className="font-medium">총 공급량:</span>{" "}
                {parseFloat(tetherInfo.totalSupply).toLocaleString()} USDT
              </p>
              <p className="text-blue-700">
                <span className="font-medium">주소:</span>{" "}
                <span className="text-xs break-all">{tetherInfo.address}</span>
              </p>
            </div>
          ) : (
            <p className="text-blue-600 text-sm">로딩 중...</p>
          )}
        </div>

        {/* RWD 컨트랙트 정보 */}
        <div className="p-4 bg-green-50 rounded-lg">
          <h3 className="font-medium text-green-900 mb-2">RWD</h3>
          {rwdInfo ? (
            <div className="space-y-1 text-sm">
              <p className="text-green-700">
                <span className="font-medium">이름:</span> {rwdInfo.name}
              </p>
              <p className="text-green-700">
                <span className="font-medium">심볼:</span> {rwdInfo.symbol}
              </p>
              <p className="text-green-700">
                <span className="font-medium">총 공급량:</span>{" "}
                {parseFloat(rwdInfo.totalSupply).toLocaleString()} RWD
              </p>
              <p className="text-green-700">
                <span className="font-medium">주소:</span>{" "}
                <span className="text-xs break-all">{rwdInfo.address}</span>
              </p>
            </div>
          ) : (
            <p className="text-green-600 text-sm">로딩 중...</p>
          )}
        </div>

        {/* DecentralBank 컨트랙트 정보 */}
        <div className="p-4 bg-purple-50 rounded-lg">
          <h3 className="font-medium text-purple-900 mb-2">DecentralBank</h3>
          {decentralBankInfo ? (
            <div className="space-y-1 text-sm">
              <p className="text-purple-700">
                <span className="font-medium">이름:</span>{" "}
                {decentralBankInfo.name}
              </p>
              <p className="text-purple-700">
                <span className="font-medium">소유자:</span>{" "}
                <span className="text-xs break-all">
                  {decentralBankInfo.owner}
                </span>
              </p>
              <p className="text-purple-700">
                <span className="font-medium">스테이커 수:</span>{" "}
                {decentralBankInfo.stakersCount}명
              </p>
              <p className="text-purple-700">
                <span className="font-medium">보유 USDT:</span>{" "}
                {parseFloat(decentralBankInfo.tetherBalance).toLocaleString()}{" "}
                USDT
              </p>
              <p className="text-purple-700">
                <span className="font-medium">보유 RWD:</span>{" "}
                {parseFloat(decentralBankInfo.rwdBalance).toLocaleString()} RWD
              </p>
              <p className="text-purple-700">
                <span className="font-medium">주소:</span>{" "}
                <span className="text-xs break-all">
                  {decentralBankInfo.address}
                </span>
              </p>
            </div>
          ) : (
            <p className="text-purple-600 text-sm">로딩 중...</p>
          )}
        </div>
      </div>
    </div>
  );
}
