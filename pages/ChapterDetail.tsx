
import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { ChevronLeft, FileText, Bookmark, Clock, Tags } from 'lucide-react';
import { Chapter, Question, QuestionType } from '../types';
import ReaderModal from '../components/ReaderModal';

interface ChapterDetailProps {
  chapters: Chapter[];
  setChapters: (chapters: Chapter[]) => void;
}

const ChapterDetail: React.FC<ChapterDetailProps> = ({ chapters, setChapters }) => {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState<QuestionType>('short');
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null);

  const chapter = chapters.find(c => c.id === id);

  useEffect(() => {
    const qId = searchParams.get('questionId');
    if (qId && chapter) {
      const q = chapter.questions.find(q => q.id === qId);
      if (q) setSelectedQuestion(q);
    }
  }, [searchParams, chapter]);

  if (!chapter) return <div>অধ্যায় পাওয়া যায়নি</div>;

  const filteredQuestions = chapter.questions.filter(q => q.type === activeTab);

  const toggleBookmark = (qId: string) => {
    const updatedChapters = chapters.map(ch => {
      if (ch.id === chapter.id) {
        return {
          ...ch,
          questions: ch.questions.map(q => q.id === qId ? { ...q, bookmarked: !q.bookmarked } : q)
        };
      }
      return ch;
    });
    setChapters(updatedChapters);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* Back button and title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <Link to="/" className="inline-flex items-center text-blue-500 hover:text-blue-600 transition">
          <ChevronLeft className="w-5 h-5" />
          <span>হোমে ফিরে যান</span>
        </Link>
        <h1 className="text-2xl md:text-3xl font-bold">{chapter.name}</h1>
      </div>

      {/* Tabs */}
      <div className="flex p-1 bg-gray-100 dark:bg-gray-800 rounded-xl max-w-md mx-auto">
        <button 
          onClick={() => setActiveTab('short')}
          className={`flex-1 py-3 px-4 rounded-lg font-medium transition ${activeTab === 'short' ? 'bg-white dark:bg-gray-700 shadow-sm text-blue-600 dark:text-blue-400' : 'text-gray-500'}`}
        >
          সংক্ষিপ্ত প্রশ্ন
        </button>
        <button 
          onClick={() => setActiveTab('essay')}
          className={`flex-1 py-3 px-4 rounded-lg font-medium transition ${activeTab === 'essay' ? 'bg-white dark:bg-gray-700 shadow-sm text-blue-600 dark:text-blue-400' : 'text-gray-500'}`}
        >
          রচনামূলক প্রশ্ন
        </button>
      </div>

      {/* Question List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filteredQuestions.map(question => (
          <div 
            key={question.id}
            onClick={() => setSelectedQuestion(question)}
            className="group cursor-pointer bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 bg-blue-50 dark:bg-blue-900/30 rounded-lg text-blue-600 dark:text-blue-400">
                <FileText className="w-5 h-5" />
              </div>
              {question.bookmarked && <Bookmark className="w-5 h-5 fill-blue-500 text-blue-500" />}
            </div>
            <h4 className="text-xl font-semibold leading-relaxed group-hover:text-blue-500 transition line-clamp-2">
              {question.title}
            </h4>
            <div className="flex flex-wrap gap-2 mt-4">
              {question.tags.map(tag => (
                <span key={tag} className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-500 text-xs rounded">#{tag}</span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {filteredQuestions.length === 0 && (
        <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-3xl opacity-50 border-2 border-dashed border-gray-200 dark:border-gray-700">
          <p>এই বিভাগে এখনও কোনো প্রশ্ন যোগ করা হয়নি।</p>
        </div>
      )}

      {selectedQuestion && (
        <ReaderModal 
          question={selectedQuestion} 
          chapterName={chapter.name}
          onClose={() => setSelectedQuestion(null)}
          onToggleBookmark={toggleBookmark}
        />
      )}
    </div>
  );
};

export default ChapterDetail;
