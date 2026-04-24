import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { Container } from "../../GlobalStyles";
import { PropagateLoader } from "react-spinners";
import Cat1 from "../../assets/images/Cat1.png";
import { fetchAnimalData } from "../../services/api";
import {
	transformAnimalData,
	TransformedAnimalData,
	ColorCategory
} from "../matching/matchingAlgorithms/Matching_AtherOption";

const colorMap: Record<Exclude<ColorCategory, 'Unknown'>, string[]> = {
	White: ['아이보리', '크림', '백색', '백', '흰색', '흰'],
	BlackWhite: ['검백색', '얼룩', '검/흰', '검.백', '검정흰색', '검줄/흰', '백흑색'],
	ThreeColor: ['삼색', '백흑갈색'],
	Mackerel: ['고등어', '반점무늬', '고등어태비'],
	Black: ['흑색', '흑갈', '검정', '회흑', '흑', '블랙탄'],
	Gold: ['노랑색', '황색', '크림색', '치즈색', '치즈', '황갈색'],
	Brown: ['베이지색', '흑갈', '초코', '초코색', '갈', '흑갈색', '연갈색', '갈백'],
	Gray: ['회백색', '쥐색', '검정회색']
};

const MatchingLoading: React.FC = () => {
	const navigate = useNavigate();
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const species = localStorage.getItem('species');
		const sex = localStorage.getItem('sex');
		const weight = localStorage.getItem('weight');
		const colors = JSON.parse(localStorage.getItem('colors') || '[]') as ColorCategory[];

		const fetchAndFilterData = async () => {
		try {
			const { data, totalCount } = await fetchAnimalData();
			// console.log(`Total data count: ${totalCount}`);
			const transformedData: TransformedAnimalData[] = data.map(transformAnimalData);
			const filteredData = transformedData.filter(animal => {
			const speciesMatch = animal.species === species;
			const sexMatch = animal.sex === sex;
			const weightMatch = animal.weightCategory === weight;
			
			const colorMatch = colors.some(selectedColor => 
				animal.colorCategories.includes(selectedColor) ||
				(animal.COLOR_NM && colorMap[selectedColor as keyof typeof colorMap]?.some(keyword => 
				animal.COLOR_NM?.includes(keyword)
				))
			);
			
			return speciesMatch && sexMatch && weightMatch && colorMatch;
			});

			const matchingAnimals = filteredData.slice(0, 3);
			localStorage.setItem('matchingAnimals', JSON.stringify(matchingAnimals));
			setIsLoading(false);
		} catch (error) {
			// console.error("Error fetching animal data:", error);
			setIsLoading(false);
		}
		};

		fetchAndFilterData();
  }, []);

  useEffect(() => {
    if (!isLoading) {
      const timer = setTimeout(() => {
        navigate("/matching/result");
      }, 1000); // 데이터 로딩 완료 후 1초 후 이동

      return () => clearTimeout(timer);
    }
  }, [isLoading, navigate]);

  return (
    <Container>
      <Container2>
        <Explanation>
          어떤 동물이
          <br />
          당신에게 찾아올까요?
        </Explanation>
        <PropagateLoader
          color="#7ECDFF"
          cssOverride={{
            transform: "scale(2) translateY(-20px)",
          }}
        />
        <Cat src={Cat1}></Cat>
      </Container2>
    </Container>
  );
};

export default MatchingLoading;

// Styled components remain the same
const Cat = styled.img`
  margin-left: 10%;
  margin-top: 6%;
  width: 200px;
  height: 200px;
`;

const Explanation = styled.div`
  width: 761px;
  height: 105px;
  color: #323232;
  text-align: center;
  font-family: "NanumSquareNeo";
  font-size: 35px;
  font-family: 'NanumSquareNeo', sans-serif;
  font-weight: 700;
  margin-top: 20px;
  line-height: 42px;
  letter-spacing: -1.95px;
  margin: 10% 0 8% 3%;
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