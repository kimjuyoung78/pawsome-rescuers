import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../components/store";
import { Container, Pagination, PageButton, Arrow } from "../GlobalStyles";
import Paw from "../assets/images/Paw_blue.svg";
import styled from "styled-components";
import { Map, MapMarker } from "react-kakao-maps-sdk";
import { Link } from "react-router-dom";
import { fetchAnimalDataPaginated, AnimalData } from "../services/api";
import AnimalDataBox from "../components/DataBox";
import FliterDropDown from "../components/FliterDropDown";
import ArrowDropDown from "../assets/images/arrow_drop_down.svg";
import Arrow_left from "../assets/images/Arrow_left.svg";
import Arrow_left_blue from "../assets/images/Arrow_left_blue.svg";
import Arrow_right from "../assets/images/Arrow_right.svg";
import Arrow_right_blue from "../assets/images/Arrow_right_blue.svg";

interface IProps {
	setShelterName?: React.Dispatch<React.SetStateAction<string>>;
}

type FilterOptionsType = {
	[key: string]: string[];
};

const filterOptions: FilterOptionsType = {
	시도군: ["수원시", "성남시", "용인시" /* ... 다른 시도군 ... */],
	상태: ["전체", "보호중", "종료"],
	나이: ["1살 미만", "1살~5살", "6살~9살", "10살 이상"],
	성별: ["남아", "여아"],
	중성화: ["완료", "미완료", "알수없음"],
	품종: ["강아지", "고양이", "그외"],
};

const AnimalMap: React.FC<IProps> = ({ setShelterName }) => {
	const { data: shelterData, status } = useSelector(
		(state: RootState) => state.shelter,
	);
	const GYEONGGI_CENTER = { lat: 37.275, lng: 127.0094 };
	const [selectedShelter, setSelectedShelter] = useState<string | null>(null);
	const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

	const [currentPage, setCurrentPage] = useState(1);
	const [animalData, setAnimalData] = useState<AnimalData[]>([]);
	const [totalCount, setTotalCount] = useState(0);
	const itemsPerPage = 15;

	useEffect(() => {
		const fetchPagedAnimalData = async () => {
			if (selectedShelter) {
				try {
					const result = await fetchAnimalDataPaginated(
						currentPage,
						itemsPerPage,
						selectedShelter,
					);
					setAnimalData(result.data);
					setTotalCount(result.totalCount);
				} catch (error) {
					console.error("Failed to fetch animal data:", error);
				}
			}
		};
		fetchPagedAnimalData();
	}, [selectedShelter, currentPage]);

	// const getCurrentPageData = () => {
	//     const startIndex = (currentPage - 1) * itemsPerPage;
	//     const endIndex = startIndex + itemsPerPage;
	//     return filteredAnimalData.slice(startIndex, endIndex);
	// };

	if (status === "loading") {
		return <LoadingContainer>데이터를 불러오는 중입니다...</LoadingContainer>;
	}

	if (status === "failed") {
		return (
			<LoadingContainer>데이터를 불러오는데 실패했습니다.</LoadingContainer>
		);
	}

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

	const getPageNumbers = () => {
		let startPage = Math.max(1, currentPage - 2);
		let endPage = Math.min(totalPages, startPage + 4);
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
		<Container2>
			<ContentWrapper>
				<Explanation>나와 가까운 보호소를 클릭해 보세요</Explanation>
				<MapContainer>
					<Map
						center={GYEONGGI_CENTER}
						style={{
							width: "100%",
							height: "430px",
							borderRadius: "40px",
							border: "2px solid #e0e0e0",
						}}
						level={10}
					>
						{shelterData.map((shelter, index) => (
							<MapMarker
								key={index}
								position={{
									lat: shelter.REFINE_WGS84_LAT,
									lng: shelter.REFINE_WGS84_LOGT,
								}}
								image={{
									src: Paw,
									size: {
										width: 30,
										height: 30,
									},
								}}
								onClick={() => {
									console.log(shelter.SHTER_NM);
									setSelectedShelter(shelter.SHTER_NM);
									if (setShelterName) {
										setShelterName(shelter.SHTER_NM);
									}
								}}
							/>
						))}
					</Map>
				</MapContainer>
			</ContentWrapper>
			{selectedShelter && (
				<>
					<Text2>{selectedShelter}에서 친구들이 기다리고 있어요</Text2>
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
					<Pagination2>
						<Arrow onClick={handlePrevPage}>
							<img
								src={currentPage === 1 ? Arrow_left : Arrow_left_blue}
								alt="이전 페이지 이미지"
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
								src={
									currentPage === totalPages ? Arrow_right : Arrow_right_blue
								}
								alt="다음 페이지 이미지"
							/>
						</Arrow>
					</Pagination2>
				</>
			)}
		</Container2>
	);
};
export default AnimalMap;
const Pagination2 = styled(Pagination)`
	margin-top: 5%;
`;
const FilterBoxWrapper = styled.div`
	position: relative;
`;

const FilterContainer = styled.div`
	display: flex;
	gap: 10px;
	margin-bottom: 20px;
	padding: 30px 0 10px 30px;
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

const AnimalListContainer = styled.div`
	display: flex;
	flex-wrap: wrap;
	justify-content: space-around;
	gap: 20px;
	margin-top: 20px;
`;

const Container2 = styled(Container)`
	display: flex;
	flex-direction: column;
	justify-content: flex-start;
	align-items: center;
	width: 100%;
	padding: 20px;
	box-sizing: border-box;
`;

const ContentWrapper = styled.div`
	display: flex;
	flex-direction: column;
	width: 100%;
	max-width: 1200px;
	margin-bottom: 20px;
`;

const MapContainer = styled.div`
	width: 100%;
	margin-top: 20px;
`;

const Explanation = styled.div`
	color: #323232;
	font-size: 30px;
	font-family: "NanumSquareNeo", sans-serif;
	font-weight: 700;
	line-height: 42px;
	letter-spacing: -1.95px;
	text-align: left;
	margin-bottom: 20px;
`;

const Text2 = styled.div`
	color: #323232;
	font-family: "NanumSquareNeo", sans-serif;
	font-size: 28px;
	font-weight: 400;
	line-height: 20px;
	letter-spacing: -2.4px;
	margin-top: 20px;
	text-align: center;
`;

const LoadingContainer = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
	height: 100vh;
	font-size: 20px;
	font-weight: bold;
`;
