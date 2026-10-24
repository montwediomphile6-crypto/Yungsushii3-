import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Wand2,
  Sparkles,
  Download,
  Upload,
  RotateCw,
  FlipHorizontal,
  FlipVertical,
  Sliders,
  Type,
  Paintbrush,
  Image as ImageIcon,
  Check,
  Undo2,
  RefreshCw,
  Film,
  ZoomIn,
  Layers,
  Palette,
  Sun,
  Contrast,
  Droplets,
  Edit3
} from 'lucide-react';
import type { GeneratedImage, ImageAdjustments } from '../types';

interface ImageStudioViewProps {
  initialImageToEdit?: string | null;
  onSendToVideoStudio?: (imageUrl: string, prompt?: string) => void;
}

const DEFAULT_ADJUSTMENTS: ImageAdjustments = {
  brightness: 100,
  contrast: 100,
  saturation: 100,
  blur: 0,
  sepia: 0,
  hueRotate: 0,
  exposure: 0,
  filterPreset: 'none',
};

export const ImageStudioView: React.FC<ImageStudioViewProps> = ({
  initialImageToEdit = null,
  onSendToVideoStudio,
}) => {
  const [activeTab, setActiveTab] = useState<'create' | 'edit'>(
    initialImageToEdit ? 'edit' : 'create'
  );

  // ─────────────────────────────────────────────────────────────
  // CREATE / GENERATE STATE
  // ─────────────────────────────────────────────────────────────
  const [prompt, setPrompt] = useState('');
  const [negativePrompt, setNegativePrompt] = useState('');
  const [aspectRatio, setAspectRatio] = useState<string>('1:1');
  const [style, setStyle] = useState<string>('photorealistic');
  const [resolution, setResolution] = useState<string>('2K');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([]);
  const [selectedPreviewImage, setSelectedPreviewImage] = useState<GeneratedImage | null>(null);

  // ─────────────────────────────────────────────────────────────
  // EDIT / CANVAS STATE
  // ─────────────────────────────────────────────────────────────
  const [editImageSrc, setEditImageSrc] = useState<string | null>(initialImageToEdit);
  const [editPrompt, setEditPrompt] = useState('');
  const [isApplyingEdit, setIsApplyingEdit] = useState(false);
  const [editAiFeedback, setEditAiFeedback] = useState<string | null>(null);

  // Canvas adjustments & filters
  const [adjustments, setAdjustments] = useState<ImageAdjustments>(DEFAULT_ADJUSTMENTS);
  const [rotation, setRotation] = useState<number>(0);
  const [flipH, setFlipH] = useState<boolean>(false);
  const [flipV, setFlipV] = useState<boolean>(false);

  // Mask / Brush
  const [isBrushing, setIsBrushing] = useState(false);
  const [brushSize, setBrushSize] = useState(25);
  const [brushMode, setBrushMode] = useState<'paint' | 'erase'>('paint');

  // Text overlay
  const [overlayText, setOverlayText] = useState('');
  const [textColor, setTextColor] = useState('#ffffff');
  const [textSize, setTextSize] = useState(36);
  const [textPosition, setTextPosition] = useState<'top' | 'center' | 'bottom'>('bottom');

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const maskCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const isMouseDownRef = useRef(false);

  // Update edit image when prop changes
  useEffect(() => {
    if (initialImageToEdit) {
      setEditImageSrc(initialImageToEdit);
      setActiveTab('edit');
    }
  }, [initialImageToEdit]);

  // Styles list
  const styleOptions = [
    { id: 'photorealistic', label: 'Photorealistic 8K', icon: '📷' },
    { id: 'cinematic', label: 'Cinematic 35mm', icon: '🎬' },
    { id: 'anime', label: 'Anime & Manga', icon: '🌸' },
    { id: 'cyberpunk', label: 'Cyberpunk Neon', icon: '⚡' },
    { id: '3d_render', label: 'Octane 3D', icon: '💎' },
    { id: 'luxury_editorial', label: 'Haute Editorial', icon: '✨' },
    { id: 'watercolor', label: 'Artistic Watercolor', icon: '🎨' },
    { id: 'retro_vhs', label: 'Retro 80s Synth', icon: '📼' },
  ];

  const filterPresets = [
    { id: 'none', label: 'Original' },
    { id: 'cinematic', label: 'Cinematic Gold' },
    { id: 'cyberpunk', label: 'Cyberpunk Glow' },
    { id: 'noir', label: 'Dramatic Noir' },
    { id: 'vintage', label: '35mm Vintage' },
    { id: 'hdr', label: 'Vibrant HDR' },
    { id: 'sunset', label: 'Warm Sunset' },
  ];

  // Quick Inspiration Prompts
  const inspirationPrompts = [
    'A hyper-detailed portrait of an ethereal celestial guardian surrounded by luminous crystalline butterflies, Octane 8K',
    'A photorealistic cyberpunk street market in Tokyo at twilight with reflective puddles and neon holographic signs',
    'A vintage 1970s sports car parked on a California coastal highway during golden hour, cinematic 35mm film',
    'A majestic biomechanical phoenix with incandescent gold and violet fiber-optic feathers',
  ];

  // Handle Generate Image
  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    setIsGenerating(true);
    try {
      const res = await fetch('/api/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: prompt.trim(),
          negativePrompt: negativePrompt.trim() || undefined,
          aspectRatio,
          style,
          resolution,
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || 'Failed to generate image');
      }

      const data = await res.json();
      const newImg: GeneratedImage = {
        id: `img-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        imageUrl: data.imageUrl,
        prompt,
        negativePrompt,
        aspectRatio,
        style,
        resolution,
        createdAt: new Date().toISOString(),
        description: data.description,
      };

      setGeneratedImages((prev) => [newImg, ...prev]);
      setSelectedPreviewImage(newImg);
    } catch (err: any) {
      console.error('Image gen error:', err);
      alert(err.message || 'Error generating image');
    } finally {
      setIsGenerating(false);
    }
  };

  // Open Image in Editor
  const handleOpenInEditor = (imgSrc: string) => {
    setEditImageSrc(imgSrc);
    setAdjustments(DEFAULT_ADJUSTMENTS);
    setRotation(0);
    setFlipH(false);
    setFlipV(false);
    setEditAiFeedback(null);
    clearMask();
    setActiveTab('edit');
  };

  // Handle File Upload into Editor
  const handleUploadToEdit = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        handleOpenInEditor(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Clear mask canvas
  const clearMask = () => {
    const mask = maskCanvasRef.current;
    if (mask) {
      const ctx = mask.getContext('2d');
      if (ctx) ctx.clearRect(0, 0, mask.width, mask.height);
    }
  };

  // Mask drawing handlers
  const handleMaskMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isBrushing) return;
    isMouseDownRef.current = true;
    drawMaskPoint(e);
  };

  const handleMaskMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isBrushing || !isMouseDownRef.current) return;
    drawMaskPoint(e);
  };

  const handleMaskMouseUp = () => {
    isMouseDownRef.current = false;
  };

  const drawMaskPoint = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = maskCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;

    ctx.save();
    if (brushMode === 'erase') {
      ctx.globalCompositeOperation = 'destination-out';
      ctx.beginPath();
      ctx.arc(x, y, brushSize, 0, Math.PI * 2);
      ctx.fill();
    } else {
      ctx.globalCompositeOperation = 'source-over';
      ctx.fillStyle = 'rgba(236, 72, 153, 0.45)'; // Neon pink mask highlight
      ctx.beginPath();
      ctx.arc(x, y, brushSize, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  };

  // Apply AI Edit / Inpainting Magic
  const handleApplyAiEdit = async () => {
    if (!editImageSrc) return;
    setIsApplyingEdit(true);
    setEditAiFeedback(null);

    try {
      const res = await fetch('/api/edit-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          image: editImageSrc,
          prompt: editPrompt.trim(),
          filter: adjustments.filterPreset,
          adjustments,
        }),
      });

      if (!res.ok) {
        throw new Error('Edit request failed');
      }

      const data = await res.json();
      setEditAiFeedback(
        data.promptNotes || `AI enhancement applied successfully: ${editPrompt}`
      );
    } catch (err: any) {
      console.error('Edit error:', err);
      alert(err.message || 'Error processing edit');
    } finally {
      setIsApplyingEdit(false);
    }
  };

  // Export & Download rendered canvas image
  const handleDownloadEditedImage = () => {
    if (!canvasRef.current && !editImageSrc) return;

    // Render offscreen canvas with all adjustments and text baked in
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const offscreen = document.createElement('canvas');
      offscreen.width = img.naturalWidth || 1024;
      offscreen.height = img.naturalHeight || 1024;
      const ctx = offscreen.getContext('2d');
      if (!ctx) return;

      // Apply transformations
      ctx.save();
      ctx.translate(offscreen.width / 2, offscreen.height / 2);
      ctx.rotate((rotation * Math.PI) / 180);
      ctx.scale(flipH ? -1 : 1, flipV ? -1 : 1);
      ctx.filter = computeFilterString(adjustments);
      ctx.drawImage(img, -offscreen.width / 2, -offscreen.height / 2, offscreen.width, offscreen.height);
      ctx.restore();

      // Draw text overlay if present
      if (overlayText.trim()) {
        ctx.save();
        ctx.font = `bold ${Math.round(textSize * (offscreen.width / 600))}px system-ui, sans-serif`;
        ctx.fillStyle = textColor;
        ctx.textAlign = 'center';
        ctx.shadowColor = 'rgba(0,0,0,0.8)';
        ctx.shadowBlur = 10;

        let yPos = offscreen.height * 0.9;
        if (textPosition === 'center') yPos = offscreen.height * 0.5;
        if (textPosition === 'top') yPos = offscreen.height * 0.15;

        ctx.fillText(overlayText, offscreen.width / 2, yPos);
        ctx.restore();
      }

      const finalDataUrl = offscreen.toDataURL('image/png');
      const a = document.createElement('a');
      a.href = finalDataUrl;
      a.download = `remix_studio_image_${Date.now()}.png`;
      a.click();
    };
    img.src = editImageSrc!;
  };

  // Compute CSS filter string
  const computeFilterString = (adj: ImageAdjustments) => {
    let base = `brightness(${adj.brightness}%) contrast(${adj.contrast}%) saturate(${adj.saturation}%) blur(${adj.blur}px) sepia(${adj.sepia}%) hue-rotate(${adj.hueRotate}deg)`;
    if (adj.filterPreset === 'cinematic') {
      base += ' contrast(115%) brightness(105%) saturate(120%) sepia(15%)';
    } else if (adj.filterPreset === 'cyberpunk') {
      base += ' contrast(125%) hue-rotate(180deg) saturate(140%)';
    } else if (adj.filterPreset === 'noir') {
      base += ' grayscale(100%) contrast(140%) brightness(90%)';
    } else if (adj.filterPreset === 'vintage') {
      base += ' sepia(40%) contrast(90%) brightness(105%)';
    } else if (adj.filterPreset === 'hdr') {
      base += ' contrast(130%) saturate(140%) brightness(105%)';
    } else if (adj.filterPreset === 'sunset') {
      base += ' sepia(30%) hue-rotate(330deg) saturate(130%)';
    }
    return base;
  };

  return (
    <div className="w-full space-y-8 max-w-7xl mx-auto px-2 sm:px-4">
      {/* Top Tab Navigator */}
      <div className="flex items-center justify-between border-b border-neutral-200 pb-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-sans font-bold tracking-tight text-neutral-900">
            Image Creation & Editing Studio
          </h1>
          <p className="text-xs text-neutral-500 mt-0.5">
            Create 4K neural artwork with custom styles or edit with AI inpainting, filters, and canvas tools.
          </p>
        </div>

        <div className="flex p-1 bg-neutral-100 rounded-2xl">
          <button
            onClick={() => setActiveTab('create')}
            className={`flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-bold transition ${
              activeTab === 'create'
                ? 'bg-white text-neutral-900 shadow-xs'
                : 'text-neutral-500 hover:text-neutral-900'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-purple-600" />
            Create Images
          </button>
          <button
            onClick={() => setActiveTab('edit')}
            className={`flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-bold transition ${
              activeTab === 'edit'
                ? 'bg-white text-neutral-900 shadow-xs'
                : 'text-neutral-500 hover:text-neutral-900'
            }`}
          >
            <Edit3 className="w-3.5 h-3.5 text-purple-600" />
            Edit & Canvas ({editImageSrc ? '1 Active' : '0'})
          </button>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          TAB 1: CREATE IMAGES
      ───────────────────────────────────────────────────────────── */}
      {activeTab === 'create' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Prompts & Controls */}
          <div className="lg:col-span-5 space-y-6 bg-white p-6 rounded-3xl border border-neutral-200 shadow-xs">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-neutral-800 uppercase tracking-wide">
                  Image Prompt
                </label>
                <button
                  onClick={() => {
                    const rnd = inspirationPrompts[Math.floor(Math.random() * inspirationPrompts.length)];
                    setPrompt(rnd);
                  }}
                  className="text-[11px] text-purple-600 hover:text-purple-800 font-semibold flex items-center gap-1"
                >
                  <Wand2 className="w-3 h-3" />
                  Inspire Me
                </button>
              </div>
              <textarea
                rows={3}
                placeholder="Describe what you want to see: subjects, lighting, environment, mood..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="w-full p-3.5 text-xs rounded-2xl border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-purple-500 placeholder-neutral-400 resize-none"
              />
            </div>

            {/* Negative Prompt */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-neutral-600 uppercase">
                Negative Prompt (Optional)
              </label>
              <input
                type="text"
                placeholder="blurry, distorted, bad hands, low resolution, watermark..."
                value={negativePrompt}
                onChange={(e) => setNegativePrompt(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-purple-500 text-neutral-700"
              />
            </div>

            {/* Art Style Selector */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-neutral-800 uppercase tracking-wide flex items-center gap-1.5">
                <Palette className="w-3.5 h-3.5 text-purple-600" />
                Art & Visual Style
              </label>
              <div className="grid grid-cols-2 gap-2">
                {styleOptions.map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => setStyle(opt.id)}
                    className={`p-2.5 rounded-xl border text-left transition flex items-center gap-2 ${
                      style === opt.id
                        ? 'border-purple-600 bg-purple-50 text-purple-900 font-bold'
                        : 'border-neutral-200 hover:border-neutral-300 text-neutral-700 text-xs'
                    }`}
                  >
                    <span>{opt.icon}</span>
                    <span className="truncate text-xs">{opt.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Aspect Ratio & Resolution */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-bold text-neutral-600 uppercase mb-1.5">
                  Aspect Ratio
                </label>
                <select
                  value={aspectRatio}
                  onChange={(e) => setAspectRatio(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
                >
                  <option value="1:1">1:1 Square (Instagram)</option>
                  <option value="16:9">16:9 Landscape (Cinematic)</option>
                  <option value="9:16">9:16 Portrait (Mobile/Stories)</option>
                  <option value="4:3">4:3 Classic Standard</option>
                  <option value="3:4">3:4 Vertical Photo</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-neutral-600 uppercase mb-1.5">
                  Resolution
                </label>
                <div className="flex gap-2">
                  {['1K', '2K', '4K'].map((res) => (
                    <button
                      key={res}
                      type="button"
                      onClick={() => setResolution(res)}
                      className={`flex-1 py-1.5 text-xs rounded-lg border font-semibold ${
                        resolution === res
                          ? 'bg-purple-600 text-white border-purple-600'
                          : 'border-neutral-300 text-neutral-700'
                      }`}
                    >
                      {res}
                    </button>
                  ))}
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
                  <span>Synthesizing Image...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Generate Image</span>
                </>
              )}
            </button>
          </div>

          {/* Right: Showcase & Gallery */}
          <div className="lg:col-span-7 space-y-6">
            {selectedPreviewImage ? (
              <div className="bg-white rounded-3xl overflow-hidden border border-neutral-200 shadow-lg p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-md bg-purple-100 text-purple-800 text-[11px] font-bold uppercase">
                      {selectedPreviewImage.style}
                    </span>
                    <span className="text-xs text-neutral-500 font-mono">
                      {selectedPreviewImage.aspectRatio} • {selectedPreviewImage.resolution}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleOpenInEditor(selectedPreviewImage.imageUrl)}
                      className="px-3 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 text-xs font-semibold flex items-center gap-1.5 transition"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      Open in Editor
                    </button>
                    {onSendToVideoStudio && (
                      <button
                        onClick={() =>
                          onSendToVideoStudio(
                            selectedPreviewImage.imageUrl,
                            selectedPreviewImage.prompt
                          )
                        }
                        className="px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-semibold flex items-center gap-1.5 transition"
                      >
                        <Film className="w-3.5 h-3.5" />
                        Animate to Video
                      </button>
                    )}
                    <a
                      href={selectedPreviewImage.imageUrl}
                      download={`remix_image_${selectedPreviewImage.id}.jpg`}
                      className="p-1.5 rounded-xl hover:bg-neutral-100 text-neutral-600 transition"
                      title="Download Image"
                    >
                      <Download className="w-4 h-4" />
                    </a>
                  </div>
                </div>

                <div className="relative rounded-2xl overflow-hidden bg-neutral-900 border border-neutral-100 flex items-center justify-center">
                  <img
                    src={selectedPreviewImage.imageUrl}
                    alt={selectedPreviewImage.prompt}
                    className="w-full max-h-[520px] object-contain rounded-2xl"
                    referrerPolicy="no-referrer"
                  />
                </div>

                <div className="text-xs text-neutral-700 p-3 bg-neutral-50 rounded-2xl border border-neutral-100">
                  <span className="font-semibold text-neutral-900">Prompt:</span> "{selectedPreviewImage.prompt}"
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center p-12 bg-neutral-50 rounded-3xl border-2 border-dashed border-neutral-200 text-center min-h-[380px]">
                <div className="w-16 h-16 rounded-2xl bg-purple-100 border border-purple-200 flex items-center justify-center text-purple-600 mb-4 shadow-xs">
                  <ImageIcon className="w-8 h-8" />
                </div>
                <h3 className="text-base font-bold text-neutral-800">No Image Generated Yet</h3>
                <p className="text-xs text-neutral-500 max-w-sm mt-1.5">
                  Enter a creative prompt or pick one with 'Inspire Me', choose your style, and click Generate to see high-res output here.
                </p>
              </div>
            )}

            {/* Generated Gallery Thumbnails */}
            {generatedImages.length > 0 && (
              <div className="space-y-3 pt-2">
                <h4 className="text-xs font-bold text-neutral-800 uppercase tracking-wide">
                  Recent Creations ({generatedImages.length})
                </h4>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                  {generatedImages.map((img) => (
                    <div
                      key={img.id}
                      onClick={() => setSelectedPreviewImage(img)}
                      className={`relative rounded-2xl overflow-hidden border cursor-pointer aspect-square bg-neutral-900 group transition ${
                        selectedPreviewImage?.id === img.id
                          ? 'border-purple-600 ring-2 ring-purple-500/20 shadow-md'
                          : 'border-neutral-200 hover:border-purple-300'
                      }`}
                    >
                      <img
                        src={img.imageUrl}
                        alt={img.prompt}
                        className="w-full h-full object-cover group-hover:scale-105 transition"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          TAB 2: EDIT & CANVAS STUDIO
      ───────────────────────────────────────────────────────────── */}
      {activeTab === 'edit' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Edit Tools & Adjustments */}
          <div className="lg:col-span-5 space-y-6 bg-white p-6 rounded-3xl border border-neutral-200 shadow-xs">
            {/* Image Selection / Upload */}
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
              <span className="text-xs font-bold text-neutral-800 uppercase tracking-wide">
                Canvas Source Image
              </span>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="text-xs text-purple-600 hover:text-purple-800 font-semibold flex items-center gap-1.5"
              >
                <Upload className="w-3.5 h-3.5" />
                Upload New Image
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleUploadToEdit}
              />
            </div>

            {/* AI Prompt Inpainting & Transformation */}
            <div className="space-y-2 p-4 bg-purple-50/60 rounded-2xl border border-purple-100">
              <div className="flex items-center gap-2 text-xs font-bold text-purple-900">
                <Wand2 className="w-4 h-4 text-purple-600" />
                AI Prompt-Based Magic Edit
              </div>
              <p className="text-[11px] text-purple-800/80">
                Describe visual modifications (e.g. "Add neon cyberpunk glasses", "Make background golden sunset", "Apply oil painting brushwork").
              </p>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Enter change description..."
                  value={editPrompt}
                  onChange={(e) => setEditPrompt(e.target.value)}
                  className="flex-1 px-3 py-2 text-xs rounded-xl border border-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
                />
                <button
                  onClick={handleApplyAiEdit}
                  disabled={isApplyingEdit || !editPrompt.trim()}
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-neutral-200 text-white font-bold text-xs rounded-xl shadow-xs transition"
                >
                  {isApplyingEdit ? 'Applying...' : 'Apply AI Edit'}
                </button>
              </div>

              {editAiFeedback && (
                <div className="p-2.5 bg-white rounded-xl border border-purple-200 text-[11px] text-neutral-700 mt-2 font-medium">
                  {editAiFeedback}
                </div>
              )}
            </div>

            {/* Preset Filters */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-neutral-800 uppercase tracking-wide">
                Cinematic Color Filters
              </label>
              <div className="flex flex-wrap gap-1.5">
                {filterPresets.map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setAdjustments((prev) => ({ ...prev, filterPreset: f.id }))}
                    className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition ${
                      adjustments.filterPreset === f.id
                        ? 'bg-purple-600 text-white border-purple-600 shadow-xs'
                        : 'border-neutral-200 hover:border-neutral-300 text-neutral-700'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Pro Adjustments Sliders */}
            <div className="space-y-3 pt-2 border-t border-neutral-100">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-neutral-800 uppercase tracking-wide">
                  Color & Lighting Adjustments
                </span>
                <button
                  onClick={() => setAdjustments(DEFAULT_ADJUSTMENTS)}
                  className="text-[11px] text-neutral-500 hover:text-neutral-800 flex items-center gap-1"
                >
                  <RefreshCw className="w-3 h-3" />
                  Reset
                </button>
              </div>

              {/* Brightness */}
              <div className="space-y-1">
                <div className="flex justify-between text-[11px] text-neutral-600">
                  <span className="flex items-center gap-1"><Sun className="w-3 h-3" /> Brightness</span>
                  <span>{adjustments.brightness}%</span>
                </div>
                <input
                  type="range"
                  min={50}
                  max={150}
                  value={adjustments.brightness}
                  onChange={(e) => setAdjustments({ ...adjustments, brightness: Number(e.target.value) })}
                  className="w-full accent-purple-600"
                />
              </div>

              {/* Contrast */}
              <div className="space-y-1">
                <div className="flex justify-between text-[11px] text-neutral-600">
                  <span className="flex items-center gap-1"><Contrast className="w-3 h-3" /> Contrast</span>
                  <span>{adjustments.contrast}%</span>
                </div>
                <input
                  type="range"
                  min={50}
                  max={150}
                  value={adjustments.contrast}
                  onChange={(e) => setAdjustments({ ...adjustments, contrast: Number(e.target.value) })}
                  className="w-full accent-purple-600"
                />
              </div>

              {/* Saturation */}
              <div className="space-y-1">
                <div className="flex justify-between text-[11px] text-neutral-600">
                  <span className="flex items-center gap-1"><Droplets className="w-3 h-3" /> Saturation</span>
                  <span>{adjustments.saturation}%</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={200}
                  value={adjustments.saturation}
                  onChange={(e) => setAdjustments({ ...adjustments, saturation: Number(e.target.value) })}
                  className="w-full accent-purple-600"
                />
              </div>

              {/* Blur */}
              <div className="space-y-1">
                <div className="flex justify-between text-[11px] text-neutral-600">
                  <span>Blur</span>
                  <span>{adjustments.blur}px</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={10}
                  value={adjustments.blur}
                  onChange={(e) => setAdjustments({ ...adjustments, blur: Number(e.target.value) })}
                  className="w-full accent-purple-600"
                />
              </div>
            </div>

            {/* Transform Controls (Rotate & Flip) */}
            <div className="space-y-2 pt-2 border-t border-neutral-100">
              <label className="text-xs font-bold text-neutral-800 uppercase tracking-wide">
                Orientation & Transform
              </label>
              <div className="flex gap-2">
                <button
                  onClick={() => setRotation((r) => (r + 90) % 360)}
                  className="flex-1 py-2 px-3 rounded-xl border border-neutral-200 hover:border-neutral-300 text-xs font-medium text-neutral-700 flex items-center justify-center gap-1.5"
                >
                  <RotateCw className="w-3.5 h-3.5" />
                  Rotate 90°
                </button>
                <button
                  onClick={() => setFlipH((f) => !f)}
                  className={`flex-1 py-2 px-3 rounded-xl border text-xs font-medium flex items-center justify-center gap-1.5 ${
                    flipH ? 'border-purple-600 bg-purple-50 text-purple-900' : 'border-neutral-200 text-neutral-700'
                  }`}
                >
                  <FlipHorizontal className="w-3.5 h-3.5" />
                  Flip H
                </button>
                <button
                  onClick={() => setFlipV((f) => !f)}
                  className={`flex-1 py-2 px-3 rounded-xl border text-xs font-medium flex items-center justify-center gap-1.5 ${
                    flipV ? 'border-purple-600 bg-purple-50 text-purple-900' : 'border-neutral-200 text-neutral-700'
                  }`}
                >
                  <FlipVertical className="w-3.5 h-3.5" />
                  Flip V
                </button>
              </div>
            </div>

            {/* Text Overlay Tool */}
            <div className="space-y-2 pt-2 border-t border-neutral-100">
              <label className="text-xs font-bold text-neutral-800 uppercase tracking-wide flex items-center gap-1.5">
                <Type className="w-3.5 h-3.5 text-purple-600" />
                Text Caption Overlay
              </label>
              <input
                type="text"
                placeholder="Enter text watermark or title..."
                value={overlayText}
                onChange={(e) => setOverlayText(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              {overlayText && (
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={textColor}
                    onChange={(e) => setTextColor(e.target.value)}
                    className="w-8 h-8 rounded-lg border-0 cursor-pointer"
                  />
                  <div className="flex gap-1 flex-1">
                    {(['top', 'center', 'bottom'] as const).map((pos) => (
                      <button
                        key={pos}
                        onClick={() => setTextPosition(pos)}
                        className={`flex-1 py-1 text-[11px] rounded-lg border capitalize font-medium ${
                          textPosition === pos ? 'bg-purple-600 text-white border-purple-600' : 'border-neutral-200 text-neutral-700'
                        }`}
                      >
                        {pos}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right: Live Interactive Canvas Viewport */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white rounded-3xl p-5 border border-neutral-200 shadow-lg space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsBrushing(!isBrushing)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition ${
                      isBrushing
                        ? 'bg-pink-600 text-white shadow-xs'
                        : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-700'
                    }`}
                  >
                    <Paintbrush className="w-3.5 h-3.5" />
                    {isBrushing ? 'Brush Active (Draw Mask)' : 'Enable Inpainting Brush'}
                  </button>

                  {isBrushing && (
                    <>
                      <button
                        onClick={() => setBrushMode(brushMode === 'paint' ? 'erase' : 'paint')}
                        className="px-2.5 py-1 text-xs rounded-lg border border-neutral-300 text-neutral-700 font-medium"
                      >
                        {brushMode === 'paint' ? 'Mode: Paint' : 'Mode: Erase'}
                      </button>
                      <button
                        onClick={clearMask}
                        className="text-xs text-neutral-500 hover:text-red-500 font-medium"
                      >
                        Clear
                      </button>
                    </>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  {onSendToVideoStudio && editImageSrc && (
                    <button
                      onClick={() => onSendToVideoStudio(editImageSrc, editPrompt || 'Animate this edited scene')}
                      className="px-3.5 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-semibold flex items-center gap-1.5 transition"
                    >
                      <Film className="w-3.5 h-3.5" />
                      Animate to Video
                    </button>
                  )}
                  <button
                    onClick={handleDownloadEditedImage}
                    disabled={!editImageSrc}
                    className="px-4 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold flex items-center gap-1.5 transition shadow-xs"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Export Image
                  </button>
                </div>
              </div>

              {/* Viewport Canvas Container */}
              <div className="relative w-full aspect-square sm:aspect-4/3 bg-neutral-900 rounded-2xl overflow-hidden flex items-center justify-center border border-neutral-200">
                {editImageSrc ? (
                  <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
                    {/* Filtered & Transformed Image */}
                    <img
                      src={editImageSrc}
                      alt="Canvas Preview"
                      className="max-w-full max-h-full object-contain transition-all duration-100"
                      style={{
                        transform: `rotate(${rotation}deg) scaleX(${flipH ? -1 : 1}) scaleY(${flipV ? -1 : 1})`,
                        filter: computeFilterString(adjustments),
                      }}
                      referrerPolicy="no-referrer"
                    />

                    {/* Mask Canvas Overlay for Brush inpainting */}
                    <canvas
                      ref={maskCanvasRef}
                      width={800}
                      height={600}
                      onMouseDown={handleMaskMouseDown}
                      onMouseMove={handleMaskMouseMove}
                      onMouseUp={handleMaskMouseUp}
                      onMouseLeave={handleMaskMouseUp}
                      className={`absolute inset-0 w-full h-full ${
                        isBrushing ? 'cursor-crosshair z-20' : 'pointer-events-none z-10'
                      }`}
                    />

                    {/* Text Overlay Display */}
                    {overlayText.trim() && (
                      <div
                        className="absolute inset-x-0 z-30 flex items-center justify-center pointer-events-none p-6"
                        style={{
                          top: textPosition === 'top' ? '8%' : textPosition === 'center' ? '45%' : 'auto',
                          bottom: textPosition === 'bottom' ? '8%' : 'auto',
                        }}
                      >
                        <span
                          className="font-bold text-center drop-shadow-[0_4px_8px_rgba(0,0,0,0.8)]"
                          style={{
                            color: textColor,
                            fontSize: `${textSize}px`,
                            textShadow: '0 2px 10px rgba(0,0,0,0.9)',
                          }}
                        >
                          {overlayText}
                        </span>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center p-8 text-center text-neutral-400">
                    <ImageIcon className="w-12 h-12 mb-3 text-neutral-600" />
                    <p className="text-sm font-semibold text-neutral-300">No Image Loaded in Canvas</p>
                    <p className="text-xs text-neutral-500 mt-1">
                      Upload an image or generate one in the 'Create Images' tab to start editing.
                    </p>
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="mt-4 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold shadow-xs transition"
                    >
                      Upload Image to Canvas
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
