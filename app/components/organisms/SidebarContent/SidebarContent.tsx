import { FC } from "react";
import { Box } from "~/components/atoms/Box/Box";
import { NavItem } from "./_ui/NavItem/NavItem";

export interface SidebarContentProps {
  menus: {
    id: string;
    title: string;
  }[];
  onDeleteMenu: (id: string) => void;
  onClickNav: () => void;
}

export const SidebarContent: FC<SidebarContentProps> = ({
  menus,
  onDeleteMenu,
  onClickNav,
}) => {
  return (
    <Box component="nav">
      {menus.map((menu) => (
        <NavItem
          key={menu.id}
          to={`/${menu.id}`}
          label={menu.title}
          onDelete={() => onDeleteMenu(menu.id)}
          onClick={onClickNav}
        />
      ))}
    </Box>
  );
};
