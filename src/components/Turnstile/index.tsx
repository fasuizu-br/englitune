import { type ComponentProps } from "react";
import { Turnstile as TurnstileComponent } from "@marsidev/react-turnstile";
import useTheme from "@/hooks/useTheme";

const TURNSTILE_SITE_KEY = import.meta.env.VITE_TURNSTILE_SITE_KEY;

const Turnstile = ({
  onVerify,
  ...props
}: Omit<ComponentProps<typeof TurnstileComponent>, "siteKey"> & {
  onVerify: (isVerified: boolean) => void;
}) => {
  const { isDark } = useTheme();

  const handleWidgetLoad = () => onVerify(false);

  const handleSuccess = () => onVerify(true);

  const handleExpire = () => onVerify(false);

  const handleError = () => onVerify(false);

  return (
    <TurnstileComponent
      siteKey={TURNSTILE_SITE_KEY}
      options={{
        theme: isDark ? "dark" : "light",
        size: "flexible",
        language: "en"
      }}
      onWidgetLoad={handleWidgetLoad}
      onSuccess={handleSuccess}
      onExpire={handleExpire}
      onError={handleError}
      {...props}
    />
  );
};

export default Turnstile;
