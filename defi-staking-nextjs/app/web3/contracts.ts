import Web3 from "web3";
import Tether from "../../src/truffle_abis/Tether.json";
import RWD from "../../src/truffle_abis/RWD.json";
import DecentralBank from "../../src/truffle_abis/DecentralBank.json";
import {
  ITetherContractInfo,
  IRWDContractInfo,
  IDecentralBankInfo,
} from "./types";
import { getTetherBalance, getRWDBalance } from "./balances";

// 네트워크 ID로 컨트랙트 주소 가져오기
export const getContractAddress = (
  contract: any,
  networkId: number
): string => {
  const address = (contract.networks as any)[networkId.toString()]?.address;
  if (!address) {
    throw new Error(
      `네트워크 ID ${networkId}에 컨트랙트가 배포되지 않았습니다.`
    );
  }
  return address;
};

// Tether 컨트랙트 주소 가져오기
export const getTetherAddress = (networkId: number): string => {
  return getContractAddress(Tether, networkId);
};

// RWD 컨트랙트 주소 가져오기
export const getRWDAddress = (networkId: number): string => {
  return getContractAddress(RWD, networkId);
};

// DecentralBank 컨트랙트 주소 가져오기
export const getDecentralBankAddress = (networkId: number): string => {
  return getContractAddress(DecentralBank, networkId);
};

// Tether 컨트랙트 인스턴스 생성
export const getTetherContract = (web3: Web3, networkId: number) => {
  const address = getTetherAddress(networkId);
  return new web3.eth.Contract(Tether.abi as any, address);
};

// RWD 컨트랙트 인스턴스 생성
export const getRWDContract = (web3: Web3, networkId: number) => {
  const address = getRWDAddress(networkId);
  return new web3.eth.Contract(RWD.abi as any, address);
};

// DecentralBank 컨트랙트 인스턴스 생성
export const getDecentralBankContract = (web3: Web3, networkId: number) => {
  const address = getDecentralBankAddress(networkId);
  return new web3.eth.Contract(DecentralBank.abi as any, address);
};

// Tether 컨트랙트 정보 조회
export const getTetherContractInfo = async (
  rpcUrl: string
): Promise<ITetherContractInfo> => {
  try {
    const web3 = new Web3(rpcUrl);
    const networkId = await web3.eth.net.getId();
    const tetherContract = getTetherContract(web3, networkId);

    // 테더 토큰 정보 조회
    const [name, symbol, decimals, totalSupply] = await Promise.all([
      tetherContract.methods.name().call({ gas: 100000 }), // 읽기 전용 호출 - 가스비 발생 안함
      tetherContract.methods.symbol().call({ gas: 100000 }), // 읽기 전용 호출 - 가스비 발생 안함
      tetherContract.methods.decimals().call({ gas: 100000 }), // 읽기 전용 호출 - 가스비 발생 안함
      tetherContract.methods.totalSupply().call({ gas: 100000 }), // 읽기 전용 호출 - 가스비 발생 안함
    ]);

    // totalSupply를 읽기 쉬운 형태로 변환
    const totalSupplyInTokens = web3.utils.fromWei(totalSupply, "ether");

    console.log(`테더 토큰 정보 조회 완료: ${name} (${symbol})`);

    return {
      name,
      symbol,
      decimals: parseInt(decimals),
      totalSupply: totalSupplyInTokens,
      address: getTetherAddress(networkId),
    };
  } catch (error: any) {
    console.error("테더 토큰 정보 조회 실패:", error);
    throw new Error(`테더 토큰 정보 조회에 실패했습니다: ${error.message}`);
  }
};

// RWD 컨트랙트 정보 조회
export const getRWDContractInfo = async (
  rpcUrl: string
): Promise<IRWDContractInfo> => {
  try {
    const web3 = new Web3(rpcUrl);
    const networkId = await web3.eth.net.getId();
    const rwdContract = getRWDContract(web3, networkId);

    // RWD 토큰 정보 조회
    const [name, symbol, decimals, totalSupply] = await Promise.all([
      rwdContract.methods.name().call({ gas: 100000 }), // 읽기 전용 호출 - 가스비 발생 안함
      rwdContract.methods.symbol().call({ gas: 100000 }), // 읽기 전용 호출 - 가스비 발생 안함
      rwdContract.methods.decimals().call({ gas: 100000 }), // 읽기 전용 호출 - 가스비 발생 안함
      rwdContract.methods.totalSupply().call({ gas: 100000 }), // 읽기 전용 호출 - 가스비 발생 안함
    ]);

    // totalSupply를 읽기 쉬운 형태로 변환
    const totalSupplyInTokens = web3.utils.fromWei(totalSupply, "ether");

    console.log(`RWD 토큰 정보 조회 완료: ${name} (${symbol})`);

    return {
      name,
      symbol,
      decimals: parseInt(decimals),
      totalSupply: totalSupplyInTokens,
      address: getRWDAddress(networkId),
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
    const networkId = await web3.eth.net.getId();
    const decentralBankContract = getDecentralBankContract(web3, networkId);

    // DecentralBank 정보 조회
    const [name, owner, tetherAddress, rwdAddress] = await Promise.all([
      decentralBankContract.methods.name().call({ gas: 100000 }), // 읽기 전용 호출 - 가스비 발생 안함
      decentralBankContract.methods.owner().call({ gas: 100000 }), // 읽기 전용 호출 - 가스비 발생 안함
      decentralBankContract.methods.tether().call({ gas: 100000 }), // 읽기 전용 호출 - 가스비 발생 안함
      decentralBankContract.methods.rwd().call({ gas: 100000 }), // 읽기 전용 호출 - 가스비 발생 안함
    ]);

    // 스테이커 수 계산
    let stakersCountNum = 0;
    try {
      // Solidity에서 동적 배열의 길이를 직접 가져올 수 없으므로
      // stakers 배열을 순회하면서 유효한 주소를 찾는 방식으로 계산
      for (let i = 0; i < 100; i++) {
        try {
          const staker = await decentralBankContract.methods
            .stakers(i)
            .call({ gas: 100000 });

          // stakers 배열에서 빈 주소(0x0000...0000)를 만나면
          // 더 이상 유효한 스테이커가 없다는 의미이므로 반복문 종료
          if (staker === "0x0000000000000000000000000000000000000000") {
            break;
          }
          stakersCountNum = i + 1;
        } catch {
          // 배열 인덱스가 범위를 벗어나면 에러가 발생하므로
          // 이때도 반복문을 종료 (더 이상 스테이커가 없음)
          break;
        }
      }
    } catch (error) {
      console.log("스테이커 수 계산 중 오류:", error);
    }

    const decentralBankAddress = getDecentralBankAddress(networkId);

    // DecentralBank가 보유한 토큰 잔액 조회
    let tetherBalance = "0";
    let rwdBalance = "0";
    try {
      tetherBalance = await getTetherBalance(decentralBankAddress, rpcUrl);
      rwdBalance = await getRWDBalance(decentralBankAddress, rpcUrl);
    } catch (error) {
      console.log("DecentralBank 토큰 잔액 조회 실패:", error);
    }

    console.log(`DecentralBank 정보 조회 완료: ${name}`);

    return {
      name,
      owner,
      address: decentralBankAddress,
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
