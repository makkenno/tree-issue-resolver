import { FC } from "react";
import { Box } from "~/components/atoms/Box/Box";
import { Text } from "~/components/atoms/Text/Text";
import { IssueCard } from "./IssueCard";
import { IssueTree } from "../IssueTree";

interface DraggingTreePreviewProps {
  subtree: IssueTree;
}

const countAllNodes = (tree: IssueTree): number => {
  return 1 + tree.children.reduce((sum, child) => sum + countAllNodes(child), 0);
};

export const DraggingTreePreview: FC<DraggingTreePreviewProps> = ({ subtree }) => {
  const childCount = subtree.children.length;
  const totalNodeCount = countAllNodes(subtree);

  return (
    <Box
      style={{
        pointerEvents: "none",
        transform: "rotate(-2deg)",
        filter: "drop-shadow(4px 4px 8px rgba(0,0,0,0.2))",
        display: "flex",
        flexDirection: "column",
        gap: 8,
        alignItems: "center",
      }}
    >
      {/* Main dragged node */}
      <Box
        style={{
          opacity: 0.8,
          transform: "scale(0.5)",
          position: "relative",
        }}
      >
        <IssueCard 
          title={subtree.title} 
          isResolved={subtree.isResolved}
        />
        
        {/* Child count indicator */}
        {childCount > 0 && (
          <Box
            style={{
              position: "absolute",
              top: -8,
              right: -8,
              backgroundColor: "rgba(0, 123, 255, 0.9)",
              color: "white",
              padding: "2px 6px",
              borderRadius: 10,
              fontSize: "11px",
              fontWeight: "bold",
              border: "1px solid white",
              boxShadow: "0 1px 2px rgba(0,0,0,0.2)",
              minWidth: 18,
              textAlign: "center",
            }}
          >
            +{totalNodeCount - 1}
          </Box>
        )}
      </Box>
    </Box>
  );
};