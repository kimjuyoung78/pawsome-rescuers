import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { Container } from "../../GlobalStyles";

const MatchingResult: React.FC = () => {
    const [currentQuestion, setCurrentQuestion] = useState(1);
    const totalQuestions = 4;
    const navigate = useNavigate();

    const handleNextStep = () => {
        navigate("/matching/test4");
    }

    return (
        <Container>
            <Container2>
                    <h1>결과 화면은 아직 만들고 있지롱</h1>
            </Container2>
        </Container>
    );
};

export default MatchingResult;
const ChoiceContainer = styled.div`
display: flex;
`;
const ChoiceBox = styled.div`
width: 214px;
height: 215px;
flex-shrink: 0;
border-radius: 40px;
border: 4px solid #E5E5E5;
margin : 30px 15px 30px 15px;
background: var(--Schemes-On-Primary, #FFF);
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
margin:20px 20px 3px 40px;
width: 134px;
height: 134px;
flex-shrink: 0;
`;
const Text = styled.div`
padding : 0px 10px 10px 10px;
margin-left:25%;
width: 99px;
height: 29px;
flex-shrink: 0;
color: #323232;
text-align: center;
font-family: Inter;
font-size: 30px;
font-family: 'NanumSquareNeo', sans-serif;
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
font-family: 'NanumSquareNeo', sans-serif;
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
    border: 2px solid #E5E5E5;
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
    box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);//그림자
	color: #fff;
	font-family: "NanumSquareNeo";
	font-size: 20px;
	font-family: 'NanumSquareNeo', sans-serif;
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