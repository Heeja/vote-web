import { Navigate } from "react-router-dom";
import { auth } from "../routes/firebase";
import { useEffect, useState } from "react";
import { signOut, User } from "firebase/auth";

export default function ProtectedRoute({
	children,
}: {
	children: React.ReactNode;
}) {
	const [isLoading, setIsLoading] = useState(true);
	const [user, setUser] = useState<User | null>(null);

	useEffect(() => {
		const unsubcribe = auth.onAuthStateChanged((currentUser) => {
			console.log(currentUser);
			setIsLoading(false);
			if (currentUser) {
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
		signOut(auth).then((res) => console.log(res));
		return <Navigate to="/login" />;
	}

	return children;
}
