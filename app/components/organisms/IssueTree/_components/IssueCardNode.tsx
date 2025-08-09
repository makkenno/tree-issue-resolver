import { IssueCard } from "./IssueCard";
import { Link } from "~/components/atoms/Link/Link";
import { Handle, Position } from "@xyflow/react";
import { FC, useState, useRef, useEffect } from "react";
import { useParams } from "@remix-run/react";
import { Box } from "~/components/atoms/Box/Box";
import { ActionIcon } from "~/components/atoms/ActionIcon/ActionIcon";
import { PlusIcon } from "~/components/atoms/Icon/Plus/Plus";
import { TextInput } from "~/components/molecules/TextInput/TextInput";
import { useAddChildIssueAtom } from "~/hooks/useAddChildIssueAtom";
import { useUpdateIssueNodeAtom } from "~/hooks/useUpdateIssueNodeAtom";
import { useIssueTreeAtom } from "~/hooks/useIssueRootAtom";
import { useToggleNodeCollapseAtom } from "~/hooks/useToggleNodeCollapseAtom";
import { useDraggable, useDroppable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { findNodeInTree } from "../_utils/treeUtils";

export interface IssueCardNodeProps {
  data: { 
    id: string; 
    title: string; 
    isResolved: boolean; 
    isCollapsed?: boolean; 
    hasChildren?: boolean;
    note?: string; 
    children?: { id: string; title: string }[] 
  };
}

export const IssueCardNode: FC<IssueCardNodeProps> = ({ data }) => {
  const { treeId } = useParams();
  const [isAddingChild, setIsAddingChild] = useState(false);
  const [childTitle, setChildTitle] = useState("");
  const [isHovered, setIsHovered] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const addChildIssue = useAddChildIssueAtom();
  const updateIssueNode = useUpdateIssueNodeAtom();
  const toggleNodeCollapse = useToggleNodeCollapseAtom();
  const issueTree = useIssueTreeAtom();
  
  const {
    attributes,
    listeners,
    setNodeRef: setDragNodeRef,
    transform,
    isDragging,
  } = useDraggable({
    id: data.id,
  });

  const {
    setNodeRef: setDropNodeRef,
    isOver,
  } = useDroppable({
    id: data.id,
  });

  const setNodeRef = (node: HTMLElement | null) => {
    setDragNodeRef(node);
    setDropNodeRef(node);
  };

  const style = {
    transform: CSS.Translate.toString(transform),
    opacity: isDragging ? 0 : 1,
    backgroundColor: isOver ? 'rgba(0, 123, 255, 0.1)' : undefined,
    border: isOver ? '2px dashed #007bff' : undefined,
  };

  useEffect(() => {
    if (isAddingChild && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isAddingChild]);

  const handleAddChild = async () => {
    if (childTitle.trim()) {
      try {
        await addChildIssue({
          parentId: data.id,
          childTitle: childTitle.trim(),
        });
        setChildTitle("");
        setIsAddingChild(false);
      } catch (error) {
        console.error("Failed to add child issue:", error);
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddChild();
    } else if (e.key === "Escape") {
      setIsAddingChild(false);
      setChildTitle("");
    }
  };

  const handleCancelAdd = () => {
    setIsAddingChild(false);
    setChildTitle("");
  };

  const handleToggleResolved = async () => {
    try {
      const currentNode = issueTree ? findNodeInTree(issueTree, data.id) : null;
      await updateIssueNode({
        id: data.id,
        title: currentNode?.title || data.title,
        note: currentNode?.note || "",
        isResolved: !data.isResolved,
        children: currentNode?.children?.map((child: any) => ({
          id: child.id,
          title: child.title,
        })) || [],
      });
    } catch (error) {
      console.error("Failed to toggle issue resolution:", error);
    }
  };

  const handleToggleCollapse = async () => {
    try {
      const currentNode = issueTree ? findNodeInTree(issueTree, data.id) : null;
      if (currentNode) {
        await toggleNodeCollapse({
          id: data.id,
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

  return (
    <Box
      ref={setNodeRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ position: "relative", ...style }}
      {...attributes}
    >
      <Handle type="target" position={Position.Left} />
      <Link to={`/edit/${treeId}/${data.id}`}>
        <IssueCard 
          title={data.title} 
          isResolved={data.isResolved}
          isCollapsed={data.isCollapsed}
          hasChildren={data.hasChildren}
          onToggleResolved={handleToggleResolved}
          onToggleCollapse={data.hasChildren ? handleToggleCollapse : undefined}
        />
      </Link>
      <Handle type="source" position={Position.Right} />
      
      {(isHovered || isAddingChild) && (
        <>
          <ActionIcon
            size="xl"
            variant="filled"
            color="blue"
            style={{
              position: "absolute",
              top: -20,
              right: -20,
              zIndex: 10,
            }}
            onClick={(e) => {
              e.stopPropagation();
              setIsAddingChild(true);
            }}
          >
            <PlusIcon size={24} />
          </ActionIcon>
          <ActionIcon
            size="xl"
            variant="subtle"
            color="gray"
            style={{
              position: "absolute",
              top: -20,
              left: -20,
              zIndex: 10,
              cursor: "grab",
              fontSize: "22px",
              fontWeight: "bold",
            }}
            onMouseDown={(e) => {
              e.stopPropagation();
              e.preventDefault();
            }}
            onTouchStart={(e) => {
              e.stopPropagation();
              e.preventDefault();
            }}
            onPointerDown={(e) => {
              e.stopPropagation();
              e.preventDefault();
            }}
            {...listeners}
          >
            ⋮⋮
          </ActionIcon>
        </>
      )}

      {isAddingChild && (
        <Box
          style={{
            position: "absolute",
            top: "100%",
            left: 0,
            marginTop: 8,
            minWidth: 200,
            zIndex: 20,
          }}
        >
          <TextInput
            ref={inputRef}
            value={childTitle}
            onChange={(e) => setChildTitle(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={handleCancelAdd}
            placeholder="新しい子ノードのタイトル..."
            size="sm"
          />
        </Box>
      )}
    </Box>
  );
};
