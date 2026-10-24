import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Play,
  Pause,
  RotateCcw,
  Download,
  Film,
  Camera,
  Sparkles,
  Sliders,
  Maximize2,
  Clock,
  Layers,
  Upload,
  Image as ImageIcon,
  Check,
  ChevronDown,
  Wand2,
  Share2,
  Edit3
} from 'lucide-react';
import type { GeneratedVideo, HiggsfieldTemplate, CameraKeyframe } from '../types';

interface VideoStudioViewProps {
  initialPrompt?: string;
  initialTemplate?: HiggsfieldTemplate | null;
  initialSourceImage?: string | null;
  onOpenInImageEditor?: (imageUrl: string) => void;
  onExploreHiggsfieldTemplates?: () => void;
}

export const VideoStudioView: React.FC<VideoStudioViewProps> = ({
  initialPrompt = '',
  initialTemplate = null,
  initialSourceImage = null,
  onOpenInImageEditor,
  onExploreHiggsfieldTemplates,
}) => {
  // Input states
  const [generationMode, setGenerationMode] = useState<'text' | 'image'>('text');
  const [prompt, setPrompt] = useState(initialPrompt);
  const [sourceImage, setSourceImage] = useState<string | null>(initialSourceImage);
  const [activeTemplate, setActiveTemplate] = useState<HiggsfieldTemplate | null>(initialTemplate);
  const [cameraMotion, setCameraMotion] = useState<string>(
    initialTemplate?.cameraMovement?.type || 'Bullet Time'
  );
  const [aspectRatio, setAspectRatio] = useState<'16:9' | '9:16' | '1:1'>('16:9');
  const [duration, setDuration] = useState<number>(5);
  const [fps, setFps] = useState<number>(30);
  const [motionIntensity, setMotionIntensity] = useState<number>(8);
  const [stylePreset, setStylePreset] = useState<string>('cinematic');

  // Generation status
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStage, setGenerationStage] = useState('');
  const [generatedVideos, setGeneratedVideos] = useState<GeneratedVideo[]>([]);
  const [activeVideo, setActiveVideo] = useState<GeneratedVideo | null>(null);

  // Video Player states
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentFrameIndex, setCurrentFrameIndex] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [isLooping, setIsLooping] = useState(true);
  const animationFrameRef = useRef<number | null>(null);
  const lastTickTimeRef = useRef<number>(0);

  // File upload input
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Update when props change
  useEffect(() => {
    if (initialPrompt) setPrompt(initialPrompt);
    if (initialTemplate) {
      setActiveTemplate(initialTemplate);
      setCameraMotion(initialTemplate.cameraMovement.type);
      setAspectRatio(initialTemplate.recommendedRatio);
      setDuration(initialTemplate.recommendedDuration);
    }
    if (initialSourceImage) {
      setSourceImage(initialSourceImage);
      setGenerationMode('image');
    }
  }, [initialPrompt, initialTemplate, initialSourceImage]);

  // Default camera motions
  const cameraMotions = [
    { id: 'Bullet Time', name: 'Bullet Time 360°', tag: '@Higgsfield' },
    { id: 'FPV Drone', name: 'FPV Drone Dive', tag: '@Higgsfield' },
    { id: 'Dolly Zoom', name: 'Vertigo Dolly Zoom', tag: 'Cinematic' },
    { id: 'Orbit Arc', name: 'Dynamic Orbit Arc', tag: 'Smooth' },
    { id: 'Crash Zoom', name: 'Crash Whip Zoom', tag: 'Action' },
    { id: 'Speed Ramp', name: 'Hyperlapse Speed Ramp', tag: 'Viral' },
  ];

  const stylePresets = [
    { id: 'cinematic', label: 'Cinematic 8K' },
    { id: 'photorealistic', label: 'Photorealistic' },
    { id: 'anime', label: 'Anime Action' },
    { id: 'cyberpunk', label: 'Cyberpunk Neon' },
    { id: '3d_render', label: 'Octane 3D' },
    { id: 'luxury_editorial', label: 'Haute Runway' },
  ];

  // Quick sample prompts
  const samplePrompts = [
    'A high-tech cyberpunk sports car drifting at midnight on rain-drenched neon streets',
    'An astronaut taking steps on a crystalline alien biome with glowing flora',
    'A majestic mythical griffin launching into flight over snow-peaked mountains at golden hour',
    'A luxury fashion model turning in slow motion wearing holographic fiber-optic fabric',
  ];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setSourceImage(event.target?.result as string);
        setGenerationMode('image');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    setIsGenerating(true);
    setIsPlaying(false);
    setGenerationStage('Initializing @Higgsfield camera physics...');

    try {
      const stages = [
        'Computing 3D camera trajectory keyframes...',
        'Synthesizing volumetric lighting & reflections...',
        'Simulating particle dynamics and motion blur...',
        'Rendering high-fidelity video stream (60fps)...',
      ];

      let stageIdx = 0;
      const stageInterval = setInterval(() => {
        if (stageIdx < stages.length) {
          setGenerationStage(stages[stageIdx]);
          stageIdx++;
        }
      }, 1100);

      const res = await fetch('/api/generate-video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: prompt.trim(),
          sourceImage: generationMode === 'image' ? sourceImage : undefined,
          cameraMotion,
          templateId: activeTemplate?.id,
          duration,
          aspectRatio,
          fps,
          style: stylePreset,
        }),
      });

      clearInterval(stageInterval);

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || 'Video generation failed');
      }

      const data = await res.json();
      if (data.video) {
        const newVideo: GeneratedVideo = data.video;
        setGeneratedVideos((prev) => [newVideo, ...prev]);
        setActiveVideo(newVideo);
        setCurrentFrameIndex(0);
        setIsPlaying(true);
      }
    } catch (err: any) {
      console.error('Generation error:', err);
      alert(err.message || 'Error generating video');
    } finally {
      setIsGenerating(false);
      setGenerationStage('');
    }
  };

  // Video Playback Loop
  useEffect(() => {
    if (!activeVideo || !isPlaying) {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      return;
    }

    const totalFrames = activeVideo.framesCount || 150;
    const frameIntervalMs = (1000 / activeVideo.fps) / playbackSpeed;

    const playLoop = (timestamp: number) => {
      if (!lastTickTimeRef.current) lastTickTimeRef.current = timestamp;
      const delta = timestamp - lastTickTimeRef.current;

      if (delta >= frameIntervalMs) {
        lastTickTimeRef.current = timestamp;
        setCurrentFrameIndex((prev) => {
          if (prev >= totalFrames - 1) {
            if (isLooping) return 0;
            setIsPlaying(false);
            return totalFrames - 1;
          }
          return prev + 1;
        });
      }

      animationFrameRef.current = requestAnimationFrame(playLoop);
    };

    animationFrameRef.current = requestAnimationFrame(playLoop);

    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [isPlaying, activeVideo, playbackSpeed, isLooping]);

  // Current keyframe
  const currentKeyframe: CameraKeyframe | undefined =
    activeVideo?.keyframes?.[currentFrameIndex] ||
    activeVideo?.keyframes?.[0];

  const handleDownloadSnapshot = () => {
    if (!activeVideo) return;
    const a = document.createElement('a');
    a.href = activeVideo.posterImage;
    a.download = `video_frame_${currentFrameIndex}_${Date.now()}.png`;
    a.click();
  };

  return (
    <div className="w-full space-y-8 max-w-7xl mx-auto px-2 sm:px-4">
      {/* Higgsfield Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 sm:p-5 rounded-2xl bg-linear-to-r from-purple-950/80 via-neutral-900 to-indigo-950/80 border border-purple-500/30 text-white shadow-lg">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-purple-600/30 border border-purple-400/30 flex items-center justify-center shrink-0">
            <Sparkles className="w-5 h-5 text-purple-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold tracking-tight">AI Video Generation Studio</h2>
              <span className="px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 text-[10px] font-semibold">
                Higgsfield Motion Engine
              </span>
            </div>
            <p className="text-xs text-neutral-300">
              Create high-framerate cinematic motion with 360° Bullet Time, FPV Drone Dives, and Zolly zooms.
            </p>
          </div>
        </div>

        <button
          onClick={onExploreHiggsfieldTemplates}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-semibold text-white transition whitespace-nowrap"
        >
          Browse @Higgsfield Templates
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Generator Controls */}
        <div className="lg:col-span-5 space-y-6 bg-white p-6 rounded-3xl border border-neutral-200 shadow-xs">
          {/* Mode Switcher */}
          <div className="flex p-1 bg-neutral-100 rounded-2xl">
            <button
              onClick={() => setGenerationMode('text')}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 ${
                generationMode === 'text'
                  ? 'bg-white text-neutral-900 shadow-xs'
                  : 'text-neutral-500 hover:text-neutral-900'
              }`}
            >
              <Film className="w-3.5 h-3.5" />
              Text to Video
            </button>
            <button
              onClick={() => setGenerationMode('image')}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 ${
                generationMode === 'image'
                  ? 'bg-white text-neutral-900 shadow-xs'
                  : 'text-neutral-500 hover:text-neutral-900'
              }`}
            >
              <ImageIcon className="w-3.5 h-3.5" />
              Image to Video
            </button>
          </div>

          {/* Active Template Notice */}
          {activeTemplate && (
            <div className="flex items-center justify-between p-3 rounded-2xl bg-purple-50 border border-purple-200 text-xs">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-600 shrink-0" />
                <span className="text-purple-900 font-medium truncate">
                  Using <strong>{activeTemplate.title}</strong>
                </span>
              </div>
              <button
                onClick={() => setActiveTemplate(null)}
                className="text-[11px] text-purple-600 hover:text-purple-800 font-semibold"
              >
                Clear
              </button>
            </div>
          )}

          {/* Source Image for Image-to-Video */}
          {generationMode === 'image' && (
            <div className="space-y-2">
              <label className="text-xs font-bold text-neutral-800 uppercase tracking-wide flex items-center justify-between">
                <span>Start Keyframe (Image)</span>
                {sourceImage && (
                  <button
                    onClick={() => setSourceImage(null)}
                    className="text-[11px] text-red-500 hover:underline normal-case font-normal"
                  >
                    Remove
                  </button>
                )}
              </label>

              {sourceImage ? (
                <div className="relative rounded-2xl overflow-hidden border border-neutral-200 group h-36 bg-neutral-900 flex items-center justify-center">
                  <img
                    src={sourceImage}
                    alt="Source"
                    className="w-full h-full object-contain"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-2">
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="px-3 py-1.5 rounded-lg bg-white/90 text-xs font-semibold text-neutral-800"
                    >
                      Change Image
                    </button>
                  </div>
                </div>
              ) : (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-neutral-300 hover:border-purple-500 rounded-2xl cursor-pointer bg-neutral-50/50 hover:bg-purple-50/30 transition text-center"
                >
                  <Upload className="w-6 h-6 text-neutral-400 mb-2" />
                  <p className="text-xs font-semibold text-neutral-700">Upload initial frame</p>
                  <p className="text-[11px] text-neutral-400 mt-0.5">PNG, JPG, or WebP</p>
                </div>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileUpload}
              />
            </div>
          )}

          {/* Prompt Input */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-neutral-800 uppercase tracking-wide">
                Video Motion Prompt
              </label>
              <button
                onClick={() => {
                  const random = samplePrompts[Math.floor(Math.random() * samplePrompts.length)];
                  setPrompt(random);
                }}
                className="text-[11px] text-purple-600 hover:text-purple-800 font-semibold flex items-center gap-1"
              >
                <Wand2 className="w-3 h-3" />
                Inspire Me
              </button>
            </div>
            <textarea
              rows={3}
              placeholder="Describe your scene, lighting, action, and subject dynamics..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="w-full p-3.5 text-xs rounded-2xl border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-purple-500 placeholder-neutral-400 resize-none"
            />
          </div>

          {/* Camera Motion Selector */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-neutral-800 uppercase tracking-wide flex items-center gap-1.5">
              <Camera className="w-3.5 h-3.5 text-purple-600" />
              Camera Choreography
            </label>
            <div className="grid grid-cols-2 gap-2">
              {cameraMotions.map((cam) => {
                const isSelected = cameraMotion === cam.id;
                return (
                  <button
                    key={cam.id}
                    onClick={() => setCameraMotion(cam.id)}
                    className={`p-2.5 rounded-xl border text-left transition flex flex-col justify-between ${
                      isSelected
                        ? 'border-purple-600 bg-purple-50 text-purple-900 font-bold'
                        : 'border-neutral-200 hover:border-neutral-300 text-neutral-700 text-xs'
                    }`}
                  >
                    <span className="text-xs">{cam.name}</span>
                    <span className="text-[10px] text-purple-500 font-semibold">{cam.tag}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Settings Grid: Aspect Ratio, Style, Duration */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-bold text-neutral-600 uppercase mb-1.5">
                Aspect Ratio
              </label>
              <select
                value={aspectRatio}
                onChange={(e) => setAspectRatio(e.target.value as any)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
              >
                <option value="16:9">16:9 Widescreen (Cinema)</option>
                <option value="9:16">9:16 Vertical (Reels/TikTok)</option>
                <option value="1:1">1:1 Square (Feed)</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-neutral-600 uppercase mb-1.5">
                Visual Style
              </label>
              <select
                value={stylePreset}
                onChange={(e) => setStylePreset(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
              >
                {stylePresets.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-neutral-600 uppercase mb-1.5">
                Duration: {duration}s
              </label>
              <input
                type="range"
                min={3}
                max={10}
                value={duration}
                onChange={(e) => setDuration(Number(e.target.value))}
                className="w-full accent-purple-600"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-neutral-600 uppercase mb-1.5">
                Frame Rate: {fps} FPS
              </label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setFps(30)}
                  className={`flex-1 py-1.5 text-xs rounded-lg border font-semibold ${
                    fps === 30 ? 'bg-purple-600 text-white border-purple-600' : 'border-neutral-300 text-neutral-700'
                  }`}
                >
                  30
                </button>
                <button
                  type="button"
                  onClick={() => setFps(60)}
                  className={`flex-1 py-1.5 text-xs rounded-lg border font-semibold ${
                    fps === 60 ? 'bg-purple-600 text-white border-purple-600' : 'border-neutral-300 text-neutral-700'
                  }`}
                >
                  60 HD
                </button>
              </div>
            </div>
          </div>

          {/* Generate Button */}
          <button
            onClick={handleGenerate}
            disabled={isGenerating || !prompt.trim()}
            className={`w-full py-3.5 rounded-2xl font-bold text-sm shadow-md transition flex items-center justify-center gap-2 ${
              isGenerating || !prompt.trim()
                ? 'bg-neutral-200 text-neutral-400 cursor-not-allowed'
                : 'bg-linear-to-r from-purple-600 via-indigo-600 to-purple-700 hover:from-purple-700 hover:to-indigo-700 text-white'
            }`}
          >
            {isGenerating ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Generating Video...</span>
              </>
            ) : (
              <>
                <Film className="w-4 h-4" />
                <span>Generate Video</span>
              </>
            )}
          </button>

          {isGenerating && (
            <p className="text-center text-xs text-purple-600 font-medium animate-pulse">
              {generationStage}
            </p>
          )}
        </div>

        {/* Right Column: High Quality Interactive Player & Video Showcase */}
        <div className="lg:col-span-7 space-y-6">
          {activeVideo ? (
            <div className="bg-neutral-950 rounded-3xl overflow-hidden border border-neutral-800 shadow-2xl flex flex-col">
              {/* Top Video Header */}
              <div className="p-4 bg-neutral-900/80 border-b border-neutral-800 flex items-center justify-between text-white">
                <div className="flex items-center gap-2 truncate">
                  <Film className="w-4 h-4 text-purple-400 shrink-0" />
                  <span className="text-xs font-bold truncate">"{activeVideo.prompt}"</span>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="px-2 py-0.5 rounded-md bg-purple-500/20 text-purple-300 text-[10px] font-mono">
                    {activeVideo.cameraMotion}
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-neutral-800 text-neutral-300 text-[10px] font-mono">
                    {activeVideo.fps} FPS
                  </span>
                </div>
              </div>

              {/* Viewport Canvas / Simulation Area */}
              <div className="relative w-full aspect-video bg-black flex items-center justify-center overflow-hidden">
                {/* Dynamically Transformed Video Poster according to Camera Trajectory */}
                <div
                  className="w-full h-full flex items-center justify-center transition-transform duration-75"
                  style={{
                    transform: currentKeyframe
                      ? `scale(${currentKeyframe.zoom}) rotate(${currentKeyframe.roll}deg) perspective(600px) rotateY(${currentKeyframe.yaw}deg) rotateX(${currentKeyframe.pitch}deg) translate(${currentKeyframe.xOffset}px, ${currentKeyframe.yOffset}px)`
                      : 'none',
                  }}
                >
                  <img
                    src={activeVideo.posterImage}
                    alt="Video Keyframe"
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>

                {/* Simulated Lens Blur / Scanlines */}
                <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(0,0,0,0.6)_100%)]" />

                {/* Live Camera Rig Telemetry Overlay (HUD) */}
                {currentKeyframe && (
                  <div className="absolute top-4 left-4 z-20 flex flex-col gap-1 text-[10px] font-mono text-white/90 bg-black/60 backdrop-blur-md px-3 py-2 rounded-xl border border-white/15">
                    <div className="flex items-center gap-2 font-bold text-amber-400">
                      <Camera className="w-3 h-3" />
                      HIGGSFIELD CAMERA HUD
                    </div>
                    <div>YAW: {currentKeyframe.yaw}° | PITCH: {currentKeyframe.pitch}°</div>
                    <div>ROLL: {currentKeyframe.roll}° | ZOOM: {currentKeyframe.zoom}x</div>
                    <div>FRAME: {currentFrameIndex + 1} / {activeVideo.framesCount}</div>
                  </div>
                )}

                {/* Big Center Play/Pause Overlay Button */}
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="absolute inset-0 m-auto w-16 h-16 rounded-full bg-black/50 hover:bg-black/70 backdrop-blur-md border border-white/30 text-white flex items-center justify-center transition opacity-0 hover:opacity-100 focus:opacity-100"
                >
                  {isPlaying ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8 ml-1" />}
                </button>
              </div>

              {/* Scrubber Timeline & Player Controls */}
              <div className="p-4 bg-neutral-900 border-t border-neutral-800 space-y-3">
                {/* Timeline Slider */}
                <div className="flex items-center gap-3">
                  <span className="text-[11px] font-mono text-neutral-400 w-10">
                    {((currentFrameIndex / activeVideo.fps) || 0).toFixed(1)}s
                  </span>
                  <input
                    type="range"
                    min={0}
                    max={(activeVideo.framesCount || 150) - 1}
                    value={currentFrameIndex}
                    onChange={(e) => {
                      setCurrentFrameIndex(Number(e.target.value));
                      setIsPlaying(false);
                    }}
                    className="flex-1 accent-purple-500 h-1.5 rounded-lg bg-neutral-800"
                  />
                  <span className="text-[11px] font-mono text-neutral-400 w-10 text-right">
                    {activeVideo.duration}s
                  </span>
                </div>

                {/* Buttons Row */}
                <div className="flex items-center justify-between text-white">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setIsPlaying(!isPlaying)}
                      className="p-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white transition"
                    >
                      {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
                    </button>
                    <button
                      onClick={() => {
                        setCurrentFrameIndex(0);
                        setIsPlaying(true);
                      }}
                      className="p-2 rounded-xl hover:bg-neutral-800 text-neutral-400 hover:text-white transition"
                      title="Rewind"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setIsLooping(!isLooping)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-mono font-semibold transition ${
                        isLooping ? 'bg-purple-600/30 text-purple-300 border border-purple-500/40' : 'text-neutral-500'
                      }`}
                    >
                      LOOP
                    </button>
                    <select
                      value={playbackSpeed}
                      onChange={(e) => setPlaybackSpeed(Number(e.target.value))}
                      className="bg-neutral-800 text-white text-xs px-2 py-1 rounded-lg border border-neutral-700"
                    >
                      <option value={0.5}>0.5x</option>
                      <option value={1}>1.0x</option>
                      <option value={1.5}>1.5x</option>
                      <option value={2}>2.0x</option>
                    </select>
                  </div>

                  <div className="flex items-center gap-2">
                    {onOpenInImageEditor && (
                      <button
                        onClick={() => onOpenInImageEditor(activeVideo.posterImage)}
                        className="px-3 py-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-xs font-semibold flex items-center gap-1.5 transition text-neutral-200"
                        title="Edit Frame in Image Studio"
                      >
                        <Edit3 className="w-3.5 h-3.5 text-purple-400" />
                        Edit Frame
                      </button>
                    )}
                    <button
                      onClick={handleDownloadSnapshot}
                      className="px-3.5 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-xs font-semibold flex items-center gap-1.5 transition text-white shadow-xs"
                    >
                      <Download className="w-3.5 h-3.5" />
                      Export Video
                    </button>
                  </div>
                </div>

                {/* Director's Motion Script */}
                {activeVideo.motionScript && (
                  <div className="mt-3 p-3 bg-neutral-950 rounded-2xl border border-neutral-800 text-[11px] text-neutral-400 font-sans leading-relaxed">
                    <div className="font-bold text-neutral-300 mb-1 flex items-center gap-1.5">
                      <Sparkles className="w-3 h-3 text-purple-400" />
                      Director's Camera Script
                    </div>
                    <pre className="whitespace-pre-wrap font-sans text-neutral-300">
                      {activeVideo.motionScript}
                    </pre>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center p-12 bg-neutral-50 rounded-3xl border-2 border-dashed border-neutral-200 text-center min-h-[420px]">
              <div className="w-16 h-16 rounded-2xl bg-purple-100 border border-purple-200 flex items-center justify-center text-purple-600 mb-4 shadow-xs">
                <Film className="w-8 h-8" />
              </div>
              <h3 className="text-base font-bold text-neutral-800">Your Video Canvas is Ready</h3>
              <p className="text-xs text-neutral-500 max-w-md mt-1.5 leading-relaxed">
                Enter a text prompt or select an image on the left, pick your camera motion (e.g. Bullet Time or Dolly Zoom), and click Generate to see high-end AI video motion.
              </p>
              <button
                onClick={() => {
                  setPrompt('A futuristic cyberpunk drone swooping through neon skyscrapers in rain');
                  setCameraMotion('FPV Drone');
                }}
                className="mt-4 px-4 py-2 rounded-xl bg-white border border-neutral-300 hover:border-purple-500 text-xs font-semibold text-neutral-700 transition"
              >
                Load Cyberpunk Drone Example
              </button>
            </div>
          )}

          {/* Video History Gallery */}
          {generatedVideos.length > 0 && (
            <div className="space-y-3 pt-2">
              <h4 className="text-xs font-bold text-neutral-800 uppercase tracking-wide">
                Generated Video History ({generatedVideos.length})
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {generatedVideos.map((vid) => (
                  <div
                    key={vid.id}
                    onClick={() => {
                      setActiveVideo(vid);
                      setCurrentFrameIndex(0);
                      setIsPlaying(true);
                    }}
                    className={`relative rounded-2xl overflow-hidden border cursor-pointer group transition ${
                      activeVideo?.id === vid.id
                        ? 'border-purple-600 ring-2 ring-purple-500/20 shadow-md'
                        : 'border-neutral-200 hover:border-purple-300'
                    }`}
                  >
                    <div className="aspect-video w-full bg-neutral-900">
                      <img
                        src={vid.posterImage}
                        alt={vid.prompt}
                        className="w-full h-full object-cover group-hover:scale-105 transition"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div className="p-2 bg-white text-[11px]">
                      <p className="font-semibold text-neutral-800 truncate">{vid.prompt}</p>
                      <div className="flex items-center justify-between text-[10px] text-neutral-500 mt-0.5">
                        <span>{vid.cameraMotion}</span>
                        <span>{vid.duration}s</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
