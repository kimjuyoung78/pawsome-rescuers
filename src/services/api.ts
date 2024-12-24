    //공공 api 가져오는 파일
    import axios from "axios";

    // 환경 변수에서 API 키를 가져옴 Vite와 일반 React 환경 모두 지원, API의 기본 URL 정의
    const API_KEY = import.meta.env.VITE_REACT_APP_SECRET_KEY || process.env.REACT_APP_SECRET_KEY;
    const BASE_URL = 'https://openapi.gg.go.kr/AbdmAnimalProtect';

    // API 응답에서 받을 수 있는 동물 데이터의 구조를 정의
    export interface AnimalData {
        LIST_TOTAL_COUNT: number; // 행총건수
        CODE: string; // 응답결과코드
        MESSAGE: string; // 응답결과메시지
        API_VERSION: string; // API버전
        SIGUN_CD: string; // 시군코드
        SIGUN_NM: string; // 시군명
        ABDM_IDNTFY_NO: string; // 유기고유번호
        RECEPT_DE: string; // 접수일자
        DISCVRY_PLC_INFO: string; // 발견장소
        STATE_NM: string; // 상태
        PBLANC_IDNTFY_NO: string; // 공고고유번호
        PBLANC_BEGIN_DE: string; // 공고시작일자
        PBLANC_END_DE: string; // 공고종료일자
        SPECIES_NM: string; // 품종
        COLOR_NM: string; // 색상
        AGE_INFO: string; // 나이
        BDWGH_INFO: string; // 체중
        SEX_NM: string; // 성별
        NEUT_YN: string; // 중성화여부
        SFETR_INFO: string; // 특징
        SHTER_NM: string; // 보호소명
        SHTER_TELNO: string; // 보호소전화번호
        PROTECT_PLC: string; // 보호장소
        REFINE_ROADNM_ADDR: string; // 보호소도로명주소
        REFINE_LOTNO_ADDR: string; // 보호소지번주소
        REFINE_ZIP_CD: string; // 보호소우편번호
        JURIS_INST_NM: string; // 관할기관
        CHRGPSN_NM: string; // 담당자
        CHRGPSN_CONTCT_NO: string; // 담당자연락처
        PARTCLR_MATR: string; // 특이사항
        IMAGE_COURS: string; // 이미지경로
        THUMB_IMAGE_COURS: string; // 썸네일이미지경로
        REFINE_WGS84_LAT: string; // WGS84위도
        REFINE_WGS84_LOGT: string; // WGS84경도
        }

    // 동물 데이터를 가져오는 비동기 함수
    // 수정: 반환 타입 변경
    // 주석: 특정 ID의 동물 데이터를 가져오는 함수
    export const fetchAnimalDataById = async (id: string): Promise<AnimalData | null> => {
        console.log('Fetching data for animal ID:', id);
        
        try {
            if (!API_KEY) {
                throw new Error('API key is not defined. Please check your environment variables.');
            }
    
            const pSize = 1000;
            let pIndex = 1;
            let found = false;
    
            while (!found) {
                const response = await axios.get(BASE_URL, {
                    params: {
                        Key: API_KEY,
                        Type: 'json',
                        pIndex: pIndex,
                        pSize: pSize
                    }
                });
    
                if (response.data && response.data.AbdmAnimalProtect && response.data.AbdmAnimalProtect[1]) {
                    const animalData = response.data.AbdmAnimalProtect[1].row;
                    const foundAnimal = animalData.find((animal: AnimalData) => animal.ABDM_IDNTFY_NO === id);
                    
                    if (foundAnimal) {
                        return foundAnimal;
                    }
    
                    if (animalData.length < pSize) {
                        // 더 이상 데이터가 없음
                        break;
                    }
    
                    pIndex++;
                } else {
                    console.error('Unexpected API response structure:', response.data);
                    return null;
                }
            }
    
            console.error('Animal not found with ID:', id);
            return null;
        } catch (error) {
            console.error('Error fetching animal data:', error);
            throw error;
        }
    }

    export const fetchAnimalData = async (): Promise<{ data: AnimalData[], totalCount: number }> => {
        // console.log('API_KEY:', API_KEY);

        let allData: AnimalData[] = [];
        let totalCount = 0;
        let pIndex = 1;
        const pSize = 1000; // 한 번에 가져올 최대 데이터 수

        try {
            if (!API_KEY) {
                throw new Error('API key is not defined. Please check your environment variables.');
            }

            while (true) {
                const response = await axios.get(BASE_URL, {
                    params: {
                        Key: API_KEY,
                        Type: 'json',
                        pIndex,
                        pSize,
                    }
                });

                if (response.data && response.data.AbdmAnimalProtect && response.data.AbdmAnimalProtect[1]) {
                    const newData = response.data.AbdmAnimalProtect[1].row;
                    allData = [...allData, ...newData];

                    // 첫 번째 응답에서만 전체 데이터 개수를 가져옴
                    if (pIndex === 1) {
                        totalCount = response.data.AbdmAnimalProtect[0].head[0].list_total_count;
                        console.log(`총 데이터 수 : ${totalCount}`);
                    }

                    // 가져온 데이터가 pSize보다 적으면 모든 데이터를 가져온 것으로 간주
                    if (newData.length < pSize) {
                        break;
                    }

                    pIndex++; // 다음 페이지로
                } else {
                    console.error('Unexpected API response structure:', response.data);
                    break;
                }
            }

            console.log(`Total fetched data: ${allData.length}`);
            return { data: allData, totalCount };
        } catch (error) {
            console.error('Error fetching animal data:', error);
            throw error;
        }
    };

//공고 마감 임박 동물 데이터 함수 추가
    export const fetchUrgentAnimals = async (daysThreshold: number = 3): Promise<AnimalData[]> => {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const thresholdDate = new Date(today.getTime() + daysThreshold * 24 * 60 * 60 * 1000);
            thresholdDate.setHours(23, 59, 59, 999);
        
            let pIndex = 1;
            const pSize = 100; // Reduced page size for quicker initial load
            let urgentAnimals: AnimalData[] = [];
        
            while (true) {
            const response = await axios.get(BASE_URL, {
                params: {
                Key: API_KEY,
                Type: 'json',
                pIndex,
                pSize,
                }
            });
        
            if (response.data?.AbdmAnimalProtect?.[1]?.row) {
                const animals: AnimalData[] = response.data.AbdmAnimalProtect[1].row;
                const newUrgentAnimals = animals.filter(animal => {
                const endDate = parseDate(animal.PBLANC_END_DE);
                return endDate >= today && endDate <= thresholdDate;
                });
        
                urgentAnimals.push(...newUrgentAnimals);
        
                if (animals.length < pSize || urgentAnimals.length >= 20) {
                break; 
                }
        
                pIndex++;
            } else {
                console.error('Unexpected API response structure:', response.data);
                break;
            }
            }
        
            return urgentAnimals.slice(0, 20); //최대 20개 데이터
        };
        
        const parseDate = (dateString: string): Date => {
            const year = parseInt(dateString.substring(0, 4));
            const month = parseInt(dateString.substring(4, 6)) - 1;
            const day = parseInt(dateString.substring(6, 8));
            return new Date(year, month, day);
        };
        
    // 새로운 함수: 페이지네이션을 지원하는 fetchAnimalDataPaginated
    export const fetchAnimalDataPaginated = async (page: number, itemsPerPage: number, shelterName: string): Promise<{ data: AnimalData[], totalCount: number }> => {
        try {
            if (!API_KEY) {
                throw new Error('API key is not defined. Please check your environment variables.');
            }
    
            const response = await axios.get(BASE_URL, {
                params: {
                    Key: API_KEY,
                    Type: 'json',
                    pIndex: page,
                    pSize: itemsPerPage,
                    SHTER_NM: shelterName
                }
            });
    
            if (response.data && response.data.AbdmAnimalProtect && response.data.AbdmAnimalProtect[1]) {
                const animalData = response.data.AbdmAnimalProtect[1].row;
                const totalCount = response.data.AbdmAnimalProtect[0].head[0].list_total_count;
                
                return { data: animalData, totalCount };
            } else {
                console.error('Unexpected API response structure:', response.data);
                return { data: [], totalCount: 0 };
            }
        } catch (error) {
            console.error('Error fetching animal data:', error);
            throw error;
        }
    };
    //보호소 데이터만 따로 저장
    export interface IShelter {
        SHTER_NM: string;
        REFINE_WGS84_LAT: number;
        REFINE_WGS84_LOGT: number;
    }
    export const fetchUniqueShelters = async (): Promise<IShelter[]> => {
        try {
            const { data } = await fetchAnimalData();
            const shelterMap = new Map<string, IShelter>();

            data.forEach((animal: AnimalData) => {
                if (animal.SHTER_NM && animal.REFINE_WGS84_LAT && animal.REFINE_WGS84_LOGT) {
                    shelterMap.set(animal.SHTER_NM, {
                        SHTER_NM: animal.SHTER_NM,
                        REFINE_WGS84_LAT: parseFloat(animal.REFINE_WGS84_LAT),
                        REFINE_WGS84_LOGT: parseFloat(animal.REFINE_WGS84_LOGT)
                    });
                }
            });

            return Array.from(shelterMap.values());
        } catch (error) {
            console.error('Error fetching unique shelters:', error);
            throw error;
        }
    };