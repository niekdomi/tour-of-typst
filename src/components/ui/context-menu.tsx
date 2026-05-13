import * as ContextMenuPrimitive from "@kobalte/core/context-menu";
import type { Component, ComponentProps } from "solid-js";
import { splitProps } from "solid-js";

import { cx } from "./cva";

const ContextMenu: Component<ContextMenuPrimitive.ContextMenuRootProps> = (props) => (
  <ContextMenuPrimitive.Root gutter={4} {...props} />
);

const ContextMenuTrigger = ContextMenuPrimitive.Trigger;

const ContextMenuContent: Component<ComponentProps<typeof ContextMenuPrimitive.Content>> = (
  props
) => {
  const [local, others] = splitProps(props, ["class"]);
  return (
    <ContextMenuPrimitive.Portal>
      <ContextMenuPrimitive.Content
        class={cx(
          "z-50 min-w-32 origin-[var(--kb-menu-content-transform-origin)] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md animate-in",
          local.class
        )}
        {...others}
      />
    </ContextMenuPrimitive.Portal>
  );
};

const ContextMenuItem: Component<ComponentProps<typeof ContextMenuPrimitive.Item>> = (props) => {
  const [local, others] = splitProps(props, ["class"]);
  return (
    <ContextMenuPrimitive.Item
      class={cx(
        "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
        local.class
      )}
      {...others}
    />
  );
};

const ContextMenuSeparator: Component<ComponentProps<typeof ContextMenuPrimitive.Separator>> = (
  props
) => {
  const [local, others] = splitProps(props, ["class"]);
  return (
    <ContextMenuPrimitive.Separator
      class={cx("-mx-1 my-1 h-px bg-muted", local.class)}
      {...others}
    />
  );
};

export {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
};
