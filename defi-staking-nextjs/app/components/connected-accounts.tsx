import { NetworkInfo, TetherContractInfo } from "./web3-utils";
import NetworkInfoComponent from "./network-info";
import TetherContractInfoComponent from "./tether-contract-info";

interface ConnectedAccountsProps {
  accounts: string[];
  networkInfo: NetworkInfo | null;
  tetherContractInfo: TetherContractInfo | null;
  onDisconnect: () => void;
}

export default function ConnectedAccounts({
  accounts,
  networkInfo,
  tetherContractInfo,
  onDisconnect,
}: ConnectedAccountsProps) {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900">연결된 계정들</h2>
        <button
          onClick={onDisconnect}
          className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition-colors"
        >
          연결 해제
        </button>
      </div>

      {/* 네트워크 정보 표시 */}
      <NetworkInfoComponent networkInfo={networkInfo} />

      {/* 테더 컨트랙트 정보 표시 */}
      <TetherContractInfoComponent contractInfo={tetherContractInfo} />

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
          💡 개발자 도구의 콘솔을 확인하여 Ganache에서 생성된 모든 계정들을
          확인할 수 있습니다.
        </p>
      </div>
    </div>
  );
}
