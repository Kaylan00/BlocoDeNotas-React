import * as Dialog from "@radix-ui/react-dialog";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from 'date-fns/locale';
import { X, Pencil, Save } from "lucide-react";
import { useState } from "react";

interface PropsNoteCard {
    note: {
        id: string;
        title: string;
        date: Date;
        content: string;
    };
    oneNoteDeleted: (id: string) => void;
    updateNote: (id: string, updatedNote: { title: string; content: string }) => void;
}

export function NoteCard({ note, oneNoteDeleted, updateNote }: PropsNoteCard) {
    const [editing, setEditing] = useState(false);
    const [editedTitle, setEditedTitle] = useState(note.title);
    const [editedContent, setEditedContent] = useState(note.content);

    const handleEdit = () => {
        setEditing(true);
    };

    const handleSave = () => {
        const updatedNote = {
            title: editedTitle,
            content: editedContent
        };
        updateNote(note.id, updatedNote);
        setEditing(false);
    };

    return (
        <Dialog.Root>
            <Dialog.Trigger className="rounded-md text-left flex-col bg-slate-800 p-5 gap-3 outline-none overflow-hidden relative hover:ring-2 hover:ring-slate-400 focus-visible:ring-2 focus-visible:ring-cyan-100">
                <h3 className="text-lg font-bold text-cyan-50 mb-2">{note.title}</h3>
                <span className="text-sm font-medium text-slate-300">
                    {formatDistanceToNow(note.date, { locale: ptBR, addSuffix: true })}
                </span>
                <p className="text-sm leading-6 text-slate-400">
                    {note.content}
                </p>

                <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-slate-950/60 to-slate-900/0 pointer-events-none" />
            </Dialog.Trigger>
            <Dialog.Portal>
                <Dialog.Overlay className="inset-0 fixed bg-slate-900/60" />
                <Dialog.Content className="fixed overflow-hidden inset-0 md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 bg-slate-900 md:rounded-md flex flex-col justify-between outline-none h-[75vh]">
                    <Dialog.Close className="rounded-bl-xl absolute right-0 top-0 bg-slate-300 p-1.5 text-slate-900 hover:text-slate-400">
                        <X className="size-5" />
                    </Dialog.Close>
                    <div className="flex flex-1 flex-col p-5 h-full">
                        {editing ? (
                            <>
                                <input
                                    type="text"
                                    className="text-lg font-bold text-cyan-50 mb-4 outline-none bg-transparent border-b border-slate-600"
                                    value={editedTitle}
                                    onChange={(e) => setEditedTitle(e.target.value)}
                                />
                                <textarea
                                    className="leading-6 text-slate-300 w-full h-full resize-none outline-none bg-transparent p-0 m-0 overflow-y-auto"
                                    style={{ wordWrap: 'break-word' }}
                                    value={editedContent}
                                    onChange={(e) => setEditedContent(e.target.value)}
                                />
                            </>
                        ) : (
                            <>
                                <h3 className="text-2xl font-bold text-cyan-50 mb-2">{note.title}</h3>
                                <div className="h-72">
                                    <span className="text-xs text-cyan-200">
                                        {formatDistanceToNow(note.date, { locale: ptBR, addSuffix: true })}
                                    </span>
                                    <div className="border-b-2 border-gray-800" />
                                    <textarea
                                        className="leading-6 text-slate-300 h-full w-full resize-none outline-none bg-transparent mt-3"
                                        readOnly
                                        value={editedContent}
                                        onChange={(e) => setEditedContent(e.target.value)}
                                    />
                                </div>
                            </>
                        )}
                    </div>
                    <div className="flex flex-col">
                        {editing ? (
                            <button
                                type="button"
                                className="w-full bg-slate-300 py-4 text-center text-sm text-slate-900 font-medium group"
                                onClick={handleSave}>
                                <Save className="inline-block mr-2" /> Salvar Edição
                            </button>
                        ) : (
                            <button
                                type="button"
                                className="w-full bg-slate-800 py-4 text-center text-sm text-cyan-100 font-medium group"
                                onClick={handleEdit}
                            >
                                <Pencil className="inline-block mr-2" /> Editar Bloco de Notas
                            </button>
                        )}
                        {!editing && (
                            <button
                                type="button"
                                className="w-full bg-slate-300 py-4 text-center text-sm text-slate-900 font-medium group"
                                onClick={() => oneNoteDeleted(note.id)}>
                                Deseja <span className="text-red-400 group-hover:underline">apagar essa nota</span>?
                            </button>
                        )}
                    </div>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
}

