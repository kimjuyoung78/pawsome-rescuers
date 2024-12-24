import { createGlobalStyle, css } from 'styled-components';
import styled from 'styled-components';

const GlobalStyle = createGlobalStyle`

@font-face {
  font-family: 'NanumSquareNeo';
  src: url('/fonts/NanumSquareNeoOTF-Lt.woff') format('woff');
  font-weight: 300;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: 'NanumSquareNeo';
  src: url('/fonts/NanumSquareNeoOTF-Rg.woff') format('woff');
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: 'NanumSquareNeo';
  src: url('/fonts/NanumSquareNeoOTF-Bd.woff') format('woff');
  font-weight: 500;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: 'NanumSquareNeo';
  src: url('/fonts/NanumSquareNeoOTF-Eb.woff') format('woff');
  font-weight: 600;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: 'NanumSquareNeo';
  src: url('/fonts/NanumSquareNeoOTF-Hv.woff') format('woff');
  font-weight: 700;
  font-style: normal;
  font-display: swap;
}


  body, button, input, select, textarea, div {
    font-family: 'NanumSquareNeo', sans-serif !important;
  }

  h1, h2, h3, h4, h5, h6 {
    font-family: 'NanumSquareNeo', sans-serif !important;
    font-weight: 700;
  }


  * {
    box-sizing: border-box;
  }


  a {
    text-decoration: none;
    color: inherit;
  }

  button {
    cursor: pointer;
    border: none;
    background: none;
    font-family: inherit;
  }

  img {
    max-width: 100%;
    height: auto;
  }

  .blue-text {
    color: #008BF0;
  }

  .container {
    width: 1410px;
    margin: 0 auto;
    padding: 0 40px;
  }
`;

export const Container = styled.div`
    padding: 20px;
    max-width: 1200px;
    margin: 10px 10px 10px 120px;
`;

export const Arrow = styled.div`
    width: 30px;
    height: 30px;
`;

export const Pagination = styled.div`
    display: flex;
    justify-content: center;
    margin-top: 20px;
`;

export const PageButton = styled.button<{ active: boolean }>`
    margin: 0 5px;
    padding: 5px 10px;
    border: 2px solid #ccc;
    background-color: ${props => props.active ? '#47b1ff' : 'white'};
    color: ${props => props.active ? 'white' : '#ccc'};
    cursor: pointer;
    border-radius: 5px;

    &:hover {
        background-color: ${props => props.active ? '#47b1ff' :'#47b1ff'};
    }
`;

export const AnimalListContainer = styled.div`
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 15px;
    justify-content: center;
    margin: 0 0 20px 20px;
    padding: 0 20px 20px 20px;
`;

export const Text1 = styled.div`
    width: 100%;
    max-width: 638px;
    color: #323232;
    font-family: 'NanumSquareNeo', sans-serif !important;
    font-size: 26px;
    font-weight: 700;
    line-height: 150%;
    letter-spacing: -1.55px;
    padding-bottom: 20px;
`;


export const ScrapAnimalListContainer = styled.div`
 display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 20px;
    justify-content: center;
    margin: 0 0 20px 20px;
    padding: 0 20px 20px 20px;
`;

export default GlobalStyle;
