import { useParams } from "react-router-dom";
import {
	collection,
	DocumentData,
	getDocs,
	query,
	where,
} from "firebase/firestore";
import { database } from "../routes/firebase";
import { useEffect, useState } from "react";

export default function Vote() {
	const { id } = useParams();
	const [voteData, setVoteData] = useState<DocumentData[]>([]);

	async function getVoteInfo() {
		console.log("함수 시작!");
		try {
			// const docRef = doc(database, `vote/${id}`);
			const queryCollection = collection(database, "vote");
			const collectionWhere = where("__name__", "==", id);
			const fireQuery = query(
				queryCollection,
				collectionWhere,
				where("anonyOn", "==", true)
			);
			const data = await getDocs(fireQuery);

			if (data.empty) {
				console.log("data.empty", data.empty);
				return { success: false, error: "조건에 맞는 문서가 없습니다." };
			}

			console.log(data.docs);
			data.forEach((doc) => {
				console.log(doc);
				setVoteData((prev) => [...prev, doc.data()]);
			});
		} catch (error) {
			console.log(error);
		}
	}

	useEffect(() => {
		console.log(voteData);
	}, [voteData]);

	return (
		<>
			<h1>투표 페이지.</h1>
			<button onClick={getVoteInfo}>실행</button>
			<hr />
			<div>
				<h1>투표 이름</h1>
				<hr />
				<ul>
					<li>1</li>
					<li>2</li>
					<li>3</li>
					<li>4</li>
				</ul>
				<button
					onClick={() => {
						console.log("다시 투표");
					}}>
					다시
				</button>
				<button
					onClick={() => {
						console.log("투표!");
					}}>
					확인
				</button>
			</div>
		</>
	);
}
