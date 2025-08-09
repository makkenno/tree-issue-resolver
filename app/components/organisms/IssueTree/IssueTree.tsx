import { ReactFlow, ReactFlowProvider, useReactFlow } from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { FC, useEffect, useRef, useState } from "react";
import { DndContext, closestCenter, DragOverlay } from "@dnd-kit/core";
import { useIssueTree } from "./_hooks/useIssueTree";
import { useDragAndDrop } from "./_hooks/useDragAndDrop";
import { Box } from "../../atoms/Box/Box";
import { IssueCardNode } from "./_components/IssueCardNode";
import { DraggingTreePreview } from "./_components/DraggingTreePreview";
import { ContextMenu } from "./_components/ContextMenu";
import { useAddChildIssueAtom } from "~/hooks/useAddChildIssueAtom";
import { useRemoveIssueAtom } from "~/hooks/useRemoveIssueAtom";
import { useUpdateIssueNodeAtom } from "~/hooks/useUpdateIssueNodeAtom";
import { useToggleNodeCollapseAtom } from "~/hooks/useToggleNodeCollapseAtom";
import { useIssueTreeAtom } from "~/hooks/useIssueRootAtom";
import { findNodeInTree } from "./_utils/treeUtils";

export type IssueTree = {
  id: string;
  title: string;
  isResolved: boolean;
  isCollapsed?: boolean;
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
  const [contextMenu, setContextMenu] = useState<{
    nodeId: string;
    position: { x: number; y: number };
  } | null>(null);

  const addChildIssue = useAddChildIssueAtom();
  const removeIssue = useRemoveIssueAtom();
  const updateIssueNode = useUpdateIssueNodeAtom();
  const toggleNodeCollapse = useToggleNodeCollapseAtom();
  const issueTree = useIssueTreeAtom();

  useEffect(() => {
    if (nodes && nodes.length > 0 && !isDragging && !hasInitialized.current) {
      setTimeout(() => {
        reactFlowInstance.fitView({ padding: 0.1 });
        hasInitialized.current = true;
      }, 100);
    }
  }, [nodes, edges, reactFlowInstance, isDragging]);

  const handleNodeContextMenu = (event: React.MouseEvent, node: any) => {
    event.preventDefault();
    setContextMenu({
      nodeId: node.id,
      position: {
        x: event.clientX,
        y: event.clientY,
      },
    });
  };

  const handleAddNode = async () => {
    if (!contextMenu) return;
    try {
      await addChildIssue({
        parentId: contextMenu.nodeId,
        childTitle: "新しいノード",
      });
    } catch (error) {
      console.error("Failed to add child issue:", error);
    }
  };

  const handleDeleteNode = async () => {
    if (!contextMenu) return;
    try {
      await removeIssue({ id: contextMenu.nodeId });
    } catch (error) {
      console.error("Failed to remove issue:", error);
    }
  };

  const handleToggleResolved = async () => {
    if (!contextMenu || !issueTree) return;
    try {
      const currentNode = findNodeInTree(issueTree, contextMenu.nodeId);
      if (currentNode) {
        await updateIssueNode({
          id: contextMenu.nodeId,
          title: currentNode.title,
          note: currentNode.note || "",
          isResolved: !currentNode.isResolved,
          children: currentNode.children?.map((child: any) => ({
            id: child.id,
            title: child.title,
          })) || [],
        });
      }
    } catch (error) {
      console.error("Failed to toggle issue resolution:", error);
    }
  };

  const handleToggleCollapse = async () => {
    if (!contextMenu || !issueTree) return;
    try {
      const currentNode = findNodeInTree(issueTree, contextMenu.nodeId);
      if (currentNode) {
        
        await toggleNodeCollapse({
          id: contextMenu.nodeId,
          title: currentNode.title,
          note: currentNode.note || "",
          isResolved: currentNode.isResolved,
          isCollapsed: currentNode.isCollapsed || false,
          children: currentNode.children?.map((child: any) => ({
            id: child.id,
            title: child.title,
          })) || [],
        });
      }
    } catch (error) {
      console.error("Failed to toggle node collapse:", error);
    }
  };

  const handleCloseContextMenu = () => {
    setContextMenu(null);
  };

  // データベースから取得した完全なツリーデータからノード情報を取得
  const currentNodeFromDB = contextMenu && issueTree ? findNodeInTree(issueTree, contextMenu.nodeId) : null;
  
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
        defaultViewport={{ x: 0, y: 0, zoom: 0.3 }}
        fitView
        fitViewOptions={{ padding: 0.1 }}
        nodesDraggable={false}
        nodesConnectable={false}
        panOnDrag={false}
        panOnScroll={true}
        onNodeContextMenu={handleNodeContextMenu}
      />
      <DragOverlay>
        {draggingSubtree && <DraggingTreePreview subtree={draggingSubtree} />}
      </DragOverlay>
      <ContextMenu
        nodeId={contextMenu?.nodeId || ""}
        position={contextMenu?.position || null}
        isCollapsed={currentNodeFromDB?.isCollapsed || false}
        hasChildren={(currentNodeFromDB?.children || []).length > 0}
        isResolved={currentNodeFromDB?.isResolved || false}
        onAddNode={handleAddNode}
        onDeleteNode={handleDeleteNode}
        onToggleResolved={handleToggleResolved}
        onToggleCollapse={(currentNodeFromDB?.children || []).length > 0 ? handleToggleCollapse : undefined}
        onClose={handleCloseContextMenu}
      />
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
