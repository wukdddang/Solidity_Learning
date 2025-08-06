import { useState, useEffect } from "react";
import {
  getTetherContractInfo,
  getRWDContractInfo,
  getDecentralBankInfo,
  ITetherContractInfo,
  IRWDContractInfo,
  IDecentralBankInfo,
} from "./web3-utils";

interface ContractInfoProps {
  customRpcUrl: string;
  onError: (error: string) => void;
}

export default function ContractInfo({
  customRpcUrl,
  onError,
}: ContractInfoProps) {
  const [tetherInfo, setTetherInfo] = useState<ITetherContractInfo | null>(
    null
  );
  const [rwdInfo, setRwdInfo] = useState<IRWDContractInfo | null>(null);
  const [decentralBankInfo, setDecentralBankInfo] =
    useState<IDecentralBankInfo | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const loadContractInfo = async () => {
    setIsLoading(true);
    onError(""); // 에러 클리어

    try {
      // 모든 컨트랙트 정보를 병렬로 로드
      const [tether, rwd, decentralBank] = await Promise.all([
        getTetherContractInfo(customRpcUrl),
        getRWDContractInfo(customRpcUrl),
        getDecentralBankInfo(customRpcUrl),
      ]);

      setTetherInfo(tether);
      setRwdInfo(rwd);
      setDecentralBankInfo(decentralBank);

      console.log("✅ 모든 컨트랙트 정보 로드 완료!");
    } catch (err: any) {
      console.error("컨트랙트 정보 로드 오류:", err);
      onError(`컨트랙트 정보 로드에 실패했습니다: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // 주소를 짧게 표시하는 함수
  const shortenAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  useEffect(() => {
    // RPC URL이 변경되면 자동으로 정보 로드
    if (customRpcUrl) {
      loadContractInfo();
    }
  }, [customRpcUrl]);

  return (
    <div className="bg-green-50 p-4 rounded-lg">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-sm font-semibold text-green-700">
          📋 스마트 컨트랙트 정보
        </h4>
        <button
          onClick={loadContractInfo}
          disabled={isLoading}
          className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-bold py-1 px-3 rounded text-xs transition-colors"
        >
          {isLoading ? "로딩 중..." : "새로고침"}
        </button>
      </div>

      <div className="space-y-4">
        {/* 테더 토큰 정보 */}
        <div className="bg-white border border-green-200 rounded p-3">
          <h5 className="text-sm font-semibold text-green-800 mb-2">
            💰 테더 (USDT) 토큰
          </h5>
          {tetherInfo ? (
            <div className="text-xs space-y-1">
              <p className="text-green-700">
                <strong>이름:</strong> {tetherInfo.name}
              </p>
              <p className="text-green-700">
                <strong>심볼:</strong> {tetherInfo.symbol}
              </p>
              <p className="text-green-700">
                <strong>소수점:</strong> {tetherInfo.decimals}자리
              </p>
              <p className="text-green-700">
                <strong>총 발행량:</strong>{" "}
                {parseFloat(tetherInfo.totalSupply).toLocaleString()} USDT
              </p>
            </div>
          ) : (
            <p className="text-xs text-gray-500">로딩 중...</p>
          )}
        </div>

        {/* RWD 토큰 정보 */}
        <div className="bg-white border border-green-200 rounded p-3">
          <h5 className="text-sm font-semibold text-green-800 mb-2">
            🏆 리워드 (RWD) 토큰
          </h5>
          {rwdInfo ? (
            <div className="text-xs space-y-1">
              <p className="text-green-700">
                <strong>이름:</strong> {rwdInfo.name}
              </p>
              <p className="text-green-700">
                <strong>심볼:</strong> {rwdInfo.symbol}
              </p>
              <p className="text-green-700">
                <strong>소수점:</strong> {rwdInfo.decimals}자리
              </p>
              <p className="text-green-700">
                <strong>총 발행량:</strong>{" "}
                {parseFloat(rwdInfo.totalSupply).toLocaleString()} RWD
              </p>
            </div>
          ) : (
            <p className="text-xs text-gray-500">로딩 중...</p>
          )}
        </div>

        {/* DecentralBank 정보 */}
        <div className="bg-white border border-green-200 rounded p-3">
          <h5 className="text-sm font-semibold text-green-800 mb-2">
            🏦 Decentral Bank
          </h5>
          {decentralBankInfo ? (
            <div className="text-xs space-y-1">
              <p className="text-green-700">
                <strong>이름:</strong> {decentralBankInfo.name}
              </p>
              <p className="text-green-700">
                <strong>소유자:</strong>{" "}
                {shortenAddress(decentralBankInfo.owner)}
              </p>
              <p className="text-green-700">
                <strong>테더 주소:</strong>{" "}
                {shortenAddress(decentralBankInfo.tetherAddress)}
              </p>
              <p className="text-green-700">
                <strong>RWD 주소:</strong>{" "}
                {shortenAddress(decentralBankInfo.rwdAddress)}
              </p>
              <p className="text-green-700">
                <strong>스테이커 수:</strong> {decentralBankInfo.stakersCount}명
              </p>
              <p className="text-green-700">
                <strong>보유 테더:</strong>{" "}
                {parseFloat(decentralBankInfo.tetherBalance).toLocaleString()}{" "}
                USDT
              </p>
              <p className="text-green-700">
                <strong>보유 RWD:</strong>{" "}
                {parseFloat(decentralBankInfo.rwdBalance).toLocaleString()} RWD
              </p>
            </div>
          ) : (
            <p className="text-xs text-gray-500">로딩 중...</p>
          )}
        </div>
      </div>

      <p className="text-xs text-green-600 mt-3">
        💡 이 정보들은 공개 정보로, 비밀키 없이도 조회 가능합니다
      </p>
    </div>
  );
}
