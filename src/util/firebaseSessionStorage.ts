export default function firebaseSessionStorage() {
	let firebaseData;

	for (let i = 0; i < sessionStorage.length; i++) {
		const sessionKey = sessionStorage.key(i);
		if (sessionKey?.match("firebase")) {
			firebaseData = sessionStorage.getItem(sessionKey);
			break;
		}
	}
	return firebaseData ? JSON.parse(firebaseData) : "";
}
