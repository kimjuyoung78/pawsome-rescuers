import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import styled from "styled-components";
import { Text1 } from "../GlobalStyles";
import AnimalDataBox from "../components/DataBox";
import { Link } from "react-router-dom";

interface IData {
	[key: string]: any;
}

const LastOneDay = () => {
	const formatDateToYYYYMMDD = (date: Date) => {
		const year = date.getFullYear();
		let month = (date.getMonth() + 1).toString().padStart(2, "0");
		let day = date.getDate().toString().padStart(2, "0");
		return `${year}${month}${day}`;
	};

	const getTomorrow = () => {
		const today = new Date();
		const tomorrow = new Date(today);
		tomorrow.setDate(today.getDate() + 1);
		return tomorrow;
	};

	const fetchData = async (): Promise<IData[]> => {
		const KEY =
			import.meta.env.VITE_REACT_APP_SECRET_KEY ||
			process.env.REACT_APP_SECRET_KEY;
		const tomorrow = getTomorrow();
		const formattedTomorrow = formatDateToYYYYMMDD(tomorrow);

		const { data } = await axios.get(
			`https://openapi.gg.go.kr/AbdmAnimalProtect?KEY=${KEY}&PBLANC_END_DE=${formattedTomorrow}&Type=json&pSize=20`,
		);
		return data.AbdmAnimalProtect[1].row;
	};

	const { data } = useQuery({
		queryKey: ["LastOneDay"],
		queryFn: fetchData,
	});

	return (
		<LastOneDayPageContainer>
			<SwiperContainerStyle>
				<Text1>공고기한이 얼마 남지 않은 친구들이에요!</Text1>
				<UrgentAnimalContainerStyle>
					{data ? (
						<Swiper
							slidesPerView={5}
							spaceBetween={-45}
							loop={true}
							autoplay={{
								delay: 2500,
								disableOnInteraction: false,
							}}
							navigation={true}
							modules={[Navigation, Autoplay]}
							className="mySwiper"
							breakpoints={{
								600: {
									slidesPerView: 2,
								},
								800: {
									slidesPerView: 3,
								},
								1100: {
									slidesPerView: 4,
								},
								1440: {
									slidesPerView: 5,
								},
								1600: {
									slidesPerView: 6,
								},
							}}
						>
							{data.map((animal: any, index: number) => (
								<SwiperSlide key={index}>
									<Link to={`/animallist/detail/${animal.ABDM_IDNTFY_NO}`}>
										<AnimalDataBox animal={animal} />
									</Link>
								</SwiperSlide>
							))}
						</Swiper>
					) : (
						<NoUrgentAnimalsStyle>
							로딩중이거나, 현재 긴급한 공고가 없습니다.
						</NoUrgentAnimalsStyle>
					)}
				</UrgentAnimalContainerStyle>
			</SwiperContainerStyle>
		</LastOneDayPageContainer>
	);
};

export default LastOneDay;

const LastOneDayPageContainer = styled.div`
	/* 스타일 */
`;

const SwiperContainerStyle = styled.div`
	/* 스타일 */
`;

const UrgentAnimalContainerStyle = styled.div`
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

const NoUrgentAnimalsStyle = styled.div`
	width: 100%;
	text-align: center;
	padding: 10px;
	font-size: 18px;
	color: #666;
`;
