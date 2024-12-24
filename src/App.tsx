import React from "react";
import GlobalStyles from "./GlobalStyles";
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import styled from "styled-components";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Provider } from 'react-redux';
import { store } from '../src/components/store';

import Header from "./components/common/Header";
import MainPage from "./pages/MainPage";
import AnimalList from "./pages/AnimalList";
import ScrapPage from "./pages/ScrapPage";
import DetailPage from "./pages/DetailPage";
import MatchingStart from "./pages/matching/MatchingStart";
import Matching_1 from "./pages/matching/Matching_1";
import Matching_2 from "./pages/matching/Matching_2";
import Matching_3 from "./pages/matching/Matching_3";
import Matching_4 from "./pages/matching/Matching_4";
import MatchingLoading from "./pages/matching/MatchingLoading";
import MatchingResult from "./pages/matching/MatchingResult";
import AnimalMap from "./pages/AnimaMap";

const queryClient = new QueryClient();

const App: React.FC = () => {
  return (
    <>
      {/* 글로벌스타일 컴포넌트가 가장 위에 위치해야 함 */}
      <GlobalStyles/>
      <QueryClientProvider client={queryClient}>
        <Provider store={store}>
          <Router>
            <AppContainter>
              <Header />
              <Routes>
                <Route path="/" element={<MainPage/>} />
                <Route path="/animallist" element={<AnimalList/>} />
                <Route path="/animallist/detail/:id" element={<DetailPage/>}/>
                <Route path="/animalmap" element={<AnimalMap/>}/>
                <Route path="/matching" element={<MatchingStart/>}/>
                <Route path="/matching/test1" element={<Matching_1/>}/>
                <Route path="/matching/test2" element={<Matching_2/>}/>
                <Route path="/matching/test3" element={<Matching_3/>}/>
                <Route path="/matching/test4" element={<Matching_4/>}/>
                <Route path="/matching/loading" element={<MatchingLoading/>}/>
                <Route path="/matching/result" element={<MatchingResult/>}/>
                <Route path="/scrap" element={<ScrapPage/>}/>
              </Routes>
            </AppContainter>
          </Router>
        </Provider>
      </QueryClientProvider>
    </>
  );
};

export default App;
//npm i styled-components

const AppContainter = styled.div`
    min-height: 100vh;
`