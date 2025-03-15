import styled, { keyframes } from "styled-components";

// css code
// animation
const pulseKeyframe = keyframes`
  0% {
    opacity: 1;
  }

  50% {
    opacity: 0.4;
  }

  100% {
    opacity: 1;
  }
`;

const waveKeyframe = keyframes`
  0% {
    transform: translateX(-100%);
  }

  50% {
    /* +0.5s of delay between each loop */
    transform: translateX(100%);
  }

  100% {
    transform: translateX(100%);
  }
`;

// component code
interface IProps {
	variant: "rounded";
	animation: "pulse" | "wave";
}

const Skelton = styled.span<{
	variant: "rounded";
	animation?: "pulse" | "wave";
}>`
	width: "100%";
	height: "100%";
	border-radius: ${(props) => `${props.variant === "rounded" && 4}`};
	animation: ${(props) =>
		props.animation &&
		`${
			props.animation === "pulse" &&
			`${pulseKeyframe} 2s ease-in-out 0.5s infinite`
		}
            ${
							props.animation === "wave" &&
							`${waveKeyframe} 2s ease-in-out 0.5s infinite`
						}`};
`;

export default function Skeleton({ variant, animation }: IProps) {
	return <Skelton variant={variant} animation={animation} />;
}
