import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export const useUser = () => {
  const pathname = usePathname();
  // get user data from local storage via useEffect
  const [user, setUser] = useState(null);

  const onResetUserState = () => {
    // remove user from local storage
    window.localStorage.removeItem('user');
    // set user to null
    setUser(null);
  }

  useEffect(() => {
    const user = window.localStorage.getItem('user');
    if (user) {
      setUser(JSON.parse(user));
    }
  }, [pathname]);

  return { user, onResetUserState };
}