import { useState } from "react";
import { DragEndEvent, DragStartEvent } from "@dnd-kit/core";
import { useReorderChildIssuesAtom } from "~/hooks/useReorderChildIssuesAtom";
import { IssueTree } from "../IssueTree";
import { 
  findNodeParent, 
  findChildrenOrder, 
  reorderArray, 
  isValidReorder,
  findSubtree
} from "../_utils/dragDropUtils";
import { NodePosition, ReorderOperation } from "../_types/dragDrop";

interface UseDragAndDropReturn {
  handleDragStart: (event: DragStartEvent) => void;
  handleDragEnd: (event: DragEndEvent) => Promise<void>;
  draggingSubtree: IssueTree | null;
  isDragging: boolean;
}

export const useDragAndDrop = (tree: IssueTree): UseDragAndDropReturn => {
  const reorderChildIssues = useReorderChildIssuesAtom();
  const [draggingSubtree, setDraggingSubtree] = useState<IssueTree | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleDragStart = (event: DragStartEvent): void => {
    const activeNodeId = event.active.id as string;
    const subtree = findSubtree(activeNodeId, tree);
    setDraggingSubtree(subtree);
    setIsDragging(true);
  };

  const handleDragEnd = async (event: DragEndEvent): Promise<void> => {
    const { active, over } = event;
    
    if (!over || active.id === over.id) {
      return;
    }

    const activeNodeId = active.id as string;
    const overNodeId = over.id as string;
    
    const activeParentId = findNodeParent(activeNodeId, tree);
    const overParentId = findNodeParent(overNodeId, tree);

    // Only allow reordering within the same parent
    if (activeParentId && activeParentId === overParentId) {
      const siblings = findChildrenOrder(activeParentId, tree);
      const activeIndex = siblings.indexOf(activeNodeId);
      const overIndex = siblings.indexOf(overNodeId);

      const nodePosition: NodePosition = {
        activeIndex,
        overIndex,
        siblings,
      };

      if (isValidReorder(nodePosition.activeIndex, nodePosition.overIndex)) {
        const newOrder = reorderArray(nodePosition.siblings, nodePosition.activeIndex, nodePosition.overIndex);

        const reorderOperation: ReorderOperation = {
          parentId: activeParentId,
          childIds: newOrder,
        };

        try {
          await reorderChildIssues(reorderOperation);
        } catch (error) {
          console.error('Failed to reorder children:', error);
        }
      }
    }
    
    // Clear dragging state
    setDraggingSubtree(null);
    setIsDragging(false);
  };

  return { 
    handleDragStart,
    handleDragEnd,
    draggingSubtree,
    isDragging
  };
};