// import { doc, runTransaction } from "firebase/firestore";
// import { database } from "../routes/firebase";

export const updateDate = () => {
	// runTransaction(database, async (transaction) => {
	//                 // 트랜잭션 내에서 최신 데이터를 다시 읽어옴
	//                 const voteRef = doc(
	//                     database,
	//                     anony ? "publicVote" : "privateVote",
	//                     id as string
	//                 );
	//                 const currentDoc = await transaction.get(voteRef);
	//                 const currentData = currentDoc.data();
	//                 // 이미 투표했는지 확인
	//                 currentData.completed?.forEach((list) => {
	//                     if (list.id === voterName.id && list.name === voterName.name) {
	//                         throw new Error("이미 투표하셨습니다.");
	//                     }
	//                 });
	//                 // 투표 마감(투표시간 종료, 상태 종료)
	//                 if (
	//                     !currentData.state ||
	//                     currentData.closeTime.toDate() < new Date()
	//                 ) {
	//                     throw new Error("투표가 종료되었습니다.");
	//                 }
	//                 // 투표 반영 값
	//                 const updateItems = [...currentData.items].map((item) => {
	//                     if (selectItem.includes(item.itemName)) {
	//                         return { ...item, score: item.score + 1 };
	//                     }
	//                     return item;
	//                 });
	//                 // 투표자 기록
	//                 const completed = currentData.completed
	//                     ? [...currentData.completed, ...voteMember]
	//                     : voteMember;
	//                 // 투표 반영(업데이트)
	//                 transaction.update(voteRef, { items: updateItems, completed });
	//             })
	//                 .then(() => {
	//                     alert("투표가 완료되었습니다!");
	//                     navigate("/");
	//                 })
	//                 .catch((err) => {
	//                     alert(err.message);
	//                     console.error("Transaction failed: ", err);
	//                 });
};
