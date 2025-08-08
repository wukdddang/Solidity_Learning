"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import {
  ContractProject,
  ContractBlock,
  BlockConnection,
  BlockType,
  BlockConfig,
} from "@/frontend/types/contract";
import { ApiResponse } from "@/frontend/types/api";
import { Node, Edge } from "reactflow";
import {
  BlockTemplate,
  BlockLibraryData,
  iconMapping,
} from "@/frontend/types/block-library";

// 에디터 초기 데이터 타입 정의
interface EditorInitialData {
  project: ContractProject;
  blockLibrary: BlockLibraryData;
}

interface EditorContextType {
  // 데이터 상태 (Route Handler에서 받은 데이터)
  project: ContractProject | null;
  nodes: Node[];
  edges: Edge[];
  selectedNode: Node | null;
  generatedCode: string;
  loading: boolean;
  error: string | null;
  isSaving: boolean;
  isCompiling: boolean;

  // 블록 라이브러리 데이터 (Route Handler에서 받은 데이터)
  blockTemplates: BlockTemplate[];
  categoryLabels: Record<string, string>;
  categoryColors: Record<string, string>;

  // 액션 함수들 (Route Handler 호출)
  에디터_초기_데이터를_로드_한다: (projectId: string) => Promise<void>;
  프로젝트를_저장_한다: () => Promise<void>;
  컨트랙트를_컴파일_한다: () => Promise<void>;
  블록을_추가_한다: (
    blockType: string,
    position: { x: number; y: number }
  ) => void;
  블록을_삭제_한다: (nodeId: string) => void;
  블록_설정을_업데이트_한다: (nodeId: string, config: BlockConfig) => void;

  // 상태 업데이트 함수들
  setNodes: React.Dispatch<React.SetStateAction<Node[]>>;
  setEdges: React.Dispatch<React.SetStateAction<Edge[]>>;
  setSelectedNode: React.Dispatch<React.SetStateAction<Node | null>>;
}

interface EditorProviderProps {
  children: React.ReactNode;
  projectId: string;
}

const EditorContext = createContext<EditorContextType | undefined>(undefined);

export const EditorProvider: React.FC<EditorProviderProps> = ({
  children,
  projectId,
}) => {
  // 데이터 상태 (Route Handler에서 받은 데이터)
  const [project, setProject] = useState<ContractProject | null>(null);
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [generatedCode, setGeneratedCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isCompiling, setIsCompiling] = useState(false);

  // 블록 라이브러리 데이터 (Route Handler에서 받은 데이터)
  const [blockTemplates, setBlockTemplates] = useState<BlockTemplate[]>([]);
  const [categoryLabels, setCategoryLabels] = useState<Record<string, string>>(
    {}
  );
  const [categoryColors, setCategoryColors] = useState<Record<string, string>>(
    {}
  );

  // 액션 함수들 (Route Handler API 호출)
  const 에디터_초기_데이터를_로드_한다 = useCallback(
    async (projectId: string) => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/editor/${projectId}`);
        const result: ApiResponse<EditorInitialData> = await response.json();

        if (result.success && result.data) {
          const { project, blockLibrary } = result.data;

          // 프로젝트 데이터 설정
          setProject(project);

          // 블록을 노드로 변환
          const projectNodes: Node[] = project.blocks.map((block) => ({
            id: block.id,
            type: "customBlock",
            position: block.position || { x: 0, y: 0 },
            data: {
              block,
              label: block.name,
              type: block.type,
              config: block.config,
            },
          }));

          // 연결을 엣지로 변환
          const projectEdges: Edge[] = project.connections.map(
            (connection) => ({
              id: connection.id,
              source: connection.sourceBlockId,
              target: connection.targetBlockId,
              sourceHandle: connection.sourceOutputId,
              targetHandle: connection.targetInputId,
            })
          );

          setNodes(projectNodes);
          setEdges(projectEdges);
          setGeneratedCode(project.generatedCode || "");

          // 블록 라이브러리 데이터 설정
          const transformedBlockTemplates: BlockTemplate[] =
            blockLibrary.blockTemplates.map((template) => ({
              ...template,
              icon:
                iconMapping[template.icon as keyof typeof iconMapping] ||
                iconMapping.FileText,
            }));

          setBlockTemplates(transformedBlockTemplates);
          setCategoryLabels(blockLibrary.categoryLabels);
          setCategoryColors(blockLibrary.categoryColors);
        } else {
          throw new Error(
            result.error || "에디터 데이터를 불러올 수 없습니다."
          );
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다."
        );
        console.error("에디터 초기 데이터 로드 오류:", err);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // 프로젝트 저장 API 호출
  const 프로젝트를_저장_한다 = useCallback(async () => {
    if (!project) return;

    setIsSaving(true);
    setError(null);

    try {
      // 노드를 블록으로 변환
      const blocks: ContractBlock[] = nodes.map((node) => ({
        ...node.data.block,
        position: node.position,
        config: node.data.config,
      }));

      // 엣지를 연결로 변환
      const connections: BlockConnection[] = edges.map((edge) => ({
        id: edge.id,
        sourceBlockId: edge.source,
        targetBlockId: edge.target,
        sourceOutputId: edge.sourceHandle || "",
        targetInputId: edge.targetHandle || "",
      }));

      const updatedProject: ContractProject = {
        ...project,
        blocks,
        connections,
        updatedAt: new Date().toISOString(),
      };

      const response = await fetch(`/api/editor/${project.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedProject),
      });

      const result = await response.json();

      if (result.success) {
        setProject(updatedProject);
      } else {
        throw new Error(result.error || "프로젝트 저장에 실패했습니다.");
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다."
      );
      console.error("프로젝트 저장 오류:", err);
    } finally {
      setIsSaving(false);
    }
  }, [project, nodes, edges]);

  // 컨트랙트 컴파일 API 호출
  const 컨트랙트를_컴파일_한다 = useCallback(async () => {
    if (!project) return;

    setIsCompiling(true);
    setError(null);

    try {
      const blocks = nodes.map((node) => ({
        ...node.data.block,
        position: node.position,
        config: node.data.config,
      }));

      const connections = edges.map((edge) => ({
        id: edge.id,
        sourceBlockId: edge.source,
        targetBlockId: edge.target,
        sourceOutputId: edge.sourceHandle || "",
        targetInputId: edge.targetHandle || "",
      }));

      const response = await fetch(`/api/editor/${project.id}/compile`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          blocks,
          connections,
        }),
      });

      const result = await response.json();

      if (result.success) {
        setGeneratedCode(result.data.code);
        // 컴파일된 프로젝트 상태 업데이트
        if (project) {
          setProject({
            ...project,
            status: "COMPILED",
            generatedCode: result.data.code,
          });
        }
      } else {
        throw new Error(result.error || "컴파일에 실패했습니다.");
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다."
      );
      console.error("컴파일 오류:", err);
    } finally {
      setIsCompiling(false);
    }
  }, [project, nodes, edges]);

  // 블록 추가 (로컬 상태 업데이트)
  const 블록을_추가_한다 = useCallback(
    (blockType: string, position: { x: number; y: number }) => {
      const newBlockId = `block-${Date.now()}`;

      // 블록 타입에 따른 기본 설정
      const getBlockDefaults = (type: string) => {
        switch (type) {
          case "CONTRACT_INFO":
            return {
              name: "컨트랙트 정보",
              description: "컨트랙트 기본 정보 설정",
              category: "basic" as const,
              inputs: [
                {
                  id: "name",
                  name: "컨트랙트 이름",
                  type: "string" as const,
                  required: true,
                },
                {
                  id: "symbol",
                  name: "심볼",
                  type: "string" as const,
                  required: true,
                },
              ],
              outputs: [],
              config: { name: "", symbol: "" } as BlockConfig,
            };
          case "MINT_FUNCTION":
            return {
              name: "새로 만들기 기능",
              description: "NFT를 새로 만드는 기능",
              category: "function" as const,
              inputs: [
                {
                  id: "price",
                  name: "가격",
                  type: "number" as const,
                  required: false,
                  defaultValue: 0,
                },
                {
                  id: "maxSupply",
                  name: "최대 발행량",
                  type: "number" as const,
                  required: false,
                },
              ],
              outputs: [],
              config: { price: 0, maxSupply: 1000 } as BlockConfig,
            };
          default:
            return {
              name: "사용자 정의 블록",
              description: "사용자 정의 블록",
              category: "basic" as const,
              inputs: [],
              outputs: [],
              config: {} as BlockConfig,
            };
        }
      };

      const blockDefaults = getBlockDefaults(blockType);

      const newBlock: ContractBlock = {
        id: newBlockId,
        type: blockType as BlockType,
        ...blockDefaults,
        position,
      };

      const newNode: Node = {
        id: newBlockId,
        type: "customBlock",
        position,
        data: {
          block: newBlock,
          label: newBlock.name,
          type: newBlock.type,
          config: newBlock.config,
        },
      };

      setNodes((prev) => [...prev, newNode]);
    },
    []
  );

  // 블록 삭제 (로컬 상태 업데이트)
  const 블록을_삭제_한다 = useCallback(
    (nodeId: string) => {
      setNodes((prev) => prev.filter((node) => node.id !== nodeId));
      setEdges((prev) =>
        prev.filter((edge) => edge.source !== nodeId && edge.target !== nodeId)
      );
      if (selectedNode?.id === nodeId) {
        setSelectedNode(null);
      }
    },
    [selectedNode]
  );

  // 블록 설정 업데이트 (로컬 상태 업데이트)
  const 블록_설정을_업데이트_한다 = useCallback(
    (nodeId: string, config: BlockConfig) => {
      setNodes((prev) =>
        prev.map((node) =>
          node.id === nodeId
            ? { ...node, data: { ...node.data, config } }
            : node
        )
      );
    },
    []
  );

  // 컴포넌트 마운트 시 에디터 초기 데이터 로드
  useEffect(() => {
    if (projectId) {
      에디터_초기_데이터를_로드_한다(projectId);
    }
  }, [projectId, 에디터_초기_데이터를_로드_한다]);

  // Context value로 Route Handler 데이터와 액션 함수들 제공
  const contextValue: EditorContextType = {
    // 데이터 상태 (Route Handler에서 받은 데이터)
    project,
    nodes,
    edges,
    selectedNode,
    generatedCode,
    loading,
    error,
    isSaving,
    isCompiling,

    // 블록 라이브러리 데이터 (Route Handler에서 받은 데이터)
    blockTemplates,
    categoryLabels,
    categoryColors,

    // 액션 함수들 (Route Handler 호출)
    에디터_초기_데이터를_로드_한다,
    프로젝트를_저장_한다,
    컨트랙트를_컴파일_한다,
    블록을_추가_한다,
    블록을_삭제_한다,
    블록_설정을_업데이트_한다,

    // 상태 업데이트 함수들
    setNodes,
    setEdges,
    setSelectedNode,
  };

  return (
    <EditorContext.Provider value={contextValue}>
      {children}
    </EditorContext.Provider>
  );
};

export const useEditor = () => {
  const context = useContext(EditorContext);
  if (context === undefined) {
    throw new Error("useEditor must be used within an EditorProvider");
  }
  return context;
};
