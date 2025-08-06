import type { TetherContractInfo } from "./web3-utils";

interface TetherContractInfoProps {
  contractInfo: TetherContractInfo | null;
}

export default function TetherContractInfo({
  contractInfo,
}: TetherContractInfoProps) {
  if (!contractInfo) {
    return null;
  }

  return (
    <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
      <h3 className="text-lg font-semibold text-green-800 mb-3">
        🪙 테더 컨트랙트 정보
      </h3>
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <p className="text-green-700">
            <strong>이름:</strong> {contractInfo.name}
          </p>
          <p className="text-green-700">
            <strong>심볼:</strong> {contractInfo.symbol}
          </p>
        </div>
        <div>
          <p className="text-green-700">
            <strong>소수점 자릿수:</strong> {contractInfo.decimals}
          </p>
          <p className="text-green-700">
            <strong>총 공급량:</strong> {contractInfo.totalSupply}{" "}
            {contractInfo.symbol}
          </p>
        </div>
      </div>
    </div>
  );
}
