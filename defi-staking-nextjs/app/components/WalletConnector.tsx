import { useState } from "react";
import Web3 from "web3";
import {
  NetworkInfo,
  TetherContractInfo,
  addGanacheNetwork,
  addCustomGanacheNetwork,
  getTetherContractInfo,
} from "./Web3Utils";

interface WalletConnectorProps {
  onConnect: (
    accounts: string[],
    networkInfo: NetworkInfo,
    tetherInfo: TetherContractInfo | null
  ) => void;
  onError: (error: string) => void;
  customRpcUrl: string;
  onCustomRpcUrlChange: (url: string) => void;
}

export default function WalletConnector({
  onConnect,
  onError,
  customRpcUrl,
  onCustomRpcUrlChange,
}: WalletConnectorProps) {
  const [isConnecting, setIsConnecting] = useState(false);

  const connectWallet = async () => {
    try {
      setIsConnecting(true);
      onError("");

      // Web3가 설치되어 있는지 확인
      if (
        typeof window !== "undefined" &&
        typeof window.ethereum !== "undefined"
      ) {
        // 현재 네트워크 확인
        const chainId = await window.ethereum.request({
          method: "eth_chainId",
        });
        console.log("현재 연결된 체인 ID:", chainId);

        if (chainId !== "0x539") {
          console.log(
            "현재 네트워크가 Ganache가 아닙니다. Ganache 네트워크로 전환을 요청합니다."
          );
          try {
            await window.ethereum.request({
              method: "wallet_switchEthereumChain",
              params: [{ chainId: "0x539" }],
            });
          } catch (switchError: any) {
            // 네트워크가 추가되지 않은 경우 추가
            if (switchError.code === 4902) {
              await addGanacheNetwork();
            }
          }
        }

        // MetaMask 또는 다른 Web3 제공자 요청
        const requestedAccounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });

        // 콘솔에 계정들 출력
        console.log("연결된 계정들:", requestedAccounts);

        // Ganache 계정들도 가져오기 (Web3 인스턴스 생성)
        const web3 = new Web3(window.ethereum);

        // 네트워크 정보 확인
        const networkId = await web3.eth.net.getId();
        const currentChainId = await window.ethereum.request({
          method: "eth_chainId",
        });
        console.log("네트워크 ID:", networkId);
        console.log("체인 ID:", currentChainId);

        // 네트워크 정보 업데이트
        const networkInfo: NetworkInfo = {
          chainId: currentChainId,
          networkId: Number(networkId),
          isGanache: currentChainId === "0x539" && Number(networkId) === 1337,
        };

        // 모든 계정 가져오기
        const allAccounts = await web3.eth.getAccounts();
        console.log("Ganache에서 생성된 모든 계정들:", allAccounts);

        // 테더 컨트랙트 정보 가져오기 (지갑 연결 후)
        let tetherInfo: TetherContractInfo | null = null;
        try {
          tetherInfo = await getTetherContractInfo(web3, networkId);
        } catch (contractError: any) {
          console.error("테더 컨트랙트 정보 조회 실패:", contractError);
          if (contractError.message.includes("Out of Gas")) {
            onError(
              "가스 부족으로 컨트랙트 조회에 실패했습니다. 계정에 충분한 ETH가 있는지 확인해주세요."
            );
          } else {
            onError(
              "테더 컨트랙트 조회에 실패했습니다. 컨트랙트가 올바르게 배포되었는지 확인해주세요."
            );
          }
        }

        // 각 계정의 잔액 확인
        for (let i = 0; i < allAccounts.length; i++) {
          const balance = await web3.eth.getBalance(allAccounts[i]);
          const balanceInEth = web3.utils.fromWei(balance, "ether");
          console.log(`계정 ${i + 1} (${allAccounts[i]}): ${balanceInEth} ETH`);
        }

        onConnect(requestedAccounts, networkInfo, tetherInfo);
      } else {
        onError("Web3 제공자를 찾을 수 없습니다. MetaMask를 설치해주세요.");
      }
    } catch (err: any) {
      console.error("지갑 연결 오류:", err);

      // 사용자가 연결을 거부한 경우
      if (err.code === 4001) {
        onError("사용자가 지갑 연결을 거부했습니다.");
      }
      // 네트워크 문제인 경우
      else if (err.code === -32603) {
        onError(
          "네트워크 연결에 문제가 있습니다. Ganache가 실행 중인지 확인해주세요."
        );
      }
      // 기타 오류
      else {
        onError(
          `지갑 연결에 실패했습니다: ${err.message || "알 수 없는 오류"}`
        );
      }
    } finally {
      setIsConnecting(false);
    }
  };

  const handleAddGanacheNetwork = async () => {
    try {
      await addGanacheNetwork();
    } catch (err: any) {
      onError(err.message);
    }
  };

  const handleAddCustomGanacheNetwork = async () => {
    try {
      await addCustomGanacheNetwork(customRpcUrl);
    } catch (err: any) {
      onError(err.message);
    }
  };

  const resetMetaMaskConnection = async () => {
    try {
      console.log("MetaMask 연결 상태를 초기화했습니다.");
      console.log("MetaMask를 수동으로 재시작해보세요:");
      console.log("1. MetaMask 확장 프로그램을 비활성화 후 다시 활성화");
      console.log("2. 또는 브라우저를 새로고침");

      // 페이지 새로고침으로 연결 상태 완전 초기화
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (err: any) {
      console.error("연결 초기화 오류:", err);
    }
  };

  return (
    <div>
      <div className="text-center mb-6 space-y-4">
        <div className="space-y-3">
          <div className="flex flex-wrap justify-center gap-3">
            <button
              onClick={connectWallet}
              disabled={isConnecting}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold py-3 px-6 rounded-lg transition-colors"
            >
              {isConnecting ? "연결 중..." : "지갑 연결하기"}
            </button>
            <button
              onClick={handleAddGanacheNetwork}
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
            >
              Ganache 네트워크 자동 추가
            </button>
          </div>

          <div className="text-center">
            <button
              onClick={resetMetaMaskConnection}
              className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded text-sm transition-colors"
            >
              🔄 MetaMask 연결 초기화
            </button>
            <p className="text-xs text-gray-500 mt-1">
              연결 오류 시 사용 (페이지가 새로고침됩니다)
            </p>
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="text-sm font-semibold text-gray-700 mb-2">
            커스텀 RPC URL로 추가
          </h4>
          <div className="flex space-x-2">
            <input
              type="text"
              value={customRpcUrl}
              onChange={(e) => onCustomRpcUrlChange(e.target.value)}
              placeholder="http://127.0.0.1:7545"
              className="flex-1 px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleAddCustomGanacheNetwork}
              className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded text-sm transition-colors"
            >
              추가
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Ganache가 다른 포트에서 실행 중인 경우 직접 URL을 입력하세요
          </p>
        </div>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-yellow-800 mb-3">
          🔧 Ganache를 MetaMask에 연결하는 방법
        </h3>
        <ol className="text-sm text-yellow-700 space-y-2 list-decimal list-inside">
          <li>MetaMask 확장 프로그램을 열고 네트워크 선택 드롭다운을 클릭</li>
          <li>"네트워크 추가" 또는 "Add Network"를 클릭</li>
          <li>
            다음 정보를 입력:
            <ul className="ml-6 mt-2 space-y-1 list-disc list-inside">
              <li>
                <strong>네트워크 이름:</strong> Ganache
              </li>
              <li>
                <strong>RPC URL:</strong> http://127.0.0.1:7545
              </li>
              <li>
                <strong>체인 ID:</strong> 1337
              </li>
              <li>
                <strong>통화 기호:</strong> ETH
              </li>
            </ul>
          </li>
          <li>"저장" 또는 "Save"를 클릭</li>
          <li>Ganache 네트워크가 추가되면 해당 네트워크로 전환</li>
          <li>Ganache에서 제공하는 계정의 개인키를 사용하여 계정 가져오기</li>
        </ol>
      </div>
    </div>
  );
}
