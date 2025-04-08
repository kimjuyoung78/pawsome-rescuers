import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { Container } from "../../GlobalStyles";
import ProgressBar, { useProgress } from "../../components/ProgressBar";
import Paw from "../../assets/images/pow.svg";
import Gold from "../../assets/images/matching_images/Gold.svg";
import Diamond from "../../assets/images/matching_images/Diamond.svg";

interface ChoiceBoxProps {
	selected: boolean;
	onClick: () => void;
}
const Matching_2: React.FC = () => {
	const { currentPage, setCurrentPage } = useProgress();
	const navigate = useNavigate();
	const [selectedOption, setSelectedOption] = useState<string | null>(null);

	const handleNextStep = () => {
		if (selectedOption) {
			localStorage.setItem("sex", selectedOption);
			setCurrentPage(currentPage + 1);
			navigate("/matching/test3");
		} else {
			alert("옵션을 선택해 주세요~");
		}
	};
	const handleChoiceClick = (choice: "M" | "F") => {
		setSelectedOption(choice);
		localStorage.setItem("sex", choice);
	};

	return (
		<Container>
			<Container2>
				<ProgressBarWrapper>
					<ProgressBar currentPage={2} totalPages={4} />{" "}
				</ProgressBarWrapper>
				<Explanation>
					백만장자에게 금고를 선물 받았다.
					<br />
					금고 안에 어떤게 한가득 쌓여 있을까?
				</Explanation>

				<ChoiceContainer>
					<ChoiceBox
						onClick={() => handleChoiceClick("M")}
						selected={selectedOption === "M"}
					>
						<BoxImg src={Gold}></BoxImg>
						<Text>황금</Text>
					</ChoiceBox>
					<ChoiceBox
						onClick={() => handleChoiceClick("F")}
						selected={selectedOption === "F"}
					>
						<BoxImg src={Diamond}></BoxImg>
						<Text>다이아</Text>
					</ChoiceBox>
				</ChoiceContainer>
				<NextBtn onClick={handleNextStep}>
					다음
					<PawIcon>
						<img src={Paw} alt="발바닥 구조대 발바닥 이미지" />
					</PawIcon>
				</NextBtn>
			</Container2>
		</Container>
	);
};

export default Matching_2;
const ChoiceContainer = styled.div`
	display: flex;
`;
const ChoiceBox = styled.div<ChoiceBoxProps>`
	width: 214px;
	height: 215px;
	flex-shrink: 0;
	border-radius: 40px;
	border: 4px solid #e5e5e5;
	margin: 30px 15px 30px 15px;
	background: ${(props) =>
		props.selected ? "#e5e5e5" : "var(--Schemes-On-Primary, #FFF)"};
	transition: all 0.3s ease;
	// 옵션: 포커스 시 나타나는 기본 아웃라인도 제거하고 싶다면 추가
	&:focus {
		outline: none;
	}
	&:hover {
		background: #e5e5e5;
		box-shadow: 0px 6px 7px rgba(0, 0, 0, 0.2);
	}
	&:active {
		box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
		transform: translateY(2px);
	}
`;
const BoxImg = styled.img`
	margin: 20px 20px 3px 40px;
	width: 134px;
	height: 134px;
	flex-shrink: 0;
`;
const Text = styled.div`
	padding: 8px 5px 10px 18px;
	margin-left: 25%;
	width: 99px;
	height: 29px;
	flex-shrink: 0;
	color: #323232;
	text-align: center;
	font-family: Inter;
	font-size: 25px;
	font-family: "NanumSquareNeo", sans-serif;
	font-weight: 500;
	line-height: normal;
`;
const Explanation = styled.div`
	width: 761px;
	height: 105px;
	color: #323232;
	text-align: center;
	font-family: "NanumSquareNeo";
	font-size: 30px;
	font-family: "NanumSquareNeo", sans-serif;
	font-weight: 700;
	margin-top: 20px;
	line-height: 42px; /* 107.692% */
	letter-spacing: -1.95px;
`;
const Container2 = styled.div`
	height: 550px;
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

const ProgressBarWrapper = styled.div`
	width: 100%;
	padding: 20px;
	box-sizing: border-box;
`;

// Button: "나의 반려동물 찾기" 버튼을 스타일링합니다.
const NextBtn = styled.button`
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
