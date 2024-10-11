import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled, { keyframes } from "styled-components";
import { Link } from "react-router-dom";
import { AnimalData, fetchUrgentAnimals, fetchAnimalData } from "../services/api";
import { Swiper, SwiperSlide } from "swiper/react";
import GogAndCat from "../assets/images/MainPage_Dog_and_Cat.svg";
import Paw from "../assets/images/pow.svg";
import AnimalDataBox from "../components/DataBox"; // 새로운 컴포넌트 import
import { PropagateLoader } from "react-spinners";
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../components/store';
import { loadShelterData } from '../components/shelterSlice';
import { Virtual, Navigation, Pagination as SwiperPagination } from "swiper/modules";
import { Text1 } from "../GlobalStyles";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';
import { Doughnut, Bar } from 'react-chartjs-2';
// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);


//fade 효과
const fadeIn = keyframes`
	from {
		opacity: 0;
		transform: translateY(20px);
	}
	to {
		opacity: 1;
		transform: translateY(0);
	}
`;

const MainPage: React.FC = () => {
	const navigate = useNavigate();
	const [urgentAnimals, setUrgentAnimals] = useState<AnimalData[]>([]);
	const [isLoadingUrgent, setIsLoadingUrgent] = useState(true);
	const dispatch = useDispatch<AppDispatch>();

	useEffect(() => {
		dispatch(loadShelterData());
		}, [dispatch]);
		
		useEffect(() => {
			const loadUrgentAnimals = async () => {
			setIsLoadingUrgent(true);
			try {
				const animals = await fetchUrgentAnimals(1); // 3일 이내 마감되는 동물들
				setUrgentAnimals(animals);
			} catch (error) {
				console.error("Failed to fetch urgent animal data:", error);
			} finally {
				setIsLoadingUrgent(false);
			}
			};
		
			loadUrgentAnimals();
		}, []);

	//공고 데이터 파싱 함수
	const parseDate = (dateString: string): Date => {
		const year = parseInt(dateString.substring(0, 4));
		const month = parseInt(dateString.substring(4, 6)) - 1; // 월은 0부터 시작
		const day = parseInt(dateString.substring(6, 8));
		return new Date(year, month, day);
	};

	const getFilteredUrgentAnimals = (animals: AnimalData[]): AnimalData[] => {
		const today = new Date();
		today.setHours(0, 0, 0, 0); // 시간을 00:00:00으로 설정
		//fivedays 이지만.. 실제 수정은 3일 마감으로 설정
		const fiveDaysLater = new Date(today.getTime() + 2 * 24 * 60 * 60 * 1000);
		fiveDaysLater.setHours(23, 59, 59, 999); // 시간을 23:59:59.999로 설정

		const filteredAnimals = animals.filter((animal) => {
			const endDate = parseDate(animal.PBLANC_END_DE);
			const isUrgent = endDate >= today && endDate <= fiveDaysLater;
			console.log("Is urgent:", isUrgent);
			return isUrgent;
		});

		console.log("Filtered urgent animals:", filteredAnimals.length);
		return filteredAnimals;
	};

	const handleMatching = () => {
		navigate("/matching");
	};

	const [chartData, setChartData] = useState<{
			labels: string[];
			datasets: {
			data: number[];
			backgroundColor: string[];
			hoverBackgroundColor: string[];
			}[];
		}>({
			labels: [],
			datasets: [{
			data: [],
			backgroundColor: [],
			hoverBackgroundColor: []
			}]
		});
		
		useEffect(() => {
			const fetchCityData = async () => {
			try {
				const { data } = await fetchAnimalData();
				const cityCount: { [key: string]: number } = {};
				
				data.forEach((animal: AnimalData) => {
				if (animal.SIGUN_NM) {
					cityCount[animal.SIGUN_NM] = (cityCount[animal.SIGUN_NM] || 0) + 1;
				}
				});
		
				const sortedCities = Object.entries(cityCount)
				.sort((a, b) => b[1] - a[1])
				.slice(0, 10);
		
				const labels = sortedCities.map(([city]) => city);
				const dataValues = sortedCities.map(([, count]) => count);
				const backgroundColors = [
					'#E6E6FA',  // 연한 라벤더
					'#c5ffc5',  // 민트 그린
					'#FFB6C1',  // 파스텔 핑크
					'#FFDAB9',  // 피치
					'#C8A2C8',  // 라일락
					'#AFEEEE',  // 라이트 터쿼이즈
					'#F0E68C',  // 버터스카치
					'#B39EB5',  // 파스텔 퍼플
					'#FBCCE7',  // 더스티 로즈
					'#E0FFFF'   // 라이트 시안
				  ];
				  
				  setChartData({
					labels,
					datasets: [{
					  data: dataValues,
					  backgroundColor: backgroundColors,
					  hoverBackgroundColor: backgroundColors
					}]
				  });
			} catch (error) {
				console.error("Failed to fetch city data:", error);
			}
			};
		
			fetchCityData();
		}, []);
		
		const chartOptions = {
			responsive: true,
			plugins: {
			legend: {
				position: 'right' as const,
			},
			title: {
				display: true,
				text: '지역별 유기동물 현황 (상위 10개 도시)',
			},
			},
		};
		const [statusChartData, setStatusChartData] = useState<{
			labels: string[];
			datasets: {
			  data: number[];
			  backgroundColor: string[];
			  borderColor: string[];
			  borderWidth: number;
			}[];
		  }>({
			labels: [],
			datasets: [{
			  data: [],
			  backgroundColor: [],
			  borderColor: [],
			  borderWidth: 1
			}]
		  });
		
		  useEffect(() => {
			const fetchStatusData = async () => {
			  try {
				const { data } = await fetchAnimalData();
				const statusCount: { [key: string]: number } = {
				  "보호중": 0,
				  "종료(입양)": 0,
				  "종료(자연사)": 0,
				  "종료(반환)": 0,
				  "종료(방사)": 0,
				  "기타": 0
				};
				
				data.forEach((animal: AnimalData) => {
				  if (statusCount.hasOwnProperty(animal.STATE_NM)) {
					statusCount[animal.STATE_NM]++;
				  } else {
					statusCount["기타"]++;
				  }
				});
		
				const labels = Object.keys(statusCount);
				const dataValues = Object.values(statusCount);
				const backgroundColors = [
				  '#E6E6FA', '#c5ffc5', '#FFB6C1', '#FFDAB9', '#C8A2C8', '#AFEEEE'
				];
		
				setStatusChartData({
				  labels,
				  datasets: [{
					data: dataValues,
					backgroundColor: backgroundColors,
					borderColor: backgroundColors.map(color => color.replace('FF', 'CC')),
					borderWidth: 1
				  }]
				});
			  } catch (error) {
				console.error("Failed to fetch status data:", error);
			  }
			};
		
			fetchStatusData();
		  }, []);
		
		  const statusChartOptions = {
			indexAxis: 'y' as const,
			responsive: true,
			plugins: {
			  legend: {
				display: false,
			  },
			  title: {
				display: true,
				text: '유기동물 상태별 현황',
			  },
			},
		  };
	

	return (
		<PageContainer>
			<ContentWrapper>
				<TextContent>
					<Title>
						버려진 아이들과 <LineBreak />
						당신의<BlueTitle>운명적 만남</BlueTitle>, 찾고 계신가요?
					</Title>
					<Subtitle>
						지금 당신의 따뜻한 마음을 기다리는 친구들이 있습니다.
						<br /> 유기동물 입양으로 가족이 되어주세요.
					</Subtitle>
					<Button onClick={handleMatching}>
						나의 반려동물 찾기
						<PawIcon>
							<img src={Paw} />
						</PawIcon>
					</Button>
				</TextContent>
				<AnimalsContainer>
					<img src={GogAndCat} alt="강아지와 고양이" />
				</AnimalsContainer>
			</ContentWrapper>
			<SwiperContainer>
        <Text1>공고기한이 얼마 남지 않은 친구들이에요!</Text1>
        <UrgentAnimalContainer>
			{isLoadingUrgent ? (
				<Container2>
				<LoaderWrapper>
					<PropagateLoader
					color="#7ECDFF"
					cssOverride={{
						transform: "scale(1)",
					}}
					/>
				</LoaderWrapper>
				</Container2>
			) : urgentAnimals.length > 0 ? (
				<Swiper
				modules={[Virtual, Navigation, SwiperPagination]}
				slidesPerView={5}
				spaceBetween={-45}
				slidesOffsetBefore={50}
				navigation={{
					nextEl: ".swiper-button-next",
					prevEl: ".swiper-button-prev",
				}}
				virtual
				>
				{urgentAnimals.map((animal, index) => (
					<SwiperSlide key={animal.ABDM_IDNTFY_NO} virtualIndex={index}>
					<Link to={`/animallist/detail/${animal.ABDM_IDNTFY_NO}`}>
						<AnimalDataBox animal={animal} />
					</Link>
					</SwiperSlide>
				))}
				<div className="swiper-button-prev"></div>
				<div className="swiper-button-next"></div>
				</Swiper>
			) : (
				<NoUrgentAnimals>현재 긴급한 공고가 없습니다.</NoUrgentAnimals>
			)}
			</UrgentAnimalContainer>
		</SwiperContainer>

		<ChartWrapper>
		<ChartContainer>
        <ChartTitle>지역별 유기동물 현황</ChartTitle>
        <Doughnut data={chartData} options={chartOptions} />
     	</ChartContainer>

		 <ChartContainer>
        <ChartTitle>유기동물 상태별 현황</ChartTitle>
        <Bar data={statusChartData} options={statusChartOptions} />
      </ChartContainer>
	  </ChartWrapper>

		</PageContainer>
	);
};

export default MainPage;
const ChartWrapper = styled.div`
	display: flex;
`;
const ChartContainer = styled.div`
  width: 100%;
  max-width: 600px;
  margin: 40px auto;
  padding: 20px;
  border-radius: 10px;

`;

const ChartTitle = styled.h2`
  text-align: center;
  margin-bottom: 20px;
  font-size: 30px;
  color: #333;
  font-family: "NanumSquareNeo", sans-serif;

`;
const Container2 = styled.div`
	position: fixed;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	height: 550px;
	width: 900px;
	max-height: 1000px;
	max-width: 1200px;
	border-radius: 20px;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	background-color: white; // 배경색 추가
	z-index: 1000; // 다른 요소들 위에 표시
`;

const LoaderWrapper = styled.div`
	position: absolute;
	top: 110%;
	left: 50%;
	transform: translate(-50%, -50%);
`;

const SwiperContainer = styled.div`
	/* border:2px solid red; */
`;

const PageContainer = styled.div`
	width: 1410px;
	height: 1080px;
	margin: 0 auto;
	padding: 0 40px; // 좌우 패딩을 줄임
	background-color: white;
	box-sizing: border-box; // 패딩을 너비에 포함
	overflow-x: hidden; // 가로 스크롤 방지
`;

const ContentWrapper = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: center;
	gap: 0;
	padding-top: 5%;
	max-width: 1360px; // 패딩을 고려한 최대 너비
	margin: 0 auto;
`;

const TextContent = styled.div`
  flex: 1;
  padding-left: 80px;
  max-width: 60%;
  margin-top: -100px;
  animation: ${fadeIn} 1s ease-out;
`;

// Title: 메인 제목을 스타일링합니다.
const Title = styled.h1`
  color: #323232;
  font-size: 42px;
  font-weight: 500;
  word-wrap: break-word;
  line-height: 1.2;
`;

const BlueTitle = styled.span`
	color: #008bf0;
	margin-left: 10px; // '당신의'와 '운명적 만남' 사이 간격 조정
`;

const LineBreak = styled.br``;

// Subtitle: 부제목을 스타일링합니다.
const Subtitle = styled.p`
  color: #575757;
  font-size: 18px;
  font-weight: 400;
  line-height: 25px;
  word-wrap: break-word;
`;

// Button: "나의 반려동물 찾기" 버튼을 스타일링합니다.
const Button = styled.button`
	display: inline-flex;
	height: 60px;
	padding: 16px 32px;
	justify-content: center;
	align-items: center;
	gap: 10px;
	flex-shrink: 0;
	border-radius: 999px;
	background: #008bf0;
	border: none; // 테두리 제거
	color: #fff;
	font-size: 22px;
  	font-weight: 600;

	line-height: normal;
	letter-spacing: -1.44px;
	box-shadow: 0px 6px 6px rgba(0, 0, 0, 0.2); //그림자
	transition: all 0.3s ease;

	animation: ${fadeIn}1.2s ease-out;

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

// AnimalsContainer: 동물 이미지들을 감싸는 컨테이너입니다.
const AnimalsContainer = styled.div`
  flex: 1;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  max-width: 40%;
  padding-right: 5%;
  animation: ${fadeIn} 1s ease-out 1s both;
  
  img {
    width: 85%;
    max-width: 500px;
    height: auto;
    object-fit: contain;
  }
`;

const UrgentAnimalContainer = styled.div`
	width: 100%;
	padding: 20px 0;
	margin-bottom: 20px;
	position: relative;

	.swiper-container {
		padding-left: 0;
	}

	.swiper-slide {
		width: auto;
		max-width: 300px;
	}

	.swiper-button-next,
	.swiper-button-prev {
		color: #47b2ff;
	}

	.swiper-button-prev {
		left: 10px;
	}

	.swiper-button-next {
		right: 10px;
	}

	.swiper-pagination {
		color: #333;
	}
`;

const NoUrgentAnimals = styled.div`
	width: 100%;
	text-align: center;
	padding: 10px;
	font-size: 18px;
	color: #666;
`;
