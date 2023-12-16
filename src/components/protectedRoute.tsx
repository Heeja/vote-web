import { Navigate } from "react-router-dom";
import { auth } from "../routes/firebase";
import { useEffect, useState } from "react";
import { User } from "firebase/auth";

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubcribe = auth.onAuthStateChanged((currentUser) => {
      if (currentUser) {
        setIsLoading(false);
        setUser(currentUser);
      } else {
        setUser(null);
      }
    });

    return () => unsubcribe();
  }, []);

  if (isLoading) {
    return null;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  return children;
}
