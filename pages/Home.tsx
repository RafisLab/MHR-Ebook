
import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Shuffle, BookOpen, GraduationCap } from 'lucide-react';
import { Chapter, Question } from '../types';

interface HomeProps {
  chapters: Chapter[];
}

const Home: React.FC<HomeProps> = ({ chapters }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleRandomQuestion = () => {
    const allQuestions: { chapterId: string, question: Question }[] = [];
    chapters.forEach(ch => {
      ch.questions.forEach(q => allQuestions.push({ chapterId: ch.id, question: q }));
    });
    
    if (allQuestions.length === 0) {
      alert('কোন প্রশ্ন পাওয়া যায়নি! এডমিন প্যানেল থেকে প্রশ্ন যোগ করুন।');
      return;
    }

    const random = allQuestions[Math.floor(Math.random() * allQuestions.length)];
    navigate(`/chapter/${random.chapterId}?questionId=${random.question.id}`);
  };

  const filteredChapters = chapters.filter(ch => 
    ch.name.includes(searchQuery) || 
    ch.questions.some(q => q.title.includes(searchQuery) || q.tags.some(t => t.includes(searchQuery)))
  );

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Hero Section */}
      <div className="text-center space-y-6 max-w-3xl mx-auto">
        <div className="inline-flex items-center justify-center p-3 bg-blue-100 dark:bg-blue-900 rounded-2xl mb-4">
          <GraduationCap className="w-12 h-12 text-blue-600 dark:text-blue-300" />
        </div>
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight">সমসাময়িক সমাজতাত্ত্বিক তত্ত্ব</h1>
        <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400">
          সমাজবিজ্ঞানের আধুনিক ও সমসাময়িক তত্ত্বগুলো সহজে পড়ার ডিজিটাল ই-বুক
        </p>

        {/* Global Search */}
        <div className="relative group max-w-xl mx-auto mt-8">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition" />
          <input 
            type="text" 
            placeholder="প্রশ্ন বা বিষয় খুঁজুন..." 
            className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:border-blue-500 focus:outline-none transition shadow-lg"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <button 
          onClick={handleRandomQuestion}
          className="inline-flex items-center space-x-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition transform hover:scale-105 shadow-xl"
        >
          <Shuffle className="w-5 h-5" />
          <span>র‍্যান্ডম প্রশ্ন পড়ুন</span>
        </button>
      </div>

      {/* Chapters Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredChapters.map((chapter) => (
          <Link 
            key={chapter.id} 
            to={`/chapter/${chapter.id}`}
            className="group relative bg-white dark:bg-gray-800 p-8 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-xl hover:-translate-y-1 transition duration-300"
          >
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition">
              <BookOpen className="w-16 h-16" />
            </div>
            <div className="space-y-4">
              <span className="text-sm font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest">অধ্যায় {chapter.id}</span>
              <h3 className="text-xl font-bold leading-relaxed">{chapter.name}</h3>
              <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 pt-4 border-t dark:border-gray-700">
                <span className="flex-1">{chapter.questions.length} টি প্রশ্ন</span>
                <span className="group-hover:translate-x-1 transition">পড়ুন →</span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {filteredChapters.length === 0 && (
        <div className="text-center py-20 opacity-50">
          <Search className="w-12 h-12 mx-auto mb-4" />
          <p>আপনার অনুসন্ধানের সাথে মিল পাওয়া যায়নি</p>
        </div>
      )}
    </div>
  );
};

export default Home;
