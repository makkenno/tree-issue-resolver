import { FC } from "react";
import { Box } from "~/components/atoms/Box/Box";
import { NavItem } from "./_ui/NavItem/NavItem";

interface SidebarContentProps {
  menus: {
    id: string;
    title: string;
  }[];
  onDeleteMenu: (id: string) => void;
}

export const SidebarContent: FC<SidebarContentProps> = ({
  menus,
  onDeleteMenu,
}) => {
  return (
    <Box component="nav">
      {menus.map((menu) => (
        <NavItem
          to={`/${menu.id}`}
          label={menu.title}
          onDelete={() => onDeleteMenu(menu.id)}
        />
      ))}
    </Box>
  );
};