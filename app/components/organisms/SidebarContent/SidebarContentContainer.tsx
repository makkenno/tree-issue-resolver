import { FC } from "react";
import { useIssueTitlesAtom } from "~/hooks/useIssuesAtom";
import { SidebarContentProps, SidebarContent } from "./SidebarContent";

export const SidebarContentContainer: FC<
  Pick<SidebarContentProps, "onClickNav" | "onDeleteMenu">
> = ({ onClickNav, onDeleteMenu }) => {
  const issueTitles = useIssueTitlesAtom();
  return (
    <SidebarContent
      menus={issueTitles.map((issueTitle) => ({
        id: issueTitle.id,
        title: issueTitle.title,
      }))}
      onDeleteMenu={onDeleteMenu}
      onClickNav={onClickNav}
    />
  );
};
