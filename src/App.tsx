import { ChangeEvent, useState } from 'react';
import { NewNote } from './components/new-card';
import { NoteCard } from './components/note-card';

interface Note {
  id: string;
  date: Date;
  title: string;
  content: string;
}

export function App() {
  const [search, setSearch] = useState('');
  const [notes, setNotes] = useState<Note[]>(() => {
    const notesOnStorage = localStorage.getItem('notes');
    if (notesOnStorage) {
      return JSON.parse(notesOnStorage);
    }
    return [];
  });

  function oneNoteDeleted(id: string) {
    const notesArray = notes.filter(note => note.id !== id);
    setNotes(notesArray);
    localStorage.setItem('notes', JSON.stringify(notesArray));
  }

  function oneNoteCreated(title: string, content: string) {
    const newNote = {
      id: crypto.randomUUID(),
      date: new Date(),
      title,
      content
    };
    const notesArray = [newNote, ...notes];
    setNotes(notesArray);
    localStorage.setItem('notes', JSON.stringify(notesArray));
  }

  function updateNote(id: string, updatedNote: { title: string; content: string }) {
    const updatedNotes = notes.map(note => {
      if (note.id === id) {
        return {
          ...note,
          title: updatedNote.title,
          content: updatedNote.content
        };
      }
      return note;
    });
    setNotes(updatedNotes);
    localStorage.setItem('notes', JSON.stringify(updatedNotes));
  }

  function handleSearch(event: ChangeEvent<HTMLInputElement>) {
    const query = event.target.value.toLowerCase();
    setSearch(query);
  }

  const notesFilter = search !== ''
  ? notes.filter(note => 
      note.content.toLowerCase().includes(search) ||
      note.title.toLowerCase().includes(search)
    )
  : notes;

  return (
    <div className="mx-auto max-w-6xl my-12 space-y-6 px-5">
      <h1 className="text-sm text-cyan-50">
        Desenvolvido por Kaylan Souza
      </h1>
      <form className="w-full">
        <input
          type="text"
          placeholder="Buscar minhas anotações..."
          className="w-full bg-transparent text-2xl font-semibold outline-none text-slate-200 placeholder:text-slate-400"
          onChange={handleSearch}
        />
      </form>
      <div className="h-0.5 bg-slate-500" />
      <div className="grid grid-cols-1 md:grid-2 lg:grid-cols-3 gap-6 auto-rows-[250px]">
        <NewNote oneNoteCreated={oneNoteCreated} />
        {notesFilter.map(note => (
          <NoteCard key={note.id} note={note} oneNoteDeleted={oneNoteDeleted} updateNote={updateNote} />
        ))}
      </div>
    </div>
  );
}

export default App;
