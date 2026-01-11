
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  Home as HomeIcon, 
  BookMarked, 
  Settings, 
  Search, 
  Moon, 
  Sun, 
  ChevronLeft,
  Menu,
  X,
  FileText,
  User
} from 'lucide-react';
import Home from './pages/Home';
import ChapterDetail from './pages/ChapterDetail';
import Bookmarks from './pages/Bookmarks';
import Admin from './pages/Admin';
import { getAppState, saveAppState } from './services/storage';
import { AppState } from './types';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>(getAppState());
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    if (state.darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    saveAppState(state);
  }, [state]);

  const toggleDarkMode = () => {
    setState(prev => ({ ...prev, darkMode: !prev.darkMode }));
  };

  const updateGlobalState = (newState: Partial<AppState>) => {
    setState(prev => ({ ...prev, ...newState }));
  };

  return (
    <HashRouter>
      <div className={`min-h-screen transition-colors duration-300 ${state.darkMode ? 'dark bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-900'}`}>
        
        {/* Navigation Bar */}
        <nav className={`sticky top-0 z-40 w-full border-b backdrop-blur transition-colors duration-300 ${state.darkMode ? 'bg-gray-800/80 border-gray-700' : 'bg-white/80 border-gray-200'}`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16 items-center">
              <div className="flex items-center">
                <button 
                  onClick={() => setIsSidebarOpen(true)}
                  className="p-2 rounded-md lg:hidden"
                >
                  <Menu className="w-6 h-6" />
                </button>
                <Link to="/" className="text-xl font-bold ml-2 lg:ml-0 truncate">
                  সমসাময়িক সমাজতাত্ত্বিক তত্ত্ব
                </Link>
              </div>
              
              <div className="hidden lg:flex items-center space-x-8">
                <Link to="/" className="flex items-center space-x-1 hover:text-blue-500 transition">
                  <HomeIcon className="w-5 h-5" />
                  <span>হোম</span>
                </Link>
                <Link to="/bookmarks" className="flex items-center space-x-1 hover:text-blue-500 transition">
                  <BookMarked className="w-5 h-5" />
                  <span>বুকমার্ক</span>
                </Link>
                <Link to="/admin" className="flex items-center space-x-1 hover:text-blue-500 transition">
                  <User className="w-5 h-5" />
                  <span>এডমিন</span>
                </Link>
              </div>

              <div className="flex items-center space-x-4">
                <button 
                  onClick={toggleDarkMode}
                  className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition"
                >
                  {state.darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                </button>
              </div>
            </div>
          </div>
        </nav>

        {/* Mobile Sidebar */}
        {isSidebarOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div className="fixed inset-0 bg-black/50" onClick={() => setIsSidebarOpen(false)}></div>
            <div className={`fixed inset-y-0 left-0 w-64 shadow-xl transform transition-transform duration-300 ${state.darkMode ? 'bg-gray-800' : 'bg-white'}`}>
              <div className="p-4 flex justify-between items-center border-b border-gray-200 dark:border-gray-700">
                <span className="font-bold">মেনু</span>
                <button onClick={() => setIsSidebarOpen(false)}><X className="w-6 h-6" /></button>
              </div>
              <div className="p-4 space-y-4">
                <Link to="/" onClick={() => setIsSidebarOpen(false)} className="flex items-center space-x-3 p-2 hover:bg-blue-50 dark:hover:bg-blue-900 rounded-md">
                  <HomeIcon className="w-5 h-5" />
                  <span>হোম</span>
                </Link>
                <Link to="/bookmarks" onClick={() => setIsSidebarOpen(false)} className="flex items-center space-x-3 p-2 hover:bg-blue-50 dark:hover:bg-blue-900 rounded-md">
                  <BookMarked className="w-5 h-5" />
                  <span>বুকমার্ক</span>
                </Link>
                <Link to="/admin" onClick={() => setIsSidebarOpen(false)} className="flex items-center space-x-3 p-2 hover:bg-blue-50 dark:hover:bg-blue-900 rounded-md">
                  <User className="w-5 h-5" />
                  <span>এডমিন প্যানেল</span>
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
          <Routes>
            <Route path="/" element={<Home chapters={state.chapters} />} />
            <Route path="/chapter/:id" element={<ChapterDetail chapters={state.chapters} setChapters={(c) => updateGlobalState({ chapters: c })} />} />
            <Route path="/bookmarks" element={<Bookmarks chapters={state.chapters} />} />
            <Route path="/admin" element={<Admin chapters={state.chapters} setChapters={(c) => updateGlobalState({ chapters: c })} />} />
          </Routes>
        </main>

        <footer className={`mt-auto py-8 border-t text-center opacity-70 text-sm ${state.darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <p>© ২০২৪ - সমসাময়িক সমাজতাত্ত্বিক তত্ত্ব | সকল স্বত্ব সংরক্ষিত</p>
        </footer>
      </div>
    </HashRouter>
  );
};

export default App;
