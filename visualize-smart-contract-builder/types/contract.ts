// 스마트 컨트랙트 관련 타입 정의

export interface ContractTemplate {
  id: string;
  name: string;
  description: string;
  type: ContractType;
  icon: string;
  blocks: ContractBlock[];
  createdAt: string;
  updatedAt: string;
}

export type ContractType = "ERC721" | "ERC20" | "VOTING" | "CUSTOM";

export interface ContractBlock {
  id: string;
  type: BlockType;
  name: string;
  description: string;
  category: BlockCategory;
  inputs: BlockInput[];
  outputs: BlockOutput[];
  config: Record<string, any>;
  position?: { x: number; y: number };
}

export type BlockType =
  | "CONTRACT_INFO"
  | "MINT_FUNCTION"
  | "BURN_FUNCTION"
  | "TRANSFER_FUNCTION"
  | "ACCESS_CONTROL"
  | "VARIABLE"
  | "CONDITION";

export type BlockCategory =
  | "basic"
  | "function"
  | "access"
  | "variable"
  | "condition";

export interface BlockInput {
  id: string;
  name: string;
  type: string;
  required: boolean;
  defaultValue?: any;
}

export interface BlockOutput {
  id: string;
  name: string;
  type: string;
}

export interface ContractProject {
  id: string;
  name: string;
  description?: string;
  templateId?: string;
  contractType: ContractType;
  status: ProjectStatus;
  blocks: ContractBlock[];
  connections: BlockConnection[];
  generatedCode?: string;
  deployedAddress?: string;
  network?: string;
  createdAt: string;
  updatedAt: string;
}

export type ProjectStatus =
  | "DRAFT"
  | "COMPILED"
  | "DEPLOYED_TESTNET"
  | "DEPLOYED_MAINNET"
  | "ERROR";

export interface BlockConnection {
  id: string;
  sourceBlockId: string;
  targetBlockId: string;
  sourceOutputId: string;
  targetInputId: string;
}

export interface DeploymentConfig {
  network: string;
  gasLimit?: number;
  gasPrice?: string;
  constructorArgs?: any[];
}

export interface DeploymentResult {
  success: boolean;
  transactionHash?: string;
  contractAddress?: string;
  error?: string;
  gasUsed?: number;
}
