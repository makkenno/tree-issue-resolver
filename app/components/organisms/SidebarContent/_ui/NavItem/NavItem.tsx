import { FC, useState } from "react";
import { ActionIcon } from "~/components/atoms/ActionIcon/ActionIcon";
import { DotsIcon } from "~/components/atoms/Icon/Dots/Dots";
import { Link } from "~/components/atoms/Link/Link";
import { NavLink } from "~/components/molecules/NavLink/NavLink";
import { Text } from "~/components/atoms/Text/Text";
import { Menu } from "~/components/molecules/Menu/Menu";

interface MenuItemProps {
  to: string;
  label: string;
  onDelete: () => void;
}

export const NavItem: FC<MenuItemProps> = ({ to, label, onDelete }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <NavLink
      label={<Text lineClamp={1}>{label}</Text>}
      rightSection={
        <>
          <Menu opened={isOpen} onChange={setIsOpen}>
            <Menu.Target>
              <ActionIcon
                variant="subtle"
                color="gray"
                onClick={(e) => {
                  e.preventDefault();
                  setIsOpen((current) => !current);
                }}
              >
                <DotsIcon />
              </ActionIcon>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Item color="red" onClick={onDelete}>
                削除
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </>
      }
      component={Link}
      to={to}
    />
  );
};
