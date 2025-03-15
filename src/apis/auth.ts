import firebase from "firebase/compat/app";

export default function Auth() {
	firebase
		.auth()
		.currentUser?.getIdToken(/* forceRefresh */ true)
		.then(function (idToken) {
			console.log(idToken);
			return idToken;
		})
		.catch(function (error) {
			console.log(error);
			// Handle error
		});
}
