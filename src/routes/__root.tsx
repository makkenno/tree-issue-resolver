import * as React from "react";
import { Link, Outlet, createRootRoute } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import { Box } from "@/components/atoms/Box/Box";
import { Container } from "@mantine/core";
import { Flex } from "@/components/atoms/Flex/Flex";

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  return (
    <>
      <Container>
        <Flex gap="xs">
          <Link
            to="/"
            activeProps={{
              className: "font-bold",
            }}
            activeOptions={{ exact: true }}
          >
            Home
          </Link>
          <Link
            to="/output"
            activeProps={{
              className: "font-bold",
            }}
            activeOptions={{ exact: true }}
          >
            Output
          </Link>
        </Flex>
      </Container>
      <hr />
      <Box mb="xl">
        <Outlet />
      </Box>
      {/* <TanStackRouterDevtools position="bottom-right" /> */}
    </>
  );
}
