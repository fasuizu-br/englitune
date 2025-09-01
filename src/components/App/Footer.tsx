import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

const Footer = ({
  className,
  children,
  ...props
}: ComponentProps<"footer">) => (
  <footer
    className={cn(
      "flex items-center justify-center gap-2 mt-auto text-xs text-muted-foreground",
      className
    )}
    {...props}
  >
    <span className="space-x-1">
      <span>© {new Date().getFullYear()} Englitune</span>
      <span>·</span>
      <a
        href="https://github.com/silvioprog"
        target="_blank"
        rel="noreferrer"
        className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
      >
        @silvioprog
      </a>
    </span>
    {children}
  </footer>
);

export default Footer;
