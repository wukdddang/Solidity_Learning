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
  address: string;
}

export interface IRWDContractInfo {
  name: string;
  symbol: string;
  decimals: number;
  totalSupply: string;
  address: string;
}

export interface IDecentralBankInfo {
  name: string;
  owner: string;
  address: string;
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

export interface IStakingInfo {
  stakingBalance: string;
  hasStaked: boolean;
  isStaking: boolean;
  rwdBalance: string;
}
