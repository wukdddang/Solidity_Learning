import Web3 from "web3";
import { IImportedAccount } from "./types";
import { getTetherBalance, getRWDBalance, getETHBalance } from "./balances";

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

  // ETH 잔액 조회
  const ethBalance = await getETHBalance(account.address, rpcUrl);

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
    ethBalance: ethBalance,
    tetherBalance: tetherBalance,
    rwdBalance: rwdBalance,
  };
};

// 비밀키로 계정 주소 생성
export const getAccountAddress = (privateKey: string): string => {
  let cleanPrivateKey = privateKey.trim();
  if (cleanPrivateKey.startsWith("0x")) {
    cleanPrivateKey = cleanPrivateKey.substring(2);
  }

  if (cleanPrivateKey.length !== 64) {
    throw new Error("올바른 비밀키 형식이 아닙니다. (64자리 16진수)");
  }

  const tempWeb3 = new Web3();
  const account = tempWeb3.eth.accounts.privateKeyToAccount(
    "0x" + cleanPrivateKey
  );
  return account.address;
};

// Web3 인스턴스에 계정 추가
export const addAccountToWeb3 = (web3: Web3, privateKey: string) => {
  let cleanPrivateKey = privateKey.trim();
  if (cleanPrivateKey.startsWith("0x")) {
    cleanPrivateKey = cleanPrivateKey.substring(2);
  }

  const account = web3.eth.accounts.privateKeyToAccount("0x" + cleanPrivateKey);
  web3.eth.accounts.wallet.add(account);
  return account;
};
