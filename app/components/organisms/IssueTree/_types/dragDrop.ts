export interface ReorderOperation {
  parentId: string;
  childIds: string[];
}

export interface DragDropState {
  isDragging: boolean;
  draggedNodeId: string | null;
  targetNodeId: string | null;
}

export interface NodePosition {
  activeIndex: number;
  overIndex: number;
  siblings: string[];
}