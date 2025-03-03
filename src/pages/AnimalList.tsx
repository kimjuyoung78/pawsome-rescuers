import React, { useState, useEffect } from "react";
import {
	Container,
	Arrow,
	Text1,
	AnimalListContainer,
	Pagination,
	PageButton,
} from "../GlobalStyles";
import styled from "styled-components";
import AnimalDataBox from "../components/DataBox"; // 새로운 컴포넌트 import
import FliterDropDown from "../components/FliterDropDown";
import { Link } from "react-router-dom";
import { useDispatch } from 'react-redux';
import { loadShelterData } from '../components/shelterSlice';
import { AppDispatch } from '../components/store';

import {
	fetchAnimalData,
	fetchAnimalDataPaginated,
	AnimalData,
	fetchUrgentAnimals,
} from "../services/api"; // API 함수와 타입 import
import { Swiper, SwiperSlide } from "swiper/react";
import { PropagateLoader } from "react-spinners";
import {
	Virtual,
	Navigation,
	Pagination as SwiperPagination,
} from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

import ArrowDropDown from "../assets/images/arrow_drop_down.svg";
import Arrow_left from "../assets/images/Arrow_left.svg";
import Arrow_left_blue from "../assets/images/Arrow_left_blue.svg";
import Arrow_right from "../assets/images/Arrow_right.svg";
import Arrow_right_blue from "../assets/images/Arrow_right_blue.svg";

type FilterOptionsType = {
	[key: string]: string[];
};

const filterOptions: FilterOptionsType = {
	시도군: [
		"수원시",
		"성남시",
		"용인시",
		"부천시",
		"화성시",
		"평택시",
		"고양시",
		"남양주시",
		"오산시",
		"의정부시",
		"안양시",
		"광명시",
		"군포시",
		"이천시",
		"시흥시",
		"양주시",
		"하남시",
		"포천시",
		"여주시",
		"안산시",
		"김포시",
		"의왕시",
		"구리시",
		"동두천시",
	],
	상태: ["전체", "보호중", "종료"],
	나이: ["1살 미만", "1살~5살", "6살~9살", "10살 이상"],
	성별: ["남아", "여아"],
	중성화: ["완료", "미완료", "알수없음"],
	품종: ["강아지", "고양이", "그외"],
};

const AnimalList: React.FC = () => {
	const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
	const [currentPage, setCurrentPage] = useState(1);
	const [animalData, setAnimalData] = useState<AnimalData[]>([]); // 현재 페이지의 데이터만 저장
	const [totalCount, setTotalCount] = useState(0); // 전체 데이터 개수
	const [urgentAnimals, setUrgentAnimals] = useState<AnimalData[]>([]);
	const itemsPerPage = 15;
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

	useEffect(() => {
		const loadPagedAnimals = async () => {
			try {
				const result = await fetchAnimalDataPaginated(
					currentPage,
					itemsPerPage,
					"",
				);
				setAnimalData(result.data);
				setTotalCount(result.totalCount);
			} catch (error) {
				console.error("Failed to fetch paged animal data:", error);
			}
		};

		loadPagedAnimals();
	}, [currentPage, itemsPerPage]);

	useEffect(() => {
		const loadAllAnimals = async () => {
			try {
				const allAnimals = await fetchAllAnimalData();
				const filteredUrgentAnimals = getFilteredUrgentAnimals(allAnimals);
				setUrgentAnimals(filteredUrgentAnimals);
			} catch (error) {
				console.error("Failed to fetch all animal data:", error);
			}
		};

		loadAllAnimals();
	}, []);

	useEffect(() => {
		const loadPagedAnimals = async () => {
			try {
				const result = await fetchAnimalDataPaginated(
					currentPage,
					itemsPerPage,
					"",
				);
				setAnimalData(result.data);
				setTotalCount(result.totalCount);
			} catch (error) {
				console.error("Failed to fetch paged animal data:", error);
			}
		};

		loadPagedAnimals();
	}, [currentPage, itemsPerPage]);

	// fetchAllAnimalData 함수 수정
	const fetchAllAnimalData = async () => {
		try {
			const result = await fetchAnimalData();
			return result.data;
		} catch (error) {
			console.error("Failed to fetch all animal data:", error);
			return [];
		}
	};

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
		const fiveDaysLater = new Date(today.getTime() + 1 * 24 * 60 * 60 * 1000);
		fiveDaysLater.setHours(23, 59, 59, 999); // 시간을 23:59:59.999로 설정

		// console.log("오늘 날짜:", today);
		// console.log("5일 후 날짜:", fiveDaysLater);
		// console.log("총 필터링 동물 수 :", animals.length);

		const filteredAnimals = animals.filter((animal) => {
			const endDate = parseDate(animal.PBLANC_END_DE);
			// console.log("Animal ID:", animal.ABDM_IDNTFY_NO);
			// console.log("공고 마감 날짜 : ", animal.PBLANC_END_DE);
			// console.log("내가 정한 마감 날짜 :", endDate);
			const isUrgent = endDate >= today && endDate <= fiveDaysLater;
			console.log("Is urgent:", isUrgent);
			return isUrgent;
		});

		console.log("Filtered urgent animals:", filteredAnimals.length);
		return filteredAnimals;
	};

	const handleMouseEnter = (filter: string) => {
		setActiveDropdown(filter);
	};

	const handleMouseLeave = () => {
		setActiveDropdown(null);
	};

	const handlePrevPage = () => {
		if (currentPage > 1) {
			setCurrentPage(currentPage - 1);
		}
	};

	const handleNextPage = () => {
		if (currentPage < totalPages) {
			setCurrentPage(currentPage + 1);
		}
	};

	// 페이지네이션 버튼을 생성하는 함수
	const getPageNumbers = () => {
		let startPage = Math.max(1, currentPage - 2);
		let endPage = Math.min(totalPages, startPage + 4);

		// 페이지 범위 조정
		if (endPage - startPage < 4) {
			startPage = Math.max(1, endPage - 4);
		}

		return Array.from(
			{ length: endPage - startPage + 1 },
			(_, i) => startPage + i,
		);
	};

	const totalPages = Math.ceil(totalCount / itemsPerPage);

	return (
		<Container>
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

			<FilterContainer>
				{Object.keys(filterOptions).map((filter) => (
					<FilterBoxWrapper
						key={filter}
						onMouseEnter={() => handleMouseEnter(filter)}
						onMouseLeave={handleMouseLeave}
					>
						<FilterBox>
							{filter}
							<img
								src={ArrowDropDown}
								alt="dropdown"
								className="arrow-drop-down"
							/>
						</FilterBox>
						{activeDropdown === filter && (
							<FliterDropDown options={filterOptions[filter]} />
						)}
					</FilterBoxWrapper>
				))}
			</FilterContainer>
			<AnimalListContainer>
        {animalData.map((animal) => (
          <Link
            to={`/animallist/detail/${animal.ABDM_IDNTFY_NO}`}
            key={animal.ABDM_IDNTFY_NO}
          >
            <AnimalDataBox animal={animal} />
          </Link>
        ))}
      </AnimalListContainer>

      <Pagination>
        <Arrow onClick={handlePrevPage}>
          <img
            src={currentPage === 1 ? Arrow_left : Arrow_left_blue}
            alt="Previous page"
          />
        </Arrow>
        {getPageNumbers().map((page) => (
          <PageButton
            key={page}
            onClick={() => setCurrentPage(page)}
            active={currentPage === page}
          >
            {page}
          </PageButton>
        ))}
        <Arrow onClick={handleNextPage}>
          <img
            src={currentPage === totalPages ? Arrow_right : Arrow_right_blue}
            alt="Next page"
          />
        </Arrow>
      </Pagination>
		</Container>
	);
};

export default AnimalList;
const FilterBoxWrapper = styled.div`
    position: relative;
`;
const FilterContainer = styled.div`
	display: flex;
	gap: 10px;
	margin-bottom: 20px;
	padding: 30px 0 10px 30px;
	/* border: 3px solid blue; */
`;
const FilterBox = styled.div`
	width: 76px;
	height: 32px;
	position: relative;
	background-image: url(./rectangle-414.svg);
	background-size: 100% 100%;
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 3px 10px 2px 10px;
	font-size: 13px;
	color: #333;
	cursor: pointer;
	box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
	border-radius: 16px;
	border: 2px solid #bbbbbb;
	font-weight: 600;

	.arrow-drop-down {
		width: 15px;
		height: 15px;
	}
`;

//공고 하루 남은 동물 리스트
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
	z-index: 1000; // 다른 요소들 위에 표시
`;

const LoaderWrapper = styled.div`
	position: absolute;
	top: 20%;
	left: 50%;
	transform: translate(-50%, -50%);
`;