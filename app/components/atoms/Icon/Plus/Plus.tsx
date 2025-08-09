import { IconPlus } from "@tabler/icons-react";
import { FC } from "react";

interface PlusIconProps {
  color?: string;
  size?: number;
}

export const PlusIcon: FC<PlusIconProps> = ({ color = "gray", size = 16 }) => {
  return <IconPlus color={color} size={size} />;
};