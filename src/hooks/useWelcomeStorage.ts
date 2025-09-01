import { useLocalStorage } from "usehooks-ts";

const useWelcomeStorage = () => {
  const [shown, setShown] = useLocalStorage<boolean>("englitune-welcome", true);

  const hide = () => setShown(false);

  return { shown, hide };
};

export default useWelcomeStorage;
