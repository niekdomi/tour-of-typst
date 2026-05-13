import type { VariantProps } from "cva";
import type { Accessor, Component, ComponentProps, JSX, ValidComponent } from "solid-js";
import { createContext, createSignal, mergeProps, Show, splitProps, useContext } from "solid-js";

import type { ButtonProps } from "./button";
import { Button } from "./button";
import { cva, cx } from "./cva";
import { Tooltip, TooltipContent, TooltipTrigger } from "./tooltip";

const SIDEBAR_COOKIE_NAME = "sidebar:state";
const SIDEBAR_COOKIE_MAX_AGE = 60 * 60 * 24 * 7;
const SIDEBAR_WIDTH = "16rem";

type SidebarContext = {
  state: Accessor<"expanded" | "collapsed">;
  open: Accessor<boolean>;
  setOpen: (open: boolean) => void;
  toggleSidebar: () => void;
};

const SidebarContext = createContext<SidebarContext | null>(null);

export function useSidebar() {
  const context = useContext(SidebarContext);
  if (!context) throw new Error("useSidebar must be used within a SidebarProvider.");
  return context;
}

type SidebarProviderProps = Omit<ComponentProps<"div">, "style"> & {
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  style?: JSX.CSSProperties;
};

const SidebarProvider: Component<SidebarProviderProps> = (rawProps) => {
  const props = mergeProps({ defaultOpen: true }, rawProps);
  const [local, others] = splitProps(props, [
    "defaultOpen",
    "open",
    "onOpenChange",
    "class",
    "style",
    "children",
  ]);

  const [_open, _setOpen] = createSignal(local.defaultOpen);
  const open = () => local.open ?? _open();
  const setOpen = (value: boolean | ((value: boolean) => boolean)) => {
    if (local.onOpenChange) {
      return local.onOpenChange(typeof value === "function" ? value(open()) : value);
    }
    _setOpen(value);
    document.cookie = `${SIDEBAR_COOKIE_NAME}=${open()}; path=/; max-age=${SIDEBAR_COOKIE_MAX_AGE}`;
  };

  const toggleSidebar = () => setOpen((v) => !v);

  const state = () => (open() ? "expanded" : "collapsed");

  return (
    <SidebarContext.Provider value={{ state, open, setOpen, toggleSidebar }}>
      <div
        style={{ "--sidebar-width": SIDEBAR_WIDTH, ...local.style }}
        class={cx("text-sidebar-foreground", local.class)}
        {...others}
      >
        {local.children}
      </div>
    </SidebarContext.Provider>
  );
};

type SidebarProps = ComponentProps<"div">;

const Sidebar: Component<SidebarProps> = (props) => {
  const [local, others] = splitProps(props, ["class", "children"]);
  const { state } = useSidebar();

  return (
    <div
      data-state={state()}
      class={cx(
        "w-(--sidebar-width) shrink-0 overflow-hidden border-r border-sidebar-border transition-[width] duration-200 ease-linear",
        "data-[state=collapsed]:w-0",
        local.class
      )}
      {...others}
    >
      <div data-sidebar="sidebar" class="w-(--sidebar-width) flex h-full flex-col bg-sidebar">
        {local.children}
      </div>
    </div>
  );
};

type SidebarTriggerProps<T extends ValidComponent = "button"> = ButtonProps<T> & {
  onClick?: (event: MouseEvent) => void;
};

const SidebarTrigger = <T extends ValidComponent = "button">(props: SidebarTriggerProps<T>) => {
  const [local, others] = splitProps(props as SidebarTriggerProps, ["class", "onClick"]);
  const { toggleSidebar } = useSidebar();

  return (
    <Button
      data-sidebar="trigger"
      variant="ghost"
      size="icon"
      class={cx("size-7", local.class)}
      onClick={(event: MouseEvent) => {
        local.onClick?.(event);
        toggleSidebar();
      }}
      {...others}
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        class="size-4"
      >
        <rect width="18" height="18" x="3" y="3" rx="2" />
        <path d="M9 3v18" />
      </svg>
      <span class="sr-only">Toggle Sidebar</span>
    </Button>
  );
};

const SidebarHeader: Component<ComponentProps<"div">> = (props) => {
  const [local, others] = splitProps(props, ["class"]);
  return (
    <div data-sidebar="header" class={cx("flex flex-col gap-2 p-2", local.class)} {...others} />
  );
};

const SidebarContent: Component<ComponentProps<"div">> = (props) => {
  const [local, others] = splitProps(props, ["class"]);
  return (
    <div
      data-sidebar="content"
      class={cx(
        "flex min-h-0 flex-1 flex-col gap-2 overflow-auto group-data-[collapsible=icon]:overflow-hidden",
        local.class
      )}
      {...others}
    />
  );
};

const SidebarGroup: Component<ComponentProps<"div">> = (props) => {
  const [local, others] = splitProps(props, ["class"]);
  return (
    <div
      data-sidebar="group"
      class={cx("relative flex w-full min-w-0 flex-col p-2", local.class)}
      {...others}
    />
  );
};

const SidebarGroupLabel: Component<ComponentProps<"div">> = (props) => {
  const [local, others] = splitProps(props, ["class"]);
  return (
    <div
      data-sidebar="group-label"
      class={cx(
        "flex h-8 shrink-0 items-center rounded-md px-2 text-xs font-medium text-sidebar-foreground/70",
        "group-data-[collapsible=icon]:-mt-8 group-data-[collapsible=icon]:opacity-0",
        local.class
      )}
      {...others}
    />
  );
};

const SidebarGroupContent: Component<ComponentProps<"div">> = (props) => {
  const [local, others] = splitProps(props, ["class"]);
  return <div data-sidebar="group-content" class={cx("w-full text-sm", local.class)} {...others} />;
};

const SidebarMenu: Component<ComponentProps<"ul">> = (props) => {
  const [local, others] = splitProps(props, ["class"]);
  return (
    <ul
      data-sidebar="menu"
      class={cx("flex w-full min-w-0 flex-col gap-1", local.class)}
      {...others}
    />
  );
};

const SidebarMenuItem: Component<ComponentProps<"li">> = (props) => {
  const [local, others] = splitProps(props, ["class"]);
  return (
    <li data-sidebar="menu-item" class={cx("group/menu-item relative", local.class)} {...others} />
  );
};

const sidebarMenuButtonVariants = cva({
  base: "peer/menu-button flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left text-sm outline-none ring-sidebar-ring transition-[width,height,padding] hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 data-[active=true]:bg-sidebar-accent data-[active=true]:font-medium data-[active=true]:text-sidebar-accent-foreground group-data-[collapsible=icon]:!size-8 group-data-[collapsible=icon]:!p-2 [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0",
  variants: {
    variant: {
      default: "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
      outline:
        "bg-background shadow-[0_0_0_1px_hsl(var(--sidebar-border))] hover:bg-sidebar-accent hover:text-sidebar-accent-foreground hover:shadow-[0_0_0_1px_hsl(var(--sidebar-accent))]",
    },
    size: {
      default: "h-8 text-sm",
      sm: "h-7 text-xs",
      lg: "h-12 text-sm group-data-[collapsible=icon]:!p-0",
    },
  },
  defaultVariants: { variant: "default", size: "default" },
});

type SidebarMenuButtonProps = ComponentProps<"button"> &
  VariantProps<typeof sidebarMenuButtonVariants> & {
    isActive?: boolean;
    tooltip?: string;
  };

const SidebarMenuButton: Component<SidebarMenuButtonProps> = (rawProps) => {
  const props = mergeProps({ isActive: false, variant: "default", size: "default" }, rawProps);
  const [local, others] = splitProps(props, ["isActive", "tooltip", "variant", "size", "class"]);
  const { state } = useSidebar();

  const button = (
    <button
      data-sidebar="menu-button"
      data-size={local.size}
      data-active={local.isActive}
      class={cx(
        sidebarMenuButtonVariants({ variant: local.variant, size: local.size }),
        local.class
      )}
      {...others}
    />
  );

  return (
    <Show when={local.tooltip} fallback={button}>
      <Tooltip placement="right">
        <TooltipTrigger class="w-full">{button}</TooltipTrigger>
        <TooltipContent hidden={state() !== "collapsed"}>{local.tooltip}</TooltipContent>
      </Tooltip>
    </Show>
  );
};

export {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
};
