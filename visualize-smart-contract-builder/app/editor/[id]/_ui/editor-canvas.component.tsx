"use client";

import { useCallback, useEffect, useState, useRef } from "react";
import ReactFlow, {
  addEdge,
  Connection,
  useNodesState,
  useEdgesState,
  Controls,
  MiniMap,
  Background,
  BackgroundVariant,
  ReactFlowProvider,
  NodeDragHandler,
  useReactFlow,
  NodeChange,
  EdgeChange,
} from "reactflow";
import "reactflow/dist/style.css";

import { useEditor } from "../_context/editor.context";
import CustomBlockNode from "./custom-block-node.component";

const nodeTypes = {
  customBlock: CustomBlockNode,
};

function EditorCanvasInner() {
  const { nodes, edges, setNodes, setEdges, 블록을_추가_한다 } = useEditor();
  const reactFlowInstance = useReactFlow();

  const [reactFlowNodes, setReactFlowNodes, onNodesChangeInternal] =
    useNodesState([]);
  const [reactFlowEdges, setReactFlowEdges, onEdgesChangeInternal] =
    useEdgesState([]);

  // 패닝 관련 상태 (기본적으로 패닝 활성화)
  const [showPanHint, setShowPanHint] = useState(false);

  // 컨테이너 참조
  const canvasRef = useRef<HTMLDivElement>(null);

  // ReactFlow 상태 변경을 컨텍스트에 동기화하는 커스텀 핸들러
  const onNodesChange = useCallback(
    (changes: NodeChange[]) => {
      onNodesChangeInternal(changes);

      // 노드 삭제가 포함된 경우 컨텍스트 상태도 업데이트
      const removeChanges = changes.filter(
        (change): change is NodeChange & { type: "remove"; id: string } =>
          change.type === "remove"
      );

      if (removeChanges.length > 0) {
        const removedNodeIds = removeChanges.map((change) => change.id);
        setNodes((prevNodes) =>
          prevNodes.filter((node) => !removedNodeIds.includes(node.id))
        );
        setEdges((prevEdges) =>
          prevEdges.filter(
            (edge) =>
              !removedNodeIds.includes(edge.source) &&
              !removedNodeIds.includes(edge.target)
          )
        );
      }
    },
    [onNodesChangeInternal, setNodes, setEdges]
  );

  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) => {
      onEdgesChangeInternal(changes);

      // 엣지 삭제가 포함된 경우 컨텍스트 상태도 업데이트
      const removeChanges = changes.filter(
        (change): change is EdgeChange & { type: "remove"; id: string } =>
          change.type === "remove"
      );

      if (removeChanges.length > 0) {
        const removedEdgeIds = removeChanges.map((change) => change.id);
        setEdges((prevEdges) =>
          prevEdges.filter((edge) => !removedEdgeIds.includes(edge.id))
        );
      }
    },
    [onEdgesChangeInternal, setEdges]
  );

  // 컨텍스트 상태와 ReactFlow 상태 동기화
  useEffect(() => {
    setReactFlowNodes(nodes);
  }, [nodes, setReactFlowNodes]);

  useEffect(() => {
    setReactFlowEdges(edges);
  }, [edges, setReactFlowEdges]);

  // 패닝 힌트 표시 (처음 사용 시)
  useEffect(() => {
    const hasSeenPanHint = localStorage.getItem("hasSeenPanHint");
    if (!hasSeenPanHint && reactFlowNodes.length === 0) {
      setShowPanHint(true);
      // 5초 후 힌트 자동 숨김
      const timer = setTimeout(() => {
        setShowPanHint(false);
        localStorage.setItem("hasSeenPanHint", "true");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [reactFlowNodes.length]);

  const onConnect = useCallback(
    (params: Connection) => {
      const newEdge = {
        ...params,
        id: `edge-${Date.now()}`,
        type: "smoothstep",
        style: { stroke: "#6366f1", strokeWidth: 2 },
      };
      setEdges((eds) => addEdge(newEdge, eds));
    },
    [setEdges]
  );

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const blockType = event.dataTransfer.getData("blockType");
      if (!blockType) return;

      const reactFlowBounds = event.currentTarget.getBoundingClientRect();

      // ReactFlow 인스턴스를 통해 올바른 좌표 계산
      const position = reactFlowInstance.project({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      });

      블록을_추가_한다(blockType, position);
    },
    [블록을_추가_한다, reactFlowInstance]
  );

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "copy";
  }, []);

  // 드래그 중 실시간 노드 위치 업데이트 (프리뷰)
  const onNodeDrag: NodeDragHandler = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    (_event, _node) => {
      // ReactFlow 내부 상태는 자동으로 업데이트되므로 추가 작업 불필요
    },
    []
  );

  // 드래그 완료 시 최종 위치를 컨텍스트에 저장
  const onNodeDragStop: NodeDragHandler = useCallback(
    (event, node) => {
      setNodes((nds) =>
        nds.map((n) =>
          n.id === node.id ? { ...n, position: node.position } : n
        )
      );
    },
    [setNodes]
  );

  // 힌트 숨김
  const hidePanHint = useCallback(() => {
    setShowPanHint(false);
    localStorage.setItem("hasSeenPanHint", "true");
  }, []);

  // 캔버스 초기화
  const handleFitView = useCallback(() => {
    reactFlowInstance.fitView({ padding: 0.1 });
  }, [reactFlowInstance]);

  // 줌 인/아웃
  const handleZoomIn = useCallback(() => {
    reactFlowInstance.zoomIn();
  }, [reactFlowInstance]);

  const handleZoomOut = useCallback(() => {
    reactFlowInstance.zoomOut();
  }, [reactFlowInstance]);

  // 키보드 단축키 처리
  useEffect(() => {
    const handleKeyboard = (event: KeyboardEvent) => {
      if (event.ctrlKey || event.metaKey) {
        switch (event.key) {
          case "=":
          case "+":
            event.preventDefault();
            handleZoomIn();
            break;
          case "-":
            event.preventDefault();
            handleZoomOut();
            break;
          case "0":
            event.preventDefault();
            handleFitView();
            break;
        }
      }
    };

    document.addEventListener("keydown", handleKeyboard);
    return () => document.removeEventListener("keydown", handleKeyboard);
  }, [handleZoomIn, handleZoomOut, handleFitView]);

  // 커스텀 휠 이벤트 핸들러 (스크롤 방향 반전)
  const onWheel = useCallback(
    (event: React.WheelEvent) => {
      // 모든 스크롤 이벤트를 차단하고 줌으로만 처리
      event.preventDefault();
      event.stopPropagation();

      // deltaY가 음수면 위로 스크롤 (줌인), 양수면 아래로 스크롤 (줌아웃)
      const zoomStep = 0.1;
      const currentZoom = reactFlowInstance.getZoom();

      if (event.deltaY < 0) {
        // 위로 스크롤 = 줌인
        reactFlowInstance.zoomTo(Math.min(currentZoom + zoomStep, 2));
      } else {
        // 아래로 스크롤 = 줌아웃
        reactFlowInstance.zoomTo(Math.max(currentZoom - zoomStep, 0.1));
      }
    },
    [reactFlowInstance]
  );

  return (
    <div ref={canvasRef} className="flex-1 bg-white relative">
      {/* 패닝 힌트 (처음 사용자용) */}
      {showPanHint && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-50 bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg">
          <div className="flex items-center gap-2">
            🖱️ 빈 공간을 드래그해서 캔버스를 이동할 수 있습니다
            <button
              onClick={hidePanHint}
              className="ml-2 text-blue-200 hover:text-white"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      <ReactFlow
        nodes={reactFlowNodes}
        edges={reactFlowEdges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onNodeDrag={onNodeDrag}
        onNodeDragStop={onNodeDragStop}
        nodeTypes={nodeTypes}
        nodesDraggable={true}
        nodesConnectable={true}
        elementsSelectable={true}
        panOnDrag={[0, 1, 2]} // 모든 마우스 버튼으로 패닝 가능 (기본값)
        panOnScroll={false} // 스크롤 패닝 비활성화 (줌만 사용)
        zoomOnScroll={false} // 기본 줌 비활성화 (커스텀 휠 핸들러 사용)
        onWheel={onWheel} // 커스텀 휠 이벤트 핸들러
        zoomOnPinch={true}
        zoomOnDoubleClick={false}
        selectNodesOnDrag={false}
        snapToGrid={true}
        snapGrid={[10, 10]}
        fitView
        fitViewOptions={{ padding: 0.1 }}
        attributionPosition="bottom-left"
        className="react-flow-container"
      >
        <Controls
          position="top-left"
          className="bg-white border border-gray-200 rounded-lg shadow-sm"
          showFitView={true}
          showZoom={true}
          showInteractive={false}
        >
          {/* 전체 보기 버튼 */}
          <div className="react-flow__controls-button border-t border-gray-200">
            <button
              onClick={handleFitView}
              className="w-full h-full flex items-center justify-center hover:bg-gray-50"
              title="전체 보기 (Ctrl+0)"
            >
              📐
            </button>
          </div>

          {/* 힌트 표시 버튼 */}
          <div className="react-flow__controls-button border-t border-gray-200">
            <button
              onClick={() => setShowPanHint(true)}
              className="w-full h-full flex items-center justify-center hover:bg-gray-50"
              title="사용법 보기"
            >
              💡
            </button>
          </div>
        </Controls>

        <MiniMap
          position="bottom-right"
          className="bg-white border border-gray-200 rounded-lg shadow-sm"
          nodeColor={(node) => {
            switch (node.data?.type) {
              case "CONTRACT_INFO":
                return "#3b82f6";
              case "MINT_FUNCTION":
              case "BURN_FUNCTION":
                return "#10b981";
              case "ACCESS_CONTROL":
                return "#8b5cf6";
              case "VARIABLE":
                return "#f59e0b";
              default:
                return "#6b7280";
            }
          }}
          maskColor="rgb(240, 242, 246, 0.7)"
          pannable={true}
          zoomable={true}
        />

        <Background
          variant={BackgroundVariant.Dots}
          gap={15}
          size={1.5}
          className="bg-white"
          color="#94a3b8"
          style={{
            opacity: 0.8,
          }}
        />
      </ReactFlow>

      {/* 빈 캔버스 안내 */}
      {reactFlowNodes.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-center">
            <div className="text-6xl mb-4">🎯</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              블록을 드래그해서 시작하세요
            </h3>
            <p className="text-gray-600 max-w-md mb-4">
              왼쪽의 블록 라이브러리에서 원하는 블록을 선택하여 캔버스에
              드래그하거나 클릭해서 추가하세요
            </p>
            <div className="bg-gray-100 rounded-lg p-4 max-w-md mx-auto">
              <h4 className="text-sm font-medium text-gray-700 mb-2">
                💡 캔버스 조작법
              </h4>
              <div className="text-xs text-gray-600 space-y-1">
                <div>• 빈 공간 드래그: 캔버스 이동</div>
                <div>• 위로 스크롤: 줌인 / 아래로 스크롤: 줌아웃</div>
                <div>• 노드 위 드래그: 노드 이동</div>
                <div>• 더블클릭: 노드 편집</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function EditorCanvas() {
  return (
    <ReactFlowProvider>
      <EditorCanvasInner />
    </ReactFlowProvider>
  );
}
