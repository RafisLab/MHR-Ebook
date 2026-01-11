
import React, { useRef, useEffect } from 'react';
import { 
  Bold, Italic, Underline, List, ListOrdered, 
  Link as LinkIcon, Undo, Redo, Type, Palette, 
  AlignLeft, AlignCenter, AlignRight 
} from 'lucide-react';

interface RichEditorProps {
  initialValue: string;
  onChange: (html: string) => void;
}

const RichEditor: React.FC<RichEditorProps> = ({ initialValue, onChange }) => {
  const editorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== initialValue) {
      editorRef.current.innerHTML = initialValue;
    }
  }, [initialValue]);

  const exec = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  return (
    <div className="border rounded-lg overflow-hidden dark:border-gray-700 bg-white dark:bg-gray-800">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-1 p-2 bg-gray-50 dark:bg-gray-900 border-b dark:border-gray-700 sticky top-0 z-10">
        <button type="button" onClick={() => exec('undo')} className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"><Undo size={18} /></button>
        <button type="button" onClick={() => exec('redo')} className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"><Redo size={18} /></button>
        <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1"></div>
        
        <button type="button" onClick={() => exec('bold')} className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"><Bold size={18} /></button>
        <button type="button" onClick={() => exec('italic')} className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"><Italic size={18} /></button>
        <button type="button" onClick={() => exec('underline')} className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"><Underline size={18} /></button>
        
        <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1"></div>
        
        <button type="button" onClick={() => exec('insertUnorderedList')} className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"><List size={18} /></button>
        <button type="button" onClick={() => exec('insertOrderedList')} className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"><ListOrdered size={18} /></button>
        
        <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1"></div>
        
        <select 
          onChange={(e) => exec('fontSize', e.target.value)} 
          className="p-1 text-sm bg-transparent border rounded dark:border-gray-600"
        >
          <option value="3">Small</option>
          <option value="4" selected>Normal</option>
          <option value="5">Large</option>
          <option value="6">Huge</option>
        </select>
        
        <input 
          type="color" 
          onChange={(e) => exec('foreColor', e.target.value)} 
          className="w-8 h-8 p-1 cursor-pointer bg-transparent"
        />
        
        <button type="button" onClick={() => {
          const url = prompt('Enter URL:');
          if (url) exec('createLink', url);
        }} className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"><LinkIcon size={18} /></button>
        
        <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1"></div>
        
        <button type="button" onClick={() => exec('justifyLeft')} className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"><AlignLeft size={18} /></button>
        <button type="button" onClick={() => exec('justifyCenter')} className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"><AlignCenter size={18} /></button>
        <button type="button" onClick={() => exec('justifyRight')} className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"><AlignRight size={18} /></button>
      </div>

      {/* Editor Canvas */}
      <div 
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        className="p-6 min-h-[400px] outline-none prose prose-lg dark:prose-invert max-w-none text-lg leading-relaxed"
        style={{ minHeight: '400px' }}
      ></div>
    </div>
  );
};

export default RichEditor;
