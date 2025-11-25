import { useEffect, useState } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "@/app/firebase/firebase.config";

export const useUser = () => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);

      if (currentUser) {
        localStorage.setItem("userId", currentUser.uid);
      } else {
        localStorage.removeItem("userId");
      }
    });

    return () => unsubscribe();
  }, []);

  return user;
};
