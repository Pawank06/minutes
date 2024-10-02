import { useSession } from "next-auth/react";

const useSessionHook = () => {
  const session = useSession();
  if (session.data?.user) {
    return true;
  }
  return false;
};

export default useSessionHook;
