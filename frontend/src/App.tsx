import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { BibleProvider } from './hooks/useBible';
import { SearchProvider } from './hooks/useSearch';
import { AnnotationProvider } from './hooks/useAnnotations';
import { ThemeProvider } from './hooks/useTheme';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import BibleReaderPage from './pages/BibleReaderPage';
import SearchPage from './pages/SearchPage';
import AnnotationsPage from './pages/AnnotationsPage';
import AboutPage from './pages/AboutPage';

function App() {
  return (
    <ThemeProvider>
      <BibleProvider>
        <SearchProvider>
          <AnnotationProvider>
            <Router>
              <div className="App min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
                <Layout>
                  <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/bible" element={<BibleReaderPage />} />
                    <Route path="/bible/:bookId/:chapter" element={<BibleReaderPage />} />
                    <Route path="/search" element={<SearchPage />} />
                    <Route path="/annotations" element={<AnnotationsPage />} />
                    <Route path="/about" element={<AboutPage />} />
                  </Routes>
                </Layout>
              </div>
            </Router>
          </AnnotationProvider>
        </SearchProvider>
      </BibleProvider>
    </ThemeProvider>
  );
}

export default App;

