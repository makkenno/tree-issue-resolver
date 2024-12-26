import { Link as RemixLink } from "@remix-run/react";
import { RemixLinkProps } from "@remix-run/react/dist/components";
import { FC } from "react";

export const Link: FC<
  RemixLinkProps & React.RefAttributes<HTMLAnchorElement>
> = (props) => (
  <RemixLink {...props} style={{ textDecoration: "none" }}></RemixLink>
);
