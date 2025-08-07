import Web3 from "web3";
import { getTetherContract, getRWDContract } from "./contracts";

// 테더 잔액 조회
export const getTetherBalance = async (
  address: string,
  rpcUrl: string
): Promise<string> => {
  try {
    const web3 = new Web3(rpcUrl);
    const networkId = await web3.eth.net.getId();
    const tetherContract = getTetherContract(web3, networkId);

    // balanceOf 함수로 테더 잔액 조회
    const tetherBalance = await tetherContract.methods
      .balanceOf(address)
      .call({ gas: 100000 }); // 읽기 전용 호출 - 가스비 발생 안함

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
    const networkId = await web3.eth.net.getId();
    const rwdContract = getRWDContract(web3, networkId);

    // balanceOf 함수로 RWD 잔액 조회
    const rwdBalance = await rwdContract.methods
      .balanceOf(address)
      .call({ gas: 100000 }); // 읽기 전용 호출 - 가스비 발생 안함

    // Wei를 RWD로 변환 (RWD는 18자리 소수점)
    const balanceInRWD = web3.utils.fromWei(rwdBalance, "ether");

    console.log(`계정 ${address}의 RWD 잔액: ${balanceInRWD} RWD`);

    return balanceInRWD;
  } catch (error: any) {
    console.error("RWD 잔액 조회 실패:", error);
    throw new Error(`RWD 잔액 조회에 실패했습니다: ${error.message}`);
  }
};

// ETH 잔액 조회
export const getETHBalance = async (
  address: string,
  rpcUrl: string
): Promise<string> => {
  try {
    const web3 = new Web3(rpcUrl);

    // 직접 RPC 호출로 ETH 잔액 확인
    const response = await fetch(rpcUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        jsonrpc: "2.0",
        method: "eth_getBalance",
        params: [address, "latest"],
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
    const balanceInEth = web3.utils.fromWei(balanceWei, "ether");

    console.log(`계정 ${address}의 ETH 잔액: ${balanceInEth} ETH`);

    return balanceInEth;
  } catch (error: any) {
    console.error("ETH 잔액 조회 실패:", error);
    throw new Error(`ETH 잔액 조회에 실패했습니다: ${error.message}`);
  }
};
