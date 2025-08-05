import type { NetworkInfo } from "./Web3Utils";

interface NetworkInfoProps {
  networkInfo: NetworkInfo | null;
}

export default function NetworkInfo({ networkInfo }: NetworkInfoProps) {
  if (!networkInfo) {
    return null;
  }

  return (
    <div className="mb-6 p-4 bg-gray-50 rounded-lg">
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        네트워크 정보
      </h3>
      <div className="space-y-1 text-sm">
        <p className="text-gray-700">
          <strong>체인 ID:</strong> {networkInfo.chainId} (십진수:{" "}
          {parseInt(networkInfo.chainId, 16)})
        </p>
        <p className="text-gray-700">
          <strong>네트워크 ID:</strong> {networkInfo.networkId}
        </p>
        <p
          className={`font-medium ${
            networkInfo.isGanache ? "text-green-700" : "text-red-700"
          }`}
        >
          <strong>Ganache 연결:</strong>{" "}
          {networkInfo.isGanache ? "✅ 연결됨" : "❌ 연결되지 않음"}
        </p>
      </div>
    </div>
  );
}
