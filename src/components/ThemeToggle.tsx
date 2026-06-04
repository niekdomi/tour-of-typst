import { TbOutlineMoon, TbOutlineSun } from "solid-icons/tb";
import { Show } from "solid-js";

import { useTheme } from "../lib/ThemeContext";
import { Button } from "./ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

export default function ThemeToggle() {
  const { theme, toggle } = useTheme();
  return (
    <Tooltip openDelay={150}>
      <TooltipTrigger
        as={Button<"button">}
        variant="outline"
        size="icon"
        class="border-border/60"
        aria-label={theme() === "dark" ? "Switch to light mode" : "Switch to dark mode"}
        onClick={toggle}
      >
        <Show when={theme() === "dark"} fallback={<TbOutlineMoon size={14} />}>
          <TbOutlineSun size={14} />
        </Show>
      </TooltipTrigger>
      <TooltipContent>
        {theme() === "dark" ? "Switch to light mode" : "Switch to dark mode"}
      </TooltipContent>
    </Tooltip>
  );
}
