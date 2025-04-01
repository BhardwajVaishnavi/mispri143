'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ChatBubbleLeftIcon, PaperAirplaneIcon } from '@heroicons/react/24/outline';

interface Note {
  id: string;
  content: string;
  createdBy: string;
  createdAt: string;
}

interface OrderNotesProps {
  notes: Note[];
  onAddNote: () => void;
  newNote: string;
  setNewNote: (note: string) => void;
  isSubmitting: boolean;
}

export default function OrderNotes({ 
  notes, 
  onAddNote, 
  newNote, 
  setNewNote,
  isSubmitting 
}: OrderNotesProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newNote.trim()) {
      onAddNote();
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-4">
        {notes.length === 0 ? (
          <div className="text-center py-6 text-gray-500">
            No notes yet. Add the first note below.
          </div>
        ) : (
          notes.map((note) => (
            <div key={note.id} className="bg-gray-50 rounded-lg p-4">
              <div className="flex justify-between items-start">
                <div className="flex items-start space-x-3">
                  <div className="bg-gray-200 p-2 rounded-full flex-shrink-0">
                    <ChatBubbleLeftIcon className="h-4 w-4 text-gray-500" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-800">{note.content}</p>
                  </div>
                </div>
                <div className="text-xs text-gray-500">
                  <p>{new Date(note.createdAt).toLocaleString()}</p>
                  <p className="text-right">by {note.createdBy}</p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      
      <form onSubmit={handleSubmit} className="mt-4">
        <div className="space-y-2">
          <Textarea
            placeholder="Add a note about this order..."
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            className="min-h-[100px]"
          />
          <div className="flex justify-end">
            <Button 
              type="submit"
              disabled={!newNote.trim() || isSubmitting}
            >
              <PaperAirplaneIcon className="h-4 w-4 mr-2" />
              {isSubmitting ? 'Adding...' : 'Add Note'}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
