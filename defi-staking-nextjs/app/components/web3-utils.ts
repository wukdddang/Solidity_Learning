import Web3 from "web3";
import Tether from "../../src/truffle_abis/Tether.json";

// Window 인터페이스 확장
declare global {
  interface Window {
    ethereum?: any;
  }
}

export interface INetworkInfo {
  chainId: string;
  networkId: number;
  isGanache: boolean;
}

export interface ITetherContractInfo {
  name: string;
  symbol: string;
  decimals: number;
  totalSupply: string;
}

export interface IImportedAccount {
  address: string;
  ethBalance: string;
  tetherBalance: string;
}

// 비밀키로 계정 정보 확인 (ETH + 테더 잔액)
export const getAccountFromPrivateKey = async (
  privateKey: string,
  rpcUrl: string
): Promise<IImportedAccount> => {
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
