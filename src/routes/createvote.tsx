import { useState } from "react";
import styled from "styled-components";

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

const Input = styled.input``;

const Label = styled.label``;

export default function Createvote() {
  const [doubleOn, setDoubleOn] = useState(false);
  const [locationOn, setLocationOn] = useState(false);
  const [anonyOn, setAnonyOn] = useState(false);

  const [title, setTitle] = useState("");
  const [items, setItems] = useState<string[]>([]);
  const [location, setLocation] = useState("");
  const [limit, setLimit] = useState(0);

  const onSubmit = () => {
    console.log(title, items, doubleOn, location, anonyOn, limit);
    return;
  };

  const addItems = () => {
    setItems((prev) => [...prev, ""]);
  };

  const onChangeItems = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const id = e.target.id;
    items[parseInt(id)] = value;
    setItems([...items]);
  };

  return (
    <Wrapper>
      <InputBox>
        <Label htmlFor="votetitle">투표 이름</Label>
        <Input
          id="votetitle"
          type="text"
          placeholder="Vote title"
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </InputBox>
      {items.map((item, idx) => {
        return (
          <InputBox>
            <Label htmlFor={idx.toString()}>항목</Label>
            <Input
              id={idx.toString()}
              type="textarea"
              value={item}
              onChange={onChangeItems}
            />
          </InputBox>
        );
      })}
      <Input type="button" value="항목 추가" onClick={addItems} />
      <hr />
      <InputBox>
        <Label htmlFor="double">중복 가능</Label>
        <Input
          id="double"
          type="checkbox"
          onClick={() => setDoubleOn((prev) => !prev)}
        />
      </InputBox>
      <InputBox>
        <Label htmlFor="location">위치 지정(반경500m)</Label>
        <Input
          id="location"
          type="checkbox"
          onClick={() => setLocationOn((prev) => !prev)}
          style={locationOn ? { appearance: "none" } : {}}
        />
        {locationOn ? <button>위치정보 지정하기</button> : null}
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
        <Label htmlFor="limit">투표 제한인원</Label>
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
        onClick={onSubmit}
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
