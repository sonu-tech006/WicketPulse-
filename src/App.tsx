/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';

// Pages
import { HomePage } from './pages/HomePage';
import { LiveScoresPage } from './pages/LiveScoresPage';
import { MatchCenterPage } from './pages/MatchCenterPage';
import { SchedulePage } from './pages/SchedulePage';
import { ResultsPage } from './pages/ResultsPage';
import { SeriesListPage } from './pages/SeriesListPage';
import { SeriesDetailPage } from './pages/SeriesDetailPage';
import { RankingsPage } from './pages/RankingsPage';
import { TeamsListPage } from './pages/TeamsListPage';
import { TeamDetailPage } from './pages/TeamDetailPage';
import { PlayersListPage } from './pages/PlayersListPage';
import { PlayerDetailPage } from './pages/PlayerDetailPage';
import { NewsPage } from './pages/NewsPage';
import { SearchPage } from './pages/SearchPage';
import { AuthPage } from './pages/AuthPage';
import { ProfilePage } from './pages/ProfilePage';
import { FavoritesPage } from './pages/FavoritesPage';
import { SettingsPage } from './pages/SettingsPage';
import { NotFoundPage } from './pages/NotFoundPage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 15,
      refetchOnWindowFocus: false,
    },
  },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <BrowserRouter>
            <div className="min-h-screen flex flex-col bg-[#080D1B] text-slate-100 transition-colors">
              <Header />
              <main className="flex-1">
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/live" element={<LiveScoresPage />} />
                  <Route path="/schedule" element={<SchedulePage />} />
                  <Route path="/results" element={<ResultsPage />} />
                  <Route path="/series" element={<SeriesListPage />} />
                  <Route path="/series/:seriesId" element={<SeriesDetailPage />} />
                  <Route path="/match/:matchId" element={<MatchCenterPage />} />
                  <Route path="/rankings" element={<RankingsPage />} />
                  <Route path="/teams" element={<TeamsListPage />} />
                  <Route path="/teams/:teamId" element={<TeamDetailPage />} />
                  <Route path="/players" element={<PlayersListPage />} />
                  <Route path="/player/:playerId" element={<PlayerDetailPage />} />
                  <Route path="/news" element={<NewsPage />} />
                  <Route path="/search" element={<SearchPage />} />
                  <Route path="/login" element={<AuthPage />} />
                  <Route path="/signup" element={<AuthPage />} />
                  <Route path="/profile" element={<ProfilePage />} />
                  <Route path="/favorites" element={<FavoritesPage />} />
                  <Route path="/settings" element={<SettingsPage />} />
                  <Route path="*" element={<NotFoundPage />} />
                </Routes>
              </main>
              <Footer />
            </div>
          </BrowserRouter>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
