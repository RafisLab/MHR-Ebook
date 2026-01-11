
import React, { useState } from 'react';
import { Bookmark, FileText, Search } from 'lucide-react';
import { Chapter, Question } from '../types';
import ReaderModal from '../components/ReaderModal';

interface BookmarksProps {
  chapters: Chapter[];
}

const Bookmarks: React.FC<BookmarksProps> = ({ chapters }) => {
  const [selectedQuestion, setSelectedQuestion] = useState<{q: Question, ch: string} | null>(null);

  const bookmarkedQuestions: { chapterName: string, question: Question }[] = [];
  chapters.forEach(ch => {
    ch.questions.forEach(q => {
      if (q.bookmarked) bookmarkedQuestions.push({ chapterName: ch.name, question: q });
    });
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">আমার বুকমার্ক</h1>
        <p className="text-gray-500">আপনার সংরক্ষিত প্রশ্নগুলো এখানে পাবেন</p>
      </div>

      {bookmarkedQuestions.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {bookmarkedQuestions.map(({ chapterName, question }) => (
            <div 
              key={question.id}
              onClick={() => setSelectedQuestion({ q: question, ch: chapterName })}
              className="cursor-pointer bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition"
            >
              <div className="flex justify-between items-start mb-2">
                <span className="text-xs font-bold text-blue-500 uppercase tracking-tighter">{chapterName}</span>
                <Bookmark className="w-5 h-5 fill-blue-500 text-blue-500" />
              </div>
              <h4 className="text-lg font-semibold leading-relaxed line-clamp-2">
                {question.title}
              </h4>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-24 bg-white dark:bg-gray-800 rounded-3xl opacity-50 border-2 border-dashed border-gray-200 dark:border-gray-700">
          <Bookmark className="w-12 h-12 mx-auto mb-4" />
          <p>আপনার কোনো বুকমার্ক করা প্রশ্ন নেই</p>
        </div>
      )}

      {selectedQuestion && (
        <ReaderModal 
          question={selectedQuestion.q} 
          chapterName={selectedQuestion.ch}
          onClose={() => setSelectedQuestion(null)}
          onToggleBookmark={() => {}} // Bookmarks page handles this differently usually, but can stay empty for simple UX
        />
      )}
    </div>
  );
};

export default Bookmarks;
