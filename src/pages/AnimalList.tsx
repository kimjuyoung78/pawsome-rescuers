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
import AnimalDataBox from "../components/DataBox";
import FliterDropDown from "../components/FliterDropDown";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loadShelterData } from "../components/shelterSlice";
import { AppDispatch } from "../components/store";
import {
	fetchAnimalData,
	fetchAnimalDataPaginated,
	AnimalData,
} from "../services/api";
import ArrowDropDown from "../assets/images/arrow_drop_down.svg";
import Arrow_left from "../assets/images/Arrow_left.svg";
import Arrow_left_blue from "../assets/images/Arrow_left_blue.svg";
import Arrow_right from "../assets/images/Arrow_right.svg";
import Arrow_right_blue from "../assets/images/Arrow_right_blue.svg";
import LastOneDay from "../components/LastOnaDay";

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
	const [animalData, setAnimalData] = useState<AnimalData[]>([]);
	const [totalCount, setTotalCount] = useState(0);
	const itemsPerPage = 15;
	const dispatch = useDispatch<AppDispatch>();

	useEffect(() => {
		dispatch(loadShelterData());
	}, [dispatch]);

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
		<Container>
			{/*<Text1>공고기한이 얼마 남지 않은 친구들이에요!</Text1>*/}
			{/* UrgentAnimalContainer 대신 LastOneDay 컴포넌트 사용 */}
			<LastOneDay />

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
