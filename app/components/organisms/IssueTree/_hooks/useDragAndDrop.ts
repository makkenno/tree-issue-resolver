import { DragEndEvent } from "@dnd-kit/core";
import { useReorderChildIssuesAtom } from "~/hooks/useReorderChildIssuesAtom";
import { IssueTree } from "../IssueTree";
import { 
  findNodeParent, 
  findChildrenOrder, 
  reorderArray, 
  isValidReorder 
} from "../_utils/dragDropUtils";
import { NodePosition, ReorderOperation } from "../_types/dragDrop";

interface UseDragAndDropReturn {
  handleDragEnd: (event: DragEndEvent) => Promise<void>;
}

export const useDragAndDrop = (tree: IssueTree): UseDragAndDropReturn => {
  const reorderChildIssues = useReorderChildIssuesAtom();

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
  };

  return { handleDragEnd };
};