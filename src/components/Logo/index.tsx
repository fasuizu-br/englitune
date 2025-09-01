import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";
import useTheme from "@/hooks/useTheme";

const Logo = ({ children, className, ...props }: ComponentProps<"div">) => {
  const { isDark } = useTheme();

  return (
    <div className={cn("flex flex-col gap-2", className)} {...props}>
      <img
        src={`/logo${isDark ? "-dark" : ""}.svg`}
        className="w-40"
        fetchPriority="high"
        alt="Englitune"
        width={160}
        height={45}
      />
      <p className="hidden md:block text-muted-foreground">{children}</p>
    </div>
  );
};

export default Logo;
