import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mic, MicOff, Volume2, Sparkles, X, ChevronRight } from 'lucide-react';

interface FloatingVoiceControlProps {
  onOpenFullVoiceStudio: () => void;
  onQuickCommandExecuted?: (action: string, param?: string) => void;
}

export const FloatingVoiceControl: React.FC<FloatingVoiceControlProps> = ({
  onOpenFullVoiceStudio,
  onQuickCommandExecuted,
}) => {
  const [isListening, setIsListening] = useState(false);
  const [speechFeedback, setSpeechFeedback] = useState<string | null>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onresult = (event: any) => {
      const text = event.results[0][0].transcript;
      setSpeechFeedback(text);

      if (event.results[0].isFinal) {
        setIsListening(false);
        processVoiceCommand(text);
      }
    };

    recognition.onerror = () => {
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;
  }, []);

  const processVoiceCommand = (cmd: string) => {
    const lower = cmd.toLowerCase();
    if (lower.includes('video') || lower.includes('animate') || lower.includes('motion')) {
      onQuickCommandExecuted?.('navigate_video', cmd);
    } else if (lower.includes('higgsfield') || lower.includes('bullet time') || lower.includes('dolly')) {
      onQuickCommandExecuted?.('navigate_higgsfield', cmd);
    } else if (lower.includes('image') || lower.includes('photo') || lower.includes('picture') || lower.includes('edit')) {
      onQuickCommandExecuted?.('navigate_image', cmd);
    } else if (lower.includes('data') || lower.includes('csv') || lower.includes('report')) {
      onQuickCommandExecuted?.('navigate_data', cmd);
    } else {
      // Open full voice studio to converse
      onOpenFullVoiceStudio();
    }
  };

  const handleToggle = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      setSpeechFeedback(null);
      try {
        recognitionRef.current?.start();
        setIsListening(true);
      } catch (e) {
        onOpenFullVoiceStudio();
      }
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-2">
      {/* Active Speech Feedback Bubble */}
      <AnimatePresence>
        {(isListening || speechFeedback) && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 10 }}
            className="p-3 bg-neutral-900/95 backdrop-blur-md text-white rounded-2xl shadow-2xl border border-white/20 text-xs max-w-xs flex items-center justify-between gap-3"
          >
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-indigo-400 animate-ping" />
              <span className="font-medium text-neutral-200 truncate">
                {speechFeedback || 'Listening... Speak your command'}
              </span>
            </div>
            <button
              onClick={() => setSpeechFeedback(null)}
              className="text-neutral-400 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Pill Button */}
      <div className="flex items-center gap-1.5 p-1.5 bg-neutral-950/90 backdrop-blur-md rounded-full shadow-2xl border border-white/20">
        <button
          onClick={handleToggle}
          className={`p-3 rounded-full font-bold shadow-lg transition-all duration-300 flex items-center justify-center text-white ${
            isListening
              ? 'bg-red-500 scale-105 ring-4 ring-red-400/40 animate-pulse'
              : 'bg-linear-to-r from-purple-600 to-indigo-600 hover:scale-105'
          }`}
          title={isListening ? 'Stop Listening' : 'Click to Speak'}
        >
          {isListening ? <Mic className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
        </button>

        <button
          onClick={onOpenFullVoiceStudio}
          className="px-3.5 py-1.5 rounded-full text-xs font-semibold text-white/90 hover:text-white hover:bg-white/10 transition flex items-center gap-1.5"
        >
          <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
          <span>Voice Studio</span>
        </button>
      </div>
    </div>
  );
};
