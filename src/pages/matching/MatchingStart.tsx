import React, { useState, useEffect } from "react";
import styled, { keyframes } from "styled-components";
import { Container, Text1 } from "../../GlobalStyles";
import { useNavigate } from "react-router-dom";
import DogAndHuman1 from "../../assets/images/DogAndHuman1.png";
import DogAndHuman2 from "../../assets/images/DogAndHuman2.png";
import DogAndHuman3 from "../../assets/images/DogAndHuman3.png";
import Paw from "../../assets/images/pow.svg";

const AnimalMatching: React.FC = () => {
	const [currentImageIndex, setCurrentImageIndex] = useState(0);
	const images = [DogAndHuman1, DogAndHuman2, DogAndHuman3];
	const navigate = useNavigate();

	useEffect(() => {
		const interval = setInterval(() => {
			setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
		}, 2000);
		return () => clearInterval(interval);
	}, []);

	const handleMatchingStart = () => {
		navigate("/matching/test1");
	};

	return (
		<Container1>
			<Container2>
				<Text2>
					테스트를 통해
					<br />
					운명의 털친구를 찾아드릴게요!
				</Text2>
				<ImageContainer>
					<FadeImage
						key={currentImageIndex}
						src={images[currentImageIndex]}
						alt={`Animal ${currentImageIndex + 1}`}
					/>
				</ImageContainer>

				<Button onClick={handleMatchingStart}>
					테스트 시작
					<PawIcon>
						<img src={Paw} alt="발바닥 구조대 발바닥 이미지" />
					</PawIcon>
				</Button>
			</Container2>
		</Container1>
	);
};
export default AnimalMatching;

// 전체 컨테이너 스타일링 커스텀

const Container1 = styled(Container)`
	display: flex;
	flex-direction: column;
	justify-content: flex-start;
	align-items: center;
	height: 100vh;
	width: 100%;
	padding: 20px;
	gap: 20px;
`;

const Container2 = styled.div`
	height: 600px;
	width: 900px;
	max-height: 1000px;
	max-width: 1200px;
	margin-left: 10%;
	margin-right: 10%;
	border: 2px solid #e5e5e5;
	border-radius: 20px;
	display: flex;
	flex-direction: column;
	align-items: center;
`;

const ImageContainer = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
	height: 300px;
	width: 300px;
`;

const Text2 = styled(Text1)`
	text-align: center;
	width: 700px;
	font-size: 30px;
	margin-top: 40px;
	margin-bottom: 20px;
`;
const fadeInout = keyframes`
    0% {
        opacity: 0;
    }
    15% {
        opacity: 1;
    }
    85% {
        opacity: 1;
    }
    100% {
        opacity: 0;
    }
`;
const FadeImage = styled.img`
	height: 100%;
	width: 100%;
	margin-left: 60px;
	object-fit: contain;
	animation: ${fadeInout} 2s ease-in-out;
`;

// Button: "나의 반려동물 찾기" 버튼을 스타일링합니다.
const Button = styled.button`
	display: inline-flex;
	height: 45px;
	padding: 16px 32px;
	justify-content: center;
	align-items: center;
	gap: 10px;
	flex-shrink: 0;
	border-radius: 999px;
	background: #008bf0;
	border: none; // 테두리 제거
	box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1); //그림자
	color: #fff;
	font-family: "NanumSquareNeo";
	font-size: 20px;
	font-family: "NanumSquareNeo", sans-serif;
	font-weight: 600;
	line-height: normal;
	letter-spacing: -1.44px;
	margin-top: 20px;
	transition: all 0.3s ease;
	margin-bottom: 10px;
	// 옵션: 포커스 시 나타나는 기본 아웃라인도 제거하고 싶다면 추가
	&:focus {
		outline: none;
	}
	&:hover {
		background: #7ecdff;
		box-shadow: 0px 6px 7px rgba(0, 0, 0, 0.2);
	}
	&:active {
		box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
		transform: translateY(2px);
	}
`;
// PawIcon: 버튼 내의 발바닥 아이콘을 위한 컴포넌트입니다.
const PawIcon = styled.span`
	/* margin-left: 10px; */
	color: white;

	img {
		width: 32px;
		height: 32px;
		object-fit: contain;
	}
`;
