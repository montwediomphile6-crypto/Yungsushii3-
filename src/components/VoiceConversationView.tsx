import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Sparkles,
  RotateCcw,
  Send,
  MessageSquare,
  Radio,
  Sliders,
  Check,
  Video,
  Image as ImageIcon,
  Flame,
  Bot
} from 'lucide-react';
import type { VoiceMessage } from '../types';

interface VoiceConversationViewProps {
  onNavigateToTab?: (tab: 'video' | 'image' | 'higgsfield' | 'data', promptText?: string) => void;
}

export const VoiceConversationView: React.FC<VoiceConversationViewProps> = ({
  onNavigateToTab,
}) => {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [handsFreeMode, setHandsFreeMode] = useState(true);
  const [selectedVoice, setSelectedVoice] = useState('Aoede'); // Aoede, Puck, Charon, Kore, Fenrir
  const [transcript, setTranscript] = useState('');
  const [interimText, setInterimText] = useState('');
  const [conversation, setConversation] = useState<VoiceMessage[]>([
    {
      id: 'welcome-1',
      sender: 'assistant',
      text: 'Hello! I am your AI Creative Voice Assistant. You can talk to me directly to generate cinematic videos with @Higgsfield camera motions, create 4K images, edit your canvas, or analyze datasets.',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const [audioLevel, setAudioLevel] = useState(0);
  const recognitionRef = useRef<any>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const chatBottomRef = useRef<HTMLDivElement | null>(null);
  const audioAnimationRef = useRef<number | null>(null);

  // Initialize Speech Synthesis
  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      synthRef.current = window.speechSynthesis;
    }
  }, []);

  // Scroll to bottom on new message
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversation, interimText]);

  // Simulated audio levels during listening or speaking
  useEffect(() => {
    if (!isListening && !isSpeaking) {
      setAudioLevel(0);
      if (audioAnimationRef.current) cancelAnimationFrame(audioAnimationRef.current);
      return;
    }

    const animateAudio = () => {
      // Simulate realistic voice waveform oscillation
      const base = isSpeaking ? 0.6 : 0.45;
      const jitter = Math.random() * 0.4;
      setAudioLevel(base + jitter);
      audioAnimationRef.current = requestAnimationFrame(animateAudio);
    };

    audioAnimationRef.current = requestAnimationFrame(animateAudio);
    return () => {
      if (audioAnimationRef.current) cancelAnimationFrame(audioAnimationRef.current);
    };
  }, [isListening, isSpeaking]);

  // Initialize Web Speech Recognition
  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      console.warn('Web Speech Recognition API is not supported in this browser.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onresult = (event: any) => {
      let finalSpeech = '';
      let interimSpeech = '';

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalSpeech += event.results[i][0].transcript;
        } else {
          interimSpeech += event.results[i][0].transcript;
        }
      }

      setInterimText(interimSpeech);

      if (finalSpeech.trim()) {
        const spoken = finalSpeech.trim();
        setTranscript(spoken);
        setInterimText('');
        handleUserSpokenMessage(spoken);
      }
    };

    recognition.onerror = (event: any) => {
      console.warn('Speech recognition error:', event.error);
      if (event.error !== 'no-speech') {
        setIsListening(false);
      }
    };

    recognition.onend = () => {
      if (isListening && handsFreeMode && !isSpeaking) {
        try {
          recognition.start();
        } catch (e) {
          setIsListening(false);
        }
      } else {
        setIsListening(false);
      }
    };

    recognitionRef.current = recognition;

    return () => {
      try {
        recognition.stop();
      } catch (e) {}
    };
  }, [handsFreeMode, isSpeaking]);

  // Toggle Microphone
  const toggleListening = () => {
    if (isListening) {
      try {
        recognitionRef.current?.stop();
      } catch (e) {}
      setIsListening(false);
    } else {
      // Stop speech synthesis if talking
      if (synthRef.current && synthRef.current.speaking) {
        synthRef.current.cancel();
        setIsSpeaking(false);
      }
      try {
        recognitionRef.current?.start();
        setIsListening(true);
      } catch (e) {
        console.warn('Could not start recognition:', e);
        setIsListening(true);
      }
    }
  };

  // Speak AI Response
  const speakResponse = (text: string) => {
    if (!synthRef.current) return;

    synthRef.current.cancel();
    const utterance = new SpeechSynthesisUtterance(text);

    // Pick voice based on personality
    const voices = synthRef.current.getVoices();
    if (selectedVoice === 'Puck') {
      utterance.pitch = 1.2;
      utterance.rate = 1.05;
    } else if (selectedVoice === 'Charon') {
      utterance.pitch = 0.75;
      utterance.rate = 0.95;
    } else if (selectedVoice === 'Fenrir') {
      utterance.pitch = 0.85;
      utterance.rate = 1.0;
    } else {
      // Aoede / Kore
      utterance.pitch = 1.0;
      utterance.rate = 1.0;
    }

    // Try to find a high quality natural English voice
    const preferredVoice = voices.find(
      (v) =>
        v.lang.startsWith('en') &&
        (v.name.includes('Google') || v.name.includes('Natural') || v.name.includes('Samantha') || v.name.includes('Daniel'))
    );
    if (preferredVoice) utterance.voice = preferredVoice;

    utterance.onstart = () => {
      setIsSpeaking(true);
      // Temporarily pause listening while assistant speaks to prevent echo
      if (recognitionRef.current && isListening) {
        try {
          recognitionRef.current.stop();
        } catch (e) {}
      }
    };

    utterance.onend = () => {
      setIsSpeaking(false);
      // Resume listening if hands free mode is active
      if (handsFreeMode && recognitionRef.current) {
        try {
          recognitionRef.current.start();
          setIsListening(true);
        } catch (e) {}
      }
    };

    utterance.onerror = () => {
      setIsSpeaking(false);
    };

    synthRef.current.speak(utterance);
  };

  // Process User Speech
  const handleUserSpokenMessage = async (userText: string) => {
    const userMsg: VoiceMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: userText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setConversation((prev) => [...prev, userMsg]);

    try {
      const res = await fetch('/api/voice-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userText,
          voice: selectedVoice,
        }),
      });

      if (!res.ok) {
        throw new Error('Voice assistant failed');
      }

      const data = await res.json();
      const assistantText = data.text;

      const aiMsg: VoiceMessage = {
        id: `ai-${Date.now()}`,
        sender: 'assistant',
        text: assistantText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestedAction: data.suggestedAction,
      };

      setConversation((prev) => [...prev, aiMsg]);
      speakResponse(assistantText);

      // Handle suggested navigation if detected
      if (data.suggestedAction && onNavigateToTab) {
        if (data.suggestedAction === 'navigate_video') {
          setTimeout(() => onNavigateToTab('video', userText), 1800);
        } else if (data.suggestedAction === 'navigate_higgsfield') {
          setTimeout(() => onNavigateToTab('higgsfield', userText), 1800);
        } else if (data.suggestedAction === 'navigate_image') {
          setTimeout(() => onNavigateToTab('image', userText), 1800);
        } else if (data.suggestedAction === 'navigate_data') {
          setTimeout(() => onNavigateToTab('data', userText), 1800);
        }
      }
    } catch (err: any) {
      console.error('Voice chat error:', err);
      const fallbackMsg: VoiceMessage = {
        id: `ai-${Date.now()}`,
        sender: 'assistant',
        text: "I heard you! Let's create your video or image now.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setConversation((prev) => [...prev, fallbackMsg]);
      speakResponse(fallbackMsg.text);
    }
  };

  const handleStopSpeaking = () => {
    if (synthRef.current) {
      synthRef.current.cancel();
      setIsSpeaking(false);
    }
  };

  const voicePersonas = [
    { id: 'Aoede', name: 'Aoede', desc: 'Calm & Poised', gender: 'Female' },
    { id: 'Puck', name: 'Puck', desc: 'Upbeat & Energetic', gender: 'Male' },
    { id: 'Charon', name: 'Charon', desc: 'Deep & Cinematic', gender: 'Male' },
    { id: 'Kore', name: 'Kore', desc: 'Warm & Creative', gender: 'Female' },
    { id: 'Fenrir', name: 'Fenrir', desc: 'Bold & Direct', gender: 'Authoritative' },
  ];

  return (
    <div className="w-full space-y-8 max-w-5xl mx-auto px-2 sm:px-4">
      {/* Voice Mode Header */}
      <div className="relative overflow-hidden rounded-3xl bg-linear-to-r from-neutral-950 via-indigo-950 to-neutral-900 border border-indigo-500/30 p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-semibold uppercase tracking-wider mb-2">
            <Radio className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
            Live Voice Studio
          </div>
          <h1 className="text-2xl sm:text-4xl font-bold tracking-tight">
            Conversational Voice Assistant
          </h1>
          <p className="text-xs sm:text-sm text-neutral-300 mt-1 max-w-xl">
            Talk hands-free to create video concepts, generate Higgsfield camera moves, edit images, or ask questions naturally.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Hands-free switch */}
          <button
            onClick={() => setHandsFreeMode(!handsFreeMode)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition flex items-center gap-1.5 ${
              handsFreeMode
                ? 'bg-indigo-600/30 border-indigo-500/50 text-indigo-200'
                : 'bg-white/10 border-white/15 text-neutral-400'
            }`}
          >
            <Radio className="w-3.5 h-3.5" />
            Hands-Free Loop: {handsFreeMode ? 'ON' : 'OFF'}
          </button>

          {/* Voice Persona Selector */}
          <select
            value={selectedVoice}
            onChange={(e) => setSelectedVoice(e.target.value)}
            className="bg-neutral-900 border border-white/20 text-white text-xs px-3 py-1.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400"
          >
            {voicePersonas.map((vp) => (
              <option key={vp.id} value={vp.id}>
                Voice: {vp.name} ({vp.desc})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Voice Interactive Arena */}
      <div className="bg-white rounded-3xl border border-neutral-200 shadow-lg overflow-hidden flex flex-col h-[580px]">
        {/* Pulsing Visualizer Stage */}
        <div className="relative h-44 bg-linear-to-b from-neutral-950 via-neutral-900 to-indigo-950 flex flex-col items-center justify-center p-6 text-white overflow-hidden border-b border-neutral-800">
          {/* Background Ambient Circles */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-25">
            <motion.div
              className="w-72 h-72 rounded-full border border-indigo-400"
              animate={{
                scale: isListening || isSpeaking ? [1, 1.35, 1] : 1,
                opacity: isListening || isSpeaking ? [0.2, 0.6, 0.2] : 0.2,
              }}
              transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
            />
            <motion.div
              className="absolute w-96 h-96 rounded-full border border-purple-400"
              animate={{
                scale: isListening || isSpeaking ? [1, 1.45, 1] : 1,
                opacity: isListening || isSpeaking ? [0.1, 0.4, 0.1] : 0.1,
              }}
              transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut', delay: 0.2 }}
            />
          </div>

          {/* Reactive Waveform Bars */}
          <div className="flex items-center gap-1.5 z-10 mb-4 h-12">
            {[40, 70, 100, 60, 90, 120, 85, 110, 50, 95, 65, 80, 45].map((height, i) => (
              <motion.div
                key={i}
                className={`w-1.5 rounded-full ${
                  isSpeaking
                    ? 'bg-linear-to-t from-purple-500 to-pink-400'
                    : isListening
                    ? 'bg-linear-to-t from-indigo-500 to-cyan-400'
                    : 'bg-neutral-700'
                }`}
                animate={{
                  height:
                    isListening || isSpeaking
                      ? Math.max(8, (height * audioLevel * (0.6 + Math.sin(i * 0.8) * 0.4)))
                      : 6,
                }}
                transition={{ duration: 0.08 }}
              />
            ))}
          </div>

          {/* Microphone & Status Pill */}
          <div className="z-10 flex items-center gap-3">
            <button
              onClick={toggleListening}
              className={`p-4 rounded-full font-bold shadow-xl transition-all duration-300 flex items-center justify-center ${
                isListening
                  ? 'bg-red-500 hover:bg-red-600 text-white scale-110 ring-4 ring-red-400/30 animate-pulse'
                  : 'bg-indigo-600 hover:bg-indigo-700 text-white'
              }`}
            >
              {isListening ? <Mic className="w-6 h-6" /> : <MicOff className="w-6 h-6" />}
            </button>

            {isSpeaking && (
              <button
                onClick={handleStopSpeaking}
                className="p-2.5 rounded-full bg-white/20 hover:bg-white/30 text-white transition text-xs flex items-center gap-1"
                title="Mute Assistant"
              >
                <VolumeX className="w-4 h-4" />
                <span>Stop Talking</span>
              </button>
            )}

            <div className="text-xs font-medium text-neutral-300">
              {isSpeaking
                ? `Speaking as ${selectedVoice}...`
                : isListening
                ? 'Listening to you... Speak now'
                : 'Click mic to talk'}
            </div>
          </div>
        </div>

        {/* Live Conversation Chat Transcript */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-neutral-50/50">
          {conversation.map((msg) => {
            const isUser = msg.sender === 'user';
            return (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
              >
                {!isUser && (
                  <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center shrink-0 text-xs font-bold shadow-xs">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`max-w-[80%] rounded-2xl p-4 text-xs leading-relaxed shadow-2xs ${
                    isUser
                      ? 'bg-indigo-600 text-white rounded-tr-none'
                      : 'bg-white text-neutral-800 border border-neutral-200/80 rounded-tl-none'
                  }`}
                >
                  <p>{msg.text}</p>
                  <div
                    className={`text-[10px] mt-1.5 flex items-center justify-between ${
                      isUser ? 'text-indigo-200' : 'text-neutral-400'
                    }`}
                  >
                    <span>{isUser ? 'You' : `AI Voice (${selectedVoice})`}</span>
                    <span>{msg.timestamp}</span>
                  </div>

                  {msg.suggestedAction && onNavigateToTab && (
                    <div className="mt-2.5 pt-2 border-t border-neutral-100 flex items-center gap-2">
                      <button
                        onClick={() => {
                          if (msg.suggestedAction === 'navigate_video') onNavigateToTab('video');
                          if (msg.suggestedAction === 'navigate_higgsfield') onNavigateToTab('higgsfield');
                          if (msg.suggestedAction === 'navigate_image') onNavigateToTab('image');
                          if (msg.suggestedAction === 'navigate_data') onNavigateToTab('data');
                        }}
                        className="px-3 py-1 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-[11px] flex items-center gap-1 transition"
                      >
                        <Sparkles className="w-3 h-3 text-indigo-600" />
                        Go to Studio Feature
                      </button>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}

          {/* Interim Real-time Speech Bubble */}
          {interimText && (
            <div className="flex justify-end">
              <div className="max-w-[75%] rounded-2xl p-3 bg-indigo-50 border border-indigo-200 text-indigo-900 text-xs italic animate-pulse">
                "{interimText}..."
              </div>
            </div>
          )}

          <div ref={chatBottomRef} />
        </div>

        {/* Quick Voice Suggestions Footer */}
        <div className="p-3 bg-white border-t border-neutral-200 flex items-center gap-2 overflow-x-auto no-scrollbar">
          <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wide shrink-0">
            Try Speaking:
          </span>
          {[
            'Generate a Higgsfield bullet time video of a sports car',
            'Create a 4K image of a cyberpunk street in rain',
            'Show me the best Higgsfield camera motion templates',
            'Can you help me edit lighting in my image?',
          ].map((promptText) => (
            <button
              key={promptText}
              onClick={() => handleUserSpokenMessage(promptText)}
              className="px-3 py-1.5 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-700 text-xs font-medium whitespace-nowrap transition"
            >
              "{promptText}"
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
