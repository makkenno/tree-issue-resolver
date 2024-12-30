import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useParams,
} from "@remix-run/react";
import type { LinksFunction } from "@remix-run/node";
import { ColorSchemeScript, Center } from "@mantine/core";
import { Provider } from "./provider";
import "@mantine/core/styles.css";
import "./global.css";
import { Loader } from "./components/atoms/Loader/Loader";
import { MenuIcon } from "./components/atoms/Icon/Menu/Menu";
import { Drawer } from "./components/molecules/Drawer/Drawer";
import { Suspense, useState } from "react";
import { Flex } from "./components/atoms/Flex/Flex";
import { ActionIcon } from "./components/atoms/ActionIcon/ActionIcon";
import { Box } from "./components/atoms/Box/Box";
import { LoadingOverlay } from "./components/molecules/LoadingOverlay/LoadingOverlay";
import { SidebarContentContainer } from "./components/organisms/SidebarContent/SidebarContentContainer";
import { EditIcon } from "./components/atoms/Icon/Edit/Edit";
import { Link } from "./components/atoms/Link/Link";
import { CloseIcon } from "./components/atoms/Icon/Close/Close";
import { useNavigate } from "./hooks/useNavigate";
import { useRemoveIssueAtom } from "./hooks/useRemoveIssueAtom";
import { FileDownloadIcon } from "./components/atoms/Icon/FileDownload/FileDownload";
import { Header } from "./components/organisms/Header/Header";

export const links: LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
];

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
        <ColorSchemeScript />
      </head>
      <body>
        <Provider>{children}</Provider>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  const [isOpen, setIsOpen] = useState(false);
  const removeIssue = useRemoveIssueAtom();
  const navigate = useNavigate();
  const { treeId } = useParams();
  return (
    <>
      <Header treeId={treeId} onClickMenu={() => setIsOpen(true)} />
      <hr />
      <Box mb="xl">
        <Outlet />
      </Box>
      <Drawer
        opened={isOpen}
        onClose={() => setIsOpen(false)}
        withCloseButton={false}
      >
        <Flex justify="space-between" pb="xs">
          <ActionIcon
            variant="subtle"
            color="gray"
            onClick={() => setIsOpen(false)}
          >
            <CloseIcon />
          </ActionIcon>
          <Flex gap="xs">
            <Link to="/import" onClick={() => setIsOpen(false)}>
              <ActionIcon variant="subtle" color="gray">
                <FileDownloadIcon />
              </ActionIcon>
            </Link>
            <Link to="/" onClick={() => setIsOpen(false)}>
              <ActionIcon variant="subtle" color="gray">
                <EditIcon />
              </ActionIcon>
            </Link>
          </Flex>
        </Flex>
        <Suspense fallback={<LoadingOverlay />}>
          <SidebarContentContainer
            onDeleteMenu={async (id) => {
              await removeIssue({ id });
              navigate("/");
            }}
            onClickNav={() => setIsOpen(false)}
          />
        </Suspense>
      </Drawer>
    </>
  );
}

export function HydrateFallback() {
  return (
    <Center h="100vh">
      <Loader />
    </Center>
  );
}
