import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { Container } from "../../GlobalStyles";
import Paw from "../../assets/images/pow.svg";
import W from "../../assets/images/matching_images/White.svg";
import BL from "../../assets/images/matching_images/Black.svg";
import G from "../../assets/images/matching_images/Gray.svg";
import Br from "../../assets/images/matching_images/Brown.svg";
import C from "../../assets/images/matching_images/Cheese.svg";
import Three from "../../assets/images/matching_images/TreeColor.svg";
import M from "../../assets/images/matching_images/Mackerel.svg";
import BW from "../../assets/images/matching_images/BlackWhite.svg";
import ProgressBar, { useProgress } from "../../components/ProgressBar";
import { ColorCategory } from "../matching/matchingAlgorithms/Matching_AtherOption";

interface ChoiceBoxProps {
    selected: boolean;
    onClick: () => void;
}

const Matching_4: React.FC = () => {
    const { currentPage, setCurrentPage } = useProgress();
    const navigate = useNavigate();
    const [species, setSpecies] = useState<string | null>(null);
    const [selectedColors, setSelectedColors] = useState<ColorCategory[]>([]);

    useEffect(() => {
        const storedSpecies = localStorage.getItem('species');
        setSpecies(storedSpecies);
        console.log("Current localStorage state:", {
            species: storedSpecies,
            sex: localStorage.getItem('sex'),
            weight: localStorage.getItem('weight')
        });
    }, []);

    const handleColorSelection = (color: ColorCategory) => {
        setSelectedColors(prevColors => {
            if (prevColors.includes(color)) {
                return prevColors.filter(c => c !== color);
            } else {
                return [...prevColors, color];
            }
        });
    };

    const handleNextStep = () => {
        if (selectedColors.length >= 3) {
            localStorage.setItem('colors', JSON.stringify(selectedColors));
            navigate("/matching/loading");
        } else {
            alert("3개 이상의 색상을 선택해주세요.");
        }
    };

    const renderChoiceBox = (color: ColorCategory, image: string, text: string) => (
        <ChoiceBox 
            selected={selectedColors.includes(color)} 
            onClick={() => handleColorSelection(color)}
        >
            <BoxImg src={image} alt={text} />
            <Text>{text}</Text>
        </ChoiceBox>
    );

    const renderChoiceContainer = () => {
        if(species === 'Cat'){
            return (
                <ChoiceContainer>
                    <A>
                        {renderChoiceBox('White', W, '흰색')}
                        {renderChoiceBox('Black', BL, '검은색')}
                        {renderChoiceBox('Gray', G, '회색')}
                        {renderChoiceBox('ThreeColor', Three, '삼색')}
                    </A>
                    <B>
                        {renderChoiceBox('Gold', C, '금색')}
                        {renderChoiceBox('Brown', Br, '갈색')}
                        {renderChoiceBox('BlackWhite', BW, '흑백')}
                        {renderChoiceBox('Mackerel', M, '고등어')}
                    </B>
                </ChoiceContainer>
            );
        } else {
            return (
                <ChoiceContainer>
                    <A>
                        {renderChoiceBox('White', W, '흰색')}
                        {renderChoiceBox('Black', BL, '검은색')}
                        {renderChoiceBox('Gray', G, '회색')}
                    </A>
                    <B>
                        {renderChoiceBox('Gold', C, '금색')}
                        {renderChoiceBox('Brown', Br, '갈색')}
                        {renderChoiceBox('BlackWhite', BW, '흑백')}
                    </B>
                </ChoiceContainer>
            );
        }
    };

    return (
        <Container>
            <Container2>
                <ProgressBarWrapper>
                    <ProgressBar currentPage={4} totalPages={4} />
                </ProgressBarWrapper>
                <Explanation>
                    나를 위한 티셔츠를 고르고 있다.<br/>
                    어떤 색깔이 좋을까? 3개 이상 골라보자!
                </Explanation>
                {renderChoiceContainer()}
                <NextBtn onClick={handleNextStep}>
                    다음
                    <PawIcon>
                        <img src={Paw} alt="발바닥 구조대 발바닥 아이콘" />
                    </PawIcon>
                </NextBtn>
            </Container2>
        </Container>
    );
};

export default Matching_4;

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
    width: 120px;
    height: 120px;
    flex-shrink: 0;
    border-radius: 40px;
    border: 4px solid ${props => props.selected ? '#008bf0' : '#E5E5E5'};
    margin: 10px 10px 5px 10px;
    background: ${props => props.selected ? '#e5e5e5' : 'var(--Schemes-On-Primary, #FFF)'};
    transition: all 0.3s ease;
    cursor: pointer;

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
  margin: 7px 0px 0px 25px; // 하단 여백(padding-bottom) 제거
  width: 65px;
  height: 65px;
  flex-shrink: 0;
`;

const Text = styled.div`
  padding: 5px 30px 0px 5px; // 상단 패딩을 줄임
  width: 140px;
  height: 29px;
  flex-shrink: 0;
  color: #323232;
  text-align: center;
  font-family: Inter;
  font-size: 20px;
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
    margin-bottom: 10px0;
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