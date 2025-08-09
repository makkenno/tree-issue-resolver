import { ReactFlow, ReactFlowProvider, useReactFlow } from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { FC, useEffect, useRef } from "react";
import { DndContext, closestCenter, DragOverlay } from "@dnd-kit/core";
import { useIssueTree } from "./_hooks/useIssueTree";
import { useDragAndDrop } from "./_hooks/useDragAndDrop";
import { Box } from "../../atoms/Box/Box";
import { IssueCardNode } from "./_components/IssueCardNode";
import { DraggingTreePreview } from "./_components/DraggingTreePreview";

export type IssueTree = {
  id: string;
  title: string;
  isResolved: boolean;
  children: IssueTree[];
};

interface IssueTreeProps {
  tree: IssueTree;
}

const IssueTreeContent: FC<IssueTreeProps> = ({ tree }) => {
  const { nodes, edges } = useIssueTree(tree);
  const reactFlowInstance = useReactFlow();
  const { handleDragStart, handleDragEnd, draggingSubtree, isDragging } = useDragAndDrop(tree);
  const hasInitialized = useRef(false);

  useEffect(() => {
    if (nodes && nodes.length > 0 && !isDragging && !hasInitialized.current) {
      setTimeout(() => {
        reactFlowInstance.fitView({ padding: 0.1 });
        hasInitialized.current = true;
      }, 100);
    }
  }, [nodes, edges, reactFlowInstance, isDragging]);

  return (
    <DndContext 
      collisionDetection={closestCenter}
      onDragStart={handleDragStart} 
      onDragEnd={handleDragEnd}
    >
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={{ issueCard: IssueCardNode }}
        defaultViewport={{ x: 0, y: 0, zoom: 0.5 }}
        fitView
        fitViewOptions={{ padding: 0.1 }}
        nodesDraggable={false}
        nodesConnectable={false}
        panOnDrag={false}
        panOnScroll={true}
      />
      <DragOverlay>
        {draggingSubtree && <DraggingTreePreview subtree={draggingSubtree} />}
      </DragOverlay>
    </DndContext>
  );
};

export const IssueTree: FC<IssueTreeProps> = ({ tree }) => {
  return (
    <Box style={{ height: "80vh", border: "1px solid gray" }}>
      <ReactFlowProvider>
        <IssueTreeContent tree={tree} />
      </ReactFlowProvider>
    </Box>
  );
};
