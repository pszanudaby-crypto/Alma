import React, { Suspense, lazy } from 'react';
import { Route, Routes } from 'react-router-dom';
import ScrollToTop from './utils/ScrollToTop.jsx';
import Header from './components/layout/Header.jsx';
import Footer from './components/layout/Footer.jsx';
import RoutePageFallback from './components/ui/RoutePageFallback.jsx';
import Home from './pages/Home.jsx';
import Philosophy from './pages/Philosophy.jsx';
import PhilosophyPage from './pages/PhilosophyPage.jsx';
import Territory from './pages/Territory.jsx';
import NotFound from './pages/NotFound.jsx';
import { ROUTES } from './constants/navigation.js';

/** Тяжёлые страницы отдельными чанками — меньше JS при первом заходе на телефоне. */
const InvestorsPage = lazy(() => import('./pages/investors/index.jsx'));
const ConstructionDiary = lazy(() => import('./pages/diary/index.jsx'));

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
            <Route
              path={ROUTES.support}
              element={(
                <Suspense fallback={<RoutePageFallback />}>
                  <InvestorsPage />
                </Suspense>
              )}
            />
            <Route
              path={ROUTES.constructionDiary}
              element={(
                <Suspense fallback={<RoutePageFallback />}>
                  <ConstructionDiary />
                </Suspense>
              )}
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </>
  );
}
