
import React, { useState, useEffect, useRef } from 'react';
import { X, Bookmark, BookmarkCheck, Volume2, Type, Square, Play, Pause, Download } from 'lucide-react';
import { Question } from '../types';

interface ReaderModalProps {
  question: Question;
  chapterName: string;
  onClose: () => void;
  onToggleBookmark: (id: string) => void;
}

const ReaderModal: React.FC<ReaderModalProps> = ({ question, chapterName, onClose, onToggleBookmark }) => {
  const [fontSize, setFontSize] = useState(18);
  const [isReading, setIsReading] = useState(false);
  const [progress, setProgress] = useState(0);
  const contentRef = useRef<HTMLDivElement>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (contentRef.current) {
        const { scrollTop, scrollHeight, clientHeight } = contentRef.current;
        const total = scrollHeight - clientHeight;
        if (total > 0) {
          setProgress(Math.round((scrollTop / total) * 100));
        }
      }
    };

    const currentRef = contentRef.current;
    if (currentRef) {
      currentRef.addEventListener('scroll', handleScroll);
    }
    return () => currentRef?.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleSpeech = () => {
    if (isReading) {
      window.speechSynthesis.cancel();
      setIsReading(false);
    } else {
      const text = contentRef.current?.innerText || '';
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'bn-BD';
      utterance.onend = () => setIsReading(false);
      utteranceRef.current = utterance;
      window.speechSynthesis.speak(utterance);
      setIsReading(true);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-gray-800 w-full max-w-4xl h-[90vh] flex flex-col rounded-2xl shadow-2xl overflow-hidden">
        
        {/* Progress Bar */}
        <div className="h-1 bg-gray-200 dark:bg-gray-700 w-full">
          <div 
            className="h-full bg-blue-500 transition-all duration-300" 
            style={{ width: `${progress}%` }}
          ></div>
        </div>

        {/* Toolbar */}
        <div className="flex items-center justify-between p-4 border-b dark:border-gray-700">
          <div className="flex items-center space-x-2">
            <button 
              onClick={() => onToggleBookmark(question.id)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full text-blue-500 transition"
            >
              {question.bookmarked ? <BookmarkCheck /> : <Bookmark />}
            </button>
            <button 
              onClick={toggleSpeech}
              className={`p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition ${isReading ? 'text-green-500 animate-pulse' : ''}`}
            >
              {isReading ? <Square className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
            </button>
            <div className="flex items-center border rounded-full px-2 space-x-2 dark:border-gray-600">
              <Type className="w-4 h-4 opacity-50" />
              <button onClick={() => setFontSize(s => Math.max(12, s - 2))} className="p-1 hover:text-blue-500">-</button>
              <span className="text-sm font-mono">{fontSize}</span>
              <button onClick={() => setFontSize(s => Math.min(32, s + 2))} className="p-1 hover:text-blue-500">+</button>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button 
              onClick={handlePrint}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition"
              title="Download as PDF/Print"
            >
              <Download className="w-5 h-5" />
            </button>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-red-100 dark:hover:bg-red-900 text-red-500 rounded-full transition"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Question Header */}
        <div className="px-8 py-6 bg-gray-50 dark:bg-gray-900/50 border-b dark:border-gray-700">
          <p className="text-xs uppercase tracking-widest text-blue-500 font-bold mb-2">{chapterName}</p>
          <h2 className="text-2xl md:text-3xl font-bold leading-tight">{question.title}</h2>
          <div className="flex mt-4 space-x-2">
            {question.tags.map(tag => (
              <span key={tag} className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200 text-xs rounded">#{tag}</span>
            ))}
          </div>
        </div>

        {/* Content Area */}
        <div 
          ref={contentRef}
          className="flex-1 overflow-y-auto px-8 py-8 prose prose-lg dark:prose-invert max-w-none"
          style={{ fontSize: `${fontSize}px`, lineHeight: '1.8' }}
          dangerouslySetInnerHTML={{ __html: question.answerHTML }}
        >
        </div>
        
        {/* Footer info */}
        <div className="p-4 border-t dark:border-gray-700 text-center text-xs opacity-50">
          সর্বশেষ আপডেট: {new Date(question.updatedAt).toLocaleDateString('bn-BD')}
        </div>
      </div>
    </div>
  );
};

export default ReaderModal;
