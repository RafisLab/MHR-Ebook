
import React, { useState } from 'react';
import { 
  Lock, Save, Plus, Trash2, Edit3, 
  ChevronRight, ArrowLeft, Download, Upload,
  CheckCircle, AlertCircle
} from 'lucide-react';
import { Chapter, Question, QuestionType } from '../types';
import { ADMIN_PASSWORD } from '../constants';
import RichEditor from '../components/RichEditor';

interface AdminProps {
  chapters: Chapter[];
  setChapters: (chapters: Chapter[]) => void;
}

const Admin: React.FC<AdminProps> = ({ chapters, setChapters }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [view, setView] = useState<'dashboard' | 'edit-chapter' | 'edit-question'>('dashboard');
  const [selectedChapterId, setSelectedChapterId] = useState<string | null>(null);
  const [editingQuestion, setEditingQuestion] = useState<Partial<Question> | null>(null);
  const [toast, setToast] = useState<{ message: string, type: 'success' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
    } else {
      alert('ভুল পাসওয়ার্ড!');
    }
  };

  const handleSaveChapterName = (id: string, newName: string) => {
    const updated = chapters.map(ch => ch.id === id ? { ...ch, name: newName } : ch);
    setChapters(updated);
    showToast('অধ্যায়র নাম আপডেট করা হয়েছে');
  };

  const handleSaveQuestion = () => {
    if (!editingQuestion || !editingQuestion.title || !selectedChapterId) return;

    const newQuestion: Question = {
      id: editingQuestion.id || Date.now().toString(),
      title: editingQuestion.title || '',
      type: editingQuestion.type as QuestionType || 'short',
      answerHTML: editingQuestion.answerHTML || '',
      tags: editingQuestion.tags || [],
      bookmarked: editingQuestion.bookmarked || false,
      updatedAt: Date.now()
    };

    const updatedChapters = chapters.map(ch => {
      if (ch.id === selectedChapterId) {
        const questions = editingQuestion.id 
          ? ch.questions.map(q => q.id === editingQuestion.id ? newQuestion : q)
          : [...ch.questions, newQuestion];
        return { ...ch, questions };
      }
      return ch;
    });

    setChapters(updatedChapters);
    setEditingQuestion(null);
    setView('edit-chapter');
    showToast('প্রশ্ন সফলভাবে সংরক্ষণ করা হয়েছে');
  };

  const handleDeleteQuestion = (chId: string, qId: string) => {
    if (!window.confirm('আপনি কি নিশ্চিত যে এই প্রশ্নটি ডিলিট করতে চান?')) return;
    const updated = chapters.map(ch => {
      if (ch.id === chId) {
        return { ...ch, questions: ch.questions.filter(q => q.id !== qId) };
      }
      return ch;
    });
    setChapters(updated);
    showToast('প্রশ্ন ডিলিট করা হয়েছে');
  };

  const handleExportData = () => {
    const dataStr = JSON.stringify(chapters, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `ebook_backup_${new Date().toISOString()}.json`;
    link.click();
  };

  const handleImportData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        if (Array.isArray(json)) {
          setChapters(json);
          showToast('ডেটা সফলভাবে ইমপোর্ট করা হয়েছে');
        }
      } catch (error) {
        showToast('ভুল ফাইল ফরম্যাট!', 'error');
      }
    };
    reader.readAsText(file);
  };

  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto mt-20 p-8 bg-white dark:bg-gray-800 rounded-3xl shadow-xl space-y-6">
        <div className="text-center space-y-2">
          <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto">
            <Lock className="text-blue-600 dark:text-blue-300" />
          </div>
          <h2 className="text-2xl font-bold">এডমিন লগইন</h2>
          <p className="text-gray-500">প্যানেল এক্সেস করতে পাসওয়ার্ড দিন</p>
        </div>
        <form onSubmit={handleLogin} className="space-y-4">
          <input 
            type="password" 
            placeholder="পাসওয়ার্ড লিখুন..." 
            className="w-full p-4 rounded-xl border dark:bg-gray-700 dark:border-gray-600 outline-none focus:ring-2 focus:ring-blue-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition">প্রবেশ করুন</button>
        </form>
      </div>
    );
  }

  const selectedChapter = chapters.find(c => c.id === selectedChapterId);

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Toast Notification */}
      {toast && (
        <div className={`fixed bottom-8 right-8 flex items-center space-x-2 px-6 py-4 rounded-2xl shadow-2xl z-50 text-white animate-bounce ${toast.type === 'success' ? 'bg-green-600' : 'bg-red-600'}`}>
          {toast.type === 'success' ? <CheckCircle /> : <AlertCircle />}
          <span>{toast.message}</span>
        </div>
      )}

      {/* Admin Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b dark:border-gray-700 pb-6">
        <div>
          <h1 className="text-3xl font-bold">এডমিন কন্ট্রোল প্যানেল</h1>
          <p className="text-gray-500">বইয়ের সকল বিষয়বস্তু এখান থেকে ম্যানেজ করুন</p>
        </div>
        <div className="flex space-x-2">
          <button onClick={handleExportData} className="flex items-center space-x-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 transition">
            <Download size={18} /> <span>এক্সপোর্ট</span>
          </button>
          <label className="flex items-center space-x-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 transition cursor-pointer">
            <Upload size={18} /> <span>ইমপোর্ট</span>
            <input type="file" className="hidden" onChange={handleImportData} />
          </label>
        </div>
      </div>

      {/* View Logic */}
      {view === 'dashboard' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {chapters.map(ch => (
            <div key={ch.id} className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border dark:border-gray-700 space-y-4">
              <div className="flex justify-between items-start">
                <span className="text-xs font-bold text-blue-500">অধ্যায় {ch.id}</span>
                <span className="text-xs opacity-50">{ch.questions.length} প্রশ্ন</span>
              </div>
              <input 
                className="w-full text-lg font-bold bg-transparent focus:underline outline-none"
                defaultValue={ch.name}
                onBlur={(e) => handleSaveChapterName(ch.id, e.target.value)}
              />
              <button 
                onClick={() => { setSelectedChapterId(ch.id); setView('edit-chapter'); }}
                className="w-full py-2 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg text-sm font-bold flex items-center justify-center space-x-1"
              >
                <span>প্রশ্ন ম্যানেজ করুন</span>
                <ChevronRight size={14} />
              </button>
            </div>
          ))}
        </div>
      )}

      {view === 'edit-chapter' && selectedChapter && (
        <div className="space-y-6">
          <button onClick={() => setView('dashboard')} className="flex items-center space-x-1 text-gray-500 hover:text-blue-500">
            <ArrowLeft size={18} /> <span>ড্যাশবোর্ডে ফিরুন</span>
          </button>
          
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">{selectedChapter.name} - প্রশ্নসমূহ</h2>
            <button 
              onClick={() => { setEditingQuestion({ type: 'short', tags: [] }); setView('edit-question'); }}
              className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition"
            >
              <Plus size={18} /> <span>নতুন প্রশ্ন</span>
            </button>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl border dark:border-gray-700 overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-gray-50 dark:bg-gray-900 text-xs font-bold text-gray-500 border-b dark:border-gray-700">
                <tr>
                  <th className="px-6 py-4">টাইটেল</th>
                  <th className="px-6 py-4">টাইপ</th>
                  <th className="px-6 py-4">ট্যাগ</th>
                  <th className="px-6 py-4 text-right">অ্যাকশন</th>
                </tr>
              </thead>
              <tbody className="divide-y dark:divide-gray-700">
                {selectedChapter.questions.map(q => (
                  <tr key={q.id} className="hover:bg-gray-50 dark:hover:bg-gray-900 transition">
                    <td className="px-6 py-4 font-medium">{q.title}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded text-xs ${q.type === 'essay' ? 'bg-purple-100 text-purple-700' : 'bg-orange-100 text-orange-700'}`}>
                        {q.type === 'essay' ? 'রচনামূলক' : 'সংক্ষিপ্ত'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-1 flex-wrap">
                        {q.tags.map(t => <span key={t} className="text-xs opacity-50">#{t}</span>)}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button onClick={() => { setEditingQuestion(q); setView('edit-question'); }} className="p-2 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900 rounded-lg"><Edit3 size={18} /></button>
                      <button onClick={() => handleDeleteQuestion(selectedChapter.id, q.id)} className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900 rounded-lg"><Trash2 size={18} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {view === 'edit-question' && editingQuestion && (
        <div className="space-y-6">
          <button onClick={() => setView('edit-chapter')} className="flex items-center space-x-1 text-gray-500 hover:text-blue-500">
            <ArrowLeft size={18} /> <span>তালিকায় ফিরুন</span>
          </button>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="space-y-2">
                <label className="font-bold text-sm">প্রশ্ন টাইটেল</label>
                <input 
                  type="text" 
                  className="w-full p-4 rounded-xl border dark:bg-gray-700 dark:border-gray-600 outline-none"
                  value={editingQuestion.title || ''}
                  onChange={(e) => setEditingQuestion({ ...editingQuestion, title: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <label className="font-bold text-sm">উত্তর লিখুন (প্রফেশনাল এডিটর)</label>
                <RichEditor 
                  initialValue={editingQuestion.answerHTML || ''}
                  onChange={(html) => setEditingQuestion({ ...editingQuestion, answerHTML: html })}
                />
              </div>
            </div>

            <div className="space-y-6">
              <div className="p-6 bg-white dark:bg-gray-800 rounded-2xl border dark:border-gray-700 space-y-6">
                <div className="space-y-2">
                  <label className="font-bold text-sm">প্রশ্নের ধরণ</label>
                  <select 
                    className="w-full p-3 rounded-lg border dark:bg-gray-700 dark:border-gray-600"
                    value={editingQuestion.type}
                    onChange={(e) => setEditingQuestion({ ...editingQuestion, type: e.target.value as QuestionType })}
                  >
                    <option value="short">সংক্ষিপ্ত প্রশ্ন</option>
                    <option value="essay">রচনামূলক প্রশ্ন</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="font-bold text-sm">ট্যাগ (কমা দিয়ে আলাদা করুন)</label>
                  <input 
                    type="text" 
                    className="w-full p-3 rounded-lg border dark:bg-gray-700 dark:border-gray-600 outline-none"
                    placeholder="e.g. Marx, Globalization"
                    value={editingQuestion.tags?.join(', ') || ''}
                    onChange={(e) => setEditingQuestion({ ...editingQuestion, tags: e.target.value.split(',').map(t => t.trim()) })}
                  />
                </div>

                <button 
                  onClick={handleSaveQuestion}
                  className="w-full py-4 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 transition flex items-center justify-center space-x-2"
                >
                  <Save size={20} /> <span>সেভ করুন</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;
