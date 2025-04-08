import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { Container } from "../../GlobalStyles";
import Paw from "../../assets/images/pow.svg";
import Key from "../../assets/images/matching_images/Key.svg";
import Carria from "../../assets/images/matching_images/Carria.svg";
import Car from "../../assets/images/matching_images/Car.svg";
import House from "../../assets/images/matching_images/House.svg";
import ProgressBar, { useProgress } from "../../components/ProgressBar";

interface ChoiceBoxProps {
	selected: boolean;
	onClick: () => void;
}

const Matching_3: React.FC = () => {
	const { currentPage, setCurrentPage } = useProgress();
	const navigate = useNavigate();
	const [selectedOption, setSelectedOption] = useState<string | null>(null);

	useEffect(() => {
		console.log("Current localStorage state:", {
			species: localStorage.getItem("species"),
			sex: localStorage.getItem("sex"),
			weight: localStorage.getItem("weight"),
		});
	}, []);

	const handleNextStep = () => {
		if (selectedOption) {
			setCurrentPage(currentPage + 1);
			navigate("/matching/test4");
		} else {
			alert("옵션을 선택해 주세요~");
		}
	};

	const handleChoiceClick = (choice: "AA" | "BB" | "CC" | "DD") => {
		setSelectedOption(choice);
		localStorage.setItem("weight", choice);
		console.log(`Weight set to: ${choice}`);
	};

	return (
		<Container>
			<Container2>
				<ProgressBarWrapper>
					<ProgressBar currentPage={3} totalPages={4} />
				</ProgressBarWrapper>
				<Explanation>
					꿈 속에서 이상한 나라로 가는 문이 눈 앞에 있다.
					<br />이 문의 크기는 얼마날까?
				</Explanation>

				<ChoiceContainer>
					<A>
						<ChoiceBox
							onClick={() => handleChoiceClick("AA")}
							selected={selectedOption === "AA"}
						>
							<BoxImg src={Key}></BoxImg>
							<Text>열쇠 크기</Text>
						</ChoiceBox>
						<ChoiceBox
							onClick={() => handleChoiceClick("BB")}
							selected={selectedOption === "BB"}
						>
							<BoxImg src={Carria}></BoxImg>
							<Text>캐리어 크기</Text>
						</ChoiceBox>
					</A>
					<B>
						<ChoiceBox
							onClick={() => handleChoiceClick("CC")}
							selected={selectedOption === "CC"}
						>
							<BoxImg src={Car}></BoxImg>
							<Text>자동차 크기</Text>
						</ChoiceBox>
						<ChoiceBox
							onClick={() => handleChoiceClick("DD")}
							selected={selectedOption === "DD"}
						>
							<BoxImg src={House}></BoxImg>
							<Text>집 채</Text>
						</ChoiceBox>
					</B>
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

export default Matching_3;
const A = styled.div`
	display: flex;
	justify-content: center;
	width: 100%;
`;
const B = styled.div`
	display: flex;
	justify-content: center;
	width: 100%;
	margin-top: 5px; // 첫 번째 줄과의 간격 조정
`;
const ChoiceContainer = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	width: 100%;
`;
const ChoiceBox = styled.div<ChoiceBoxProps>`
	width: 300px;
	height: 120px;
	display: flex;
	flex-shrink: 0;
	border-radius: 40px;
	border: 4px solid #e5e5e5;
	margin: 10px 10px 5px 10px; // 상하좌우 여백을 동일하게 설정
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
	margin: 5px 0px 10px 20px;
	padding-bottom: 10px;
	width: 110px;
	height: 110px;
	flex-shrink: 0;
`;
const Text = styled.div`
	padding: 40px 0px 10px 0px;
	/* margin-left:25%; */
	width: 140px;
	height: 29px;
	flex-shrink: 0;
	color: #323232;
	text-align: center;
	font-family: Inter;
	font-size: 28px;
	font-family: "NanumSquareNeo", sans-serif;
	font-weight: 500;
	line-height: normal;
`;
const Explanation = styled.div`
	width: 761px;
	height: 105px;
	color: #323232;
	text-align: center;
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
	margin-bottom: 10px0;
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
