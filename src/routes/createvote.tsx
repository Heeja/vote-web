import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { addDoc, collection, Timestamp } from "firebase/firestore";

import Googlemaps from "../components/googlemaps";
import Modal from "../components/Modal";

import { database } from "./firebase";
import firebaseSessionStorage from "../util/firebaseSessionStorage";

const Wrapper = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	gap: 8px;
`;

const InputBox = styled.span`
	width: 100%;
	display: flex;
	justify-content: space-between;
	align-content: center;
	gap: 10px;
	align-items: center;
`;

const Input = styled.input`
	border: none;
	border-radius: 0.25rem;
	padding: 0.25rem 0.5rem;
`;

const Label = styled.label``;

export default function Createvote() {
	const navigate = useNavigate();

	const [doubleOn, setDoubleOn] = useState(false);
	const [locationOn, setLocationOn] = useState(false);
	const [anonyOn, setAnonyOn] = useState(false);
	const [mapOn, setMapOn] = useState(false);

	const [title, setTitle] = useState("");
	const [items, setItems] = useState<string[]>([]);
	const [limit, setLimit] = useState(0);

	// user data
	const userData = firebaseSessionStorage();

	const onCreateVote = async () => {
		const submitData = {
			title: title,
			items: [...items],
			doubleOn: doubleOn,
			location: mapOn ? location : "",
			anonyOn: anonyOn,
			limit: limit,
			createTime: Timestamp.fromDate(new Date()),
			createUser: userData.uid,
		};

		// firestore save
		await addDoc(collection(database, "vote"), submitData).then((res) => {
			console.log(res);
			return navigate("/user");
		});
	};

	const addItems = () => {
		if (items.length > 4) {
			alert("입력할 수 있는 항목 수를 초과하였습니다.");
			return;
		}
		setItems((prev) => [...prev, ""]);
	};

	const onChangeItems = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;
		const id = e.target.id;
		if (value.length > 10) {
			alert("항목의 이름 길이가 초과되었습니다.");
			return;
		}
		items[parseInt(id)] = value;
		setItems([...items]);
	};

	return (
		<Wrapper>
			{mapOn ? (
				<Modal
					title="위치 정하기"
					isVisible={mapOn}
					onClose={() => setMapOn(false)}>
					<Googlemaps />
				</Modal>
			) : null}
			<InputBox>
				<Label htmlFor="votetitle" style={{ fontSize: "1.2rem" }}>
					투표 이름
				</Label>
				<Input
					id="votetitle"
					type="text"
					placeholder="Vote title.(최대 30자)"
					required
					value={title}
					onChange={(e) => {
						if (e.target.value.length > 30) return;
						setTitle(e.target.value);
					}}
				/>
			</InputBox>
			{items.map((item, idx) => {
				return (
					<InputBox key={idx}>
						<Label htmlFor={idx.toString()}>항목</Label>
						<Input
							id={idx.toString()}
							type="textarea"
							value={item}
							onChange={onChangeItems}
							placeholder={`${idx + 1}항목. (최대 10자)`}
						/>
						<button
							onClick={() =>
								setItems((prev) => [
									...prev.slice(0, idx),
									...prev.slice(idx + 1, prev.length + 1),
								])
							}>
							X
						</button>
					</InputBox>
				);
			})}
			<Input type="button" value="항목 추가" onClick={addItems} />
			<hr />
			<InputBox>
				<Label htmlFor="double">중복 선택</Label>
				<Input
					id="double"
					type="checkbox"
					onClick={() => setDoubleOn((prev) => !prev)}
				/>
			</InputBox>
			<InputBox>
				<Label htmlFor="location">위치 지정(반경500m)</Label>
				{locationOn ? (
					<button onClick={() => setMapOn(true)}>위치정보 지정하기</button>
				) : null}
				<Input
					id="location"
					type="checkbox"
					onClick={() => setLocationOn((prev) => !prev)}
				/>
			</InputBox>
			<InputBox>
				<Label htmlFor="anonymously">익명 여부</Label>
				<Input
					id="anonymously"
					type="checkbox"
					onClick={() => setAnonyOn((prev) => !prev)}
				/>
			</InputBox>
			<InputBox>
				<Label htmlFor="limit">투표 제한인원 (최대 200명)</Label>
				<Input
					id="limit"
					type="number"
					min="0"
					max="200"
					required
					style={{
						appearance: "none",
						MozAppearance: "none",
						WebkitAppearance: "none",
					}}
					value={limit}
					onChange={(e) => {
						const value = parseInt(e.target.value);
						if (value < 0 || isNaN(value)) {
							setLimit(0);
						} else if (value > 200) {
							setLimit(200);
						} else {
							setLimit(value);
						}
					}}
				/>
			</InputBox>
			<Input
				type="button"
				value={"create"}
				onClick={onCreateVote}
				style={{
					padding: "8px 12px",
					marginTop: "10px",
					fontSize: "16px",
					fontWeight: "600",
				}}
			/>
		</Wrapper>
	);
}
