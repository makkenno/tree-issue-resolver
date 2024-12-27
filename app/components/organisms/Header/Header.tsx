import { FC } from "react";
import { ActionIcon } from "~/components/atoms/ActionIcon/ActionIcon";
import { Flex } from "~/components/atoms/Flex/Flex";
import { MenuIcon } from "~/components/atoms/Icon/Menu/Menu";
import { Link } from "~/components/atoms/Link/Link";

interface HeaderProps {
  onClickMenu: () => void;
}
export const Header: FC<HeaderProps> = ({ onClickMenu }) => {
  return (
    <Flex gap="xs" m="xs" align="center">
      <ActionIcon variant="subtle" color="gray" onClick={onClickMenu}>
        <MenuIcon />
      </ActionIcon>
      <Link to="/">Home</Link>
      <Link to="/output">Output</Link>
      <Link to="/import">Import</Link>
    </Flex>
  );
};
