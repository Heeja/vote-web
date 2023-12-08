import styled from "styled-components";

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 12px;

  span {
    display: flex;
    justify-content: flex-end;
    gap: 10px;

    p {
      color: tomato;
      font-size: 0.8rem;
    }
  }
  span:last-child {
    display: flex;
    justify-content: center;

    button {
      padding: 0.4rem 1.2rem;
      background: lightyellow;
    }
  }
`;

export const Error = styled.span`
  margin-bottom: 10px;
  color: tomato;
  font-size: 0.8rem;
`;

export const Switcher = styled.span`
  font-size: 0.9rem;
  a {
    color: #4487ff;
  }
`;
