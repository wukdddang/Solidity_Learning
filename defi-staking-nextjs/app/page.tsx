"use client";

import { useState, useEffect } from "react";
import Web3 from "web3";

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
  const [networkInfo, setNetworkInfo] = useState<{
    chainId: string;
    networkId: number;
    isGanache: boolean;
  } | null>(null);
  const [customRpcUrl, setCustomRpcUrl] = useState<string>(
    "http://127.0.0.1:7545"
  );
  const [privateKey, setPrivateKey] = useState<string>("");
  const [importedAccount, setImportedAccount] = useState<{
    address: string;
    balance: string;
  } | null>(null);

  const connectWallet = async () => {
    try {
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

        setAccounts(requestedAccounts);
        setIsConnected(true);
        setError("");

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
        setNetworkInfo({
          chainId: currentChainId,
          networkId: Number(networkId),
          isGanache: currentChainId === "0x539" && Number(networkId) === 1337,
        });

        // 모든 계정 가져오기
        const allAccounts = await web3.eth.getAccounts();
        console.log("Ganache에서 생성된 모든 계정들:", allAccounts);

        // 각 계정의 잔액 확인
        for (let i = 0; i < allAccounts.length; i++) {
          const balance = await web3.eth.getBalance(allAccounts[i]);
          const balanceInEth = web3.utils.fromWei(balance, "ether");
          console.log(`계정 ${i + 1} (${allAccounts[i]}): ${balanceInEth} ETH`);
        }
      } else {
        setError("Web3 제공자를 찾을 수 없습니다. MetaMask를 설치해주세요.");
      }
    } catch (err: any) {
      console.error("지갑 연결 오류:", err);

      // 사용자가 연결을 거부한 경우
      if (err.code === 4001) {
        setError("사용자가 지갑 연결을 거부했습니다.");
      }
      // 네트워크 문제인 경우
      else if (err.code === -32603) {
        setError(
          "네트워크 연결에 문제가 있습니다. Ganache가 실행 중인지 확인해주세요."
        );
      }
      // 기타 오류
      else {
        setError(
          `지갑 연결에 실패했습니다: ${err.message || "알 수 없는 오류"}`
        );
      }
    }
  };

  const testGanacheConnection = async () => {
    const commonPorts = [7545, 8545, 9545];
    const commonHosts = ["127.0.0.1", "localhost"];

    for (const host of commonHosts) {
      for (const port of commonPorts) {
        const rpcUrl = `http://${host}:${port}`;
        try {
          console.log(`${rpcUrl} 연결 테스트 중...`);
          const response = await fetch(rpcUrl, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              jsonrpc: "2.0",
              method: "eth_chainId",
              params: [],
              id: 1,
            }),
          });

          if (response.ok) {
            const data = await response.json();
            console.log(`${rpcUrl} 연결 성공! 체인 ID: ${data.result}`);
            return rpcUrl;
          }
        } catch (err) {
          console.log(`${rpcUrl} 연결 실패`);
        }
      }
    }

    console.log("모든 일반적인 Ganache 포트에서 연결 실패");
    return null;
  };

  const addGanacheNetwork = async () => {
    try {
      if (
        typeof window !== "undefined" &&
        typeof window.ethereum !== "undefined"
      ) {
        // Ganache 연결 테스트
        const workingRpcUrl = await testGanacheConnection();

        if (!workingRpcUrl) {
          setError(
            "Ganache를 찾을 수 없습니다. Ganache가 실행 중인지 확인해주세요."
          );
          return;
        }

        console.log(`사용할 RPC URL: ${workingRpcUrl}`);

        await window.ethereum.request({
          method: "wallet_addEthereumChain",
          params: [
            {
              chainId: "0x539", // 1337 in hex
              chainName: "Ganache Local",
              nativeCurrency: {
                name: "Ethereum",
                symbol: "ETH",
                decimals: 18,
              },
              rpcUrls: [workingRpcUrl],
              blockExplorerUrls: null,
            },
          ],
        });

        console.log("Ganache 네트워크가 성공적으로 추가되었습니다!");

        // 네트워크 추가 후 자동으로 전환 시도
        try {
          await window.ethereum.request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId: "0x539" }],
          });
          console.log("Ganache 네트워크로 전환되었습니다!");
        } catch (switchErr) {
          console.log("네트워크 전환 실패, 수동으로 전환해주세요.");
        }
      }
    } catch (err: any) {
      console.error("네트워크 추가 오류:", err);
      if (err.code === 4902) {
        setError("네트워크 추가가 지원되지 않습니다. 수동으로 추가해주세요.");
      } else if (err.code === 4001) {
        setError("사용자가 네트워크 추가를 거부했습니다.");
      } else {
        setError(`네트워크 추가에 실패했습니다: ${err.message}`);
      }
    }
  };

  const addCustomGanacheNetwork = async () => {
    try {
      if (
        typeof window !== "undefined" &&
        typeof window.ethereum !== "undefined"
      ) {
        // 커스텀 RPC URL 테스트
        try {
          console.log(`${customRpcUrl} 연결 테스트 중...`);
          const response = await fetch(customRpcUrl, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              jsonrpc: "2.0",
              method: "eth_chainId",
              params: [],
              id: 1,
            }),
          });

          if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
          }

          const data = await response.json();
          console.log(`${customRpcUrl} 연결 성공! 체인 ID: ${data.result}`);
        } catch (err) {
          setError(
            `${customRpcUrl}에 연결할 수 없습니다. Ganache가 해당 주소에서 실행 중인지 확인해주세요.`
          );
          return;
        }

        await window.ethereum.request({
          method: "wallet_addEthereumChain",
          params: [
            {
              chainId: "0x539", // 1337 in hex
              chainName: "Ganache Custom",
              nativeCurrency: {
                name: "Ethereum",
                symbol: "ETH",
                decimals: 18,
              },
              rpcUrls: [customRpcUrl],
              blockExplorerUrls: null,
            },
          ],
        });

        console.log("커스텀 Ganache 네트워크가 성공적으로 추가되었습니다!");

        // 네트워크 추가 후 자동으로 전환 시도
        try {
          await window.ethereum.request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId: "0x539" }],
          });
          console.log("Ganache 네트워크로 전환되었습니다!");
        } catch (switchErr) {
          console.log("네트워크 전환 실패, 수동으로 전환해주세요.");
        }
      }
    } catch (err: any) {
      console.error("커스텀 네트워크 추가 오류:", err);
      if (err.code === 4001) {
        setError("사용자가 네트워크 추가를 거부했습니다.");
      } else {
        setError(`커스텀 네트워크 추가에 실패했습니다: ${err.message}`);
      }
    }
  };

  const importAccountFromPrivateKey = async () => {
    try {
      if (!privateKey) {
        setError("비밀키를 입력해주세요.");
        return;
      }

      // 비밀키 형식 검증 및 정리
      let cleanPrivateKey = privateKey.trim();
      if (cleanPrivateKey.startsWith("0x")) {
        cleanPrivateKey = cleanPrivateKey.substring(2);
      }

      if (cleanPrivateKey.length !== 64) {
        setError("올바른 비밀키 형식이 아닙니다. (64자리 16진수)");
        return;
      }

      // 직접 Ganache RPC로 계정 정보 확인 (MetaMask 우회)
      try {
        const rpcUrl = customRpcUrl;

        // 비밀키로 계정 주소 생성
        const tempWeb3 = new Web3();
        const account = tempWeb3.eth.accounts.privateKeyToAccount(
          "0x" + cleanPrivateKey
        );
        console.log("계정 주소:", account.address);

        // 직접 RPC 호출로 잔액 확인
        const response = await fetch(rpcUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            jsonrpc: "2.0",
            method: "eth_getBalance",
            params: [account.address, "latest"],
            id: 1,
          }),
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        const data = await response.json();
        if (data.error) {
          throw new Error(data.error.message);
        }

        // Wei를 ETH로 변환
        const balanceWei = data.result;
        const balanceInEth = tempWeb3.utils.fromWei(balanceWei, "ether");

        console.log(`계정 잔액: ${balanceInEth} ETH`);

        setImportedAccount({
          address: account.address,
          balance: balanceInEth,
        });

        setError(""); // 에러 클리어
        console.log("✅ 계정 정보 확인 완료!");
        console.log("MetaMask로 계정을 가져오려면:");
        console.log("1. MetaMask > 계정 메뉴 > 계정 가져오기");
        console.log("2. 비밀키 입력:", "0x" + cleanPrivateKey);
      } catch (rpcError: any) {
        console.error("RPC 요청 실패:", rpcError);
        setError(`Ganache 연결 실패: ${rpcError.message || "알 수 없는 오류"}`);
      }
    } catch (err: any) {
      console.error("계정 가져오기 오류:", err);
      setError(`계정 가져오기에 실패했습니다: ${err.message}`);
    }
  };

  const clearImportedAccount = () => {
    setPrivateKey("");
    setImportedAccount(null);
    setError("");
  };

  const resetMetaMaskConnection = async () => {
    try {
      // MetaMask 연결 상태 초기화
      setAccounts([]);
      setIsConnected(false);
      setError("");
      setNetworkInfo(null);

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

  const disconnectWallet = () => {
    setAccounts([]);
    setIsConnected(false);
    setError("");
    setNetworkInfo(null);
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
          Web3 Ethereum 계정 관리
        </h1>

        <div className="bg-white rounded-lg shadow-md p-6">
          {!isConnected ? (
            <div>
              <div className="text-center mb-6 space-y-4">
                <div className="space-y-3">
                  <div className="flex flex-wrap justify-center gap-3">
                    <button
                      onClick={connectWallet}
                      className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
                    >
                      지갑 연결하기
                    </button>
                    <button
                      onClick={addGanacheNetwork}
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
                      onChange={(e) => setCustomRpcUrl(e.target.value)}
                      placeholder="http://127.0.0.1:7545"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      onClick={addCustomGanacheNetwork}
                      className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded text-sm transition-colors"
                    >
                      추가
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Ganache가 다른 포트에서 실행 중인 경우 직접 URL을 입력하세요
                  </p>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="text-sm font-semibold text-blue-700 mb-2">
                    🔑 Ganache 테스트 계정 가져오기
                  </h4>
                  <div className="space-y-3">
                    <div className="flex space-x-2">
                      <input
                        type="password"
                        value={privateKey}
                        onChange={(e) => setPrivateKey(e.target.value)}
                        placeholder="Ganache 계정의 비밀키를 입력하세요"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <button
                        onClick={importAccountFromPrivateKey}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded text-sm transition-colors"
                      >
                        확인
                      </button>
                      {importedAccount && (
                        <button
                          onClick={clearImportedAccount}
                          className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded text-sm transition-colors"
                        >
                          초기화
                        </button>
                      )}
                    </div>

                    {importedAccount && (
                      <div className="bg-green-50 border border-green-200 rounded p-3">
                        <h5 className="text-sm font-semibold text-green-800 mb-2">
                          ✅ 계정 정보 확인 완료
                        </h5>
                        <div className="text-xs space-y-1">
                          <p className="text-green-700">
                            <strong>주소:</strong> {importedAccount.address}
                          </p>
                          <p className="text-green-700">
                            <strong>잔액:</strong> {importedAccount.balance} ETH
                          </p>
                        </div>
                        <div className="mt-2 p-2 bg-yellow-100 border border-yellow-300 rounded text-xs">
                          <p className="text-yellow-800">
                            💡 <strong>MetaMask로 계정 가져오기:</strong>
                          </p>
                          <ol className="text-yellow-700 mt-1 list-decimal list-inside">
                            <li>
                              MetaMask &gt; 계정 메뉴 &gt; "계정 가져오기" 클릭
                            </li>
                            <li>위에 입력한 비밀키 붙여넣기</li>
                            <li>"가져오기" 클릭</li>
                          </ol>
                        </div>
                      </div>
                    )}

                    <p className="text-xs text-blue-600">
                      Ganache 계정의 비밀키를 입력하면 해당 계정의 테스트 이더
                      잔액을 확인할 수 있습니다
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-yellow-800 mb-3">
                  🔧 Ganache를 MetaMask에 연결하는 방법
                </h3>
                <ol className="text-sm text-yellow-700 space-y-2 list-decimal list-inside">
                  <li>
                    MetaMask 확장 프로그램을 열고 네트워크 선택 드롭다운을 클릭
                  </li>
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
                  <li>
                    Ganache에서 제공하는 계정의 개인키를 사용하여 계정 가져오기
                  </li>
                </ol>
              </div>
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

              {/* 네트워크 정보 표시 */}
              {networkInfo && (
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
                        networkInfo.isGanache
                          ? "text-green-700"
                          : "text-red-700"
                      }`}
                    >
                      <strong>Ganache 연결:</strong>{" "}
                      {networkInfo.isGanache ? "✅ 연결됨" : "❌ 연결되지 않음"}
                    </p>
                  </div>
                </div>
              )}

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
