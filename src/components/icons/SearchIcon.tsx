import { IconWrapper } from "./index";
import type { IconProps } from "./index";

export const SearchIcon = (props: IconProps) => (
  <IconWrapper {...props}>
    <circle cx="11" cy="11" r="8" />
    <line x1="21" x2="16.65" y1="21" y2="16.65" />
  </IconWrapper>
);
