import Web3 from "web3";
import Tether from "../../src/truffle_abis/Tether.json";
import RWD from "../../src/truffle_abis/RWD.json";
import DecentralBank from "../../src/truffle_abis/DecentralBank.json";

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

export interface IRWDContractInfo {
  name: string;
  symbol: string;
  decimals: number;
  totalSupply: string;
}

export interface IDecentralBankInfo {
  name: string;
  owner: string;
  tetherAddress: string;
  rwdAddress: string;
  stakersCount: number;
  tetherBalance: string;
  rwdBalance: string;
}

export interface IImportedAccount {
  address: string;
  ethBalance: string;
  tetherBalance: string;
  rwdBalance: string;
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

  // RWD 잔액도 조회
  let rwdBalance = "0";
  try {
    rwdBalance = await getRWDBalance(account.address, rpcUrl);
  } catch (error) {
    console.log("RWD 잔액 조회 실패, 0으로 설정:", error);
  }

  return {
    address: account.address,
    ethBalance: balanceInEth,
    tetherBalance: tetherBalance,
    rwdBalance: rwdBalance,
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

// RWD 잔액 조회
export const getRWDBalance = async (
  address: string,
  rpcUrl: string
): Promise<string> => {
  try {
    const web3 = new Web3(rpcUrl);

    // 네트워크 ID 확인
    const networkId = await web3.eth.net.getId();

    // RWD 컨트랙트 주소 가져오기
    const rwdAddress = (RWD.networks as any)[networkId.toString()]?.address;

    if (!rwdAddress) {
      throw new Error(
        `네트워크 ID ${networkId}에 RWD 컨트랙트가 배포되지 않았습니다.`
      );
    }

    // RWD 컨트랙트 인스턴스 생성
    const rwdContract = new web3.eth.Contract(RWD.abi as any, rwdAddress);

    // balanceOf 함수로 RWD 잔액 조회
    const rwdBalance = await rwdContract.methods
      .balanceOf(address)
      .call({ gas: 100000 });

    // Wei를 RWD로 변환 (RWD는 18자리 소수점)
    const balanceInRWD = web3.utils.fromWei(rwdBalance, "ether");

    console.log(`계정 ${address}의 RWD 잔액: ${balanceInRWD} RWD`);

    return balanceInRWD;
  } catch (error: any) {
    console.error("RWD 잔액 조회 실패:", error);
    throw new Error(`RWD 잔액 조회에 실패했습니다: ${error.message}`);
  }
};

// RWD 토큰 정보 조회
export const getRWDContractInfo = async (
  rpcUrl: string
): Promise<IRWDContractInfo> => {
  try {
    const web3 = new Web3(rpcUrl);

    // 네트워크 ID 확인
    const networkId = await web3.eth.net.getId();

    // RWD 컨트랙트 주소 가져오기
    const rwdAddress = (RWD.networks as any)[networkId.toString()]?.address;

    if (!rwdAddress) {
      throw new Error(
        `네트워크 ID ${networkId}에 RWD 컨트랙트가 배포되지 않았습니다.`
      );
    }

    // RWD 컨트랙트 인스턴스 생성
    const rwdContract = new web3.eth.Contract(RWD.abi as any, rwdAddress);

    // RWD 토큰 정보 조회
    const [name, symbol, decimals, totalSupply] = await Promise.all([
      rwdContract.methods.name().call({ gas: 100000 }),
      rwdContract.methods.symbol().call({ gas: 100000 }),
      rwdContract.methods.decimals().call({ gas: 100000 }),
      rwdContract.methods.totalSupply().call({ gas: 100000 }),
    ]);

    // totalSupply를 읽기 쉬운 형태로 변환
    const totalSupplyInTokens = web3.utils.fromWei(totalSupply, "ether");

    console.log(`RWD 토큰 정보 조회 완료: ${name} (${symbol})`);

    return {
      name,
      symbol,
      decimals: parseInt(decimals),
      totalSupply: totalSupplyInTokens,
    };
  } catch (error: any) {
    console.error("RWD 토큰 정보 조회 실패:", error);
    throw new Error(`RWD 토큰 정보 조회에 실패했습니다: ${error.message}`);
  }
};

// DecentralBank 컨트랙트 정보 조회
export const getDecentralBankInfo = async (
  rpcUrl: string
): Promise<IDecentralBankInfo> => {
  try {
    const web3 = new Web3(rpcUrl);

    // 네트워크 ID 확인
    const networkId = await web3.eth.net.getId();

    // DecentralBank 컨트랙트 주소 가져오기
    const decentralBankAddress = (DecentralBank.networks as any)[
      networkId.toString()
    ]?.address;

    if (!decentralBankAddress) {
      throw new Error(
        `네트워크 ID ${networkId}에 DecentralBank 컨트랙트가 배포되지 않았습니다.`
      );
    }

    // DecentralBank 컨트랙트 인스턴스 생성
    const decentralBankContract = new web3.eth.Contract(
      DecentralBank.abi as any,
      decentralBankAddress
    );

    // DecentralBank 정보 조회
    const [name, owner, tetherAddress, rwdAddress, stakersCount] =
      await Promise.all([
        decentralBankContract.methods.name().call({ gas: 100000 }),
        decentralBankContract.methods.owner().call({ gas: 100000 }),
        decentralBankContract.methods.tether().call({ gas: 100000 }),
        decentralBankContract.methods.rwd().call({ gas: 100000 }),
        decentralBankContract.methods
          .stakers(0)
          .call({ gas: 100000 })
          .catch(() => "0"),
      ]);

    // 스테이커 수 계산 (배열 길이를 직접 가져올 수 없으므로 다른 방법 사용)
    let stakersCountNum = 0;
    try {
      // stakers 배열의 길이를 추정하기 위해 반복문 사용
      for (let i = 0; i < 100; i++) {
        try {
          const staker = await decentralBankContract.methods
            .stakers(i)
            .call({ gas: 100000 });
          if (staker === "0x0000000000000000000000000000000000000000") {
            break;
          }
          stakersCountNum = i + 1;
        } catch {
          break;
        }
      }
    } catch (error) {
      console.log("스테이커 수 계산 중 오류:", error);
    }

    // DecentralBank가 보유한 테더 잔액 조회
    let tetherBalance = "0";
    try {
      tetherBalance = await getTetherBalance(decentralBankAddress, rpcUrl);
    } catch (error) {
      console.log("DecentralBank 테더 잔액 조회 실패:", error);
    }

    // DecentralBank가 보유한 RWD 잔액 조회
    let rwdBalance = "0";
    try {
      rwdBalance = await getRWDBalance(decentralBankAddress, rpcUrl);
    } catch (error) {
      console.log("DecentralBank RWD 잔액 조회 실패:", error);
    }

    console.log(`DecentralBank 정보 조회 완료: ${name}`);

    return {
      name,
      owner,
      tetherAddress,
      rwdAddress,
      stakersCount: stakersCountNum,
      tetherBalance,
      rwdBalance,
    };
  } catch (error: any) {
    console.error("DecentralBank 정보 조회 실패:", error);
    throw new Error(`DecentralBank 정보 조회에 실패했습니다: ${error.message}`);
  }
};

// 테더 컨트랙트 정보 조회 (기존 함수와 유사하지만 공개 정보만)
export const getTetherContractInfo = async (
  rpcUrl: string
): Promise<ITetherContractInfo> => {
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

    // 테더 토큰 정보 조회
    const [name, symbol, decimals, totalSupply] = await Promise.all([
      tetherContract.methods.name().call({ gas: 100000 }),
      tetherContract.methods.symbol().call({ gas: 100000 }),
      tetherContract.methods.decimals().call({ gas: 100000 }),
      tetherContract.methods.totalSupply().call({ gas: 100000 }),
    ]);

    // totalSupply를 읽기 쉬운 형태로 변환
    const totalSupplyInTokens = web3.utils.fromWei(totalSupply, "ether");

    console.log(`테더 토큰 정보 조회 완료: ${name} (${symbol})`);

    return {
      name,
      symbol,
      decimals: parseInt(decimals),
      totalSupply: totalSupplyInTokens,
    };
  } catch (error: any) {
    console.error("테더 토큰 정보 조회 실패:", error);
    throw new Error(`테더 토큰 정보 조회에 실패했습니다: ${error.message}`);
  }
};
