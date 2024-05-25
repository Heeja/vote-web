import { DocumentData } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

export default function Detailvote() {
	const { state } = useLocation();
	const [voteInfo, setVoteInfo] = useState<DocumentData>();

	useEffect(() => {
		if (state.voteInfo) {
			const fireBaseTime = new Date(
				state.voteInfo.createTime.seconds * 1000 +
					state.voteInfo.createTime.nanoseconds / 1000000
			);
			setVoteInfo({
				...state.voteInfo,
				createTime: fireBaseTime.toLocaleDateString(),
			});
		}
		return () => {};
	}, [state.voteInfo]);

	return (
		voteInfo && (
			<div>
				<div>Title: {voteInfo.title}</div>
				<div style={{ display: "flex", flexDirection: "column" }}>
					<div>items</div>
					{voteInfo.items.map((item: string) => (
						<div key={item}>{item}</div>
					))}
				</div>
				<div style={{ display: "flex" }}>
					<div>{voteInfo.anonyOn}</div>
					<div>{voteInfo.doubleOn}</div>
					<div>{voteInfo.limit}</div>
					<div>{voteInfo.location}</div>
					<div>{voteInfo.fireBaseTime}</div>
				</div>
			</div>
		)
	);
}
