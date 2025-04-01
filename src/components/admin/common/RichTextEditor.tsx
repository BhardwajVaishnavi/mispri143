'use client';

import { useState, useEffect } from 'react';
import { 
  Bold, Italic, Underline, List, ListOrdered, 
  Link, Image, AlignLeft, AlignCenter, AlignRight, 
  Heading1, Heading2, Heading3, Undo, Redo
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
}

export default function RichTextEditor({ value, onChange }: RichTextEditorProps) {
  const [editorContent, setEditorContent] = useState(value);
  
  // Update the editor content when the value prop changes
  useEffect(() => {
    setEditorContent(value);
  }, [value]);
  
  // Update the parent component when the editor content changes
  const handleContentChange = (e: React.FormEvent<HTMLDivElement>) => {
    const content = e.currentTarget.innerHTML;
    setEditorContent(content);
    onChange(content);
  };
  
  // Execute a document command
  const execCommand = (command: string, value: string = '') => {
    document.execCommand(command, false, value);
  };
  
  // Handle formatting commands
  const handleFormat = (command: string, value: string = '') => {
    execCommand(command, value);
  };
  
  // Handle link insertion
  const handleLink = () => {
    const url = prompt('Enter URL:');
    if (url) {
      execCommand('createLink', url);
    }
  };
  
  // Handle image insertion
  const handleImage = () => {
    const url = prompt('Enter image URL:');
    if (url) {
      execCommand('insertImage', url);
    }
  };
  
  return (
    <div className="border rounded-md overflow-hidden">
      {/* Toolbar */}
      <div className="flex flex-wrap gap-1 p-2 border-b bg-gray-50">
        <Button 
          type="button" 
          variant="ghost" 
          size="sm" 
          onClick={() => handleFormat('bold')}
          className="h-8 w-8 p-0"
        >
          <Bold className="h-4 w-4" />
        </Button>
        <Button 
          type="button" 
          variant="ghost" 
          size="sm" 
          onClick={() => handleFormat('italic')}
          className="h-8 w-8 p-0"
        >
          <Italic className="h-4 w-4" />
        </Button>
        <Button 
          type="button" 
          variant="ghost" 
          size="sm" 
          onClick={() => handleFormat('underline')}
          className="h-8 w-8 p-0"
        >
          <Underline className="h-4 w-4" />
        </Button>
        
        <div className="w-px h-8 bg-gray-300 mx-1"></div>
        
        <Button 
          type="button" 
          variant="ghost" 
          size="sm" 
          onClick={() => handleFormat('formatBlock', '<h1>')}
          className="h-8 w-8 p-0"
        >
          <Heading1 className="h-4 w-4" />
        </Button>
        <Button 
          type="button" 
          variant="ghost" 
          size="sm" 
          onClick={() => handleFormat('formatBlock', '<h2>')}
          className="h-8 w-8 p-0"
        >
          <Heading2 className="h-4 w-4" />
        </Button>
        <Button 
          type="button" 
          variant="ghost" 
          size="sm" 
          onClick={() => handleFormat('formatBlock', '<h3>')}
          className="h-8 w-8 p-0"
        >
          <Heading3 className="h-4 w-4" />
        </Button>
        
        <div className="w-px h-8 bg-gray-300 mx-1"></div>
        
        <Button 
          type="button" 
          variant="ghost" 
          size="sm" 
          onClick={() => handleFormat('insertUnorderedList')}
          className="h-8 w-8 p-0"
        >
          <List className="h-4 w-4" />
        </Button>
        <Button 
          type="button" 
          variant="ghost" 
          size="sm" 
          onClick={() => handleFormat('insertOrderedList')}
          className="h-8 w-8 p-0"
        >
          <ListOrdered className="h-4 w-4" />
        </Button>
        
        <div className="w-px h-8 bg-gray-300 mx-1"></div>
        
        <Button 
          type="button" 
          variant="ghost" 
          size="sm" 
          onClick={() => handleFormat('justifyLeft')}
          className="h-8 w-8 p-0"
        >
          <AlignLeft className="h-4 w-4" />
        </Button>
        <Button 
          type="button" 
          variant="ghost" 
          size="sm" 
          onClick={() => handleFormat('justifyCenter')}
          className="h-8 w-8 p-0"
        >
          <AlignCenter className="h-4 w-4" />
        </Button>
        <Button 
          type="button" 
          variant="ghost" 
          size="sm" 
          onClick={() => handleFormat('justifyRight')}
          className="h-8 w-8 p-0"
        >
          <AlignRight className="h-4 w-4" />
        </Button>
        
        <div className="w-px h-8 bg-gray-300 mx-1"></div>
        
        <Button 
          type="button" 
          variant="ghost" 
          size="sm" 
          onClick={handleLink}
          className="h-8 w-8 p-0"
        >
          <Link className="h-4 w-4" />
        </Button>
        <Button 
          type="button" 
          variant="ghost" 
          size="sm" 
          onClick={handleImage}
          className="h-8 w-8 p-0"
        >
          <Image className="h-4 w-4" />
        </Button>
        
        <div className="w-px h-8 bg-gray-300 mx-1"></div>
        
        <Button 
          type="button" 
          variant="ghost" 
          size="sm" 
          onClick={() => handleFormat('undo')}
          className="h-8 w-8 p-0"
        >
          <Undo className="h-4 w-4" />
        </Button>
        <Button 
          type="button" 
          variant="ghost" 
          size="sm" 
          onClick={() => handleFormat('redo')}
          className="h-8 w-8 p-0"
        >
          <Redo className="h-4 w-4" />
        </Button>
      </div>
      
      {/* Editor */}
      <div
        contentEditable
        dangerouslySetInnerHTML={{ __html: editorContent }}
        onInput={handleContentChange}
        className="p-4 min-h-[300px] focus:outline-none"
      />
    </div>
  );
}
