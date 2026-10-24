export interface ReportInsight {
  title: string;
  detail: string;
  metric?: string;
  value?: string;
}

export interface ReportChart {
  title: string;
  file: string;
  caption?: string;
  type?: string;
  /** Base64 data URL injected by the server after extracting the PNG from the sandbox. */
  image?: string;
  data?: Array<Record<string, any>>;
  xAxisKey?: string;
  yAxisKey?: string;
  seriesNames?: string[];
}

export interface ReportTable {
  title: string;
  columns: string[];
  rows: Array<Array<string | number | null>>;
  caption?: string;
}

export interface AnalysisReport {
  dataset_name: string;
  question: string;
  title: string;
  executive_summary: string;
  insights: ReportInsight[];
  charts: ReportChart[];
  tables: ReportTable[];
  methodology?: string;
  recommendations?: string[];
  generated_at?: string;
}

export type ActivityType =
  | 'info'
  | 'thinking'
  | 'text'
  | 'tool_call'
  | 'tool_result'
  | 'error';

export interface ActivityLog {
  id: string;
  timestamp: string;
  type: ActivityType;
  content?: string;
  name?: string;
  args?: Record<string, unknown>;
  result?: string;
}

export interface UploadedFile {
  name: string;
  content?: string;
  gsUri?: string;
  localPath?: string;
  isLocal?: boolean;
  isGcsUri?: boolean;
  size?: number;
  driveId?: string;
  mimeType?: string;
}

export type ActiveStudioTab = 'zte_g5ts' | 'higgsfield' | 'video' | 'image' | 'voice' | 'data';

export interface HiggsfieldTemplate {
  id: string;
  title: string;
  category: "camera_motion" | "visual_fx" | "cinematic" | "stylized" | "viral";
  creator: "@Higgsfield";
  description: string;
  promptFormula: string;
  negativePrompt: string;
  cameraMovement: {
    type: "Bullet Time" | "FPV Drone" | "Dolly Zoom" | "Orbit Arc" | "Crash Zoom" | "Speed Ramp" | "Crane Down" | "Infinite Loop";
    trajectory: string;
    focalLength: string;
    motionIntensity: number;
    speedCurve: "Linear" | "EaseInOut" | "Exponential Ramp" | "Reverse Ease";
  };
  sampleTags: string[];
  recommendedRatio: "16:9" | "9:16" | "1:1";
  recommendedDuration: number;
  previewGradient: string;
}

export interface GeneratedImage {
  id: string;
  imageUrl: string;
  prompt: string;
  negativePrompt?: string;
  aspectRatio: string;
  style: string;
  resolution: string;
  createdAt: string;
  description?: string;
}

export interface CameraKeyframe {
  frameIndex: number;
  t: number;
  pitch: number;
  yaw: number;
  roll: number;
  zoom: number;
  xOffset: number;
  yOffset: number;
}

export interface GeneratedVideo {
  id: string;
  prompt: string;
  template?: string | null;
  cameraMotion: string;
  duration: number;
  aspectRatio: string;
  fps: number;
  framesCount: number;
  keyframes: CameraKeyframe[];
  posterImage: string;
  motionScript?: string;
  createdAt: string;
}

export interface ImageAdjustments {
  brightness: number; // 50 to 150 (default 100)
  contrast: number; // 50 to 150 (default 100)
  saturation: number; // 0 to 200 (default 100)
  blur: number; // 0 to 20 (default 0)
  sepia: number; // 0 to 100 (default 0)
  hueRotate: number; // 0 to 360 (default 0)
  exposure: number; // -50 to 50 (default 0)
  filterPreset: string; // 'none' | 'cinematic' | 'cyberpunk' | 'noir' | 'vintage' | 'hdr' | 'sunset'
}

export interface VoiceMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  suggestedAction?: string | null;
}

declare global {
  interface Window {
    gapi: any;
    google?: any;
    webkitSpeechRecognition?: any;
    SpeechRecognition?: any;
  }
  const google: any;
}

