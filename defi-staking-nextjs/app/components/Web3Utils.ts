import Web3 from "web3";
import Tether from "../../src/truffle_abis/Tether.json";

// Window 인터페이스 확장
declare global {
  interface Window {
    ethereum?: any;
  }
}

export interface NetworkInfo {
  chainId: string;
  networkId: number;
  isGanache: boolean;
}

export interface TetherContractInfo {
  name: string;
  symbol: string;
  decimals: number;
  totalSupply: string;
}

export interface ImportedAccount {
  address: string;
  ethBalance: string;
  tetherBalance: string;
}

// Ganache 연결 테스트
export const testGanacheConnection = async (): Promise<string | null> => {
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

// Ganache 네트워크 추가
export const addGanacheNetwork = async (): Promise<void> => {
  try {
    if (
      typeof window !== "undefined" &&
      typeof window.ethereum !== "undefined"
    ) {
      // Ganache 연결 테스트
      const workingRpcUrl = await testGanacheConnection();

      if (!workingRpcUrl) {
        throw new Error(
          "Ganache를 찾을 수 없습니다. Ganache가 실행 중인지 확인해주세요."
        );
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
      throw new Error(
        "네트워크 추가가 지원되지 않습니다. 수동으로 추가해주세요."
      );
    } else if (err.code === 4001) {
      throw new Error("사용자가 네트워크 추가를 거부했습니다.");
    } else {
      throw new Error(`네트워크 추가에 실패했습니다: ${err.message}`);
    }
  }
};

// 커스텀 Ganache 네트워크 추가
export const addCustomGanacheNetwork = async (
  customRpcUrl: string
): Promise<void> => {
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
        throw new Error(
          `${customRpcUrl}에 연결할 수 없습니다. Ganache가 해당 주소에서 실행 중인지 확인해주세요.`
        );
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
      throw new Error("사용자가 네트워크 추가를 거부했습니다.");
    } else {
      throw new Error(`커스텀 네트워크 추가에 실패했습니다: ${err.message}`);
    }
  }
};

// 테더 컨트랙트 정보 가져오기
export const getTetherContractInfo = async (
  web3: Web3,
  networkId: number
): Promise<TetherContractInfo> => {
  // 네트워크 ID를 사용하여 실제 배포된 컨트랙트 주소 가져오기
  const tetherAddress = (Tether.networks as any)[networkId.toString()]?.address;

  if (!tetherAddress) {
    throw new Error(
      `현재 네트워크(네트워크 ID: ${networkId})에 테더 컨트랙트가 배포되지 않았습니다. 먼저 컨트랙트를 배포해주세요.`
    );
  }

  console.log(`테더 컨트랙트 주소: ${tetherAddress}`);

  const tetherContract = new web3.eth.Contract(
    Tether.abi as any,
    tetherAddress
  );

  console.log("테더 컨트랙트 인스턴스 생성 완료:", tetherContract);

  // 컨트랙트가 실제로 존재하는지 확인
  const code = await web3.eth.getCode(tetherAddress);
  if (code === "0x" || code === "0x0") {
    throw new Error(
      "테더 컨트랙트가 배포되지 않았습니다. 먼저 컨트랙트를 배포해주세요."
    );
  }

  // 테더 컨트랙트 정보 확인 (가스 제한 설정)
  const tetherName = await tetherContract.methods.name().call({ gas: 100000 });
  const tetherSymbol = await tetherContract.methods
    .symbol()
    .call({ gas: 100000 });
  const tetherDecimals = await tetherContract.methods
    .decimals()
    .call({ gas: 100000 });
  const totalSupply = await tetherContract.methods
    .totalSupply()
    .call({ gas: 100000 });

  const contractInfo = {
    name: tetherName,
    symbol: tetherSymbol,
    decimals: Number(tetherDecimals),
    totalSupply: web3.utils.fromWei(totalSupply, "ether"),
  };

  console.log("테더 컨트랙트 정보:");
  console.log("- 이름:", tetherName);
  console.log("- 심볼:", tetherSymbol);
  console.log("- 소수점 자릿수:", tetherDecimals);
  console.log("- 총 공급량:", web3.utils.fromWei(totalSupply, "ether"), "USDT");

  return contractInfo;
};

// 비밀키로 계정 정보 확인 (ETH + 테더 잔액)
export const getAccountFromPrivateKey = async (
  privateKey: string,
  rpcUrl: string
): Promise<ImportedAccount> => {
  // 비밀키 형식 검증 및 정리
  let cleanPrivateKey = privateKey.trim();
  if (cleanPrivateKey.startsWith("0x")) {
    cleanPrivateKey = cleanPrivateKey.substring(2);
  }

  if (cleanPrivateKey.length !== 64) {
    throw new Error("올바른 비밀키 형식이 아닙니다. (64자리 16진수)");
  }

  // 비밀키로 계정 주소 생성
  const tempWeb3 = new Web3();
  const account = tempWeb3.eth.accounts.privateKeyToAccount(
    "0x" + cleanPrivateKey
  );
  console.log("계정 주소:", account.address);

  // 직접 RPC 호출로 ETH 잔액 확인
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

  console.log(`계정 ETH 잔액: ${balanceInEth} ETH`);

  // 테더 잔액도 조회
  let tetherBalance = "0";
  try {
    tetherBalance = await getTetherBalance(account.address, rpcUrl);
  } catch (error) {
    console.log("테더 잔액 조회 실패, 0으로 설정:", error);
  }

  return {
    address: account.address,
    ethBalance: balanceInEth,
    tetherBalance: tetherBalance,
  };
};

// 테더 잔액 조회
export const getTetherBalance = async (
  address: string,
  rpcUrl: string
): Promise<string> => {
  try {
    const web3 = new Web3(rpcUrl);

    // 네트워크 ID 확인
    const networkId = await web3.eth.net.getId();

    // 테더 컨트랙트 주소 가져오기
    const tetherAddress = (Tether.networks as any)[networkId.toString()]
      ?.address;

    if (!tetherAddress) {
      throw new Error(
        `네트워크 ID ${networkId}에 테더 컨트랙트가 배포되지 않았습니다.`
      );
    }

    // 테더 컨트랙트 인스턴스 생성
    const tetherContract = new web3.eth.Contract(
      Tether.abi as any,
      tetherAddress
    );

    // balanceOf 함수로 테더 잔액 조회
    const tetherBalance = await tetherContract.methods
      .balanceOf(address)
      .call({ gas: 100000 });

    // Wei를 USDT로 변환 (테더는 18자리 소수점)
    const balanceInTether = web3.utils.fromWei(tetherBalance, "ether");

    console.log(`계정 ${address}의 테더 잔액: ${balanceInTether} USDT`);

    return balanceInTether;
  } catch (error: any) {
    console.error("테더 잔액 조회 실패:", error);
    throw new Error(`테더 잔액 조회에 실패했습니다: ${error.message}`);
  }
};
