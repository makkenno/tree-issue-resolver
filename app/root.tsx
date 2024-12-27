import {
  Link,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import type { LinksFunction } from "@remix-run/node";
import { Container, Flex, Box, ColorSchemeScript, Center } from "@mantine/core";
import { Provider } from "./provider";
import "@mantine/core/styles.css";
import "./global.css";
import { Loader } from "./components/atoms/Loader/Loader";

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
  return (
    <>
      <Container>
        <Flex gap="xs">
          <Link to="/">Home</Link>
          <Link to="/output">Output</Link>
          <Link to="/import">Import</Link>
        </Flex>
      </Container>
      <hr />
      <Box mb="xl">
        <Outlet />
      </Box>
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