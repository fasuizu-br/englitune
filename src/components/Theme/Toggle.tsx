import type { ComponentProps } from "react";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import useTheme from "@/hooks/useTheme";

const Toggle = ({ ...props }: ComponentProps<typeof Button>) => {
  const { isDark, toggle } = useTheme();

  const title = `Switch to ${isDark ? "light" : "dark"} theme`;

  return (
    <Button
      variant="ghost"
      className="size-6 border"
      title={title}
      aria-label={title}
      onClick={toggle}
      {...props}
    >
      {isDark ? <Sun /> : <Moon />}
    </Button>
  );
};

export default Toggle;
