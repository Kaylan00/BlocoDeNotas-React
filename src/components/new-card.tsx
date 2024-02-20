import { X } from "lucide-react";
import * as Dialog from "@radix-ui/react-dialog";
import { ChangeEvent, FormEvent, useState } from "react";
import { toast } from "sonner";

interface NewNoteCardProps {
    oneNoteCreated: (title: string, content: string) => void;
}

export function NewNote({ oneNoteCreated }: NewNoteCardProps) {
    const [shouldShowOnboarding, setShouldShowOnboarding] = useState(true);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [isRecording, setIsRecording] = useState(false);
    const [speechRecognition, setSpeechRecognition] = useState<SpeechRecognition | null>(null);

    function handleStartEditor() {
        setShouldShowOnboarding(false);
    }

    function handleTitleChanged(event: ChangeEvent<HTMLInputElement>) {
        setTitle(event.target.value);
    }

    function handleContentChanged(event: ChangeEvent<HTMLTextAreaElement>) {
        setContent(event.target.value);
        if (event.target.value === '') {
            setShouldShowOnboarding(true);
        }
    }

    function handleSaveNote(event: FormEvent) {
        event.preventDefault();

        if (title === "" || content === "") {
            toast.error('Por favor, preencha o título e o conteúdo antes de salvar a nota.');
            return;
        }

        oneNoteCreated(title, content);

        setTitle('');
        setContent('');
        setShouldShowOnboarding(true);

        toast.success('Nota criada com sucesso!');
    }

    function handleToggleRecording() {
        const isSpeechRecognitionAPIAvailable = 'SpeechRecognition' in window || 'webkitSpeechRecognition' in window;

        if (!isSpeechRecognitionAPIAvailable) {
            alert('Infelizmente seu navegador não suporta a API de gravação');
            return;
        }

        setIsRecording(true);
        setShouldShowOnboarding(false);

        const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognition = new SpeechRecognitionAPI();

        recognition.lang = 'pt-BR';
        recognition.continuous = true;
        recognition.maxAlternatives = 1;
        recognition.interimResults = true;

        recognition.onresult = (event) => {
            const transcription = Array.from(event.results).reduce((text, result) => {
                return text.concat(result[0].transcript);
            }, '');
            setContent(transcription);
        };

        setSpeechRecognition(recognition);
        recognition.start();
    }

    function handleStopRecording() {
        setIsRecording(false);

        if (speechRecognition) {
            speechRecognition.stop();
        }
    }

    function handleStartRecording() {
        const isSpeechRecognitionAPIAvailable = 'SpeechRecognition' in window || 'webkitSpeechRecognition' in window;

        if (!isSpeechRecognitionAPIAvailable) {
            alert('Infelizmente seu navegador não suporta a API de gravação');
            return;
        }

        setIsRecording(true);
        setShouldShowOnboarding(false);

        const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognition = new SpeechRecognitionAPI();

        recognition.lang = 'pt-BR';
        recognition.continuous = true;
        recognition.maxAlternatives = 1;
        recognition.interimResults = true;

        if (content.trim() !== '') {
            recognition.continuous = false;
        }

        let accumulatedTranscription = content.trim();

        recognition.onresult = (event) => {
            const lastResultIndex = event.results.length - 1;
            const lastResult = event.results[lastResultIndex];
            const transcription = lastResult[0].transcript;

            if (lastResult.isFinal && transcription.trim() !== '') {
                accumulatedTranscription += ' ' + transcription.trim();
                setContent(accumulatedTranscription);
            }
        };

        setSpeechRecognition(recognition);
        recognition.start();
    }


    return (
        <Dialog.Root>
            <Dialog.Trigger className="rounded-lg flex flex-col text-left bg-slate-300 p-5 space-y-3 overflow-hidden relative outline-none hover:ring-2 hover:ring-blue-200 focus-visible:ring-2 focus-visible:ring-cyan-600">
                <span className="text-sm font-medium text-cyan-950">Adicionar nota</span>
                <p className="text-sm leading-6 text-slate-500 ">
                    Grave uma nota em áudio que será convertida para texto automaticamente.
                </p>
            </Dialog.Trigger>
            <Dialog.Portal>
                <Dialog.Overlay className="inset-0 fixed bg-slate-900/60" />
                <Dialog.Content className="fixed overflow-hidden inset-0 md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 max-w-[650px] w-full h-full md:h-[75vh] bg-slate-300 rounded-md flex flex-col outline-none">
                    <Dialog.Close className=" rounded-bl-xl absolute right-0 top-0 bg-slate-900 p-1.5 text-slate-300 hover:text-slate-500 ">
                        <X className="size-5" />
                    </Dialog.Close>

                    <form className="flex-1 flex flex-col">
                        <div className="flex flex-1 flex-col gap-3 p-5">
                            <span className="text-sm font-medium text-cyan-900">Adicionar nota</span>
                            {!shouldShowOnboarding && (
                                <input
                                    type="text"
                                    placeholder="Título"
                                    className="text-sm leading-6 text-slate-500 bg-transparent resize-none outline-none border-b-2 border-slate-400"
                                    onChange={handleTitleChanged}
                                    value={title}
                                />
                            )}
                            {shouldShowOnboarding && (
                                <p className="text-sm leading-6 text-slate-900">
                                    Comece <button type="button" className="font-medium text-cyan-600 hover:underline" onClick={handleToggleRecording}>gravando uma nota </button> em áudio ou se preferir <button type="button" onClick={handleStartEditor} className="font-medium text-cyan-600 hover:underline " >utilize apenas texto.</button>
                                </p>
                            )}
                            {!shouldShowOnboarding && (
                                <textarea
                                    autoFocus
                                    className="text-sm leading-6 text-slate-950 bg-transparent resize-none flex-1 outline-none"
                                    onChange={handleContentChanged}
                                    value={content} />
                            )}
                        </div>
                        {!shouldShowOnboarding && !isRecording && (
                            <button
                                type="button"
                                className="w-full mt-3 py-4 text-center text-sm text-cyan-700 font-medium group hover:underline"
                                onClick={handleStartRecording}>
                                Começar a gravar novamente
                            </button>
                        )}

                        {isRecording && !shouldShowOnboarding && (
                            <button
                                type="button"
                                className="w-full flex items-center justify-center gap-2 bg-slate-100 py-4 text-center text-sm text-slate-950 font-medium group hover:bg-slate-400 hover:underline"
                                onClick={handleStopRecording}>
                                <span className="size-3 rounded-full bg-red-500 animate-pulse opacity-100" />
                                Gravando... <span className="text-cyan-700">(Clique aqui para interromper)</span>
                            </button>
                        )}

                        {!isRecording && !shouldShowOnboarding && (
                            <button
                                type="button"
                                onClick={handleSaveNote}
                                className={`w-full bg-slate-900 py-4 text-center text-sm text-slate-300 font-medium group hover:bg-slate-800 ${shouldShowOnboarding ? 'opacity-50 cursor-not-allowed' : 'hover:bg-slate-800'}`}>
                                Salvar nota
                            </button>
                        )}


                    </form>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
}
