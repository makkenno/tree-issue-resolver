import { FC } from "react";
import { ActionIcon } from "~/components/atoms/ActionIcon/ActionIcon";
import { Box } from "~/components/atoms/Box/Box";
import { Flex } from "~/components/atoms/Flex/Flex";
import { EditIcon } from "~/components/atoms/Icon/Edit/Edit";
import { MenuIcon } from "~/components/atoms/Icon/Menu/Menu";
import { Link } from "~/components/atoms/Link/Link";

interface HeaderProps {
  treeId: string | undefined;
  onClickMenu: () => void;
}
export const Header: FC<HeaderProps> = ({ treeId, onClickMenu }) => {
  return (
    <Flex
      component="header"
      gap="xs"
      m="xs"
      align="center"
      justify="space-between"
    >
      <Flex gap="xs" align="center">
        <ActionIcon variant="subtle" color="gray" onClick={onClickMenu}>
          <MenuIcon />
        </ActionIcon>
        {treeId && (
          <>
            <Link to={`/${treeId}`}>Home</Link>
            <Link to={`/output/${treeId}`}>Output</Link>
          </>
        )}
      </Flex>
      {treeId && (
        <Link to="/">
          <ActionIcon variant="subtle" color="gray">
            <EditIcon />
          </ActionIcon>
        </Link>
      )}
    </Flex>
  );
};
