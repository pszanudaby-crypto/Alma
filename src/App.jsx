import React from 'react';
import { Route, Routes } from 'react-router-dom';
import ScrollToTop from './utils/ScrollToTop.jsx';
import Header from './components/layout/Header.jsx';
import Footer from './components/layout/Footer.jsx';
import Home from './pages/Home.jsx';
import Philosophy from './pages/Philosophy.jsx';
import PhilosophyPage from './pages/PhilosophyPage.jsx';
import Territory from './pages/Territory.jsx';
import Support from './pages/investors/index.jsx';
import ConstructionDiary from './pages/diary/index.jsx';
import NotFound from './pages/NotFound.jsx';
import { ROUTES } from './constants/navigation.js';

export default function App() {
  return (
    <>
      <ScrollToTop />
      <div className="bg-[#F5F4F0] text-[#2D332F] font-sans selection:bg-[#4A5D4E] selection:text-white overflow-x-hidden min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 w-full">
          <Routes>
            <Route path={ROUTES.home} element={<Home />} />
            <Route path={ROUTES.philosophy} element={<PhilosophyPage />} />
            <Route path={ROUTES.rehabilitation} element={<Philosophy />} />
            <Route path={ROUTES.territory} element={<Territory />} />
            <Route path={ROUTES.support} element={<Support />} />
            <Route path={ROUTES.constructionDiary} element={<ConstructionDiary />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </>
  );
}
