import React, { useState, useEffect } from "react";
import scrapNo from "../assets/images/scrap_no.svg";
import scrapYes from "../assets/images/scrap_yes.svg";
import styled from "styled-components";
import { AnimalData } from '../services/api';
interface DataBoxProps {
    animal: AnimalData;
    onScrapChange?: (animalId: string, isScraped: boolean) => void;
}

const DataBox: React.FC<DataBoxProps> = ({ animal, onScrapChange }) => {
    const [isScraped, setIsScraped] = useState(false);

    const getAge = (ageInfo: string): number => {
        const year = ageInfo.split('(')[0];
        const currentYear = new Date().getFullYear();
        return currentYear - parseInt(year);
    };
    
    const getNeuterStatus = (neutYn: string): string => {
        return neutYn === 'N' ? '중성화 미완료' : '중성화 완료';
    };
    
    useEffect(() => {
        const scrapedAnimals = JSON.parse(localStorage.getItem('scrapedAnimals') || '[]');
        setIsScraped(scrapedAnimals.includes(animal.ABDM_IDNTFY_NO));
    }, [animal.ABDM_IDNTFY_NO]);

    const toggleScrap = (event: React.MouseEvent) => {
        event.stopPropagation();  // 이벤트 전파 중지
        event.preventDefault();   // 기본 동작 방지

        const newScrapState = !isScraped;
        setIsScraped(newScrapState);
        
        const scrapedAnimals = JSON.parse(localStorage.getItem('scrapedAnimals') || '[]');
        if (newScrapState) {
            scrapedAnimals.push(animal.ABDM_IDNTFY_NO);
            window.alert('스크랩 되었습니다.');
        } else {
            const index = scrapedAnimals.indexOf(animal.ABDM_IDNTFY_NO);
            if (index > -1) {
                scrapedAnimals.splice(index, 1);
            }
            window.alert('스크랩이 해제되었습니다.');
        }
        localStorage.setItem('scrapedAnimals', JSON.stringify(scrapedAnimals));

        if (onScrapChange) {
            onScrapChange(animal.ABDM_IDNTFY_NO, newScrapState);
        }
    };

    return (
        <StyledBox>
            <div className="group">
                <div className="overlap">
                    <div className="overlap-group-wrapper">
                        <img 
                            src={animal.IMAGE_COURS} 
                            alt={animal.SPECIES_NM} 
                            className="animal-image"
			    loading="lazy"
                        />
                        <div className="overlap-button">
                            <div className="text-wrapper">{animal.STATE_NM}</div>
                        </div>
                    </div>
                </div>
                <div className="div">
                    <div className="overlap-2">
                        <img 
                            className="scrapIcon" 
                            alt="scrap icon" 
                            src={isScraped ? scrapYes : scrapNo} 
                            onClick={toggleScrap}
                        />
                        <div className="frame-wrapper">
                            <div className="frame">
                                <div className="overlap-3">
                                    <div className="text-wrapper-2">중성화</div>
                                    <div className="text-wrapper-3">시도군</div>
                                    <div className="text-wrapper-4">성별</div>
                                    <div className="text-wrapper-5">나이</div>
                                </div>
                                <div className="overlap-group-2">
                                    <div className="text-wrapper-6">{animal.SEX_NM === 'M' ? '남아' : '여아'}</div>
                                    <div className="text-wrapper-7">{getNeuterStatus(animal.NEUT_YN)}</div>
                                </div>
                                <div className="text-wrapper-8">{animal.SIGUN_NM}</div>
                                <div className="text-wrapper-9">{getAge(animal.AGE_INFO)}살</div>
                            </div>
                        </div>
                    </div>
                    <div className="text-wrapper-10">{animal.SPECIES_NM}</div>
                </div>
            </div>
        </StyledBox>
    );
};

export default DataBox;

const StyledBox = styled.div`
    .group {
        width: 205px;
        height: 320px;
        position: relative;
        border-radius: 20px;
    }

    .overlap {
        height: 177px;
        left: 0;
        top: 0;
        position: absolute;
        width: 190px;
        margin-left: 6px;
    }

    .overlap-group-wrapper {
        position: relative;
        width: 100%;
        height: 177px;
        overflow: hidden;
        border-radius: 20px 20px 0 0;
    }

    .animal-image {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }

    .overlap-button {
        position: absolute;
        top: 10px;
        left: 10px;
        width: auto;
        height: auto;
        padding: 5px 10px;
        background-color: #47b2ff;
        border-radius: 10px;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .overlap-button .text-wrapper {
        color: #ffffff;
        font-family: "Inter-Bold", Helvetica;
        font-size: 11px;
        font-weight: 600;
        letter-spacing: -0.44px;
        margin-top: 1px;
        white-space: nowrap;
    }
	//상단 박스 끝

	.rectangle {
		width: 189.527px;
		height: 176.929px;
		flex-shrink: 0;
		left: 0;
		/* position: absolute; */
		top: 13px;
		border-radius: 20px;
	}

	.div {
		height: 189px;
		left: 6px;
		position: absolute;
		top: 175px;
		width: 171px;
	}

	.overlap-2 {
		height: 176px;
		left: 0;
		position: absolute;
		top: 13px;
		width: 230px;
		justify-content: flex-end;
		padding-left: 90%;
	}
	.scrapIcon {
		width: 20px;
		height: 20px;
		position: absolute; /* 절대 위치 설정 */
		right: 40px; /* 오른쪽에서 10px 떨어짐 */
		top: 0;
		cursor: pointer; /* 클릭 가능함을 표시 */
	}
	.frame-wrapper {
		height: 130px;
		left: 0;
		position: absolute;
		top: 19px;
		width: 171px;
	}
	
	.scrapNo {
		height: 25px;
        width: 16px;
		left: 167px;
		position: absolute;
		top: 0;
		margin-left: 100px;
	}

	.frame {
		position: relative;
	}

	.overlap-3 {
		height: 108px;
		left: 0;
		position: absolute;
		top: 0;
		width: 86px;
	}

	.text-wrapper-2 {
		color: #7f7f7f;
		font-family: "Inter-Medium", Helvetica;
		font-size: 15px;
		font-weight: 500;
		left: 0;
		letter-spacing: -0.6px;
		line-height: 50px;
		position: absolute;
		top: 78px;
		white-space: nowrap;
		width: 86px;
	}

	.text-wrapper-3 {
		color: #7f7f7f;
		font-family: "Inter-Medium", Helvetica;
		font-size: 15px;
		font-weight: 500;
		left: 0;
		letter-spacing: -0.6px;
		line-height: 50px;
		position: absolute;
		top: 26px;
		white-space: nowrap;
		width: 72px;
	}

	.text-wrapper-4 {
		color: #7f7f7f;
		font-family: "Inter-Medium", Helvetica;
		font-size: 15px;
		font-weight: 500;
		left: 0;
		letter-spacing: -0.6px;
		line-height: 50px;
		position: absolute;
		top: 53px;
		white-space: nowrap;
		width: 78px;
	}

	.text-wrapper-5 {
		color: #7f7f7f;
		font-family: "Inter-Medium", Helvetica;
		font-size: 15px;
		font-weight: 500;
		left: 1px;
		letter-spacing: -0.6px;
		line-height: 50px;
		position: absolute;
		top: 0;
		white-space: nowrap;
		width: 71px;
	}

	.overlap-group-2 {
		height: 55px;
		left: 86px;
		position: absolute;
		top: 52px;
		width: 100px;
	}

	.text-wrapper-6 {
		color: #323232;
		font-family: "Inter-Medium", Helvetica;
		font-size: 15px;
		font-weight: 500;
		left: 17px;
		letter-spacing: -0.6px;
		line-height: 50px;
		position: absolute;
		text-align: right;
		top: 0;
		white-space: nowrap;
		width: 83px;
	}

	.text-wrapper-7 {
		color: #323232;
		font-family: "Inter-Medium", Helvetica;
		font-size: 15px;
		font-weight: 500;
		left: 0;
		letter-spacing: -0.6px;
		line-height: 50px;
		position: absolute;
		text-align: right;
		top: 26px;
		white-space: nowrap;
		width: 100px;
	}

	.text-wrapper-8 {
		color: #323232;
		font-family: "Inter-Medium", Helvetica;
		font-size: 15px;
		font-weight: 500;
		left: 94px;
		letter-spacing: -0.6px;
		line-height: 50px;
		position: absolute;
		text-align: right;
		top: 25px;
		white-space: nowrap;
		width: 92px;
	}

	.text-wrapper-9 {
		color: #323232;
		font-family: "Inter-Medium", Helvetica;
		font-size: 15px;
		font-weight: 500;
		left: 146px;
		letter-spacing: -0.6px;
		line-height: 50px;
		position: absolute;
		text-align: right;
		top: -1px;
		white-space: nowrap;
		width: 39px;
	}

	.text-wrapper-10 {
		color: #323232;
		font-family: "Inter-Bold", Helvetica;
		font-size: 20px;
		font-weight: 700;
		left: 1px;
		letter-spacing: -0.8px;
		line-height: 50px;
		position: absolute;
		top: 0;
		white-space: nowrap;
		width: 112px;
	}
`;