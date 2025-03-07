import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom"; // Link 추가
import {
	Container,
	Arrow,
	Text1,
	Pagination,
	PageButton,
} from "../GlobalStyles";
import { ScrapAnimalListContainer } from "../GlobalStyles";
import styled from "styled-components";
import DataBox from "../components/DataBox";
import { fetchAnimalDataById, AnimalData } from "../services/api";

import Arrow_left from "../assets/images/Arrow_left.svg";
import Arrow_left_blue from "../assets/images/Arrow_left_blue.svg";
import Arrow_right from "../assets/images/Arrow_right.svg";
import Arrow_right_blue from "../assets/images/Arrow_right_blue.svg";
import DogAndCat from "../assets/images/MainPage_Dog_and_Cat.svg";

const ScrapPage: React.FC = () => {
	const [scrapedAnimals, setScrapedAnimals] = useState<AnimalData[]>([]);
	const [currentPage, setCurrentPage] = useState(1);
	const itemsPerPage = 10;

	useEffect(() => {
		const loadScrapedAnimals = async () => {
			const scrapedIds = JSON.parse(
				localStorage.getItem("scrapedAnimals") || "[]",
			);
			const animals = await Promise.all(
				scrapedIds.map((id: string) => fetchAnimalDataById(id)),
			);
			setScrapedAnimals(
				animals.filter((animal): animal is AnimalData => animal !== null),
			);
		};
		loadScrapedAnimals();
	}, []);

	const getCurrentPageItems = () => {
		const startIndex = (currentPage - 1) * itemsPerPage;
		return scrapedAnimals.slice(startIndex, startIndex + itemsPerPage);
	};

	const totalPages = Math.ceil(scrapedAnimals.length / itemsPerPage);

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

	const handleScrapChange = (animalId: string, isScraped: boolean) => {
		if (!isScraped) {
			setScrapedAnimals(
				scrapedAnimals.filter((animal) => animal.ABDM_IDNTFY_NO !== animalId),
			);
		}
	};

	if (scrapedAnimals.length === 0) {
		return (
			<Container2>
				<DogAndCatScrap>
					<img src={DogAndCat} alt="DogAndCat" />
				</DogAndCatScrap>
				<Text2>다시 보고 싶은 친구들을 추가해주세요!</Text2>
			</Container2>
		);
	}

	return (
		<Container2>
			<Text1>친구들에게 관심을 가져 주셔서 감사해요!</Text1>
			<ScrapAnimalListContainer>
				{getCurrentPageItems().map((animal) => (
					<Link
						to={`/animallist/detail/${animal.ABDM_IDNTFY_NO}`}
						key={animal.ABDM_IDNTFY_NO}
					>
						<DataBox animal={animal} onScrapChange={handleScrapChange} />
					</Link>
				))}
			</ScrapAnimalListContainer>
			<Pagination>
				<Arrow onClick={handlePrevPage}>
					<img
						src={currentPage === 1 ? Arrow_left : Arrow_left_blue}
						alt="Previous page"
					/>
				</Arrow>
				{Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
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
		</Container2>
	);
};

export default ScrapPage;

const Container2 = styled(Container)`
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	min-height: 100vh;
	padding-bottom: 8%;
`;

const Text2 = styled(Text1)`
	padding-left: 12%;
`;

const DogAndCatScrap = styled.div`
	width: 381.6px;
	height: 456px;
`;
