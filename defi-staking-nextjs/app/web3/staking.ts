import Web3 from "web3";
import { IStakingInfo } from "./types";
import { getDecentralBankContract, getTetherContract } from "./contracts";
import { getRWDBalance } from "./balances";
import { addAccountToWeb3 } from "./accounts";

// 계정의 스테이킹 정보 조회
export const getStakingInfo = async (
  address: string,
  rpcUrl: string
): Promise<IStakingInfo> => {
  try {
    const web3 = new Web3(rpcUrl);
    const networkId = await web3.eth.net.getId();
    const decentralBankContract = getDecentralBankContract(web3, networkId);

    // 스테이킹 정보 조회
    const [stakingBalance, hasStaked, isStaking] = await Promise.all([
      decentralBankContract.methods
        .stakingBalance(address)
        .call({ gas: 100000 }), // 읽기 전용 호출 - 가스비 발생 안함
      decentralBankContract.methods.hasStaked(address).call({ gas: 100000 }), // 읽기 전용 호출 - 가스비 발생 안함
      decentralBankContract.methods.isStaking(address).call({ gas: 100000 }), // 읽기 전용 호출 - 가스비 발생 안함
    ]);

    // RWD 잔액 조회
    const rwdBalance = await getRWDBalance(address, rpcUrl);

    // stakingBalance를 읽기 쉬운 형태로 변환
    const stakingBalanceInTokens = web3.utils.fromWei(stakingBalance, "ether");

    return {
      stakingBalance: stakingBalanceInTokens,
      hasStaked,
      isStaking,
      rwdBalance,
    };
  } catch (error: any) {
    console.error("스테이킹 정보 조회 실패:", error);
    throw new Error(`스테이킹 정보 조회에 실패했습니다: ${error.message}`);
  }
};

// Tether 토큰 승인 (스테이킹 전 필요)
export const approveTether = async (
  privateKey: string,
  amount: string,
  rpcUrl: string
): Promise<string> => {
  try {
    const web3 = new Web3(rpcUrl);
    const networkId = await web3.eth.net.getId();

    // 계정 설정
    const account = addAccountToWeb3(web3, privateKey);

    // Tether 컨트랙트 인스턴스 생성
    const tetherContract = getTetherContract(web3, networkId);

    // DecentralBank 컨트랙트 주소 가져오기
    const { getDecentralBankAddress } = await import("./contracts");
    const decentralBankAddress = getDecentralBankAddress(networkId);

    // amount를 Wei로 변환
    const amountInWei = web3.utils.toWei(amount, "ether");

    // approve 트랜잭션 실행 (상태 변경 - 가스비 발생)
    const approveTx = tetherContract.methods.approve(
      decentralBankAddress,
      amountInWei
    );
    const gasEstimate = await approveTx.estimateGas({ from: account.address });

    const result = await approveTx.send({
      from: account.address,
      gas: Math.floor(gasEstimate * 1.2), // 20% 버퍼 - 실제 가스비 발생
    });

    console.log("Tether 승인 완료:", result.transactionHash);
    return result.transactionHash;
  } catch (error: any) {
    console.error("Tether 승인 실패:", error);
    throw new Error(`Tether 승인에 실패했습니다: ${error.message}`);
  }
};

// 토큰 스테이킹
export const stakeTokens = async (
  privateKey: string,
  amount: string,
  rpcUrl: string
): Promise<string> => {
  try {
    const web3 = new Web3(rpcUrl);
    const networkId = await web3.eth.net.getId();

    // 계정 설정
    const account = addAccountToWeb3(web3, privateKey);

    // DecentralBank 컨트랙트 인스턴스 생성
    const decentralBankContract = getDecentralBankContract(web3, networkId);

    // amount를 Wei로 변환
    const amountInWei = web3.utils.toWei(amount, "ether");

    // depositTokens 트랜잭션 실행 (상태 변경 - 가스비 발생)
    const stakeTx = decentralBankContract.methods.depositTokens(amountInWei);
    const gasEstimate = await stakeTx.estimateGas({ from: account.address });

    const result = await stakeTx.send({
      from: account.address,
      gas: Math.floor(gasEstimate * 1.2), // 20% 버퍼 - 실제 가스비 발생
    });

    console.log("토큰 스테이킹 완료:", result.transactionHash);
    return result.transactionHash;
  } catch (error: any) {
    console.error("토큰 스테이킹 실패:", error);
    throw new Error(`토큰 스테이킹에 실패했습니다: ${error.message}`);
  }
};

// 토큰 언스테이킹
export const unstakeTokens = async (
  privateKey: string,
  rpcUrl: string
): Promise<string> => {
  try {
    const web3 = new Web3(rpcUrl);
    const networkId = await web3.eth.net.getId();

    // 계정 설정
    const account = addAccountToWeb3(web3, privateKey);

    // DecentralBank 컨트랙트 인스턴스 생성
    const decentralBankContract = getDecentralBankContract(web3, networkId);

    // unstakeTokens 트랜잭션 실행 (상태 변경 - 가스비 발생)
    const unstakeTx = decentralBankContract.methods.unstakeTokens();
    const gasEstimate = await unstakeTx.estimateGas({ from: account.address });

    const result = await unstakeTx.send({
      from: account.address,
      gas: Math.floor(gasEstimate * 1.2), // 20% 버퍼 - 실제 가스비 발생
    });

    console.log("토큰 언스테이킹 완료:", result.transactionHash);
    return result.transactionHash;
  } catch (error: any) {
    console.error("토큰 언스테이킹 실패:", error);
    throw new Error(`토큰 언스테이킹에 실패했습니다: ${error.message}`);
  }
};
