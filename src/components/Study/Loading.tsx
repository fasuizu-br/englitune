import type { ComponentProps } from "react";
import { Item, ItemContent, ItemMedia, ItemTitle } from "@/components/ui/item";
import { Spinner } from "@/components/ui/spinner";

const Loading = ({ ...props }: ComponentProps<typeof Item>) => (
  <Item variant="outline" {...props}>
    <ItemMedia>
      <Spinner className="size-auto" />
    </ItemMedia>
    <ItemContent>
      <ItemTitle>Loading...</ItemTitle>
    </ItemContent>
  </Item>
);

export default Loading;
