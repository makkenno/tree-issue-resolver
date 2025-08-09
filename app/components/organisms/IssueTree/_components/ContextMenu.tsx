import { FC, useEffect, useRef } from "react";
import { Box } from "~/components/atoms/Box/Box";
import { ActionIcon } from "~/components/atoms/ActionIcon/ActionIcon";
import { PlusIcon } from "~/components/atoms/Icon/Plus/Plus";

export interface ContextMenuProps {
  nodeId: string;
  position: { x: number; y: number } | null;
  isCollapsed?: boolean;
  hasChildren?: boolean;
  isResolved?: boolean;
  onAddNode: () => void;
  onDeleteNode: () => void;
  onToggleResolved: () => void;
  onToggleCollapse?: () => void;
  onClose: () => void;
}

export const ContextMenu: FC<ContextMenuProps> = ({
  nodeId,
  position,
  isCollapsed = false,
  hasChildren = false,
  isResolved = false,
  onAddNode,
  onDeleteNode,
  onToggleResolved,
  onToggleCollapse,
  onClose,
}) => {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    if (position) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleEscapeKey);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscapeKey);
    };
  }, [position, onClose]);

  if (!position) return null;

  const getAdjustedPosition = () => {
    const menuWidth = 200;
    const menuHeight = hasChildren ? 160 : 120;
    const padding = 10;

    let adjustedX = position.x;
    let adjustedY = position.y;

    if (position.x + menuWidth + padding > window.innerWidth) {
      adjustedX = window.innerWidth - menuWidth - padding;
    }

    if (position.y + menuHeight + padding > window.innerHeight) {
      adjustedY = window.innerHeight - menuHeight - padding;
    }

    return { x: Math.max(padding, adjustedX), y: Math.max(padding, adjustedY) };
  };

  const adjustedPos = getAdjustedPosition();

  return (
    <Box
      ref={menuRef}
      style={{
        position: "fixed",
        top: adjustedPos.y,
        left: adjustedPos.x,
        backgroundColor: "white",
        border: "1px solid #ccc",
        borderRadius: "8px",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
        zIndex: 1000,
        minWidth: "180px",
        padding: "8px 0",
      }}
    >
      <MenuItem
        icon={<PlusIcon size={16} />}
        label="ノードを追加"
        onClick={() => {
          onAddNode();
          onClose();
        }}
      />
      
      <MenuItem
        icon={<span style={{ fontSize: "16px", color: "#dc3545" }}>🗑️</span>}
        label="ノードを削除"
        onClick={() => {
          onDeleteNode();
          onClose();
        }}
        color="#dc3545"
      />

      <MenuItem
        icon={
          <span style={{ fontSize: "16px" }}>
            {isResolved ? "❌" : "✅"}
          </span>
        }
        label={isResolved ? "未解決にする" : "解決にする"}
        onClick={() => {
          onToggleResolved();
          onClose();
        }}
      />

      {hasChildren && onToggleCollapse && (
        <MenuItem
          icon={
            <span style={{ fontSize: "16px" }}>
              {isCollapsed ? "📂" : "📁"}
            </span>
          }
          label={isCollapsed ? "子ノードを展開" : "子ノードを折りたたむ"}
          onClick={() => {
            onToggleCollapse();
            onClose();
          }}
        />
      )}
    </Box>
  );
};

interface MenuItemProps {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  color?: string;
}

const MenuItem: FC<MenuItemProps> = ({ icon, label, onClick, color }) => {
  return (
    <Box
      style={{
        display: "flex",
        alignItems: "center",
        padding: "8px 16px",
        cursor: "pointer",
        fontSize: "14px",
        color: color || "#333",
        transition: "background-color 0.15s ease",
      }}
      onMouseEnter={(e) => {
        (e.target as HTMLElement).style.backgroundColor = "#f8f9fa";
      }}
      onMouseLeave={(e) => {
        (e.target as HTMLElement).style.backgroundColor = "transparent";
      }}
      onClick={onClick}
    >
      <Box style={{ marginRight: "12px", display: "flex", alignItems: "center" }}>
        {icon}
      </Box>
      {label}
    </Box>
  );
};