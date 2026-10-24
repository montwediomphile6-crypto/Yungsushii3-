import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles,
  Video,
  Camera,
  Play,
  RotateCcw,
  Zap,
  Flame,
  Wand2,
  Sliders,
  ExternalLink,
  Search,
  Check,
  ChevronRight,
  Info
} from 'lucide-react';
import type { HiggsfieldTemplate } from '../types';

interface HiggsfieldTemplatesViewProps {
  onUseTemplateInVideo: (template: HiggsfieldTemplate, customSubject?: string) => void;
  onUseTemplateInImage: (template: HiggsfieldTemplate, customSubject?: string) => void;
}

export const HiggsfieldTemplatesView: React.FC<HiggsfieldTemplatesViewProps> = ({
  onUseTemplateInVideo,
  onUseTemplateInImage,
}) => {
  const [templates, setTemplates] = useState<HiggsfieldTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activePreviewId, setActivePreviewId] = useState<string | null>(null);

  // Modal for quick customization
  const [customizingTemplate, setCustomizingTemplate] = useState<HiggsfieldTemplate | null>(null);
  const [customSubject, setCustomSubject] = useState('');

  useEffect(() => {
    fetch('/api/templates')
      .then((r) => r.json())
      .then((data) => {
        if (data.templates) {
          setTemplates(data.templates);
        }
      })
      .catch((err) => console.error('Failed to load templates:', err))
      .finally(() => setLoading(false));
  }, []);

  const categories = [
    { id: 'all', label: 'All Templates', icon: Sparkles },
    { id: 'camera_motion', label: 'Camera Motion', icon: Camera },
    { id: 'visual_fx', label: 'Visual FX & Metamorphosis', icon: Wand2 },
    { id: 'cinematic', label: 'Cinematic & Sci-Fi', icon: Video },
    { id: 'stylized', label: 'Anime & Stylized', icon: Flame },
    { id: 'viral', label: 'Viral & Social', icon: Zap },
  ];

  const filteredTemplates = templates.filter((tpl) => {
    const matchesCategory = selectedCategory === 'all' || tpl.category === selectedCategory;
    const matchesSearch =
      tpl.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tpl.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tpl.cameraMovement.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tpl.sampleTags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const handleOpenCustomize = (tpl: HiggsfieldTemplate) => {
    setCustomizingTemplate(tpl);
    setCustomSubject('');
  };

  return (
    <div className="w-full space-y-8 max-w-7xl mx-auto px-2 sm:px-4">
      {/* Hero Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-linear-to-r from-neutral-950 via-purple-950 to-neutral-900 border border-purple-500/20 p-6 sm:p-10 shadow-2xl text-white">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-96 h-96 bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-10 w-80 h-80 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-2xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 border border-purple-400/30 text-purple-300 text-xs font-semibold tracking-wide uppercase">
              <Sparkles className="w-3.5 h-3.5 text-purple-400" />
              Official Integration
            </div>
            <h1 className="text-3xl sm:text-5xl font-sans font-bold tracking-tight bg-linear-to-r from-white via-neutral-100 to-purple-200 bg-clip-text text-transparent">
              Templates from @Higgsfield
            </h1>
            <p className="text-sm sm:text-base text-neutral-300 leading-relaxed font-light">
              Explore physics-defying camera choreography, seamless 360° bullet-time pans, vertigo dolly zooms, and cinematic transformations curated directly from the <strong>@Higgsfield AI</strong> motion ecosystem.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10 text-center sm:text-left">
              <div className="text-2xl font-bold text-white tracking-tight">12+</div>
              <div className="text-xs text-neutral-300 font-medium">Higgsfield Presets</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10 text-center sm:text-left">
              <div className="text-2xl font-bold text-amber-400 tracking-tight">60 FPS</div>
              <div className="text-xs text-neutral-300 font-medium">Cinematic Motion</div>
            </div>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="relative z-10 mt-8 flex flex-col sm:flex-row gap-4 items-center justify-between border-t border-white/10 pt-6">
          <div className="flex items-center gap-2 overflow-x-auto w-full pb-2 sm:pb-0 no-scrollbar">
            {categories.map((cat) => {
              const Icon = cat.icon;
              const isActive = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-200 ${
                    isActive
                      ? 'bg-white text-neutral-900 shadow-md font-bold scale-[1.02]'
                      : 'bg-white/10 hover:bg-white/20 text-neutral-200'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {cat.label}
                </button>
              );
            })}
          </div>

          <div className="relative w-full sm:w-64 shrink-0">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              placeholder="Search camera motion..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/10 border border-white/15 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-purple-400/50"
            />
          </div>
        </div>
      </div>

      {/* Templates Grid */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="w-10 h-10 border-4 border-purple-600 border-t-transparent rounded-full animate-spin" />
          <p className="mt-4 text-sm text-neutral-500 font-medium">Loading @Higgsfield camera motions...</p>
        </div>
      ) : filteredTemplates.length === 0 ? (
        <div className="text-center py-16 bg-neutral-50 rounded-3xl border border-neutral-200">
          <p className="text-base font-semibold text-neutral-700">No templates matched your search</p>
          <p className="text-xs text-neutral-500 mt-1">Try clearing your filters or search keywords</p>
          <button
            onClick={() => { setSelectedCategory('all'); setSearchQuery(''); }}
            className="mt-4 px-4 py-2 bg-neutral-900 text-white text-xs font-medium rounded-xl hover:bg-neutral-800"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTemplates.map((tpl) => {
            const isHovered = activePreviewId === tpl.id;
            return (
              <motion.div
                key={tpl.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="group relative flex flex-col bg-white rounded-3xl border border-neutral-200/80 shadow-xs hover:shadow-xl hover:border-purple-300 transition-all duration-300 overflow-hidden"
                onMouseEnter={() => setActivePreviewId(tpl.id)}
                onMouseLeave={() => setActivePreviewId(null)}
              >
                {/* Visual Motion Simulation Header */}
                <div className={`relative h-52 w-full bg-linear-to-br ${tpl.previewGradient} flex items-center justify-center overflow-hidden p-4`}>
                  {/* Dynamic background grid & particles */}
                  <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />

                  {/* Simulated 3D Camera Rig Perspective */}
                  <motion.div
                    className="relative z-10 w-32 h-32 rounded-2xl border-2 border-white/40 bg-white/10 backdrop-blur-md flex flex-col items-center justify-center text-white shadow-2xl"
                    animate={
                      isHovered
                        ? tpl.cameraMovement.type === 'Bullet Time'
                          ? { rotateY: [0, 180, 360], scale: [1, 1.1, 1] }
                          : tpl.cameraMovement.type === 'FPV Drone'
                          ? { y: [-20, 20, -20], rotateZ: [-15, 15, -15], scale: [0.9, 1.15, 0.9] }
                          : tpl.cameraMovement.type === 'Dolly Zoom'
                          ? { scale: [1, 1.35, 1], zIndex: 20 }
                          : tpl.cameraMovement.type === 'Crash Zoom'
                          ? { scale: [1, 1.5, 1.2], rotateX: [0, 20, 0] }
                          : { rotateZ: [0, 360], scale: [1, 1.05, 1] }
                        : { rotateY: 0, scale: 1 }
                    }
                    transition={{
                      repeat: isHovered ? Infinity : 0,
                      duration: tpl.recommendedDuration || 4,
                      ease: 'easeInOut',
                    }}
                  >
                    <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center mb-1 shadow-inner">
                      <Camera className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-[11px] font-bold tracking-wider uppercase text-white/90">
                      {tpl.cameraMovement.type}
                    </span>
                    <span className="text-[9px] text-white/70">
                      {tpl.cameraMovement.focalLength}
                    </span>
                  </motion.div>

                  {/* Creator Badge */}
                  <div className="absolute top-3 left-3 z-20 flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/40 backdrop-blur-md border border-white/20 text-[11px] font-semibold text-white">
                    <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
                    {tpl.creator}
                  </div>

                  {/* Ratio badge */}
                  <div className="absolute top-3 right-3 z-20 px-2.5 py-1 rounded-lg bg-black/40 backdrop-blur-md border border-white/20 text-[10px] font-mono text-white/90">
                    {tpl.recommendedRatio} • {tpl.recommendedDuration}s
                  </div>

                  {/* Intensity Telemetry Bar */}
                  <div className="absolute bottom-3 left-3 right-3 z-20 flex items-center justify-between px-3 py-1.5 rounded-xl bg-black/50 backdrop-blur-md border border-white/10 text-white text-[10px]">
                    <span className="text-white/70">Motion Intensity</span>
                    <div className="flex items-center gap-1.5">
                      <div className="w-24 h-1.5 bg-white/20 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-linear-to-r from-amber-400 to-purple-400 rounded-full"
                          style={{ width: `${(tpl.cameraMovement.motionIntensity / 10) * 100}%` }}
                        />
                      </div>
                      <span className="font-mono font-bold text-amber-300">
                        {tpl.cameraMovement.motionIntensity}/10
                      </span>
                    </div>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-sans font-bold text-neutral-900 text-base leading-snug group-hover:text-purple-600 transition">
                        {tpl.title}
                      </h3>
                    </div>
                    <p className="text-xs text-neutral-600 leading-relaxed line-clamp-2">
                      {tpl.description}
                    </p>

                    {/* Camera Trajectory Description */}
                    <div className="p-2.5 rounded-xl bg-neutral-50 border border-neutral-100 text-[11px] text-neutral-700 flex items-center gap-2">
                      <Sliders className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                      <span className="truncate">
                        <strong>Trajectory:</strong> {tpl.cameraMovement.trajectory}
                      </span>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {tpl.sampleTags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-0.5 rounded-md bg-purple-50 text-purple-700 font-medium text-[10px] border border-purple-100"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-2 border-t border-neutral-100 flex items-center gap-2">
                    <button
                      onClick={() => handleOpenCustomize(tpl)}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-linear-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-medium text-xs shadow-xs transition"
                    >
                      <Video className="w-3.5 h-3.5" />
                      Use Template
                    </button>
                    <button
                      onClick={() => onUseTemplateInImage(tpl)}
                      title="Use Style in Image Studio"
                      className="p-2.5 rounded-xl border border-neutral-200 hover:border-neutral-300 bg-white hover:bg-neutral-50 text-neutral-700 text-xs transition"
                    >
                      <Camera className="w-4 h-4 text-neutral-600" />
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Quick Customize Modal */}
      <AnimatePresence>
        {customizingTemplate && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-neutral-200 overflow-hidden"
            >
              <div className={`p-6 bg-linear-to-r ${customizingTemplate.previewGradient} text-white relative`}>
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-white/80 mb-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  @Higgsfield Template
                </div>
                <h3 className="text-xl font-bold">{customizingTemplate.title}</h3>
                <p className="text-xs text-white/80 mt-1">{customizingTemplate.description}</p>
                <button
                  onClick={() => setCustomizingTemplate(null)}
                  className="absolute top-5 right-5 text-white/80 hover:text-white text-lg font-bold w-8 h-8 rounded-full bg-black/20 flex items-center justify-center"
                >
                  &times;
                </button>
              </div>

              <div className="p-6 space-y-5">
                <div>
                  <label className="block text-xs font-bold text-neutral-800 uppercase tracking-wide mb-1.5">
                    Enter Your Subject or Scene
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Cyberpunk sports car drifting in rain, futuristic city, lone samurai"
                    value={customSubject}
                    onChange={(e) => setCustomSubject(e.target.value)}
                    className="w-full px-4 py-2.5 text-sm rounded-xl border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    autoFocus
                  />
                  <p className="text-[11px] text-neutral-500 mt-1">
                    Higgsfield prompt formula will dynamically merge your subject with the camera motion physics.
                  </p>
                </div>

                <div className="p-3.5 bg-neutral-50 rounded-2xl border border-neutral-200 text-xs space-y-2">
                  <div className="font-semibold text-neutral-800 flex items-center gap-1.5">
                    <Info className="w-3.5 h-3.5 text-purple-600" />
                    Higgsfield Formula Preview
                  </div>
                  <p className="text-neutral-600 italic">
                    "{customizingTemplate.promptFormula.replace('{subject}', customSubject.trim() || '[Your Subject]')}"
                  </p>
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    onClick={() => setCustomizingTemplate(null)}
                    className="px-4 py-2 text-xs font-medium text-neutral-600 hover:text-neutral-900"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      const subject = customSubject.trim() || undefined;
                      const tpl = customizingTemplate;
                      setCustomizingTemplate(null);
                      onUseTemplateInVideo(tpl, subject);
                    }}
                    className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold flex items-center gap-2 shadow-sm"
                  >
                    <Video className="w-3.5 h-3.5" />
                    Generate in Video Studio
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
