import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import {
  Wifi,
  WifiOff,
  Radio,
  Signal,
  Smartphone,
  Laptop,
  Tv,
  Globe,
  Settings,
  Shield,
  MessageSquare,
  RefreshCw,
  Power,
  RotateCcw,
  Zap,
  CheckCircle2,
  AlertCircle,
  QrCode,
  Lock,
  Unlock,
  Eye,
  EyeOff,
  ArrowDown,
  ArrowUp,
  Sliders,
  Send,
  Trash2,
  Play,
  Gauge,
  HelpCircle,
  Cpu,
  HardDrive,
  Activity,
  Hash,
  PhoneCall,
  Check,
  Copy,
  ShieldCheck,
} from 'lucide-react';

export const ZteMtnG5tsView: React.FC = () => {
  // Navigation tabs in ZTE WebUI
  type TabKey = 'home' | 'network' | 'wifi' | 'devices' | 'sms' | 'speedtest' | 'system';
  const [activeTab, setActiveTab] = useState<TabKey>('home');

  // Router Authentication State (ZTE WebUI 192.168.0.1 login gate)
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(true);
  const [loginPasswordInput, setLoginPasswordInput] = useState('');
  const [loginError, setLoginError] = useState<string | null>(null);
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  // Router Connection & Network States
  const [isConnected, setIsConnected] = useState(true);
  const [networkType, setNetworkType] = useState<'5G' | '4G' | 'Auto'>('Auto');
  const [networkBand, setNetworkBand] = useState('n78 (3500MHz) + B3 CA');
  const [rsrp, setRsrp] = useState(-74); // dBm
  const [sinr, setSinr] = useState(24.5); // dB
  const [currentDownloadSpeed, setCurrentDownloadSpeed] = useState(485.6); // Mbps
  const [currentUploadSpeed, setCurrentUploadSpeed] = useState(64.2); // Mbps
  const [dataUsedGB, setDataUsedGB] = useState(182.4);
  const totalBundleGB = 500;

  // Real-time Bandwidth History for Recharts
  const [trafficHistory, setTrafficHistory] = useState<
    Array<{ time: string; download: number; upload: number }>
  >([]);

  // Wi-Fi Configuration
  const [wifiEnabled, setWifiEnabled] = useState(true);
  const [ssid24, setSsid24] = useState('MTN_5G_G5TS_2.4G');
  const [ssid5G, setSsid5G] = useState('MTN_5G_G5TS_Ultra_5G');
  const [wifiPassword, setWifiPassword] = useState('mtn5g#turbo2026');
  const [showPassword, setShowPassword] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);
  const [wpaMode, setWpaMode] = useState('WPA2/WPA3-Personal');

  // APN Settings
  const [apnMode, setApnMode] = useState<'auto' | 'manual'>('auto');
  const [apnProfile, setApnProfile] = useState('myMTN (internet)');
  const [roamingEnabled, setRoamingEnabled] = useState(false);

  // Advanced RF & Diagnostics Modal
  const [showRfModal, setShowRfModal] = useState(false);

  // USSD Interactive Engine & Modal
  const [showUssdModal, setShowUssdModal] = useState(false);
  const [ussdInput, setUssdInput] = useState('*136#');
  const [ussdSessionActive, setUssdSessionActive] = useState(false);
  const [ussdSessionTitle, setUssdSessionTitle] = useState('');
  const [ussdSessionMenu, setUssdSessionMenu] = useState<string[]>([]);
  const [ussdResultText, setUssdResultText] = useState<string | null>(null);
  const [ussdReplyInput, setUssdReplyInput] = useState('');
  const [ussdLoading, setUssdLoading] = useState(false);

  // Connected Devices
  const [devices, setDevices] = useState([
    { id: 1, name: "Galaxy S26 Ultra", ip: "192.168.0.102", mac: "D4:F5:47:89:12:30", type: "phone", band: "5GHz", rx: "32.4 MB/s", tx: "4.1 MB/s", blocked: false },
    { id: 2, name: "MacBook Pro M4", ip: "192.168.0.105", mac: "3C:06:30:4A:BC:88", type: "laptop", band: "5GHz", rx: "18.2 MB/s", tx: "1.8 MB/s", blocked: false },
    { id: 3, name: "Samsung Neo QLED 4K TV", ip: "192.168.0.110", mac: "F0:27:65:11:90:EA", type: "tv", band: "LAN 1", rx: "24.6 MB/s", tx: "0.2 MB/s", blocked: false },
    { id: 4, name: "PlayStation 5 Pro", ip: "192.168.0.114", mac: "00:D9:D1:6C:54:19", type: "console", band: "LAN 2", rx: "86.1 MB/s", tx: "8.5 MB/s", blocked: false },
    { id: 5, name: "Smart Home Hub", ip: "192.168.0.120", mac: "58:6D:8F:7C:3A:42", type: "iot", band: "2.4GHz", rx: "0.4 MB/s", tx: "0.1 MB/s", blocked: false },
  ]);

  // SMS Inbox
  const [messages, setMessages] = useState([
    { id: 1, sender: "MTN-Notice", time: "Today 14:20", text: "Y'ello! Your MTN 5G Home Uncapped Plan has renewed successfully. High-speed 5G priority active until Nov 23.", read: true },
    { id: 2, sender: "136", time: "Yesterday 09:12", text: "MTN Balance Update: Data remaining 317.6 GB. Airtime: R45.00. Recharge anytime on the MTN App or dial *136#.", read: true },
    { id: 3, sender: "MTN-Promo", time: "21 Oct 18:05", text: "Get 50% extra data on Night Owl bundle recharge. Dial *142# for your personalized Made4U deals.", read: false },
  ]);
  const [newSmsRecipient, setNewSmsRecipient] = useState('');
  const [newSmsText, setNewSmsText] = useState('');
  const [smsSending, setSmsSending] = useState(false);

  // Speedtest tool
  const [speedTestRunning, setSpeedTestRunning] = useState(false);
  const [testPing, setTestPing] = useState(12);
  const [testJitter, setTestJitter] = useState(2);
  const [testDownload, setTestDownload] = useState(0);
  const [testUpload, setTestUpload] = useState(0);
  const [testStage, setTestStage] = useState<'idle' | 'ping' | 'download' | 'upload' | 'complete'>('idle');

  // Reboot simulation
  const [isRebooting, setIsRebooting] = useState(false);
  const [rebootProgress, setRebootProgress] = useState(0);

  // Toast Notification
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => {
      setToastMsg((current) => (current === msg ? null : current));
    }, 3200);
  };

  // Keyboard shortcut listener: Keys 1 to 7 switch tabs instantly
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input or textarea
      const targetTag = (e.target as HTMLElement)?.tagName?.toLowerCase();
      if (targetTag === 'input' || targetTag === 'textarea' || targetTag === 'select') return;

      if (e.key === '1') {
        setActiveTab('home');
        showToast('Switched to [1] Home Status');
      } else if (e.key === '2') {
        setActiveTab('network');
        showToast('Switched to [2] 5G / Mobile Network');
      } else if (e.key === '3') {
        setActiveTab('wifi');
        showToast('Switched to [3] Wi-Fi 6 (WLAN)');
      } else if (e.key === '4') {
        setActiveTab('devices');
        showToast('Switched to [4] Connected Devices');
      } else if (e.key === '5') {
        setActiveTab('sms');
        showToast('Switched to [5] SMS & USSD Bundles');
      } else if (e.key === '6') {
        setActiveTab('speedtest');
        showToast('Switched to [6] 5G Speed Test');
      } else if (e.key === '7') {
        setActiveTab('system');
        showToast('Switched to [7] Router System');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Live Traffic Generator
  useEffect(() => {
    // Generate initial 12 points
    const now = new Date();
    const initial = Array.from({ length: 12 }).map((_, i) => {
      const d = new Date(now.getTime() - (12 - i) * 3000);
      const timeStr = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      return {
        time: timeStr,
        download: Math.round(420 + Math.random() * 120),
        upload: Math.round(50 + Math.random() * 25),
      };
    });
    setTrafficHistory(initial);

    const interval = setInterval(() => {
      if (!isConnected || isRebooting) {
        setCurrentDownloadSpeed(0);
        setCurrentUploadSpeed(0);
        return;
      }

      const variation = (Math.random() - 0.5) * 40;
      const newDown = Math.max(280, Math.min(620, Math.round(480 + variation)));
      const newUp = Math.max(35, Math.min(85, Math.round(62 + variation * 0.2)));

      setCurrentDownloadSpeed(newDown);
      setCurrentUploadSpeed(newUp);

      const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      setTrafficHistory((prev) => {
        const next = [...prev.slice(1), { time: timeStr, download: newDown, upload: newUp }];
        return next;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [isConnected, isRebooting]);

  // Run Speedtest
  const handleStartSpeedTest = () => {
    setSpeedTestRunning(true);
    setTestStage('ping');
    setTestDownload(0);
    setTestUpload(0);

    setTimeout(() => {
      setTestPing(Math.round(9 + Math.random() * 6));
      setTestJitter(Math.round(1 + Math.random() * 3));
      setTestStage('download');

      let currentD = 50;
      const downInterval = setInterval(() => {
        currentD += 35 + Math.random() * 30;
        if (currentD >= 512) {
          clearInterval(downInterval);
          setTestDownload(524.8);
          setTestStage('upload');

          let currentU = 10;
          const upInterval = setInterval(() => {
            currentU += 10 + Math.random() * 10;
            if (currentU >= 72) {
              clearInterval(upInterval);
              setTestUpload(76.4);
              setTestStage('complete');
              setSpeedTestRunning(false);
            } else {
              setTestUpload(Number(currentU.toFixed(1)));
            }
          }, 150);
        } else {
          setTestDownload(Number(currentD.toFixed(1)));
        }
      }, 150);
    }, 1200);
  };

  // Send SMS
  const handleSendSms = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSmsRecipient || !newSmsText) return;
    setSmsSending(true);

    setTimeout(() => {
      const newMsg = {
        id: Date.now(),
        sender: `To: ${newSmsRecipient}`,
        time: 'Just now',
        text: newSmsText,
        read: true,
      };
      setMessages((prev) => [newMsg, ...prev]);
      const sentText = newSmsText;
      const sentRecipient = newSmsRecipient;
      setNewSmsText('');
      setNewSmsRecipient('');
      setSmsSending(false);
      showToast('SMS dispatched via MTN SMSC');

      // Automated MTN response if sending to 136 or balance query
      if (sentRecipient === '136' || sentText.toLowerCase().includes('bal')) {
        setTimeout(() => {
          const reply = {
            id: Date.now() + 1,
            sender: '136',
            time: 'Just now',
            text: `MTN Balance: 5G Uncapped Active. Available high-speed data: ${(totalBundleGB - dataUsedGB).toFixed(1)} GB. Airtime: R45.00. Thank you for choosing MTN.`,
            read: false,
          };
          setMessages((prev) => [reply, ...prev]);
          showToast('New SMS from MTN (136)');
        }, 1200);
      }
    }, 800);
  };

  // USSD Command Dispatcher
  const handleDialUssd = (codeToDial?: string) => {
    const code = (codeToDial || ussdInput).trim();
    if (!code) return;
    setUssdLoading(true);
    setUssdResultText(null);

    setTimeout(() => {
      setUssdLoading(false);
      if (code === '*136#' || code === '136') {
        setUssdSessionActive(true);
        setUssdSessionTitle('MTN Y’ello Services (*136#)');
        setUssdSessionMenu([
          '1. Balance Enquiry (High-Speed 5G & Airtime)',
          '2. Buy 5G Broadband Bundles',
          '3. Made4U Special Promotions',
          '4. Recharge with Airtime PIN',
          '0. Exit Session',
        ]);
        setUssdReplyInput('');
      } else if (code === '*142#' || code === '142') {
        setUssdSessionActive(true);
        setUssdSessionTitle('MTN Made4U Offers (*142#)');
        setUssdSessionMenu([
          '1. 100GB 5G Super Pass @ R149 (7 Days)',
          '2. Uncapped 5G Night Owl @ R49 (12am - 6am)',
          '3. 250GB Monthly Booster @ R299',
          '0. Back',
        ]);
        setUssdReplyInput('');
      } else if (code === '*131#' || code === '131') {
        setUssdSessionActive(true);
        setUssdSessionTitle('MTN 5G Bundle Store (*131#)');
        setUssdSessionMenu([
          '1. Uncapped Home 5G Renewal',
          '2. Top-Up 20GB Anytime @ R99',
          '3. Share Data (DataShare)',
          '0. Exit',
        ]);
        setUssdReplyInput('');
      } else {
        // Direct response for other codes
        setUssdSessionActive(false);
        setUssdResultText(`MTN Service Notice: Command ${code} processed successfully. No active interactive session required.`);
      }
    }, 700);
  };

  // USSD Session Reply handler (e.g., when user inputs "1" or clicks an option)
  const handleUssdReply = (replyChoice?: string) => {
    const choice = (replyChoice || ussdReplyInput).trim();
    if (!choice) return;
    setUssdLoading(true);

    setTimeout(() => {
      setUssdLoading(false);
      setUssdSessionActive(false);

      if (choice === '1') {
        setUssdResultText(
          `Y'ello! MTN 5G Home Uncapped Plan active.\n• Remaining High-Speed 5G Data: ${(totalBundleGB - dataUsedGB).toFixed(1)} GB / ${totalBundleGB} GB\n• Airtime Balance: R45.00\n• Bonus Data: 15.0 GB Night Owl\n• Billing Cycle Renewal: Nov 23\nDial *142# for personalized deals.`
        );
      } else if (choice === '2') {
        setUssdResultText(
          `MTN 5G Bundles:\nSelect your package on the MTN App or recharge with voucher. Available credit: R45.00.`
        );
      } else if (choice === '3') {
        setUssdResultText(
          `Made4U Deals:\nSpecial 5G booster loaded. 50GB extra awarded for this billing cycle.`
        );
      } else if (choice === '0') {
        setUssdResultText(`USSD Session Terminated.`);
      } else {
        setUssdResultText(`Selection "${choice}" recorded. Thank you for choosing MTN 5G.`);
      }
      setUssdReplyInput('');
    }, 500);
  };

  // Toggle Block Device
  const handleToggleBlockDevice = (id: number) => {
    setDevices((prev) =>
      prev.map((d) => {
        if (d.id === id) {
          const nextBlocked = !d.blocked;
          showToast(nextBlocked ? `Blocked access for ${d.name}` : `Unblocked ${d.name}`);
          return { ...d, blocked: nextBlocked };
        }
        return d;
      })
    );
  };

  // Simulate Router Reboot
  const handleReboot = () => {
    if (confirm('Are you sure you want to reboot the ZTE MTN G5TS router? Network services will be temporarily disconnected.')) {
      setIsRebooting(true);
      setRebootProgress(0);

      const interval = setInterval(() => {
        setRebootProgress((p) => {
          if (p >= 100) {
            clearInterval(interval);
            setIsRebooting(false);
            setIsConnected(true);
            showToast('ZTE MTN G5TS restarted and re-registered on MTN 5G.');
            return 100;
          }
          return p + 5;
        });
      }, 200);
    }
  };

  // Admin Login Handle
  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginPasswordInput.trim() === 'admin' || loginPasswordInput.trim() === '12345678' || loginPasswordInput.trim() === 'admin123' || loginPasswordInput.trim() === 'mtn5g#turbo2026') {
      setIsAdminLoggedIn(true);
      setLoginError(null);
      setLoginPasswordInput('');
      showToast('Welcome to ZTE MTN G5TS Web Control');
    } else {
      setLoginError('Incorrect password. Default ZTE password is "admin".');
    }
  };

  // Custom Tooltip for Bandwidth chart
  const SpeedTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-neutral-900/95 text-white p-3 rounded-xl shadow-2xl border border-neutral-700 text-xs">
          <div className="text-[10px] text-neutral-400 font-mono mb-1">{label}</div>
          <div className="space-y-1 font-mono">
            <div className="flex items-center justify-between gap-4">
              <span className="flex items-center gap-1.5 text-amber-400">
                <span className="w-2 h-2 rounded-full bg-amber-400" />
                Download:
              </span>
              <span className="font-bold">{payload[0]?.value} Mbps</span>
            </div>
            <div className="flex items-center justify-between gap-4">
              <span className="flex items-center gap-1.5 text-blue-400">
                <span className="w-2 h-2 rounded-full bg-blue-400" />
                Upload:
              </span>
              <span className="font-bold">{payload[1]?.value} Mbps</span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6 relative">
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMsg && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            className="fixed top-6 right-6 z-50 flex items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-neutral-950/90 text-white border border-amber-400/40 shadow-2xl backdrop-blur-md text-xs font-mono"
          >
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
            <span className="text-amber-400 font-bold">ZTE CPE:</span>
            <span>{toastMsg}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─────────────────────────────────────────────────────────────
          ZTE MTN G5TS BRANDED TOP BAR & STATUS HEADER
      ───────────────────────────────────────────────────────────── */}
      <div className="rounded-3xl bg-neutral-950 border border-neutral-800 shadow-2xl overflow-hidden text-white">
        {/* Top Header Row with MTN Brand Accent */}
        <div className="bg-linear-to-r from-amber-400 via-yellow-400 to-amber-500 h-1.5 w-full" />

        <div className="p-4 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Logo & Device Model */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="h-10 px-3 rounded-xl bg-amber-400 text-neutral-950 font-black text-lg flex items-center justify-center tracking-tighter shadow-md">
                MTN
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold tracking-tight text-white flex items-center gap-1.5">
                  5G Broadband
                  <span className="px-1.5 py-0.5 rounded text-[10px] bg-amber-400/20 text-amber-300 font-mono font-bold border border-amber-400/30">
                    G5TS
                  </span>
                </span>
                <span className="text-[10px] text-neutral-400 font-mono">
                  ZTE Corporation • WebUI v1.0.0
                </span>
              </div>
            </div>

            <div className="hidden sm:block h-8 w-px bg-neutral-800" />

            {/* Gateway IP & Login Status */}
            <div className="hidden sm:flex flex-col text-xs font-mono">
              <span className="text-neutral-400 text-[10px]">GATEWAY IP</span>
              <span className="text-neutral-200 font-bold flex items-center gap-1">
                192.168.0.1
                {isAdminLoggedIn ? (
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" title="Admin Logged In" />
                ) : (
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400" title="Locked" />
                )}
              </span>
            </div>
          </div>

          {/* Real-time Status Badges & Quick Action Triggers */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* 5G Signal Quality & RF Diagnostics Trigger */}
            <button
              onClick={() => setShowRfModal(true)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-xs font-mono transition text-left"
              title="Click for 5G RF Cell Diagnostics"
            >
              <Signal className="w-4 h-4 text-amber-400 animate-pulse" />
              <div className="flex flex-col">
                <span className="text-[9px] text-neutral-400">NETWORK (CLICK FOR RF)</span>
                <span className="text-amber-400 font-bold">MTN 5G (SA)</span>
              </div>
            </button>

            {/* Live Throughput Badge */}
            <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-neutral-900 border border-neutral-800 text-xs font-mono">
              <div className="flex items-center gap-1 text-amber-400">
                <ArrowDown className="w-3.5 h-3.5" />
                <span className="font-bold">{currentDownloadSpeed}</span>
                <span className="text-[9px] text-neutral-400">M</span>
              </div>
              <div className="flex items-center gap-1 text-blue-400">
                <ArrowUp className="w-3.5 h-3.5" />
                <span className="font-bold">{currentUploadSpeed}</span>
                <span className="text-[9px] text-neutral-400">M</span>
              </div>
            </div>

            {/* USSD Fast Dial Button */}
            <button
              onClick={() => {
                setShowUssdModal(true);
                handleDialUssd('*136#');
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-400/10 hover:bg-amber-400/20 border border-amber-400/30 text-amber-300 text-xs font-mono transition"
              title="Quick USSD Dial (*136#)"
            >
              <Hash className="w-3.5 h-3.5" />
              <span>USSD (*136#)</span>
            </button>

            {/* Connected Clients */}
            <button
              onClick={() => setActiveTab('devices')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-xs font-mono text-neutral-200 transition"
              title="View Connected Devices"
            >
              <Smartphone className="w-3.5 h-3.5 text-neutral-400" />
              <span>{devices.filter((d) => !d.blocked).length} Clients</span>
            </button>

            {/* SMS Badge */}
            <button
              onClick={() => setActiveTab('sms')}
              className="relative p-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-300 transition"
              title="SMS Messages"
            >
              <MessageSquare className="w-4 h-4" />
              {messages.some((m) => !m.read) && (
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping" />
              )}
            </button>

            {/* Lock / Logout Router */}
            <button
              onClick={() => {
                setIsAdminLoggedIn(!isAdminLoggedIn);
                showToast(isAdminLoggedIn ? 'Router session locked' : 'Router session unlocked');
              }}
              className={`p-2 rounded-xl border transition ${
                isAdminLoggedIn
                  ? 'bg-neutral-900 hover:bg-neutral-800 text-neutral-300 border-neutral-800'
                  : 'bg-amber-400/20 text-amber-300 border-amber-400/40'
              }`}
              title={isAdminLoggedIn ? 'Lock ZTE WebUI (Logout)' : 'Admin Locked - Click to Login'}
            >
              {isAdminLoggedIn ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4 text-amber-400" />}
            </button>

            {/* Reboot Button */}
            <button
              onClick={handleReboot}
              className="p-2 rounded-xl bg-neutral-900 hover:bg-red-500/20 text-neutral-400 hover:text-red-400 border border-neutral-800 transition"
              title="Reboot Router"
            >
              <Power className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs Bar with Numeric Indicators [1] to [7] */}
        <div className="px-4 border-t border-neutral-800 flex items-center gap-1 overflow-x-auto no-scrollbar bg-neutral-950/80">
          {[
            { id: 'home', num: '1', label: 'Home Status', icon: Globe },
            { id: 'network', num: '2', label: '5G / Mobile Network', icon: Radio },
            { id: 'wifi', num: '3', label: 'Wi-Fi 6 (WLAN)', icon: Wifi },
            { id: 'devices', num: '4', label: 'Connected Devices', icon: Laptop },
            { id: 'sms', num: '5', label: 'SMS & USSD Bundles', icon: MessageSquare },
            { id: 'speedtest', num: '6', label: '5G Speed Test', icon: Gauge },
            { id: 'system', num: '7', label: 'Router System', icon: Settings },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id as TabKey);
                  showToast(`Selected [${tab.num}] ${tab.label}`);
                }}
                className={`flex items-center gap-2 px-3.5 py-3 text-xs font-bold transition whitespace-nowrap border-b-2 ${
                  isActive
                    ? 'border-amber-400 text-amber-400 bg-amber-400/5'
                    : 'border-transparent text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900'
                }`}
                title={`Press "${tab.num}" on keyboard to switch`}
              >
                <span className={`px-1.5 py-0.2 rounded text-[10px] font-mono ${
                  isActive ? 'bg-amber-400 text-neutral-950 font-black' : 'bg-neutral-800 text-neutral-400'
                }`}>
                  {tab.num}
                </span>
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ZTE G5TS Login Guard (If User Locks the WebUI) */}
      {!isAdminLoggedIn && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-neutral-900 rounded-3xl p-8 border border-neutral-800 shadow-2xl text-white max-w-md mx-auto my-8 text-center space-y-6"
        >
          <div className="w-16 h-16 rounded-3xl bg-amber-400 text-neutral-950 flex items-center justify-center mx-auto shadow-lg">
            <Lock className="w-8 h-8" />
          </div>

          <div>
            <h2 className="text-xl font-bold">ZTE 5G CPE Web Management</h2>
            <p className="text-xs text-neutral-400 mt-1">
              Please enter the administrator password for MTN G5TS (Gateway 192.168.0.1)
            </p>
          </div>

          <form onSubmit={handleAdminLogin} className="space-y-4">
            <div className="relative">
              <input
                type={showLoginPassword ? 'text' : 'password'}
                placeholder="Password (Default: admin)"
                value={loginPasswordInput}
                onChange={(e) => setLoginPasswordInput(e.target.value)}
                className="w-full p-3 pr-10 text-xs rounded-xl bg-neutral-950 border border-neutral-700 text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-amber-400 font-mono"
              />
              <button
                type="button"
                onClick={() => setShowLoginPassword(!showLoginPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white"
              >
                {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {loginError && (
              <p className="text-xs text-red-400 font-medium">{loginError}</p>
            )}

            <div className="flex flex-col gap-2">
              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-amber-400 hover:bg-amber-500 text-neutral-950 font-bold text-xs shadow-md transition"
              >
                Log In to Router
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsAdminLoggedIn(true);
                  showToast('Admin session unlocked');
                }}
                className="text-xs text-amber-400 hover:text-amber-300 underline font-mono pt-1"
              >
                Quick Demo Unlock (admin)
              </button>
            </div>
          </form>
        </motion.div>
      )}

      {/* Rebooting Screen Overlay */}
      <AnimatePresence>
        {isRebooting && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-neutral-950/95 flex flex-col items-center justify-center p-6 text-white text-center backdrop-blur-md"
          >
            <div className="w-16 h-16 rounded-full border-4 border-amber-400 border-t-transparent animate-spin mb-6" />
            <h2 className="text-2xl font-bold">Rebooting ZTE MTN G5TS...</h2>
            <p className="text-sm text-neutral-400 mt-2 max-w-md">
              Please wait while the 5G modem restarts its baseband, recalibrates antennas, and rejoins the MTN 5G carrier network.
            </p>
            <div className="w-72 h-2.5 bg-neutral-800 rounded-full mt-6 overflow-hidden">
              <div
                className="h-full bg-linear-to-r from-amber-400 to-yellow-500 transition-all duration-200"
                style={{ width: `${rebootProgress}%` }}
              />
            </div>
            <span className="text-xs font-mono text-neutral-400 mt-2">{rebootProgress}%</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MAIN CONTENT (When logged in) */}
      {isAdminLoggedIn && (
        <>
          {/* ─────────────────────────────────────────────────────────────
              TAB 1: HOME STATUS DASHBOARD
          ───────────────────────────────────────────────────────────── */}
          {activeTab === 'home' && (
            <div className="space-y-6">
              {/* Bento Grid: 5G Dial Status + Quick Wi-Fi + Bundle Quota */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Left 4 Cols: 5G Network Dial Connection Box */}
                <div className="lg:col-span-4 bg-white rounded-3xl p-6 border border-neutral-200 shadow-sm flex flex-col justify-between space-y-6">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xs font-bold uppercase tracking-wider text-neutral-500 font-mono">
                        5G Carrier State
                      </span>
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                          isConnected
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {isConnected ? 'ONLINE (5G SA)' : 'DISCONNECTED'}
                      </span>
                    </div>

                    {/* Big Visual Circle Toggle */}
                    <div className="flex flex-col items-center justify-center py-4">
                      <div className="relative flex items-center justify-center">
                        {/* Outer animated ripple */}
                        {isConnected && (
                          <div className="absolute w-44 h-44 rounded-full bg-amber-400/15 animate-ping" />
                        )}
                        <button
                          onClick={() => {
                            const nextState = !isConnected;
                            setIsConnected(nextState);
                            showToast(nextState ? '5G Broadband Connected' : '5G Mobile Network Disconnected');
                          }}
                          className={`relative z-10 w-36 h-36 rounded-full flex flex-col items-center justify-center shadow-xl transition-all duration-300 ${
                            isConnected
                              ? 'bg-linear-to-br from-neutral-900 to-neutral-950 text-white border-4 border-amber-400 hover:scale-105'
                              : 'bg-neutral-100 text-neutral-400 border-4 border-neutral-300'
                          }`}
                          title={isConnected ? 'Click to Disconnect 5G' : 'Click to Connect 5G'}
                        >
                          <Globe className={`w-8 h-8 mb-1 ${isConnected ? 'text-amber-400 animate-pulse' : 'text-neutral-400'}`} />
                          <span className="text-xs font-bold font-mono tracking-wider">
                            {isConnected ? 'CONNECTED' : 'DISCONNECTED'}
                          </span>
                          <span className="text-[10px] text-neutral-400 mt-0.5">MTN 5G</span>
                        </button>
                      </div>
                      <p className="text-[11px] text-neutral-500 mt-4 text-center">
                        Click central dial to toggle mobile broadband connection.
                      </p>
                    </div>
                  </div>

                  {/* Signal Metrics Telemetry (Clickable for RF Details) */}
                  <div
                    onClick={() => setShowRfModal(true)}
                    className="p-3.5 bg-neutral-50 hover:bg-neutral-100/80 cursor-pointer rounded-2xl border border-neutral-200/80 space-y-2 text-xs transition group"
                    title="Click for full 5G RF Engineering Diagnostics"
                  >
                    <div className="flex justify-between items-center text-neutral-600">
                      <span className="flex items-center gap-1 font-semibold">
                        <Activity className="w-3.5 h-3.5 text-amber-500" />
                        Cell RF Diagnostics
                      </span>
                      <span className="text-[10px] text-amber-600 group-hover:underline font-bold">Inspect Details →</span>
                    </div>
                    <div className="flex justify-between text-neutral-600">
                      <span>Band:</span>
                      <span className="font-mono font-bold text-neutral-900">{networkBand}</span>
                    </div>
                    <div className="flex justify-between text-neutral-600">
                      <span>Signal (RSRP):</span>
                      <span className="font-mono font-bold text-emerald-600">{rsrp} dBm (Excellent)</span>
                    </div>
                    <div className="flex justify-between text-neutral-600">
                      <span>Quality (SINR):</span>
                      <span className="font-mono font-bold text-neutral-900">{sinr} dB</span>
                    </div>
                    <div className="flex justify-between text-neutral-600">
                      <span>Tower Cell ID:</span>
                      <span className="font-mono text-neutral-700">41289-01 (Sandton Hub)</span>
                    </div>
                  </div>
                </div>

                {/* Center 8 Cols: Real-time Traffic Graph & Data Quota */}
                <div className="lg:col-span-8 space-y-6">
                  {/* Traffic Area Chart with Interactive Hover Tooltips */}
                  <div className="bg-white rounded-3xl p-6 border border-neutral-200 shadow-sm space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-neutral-100 pb-3">
                      <div>
                        <h3 className="font-bold text-neutral-900 text-sm">
                          Real-Time 5G Network Throughput
                        </h3>
                        <p className="text-xs text-neutral-500">
                          Hover over data points to display precise download & upload speeds.
                        </p>
                      </div>
                      <div className="flex items-center gap-3 text-xs font-mono">
                        <span className="flex items-center gap-1.5 text-amber-600 font-bold">
                          <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                          DL: {currentDownloadSpeed} Mbps
                        </span>
                        <span className="flex items-center gap-1.5 text-blue-600 font-bold">
                          <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                          UL: {currentUploadSpeed} Mbps
                        </span>
                      </div>
                    </div>

                    <div className="w-full h-56 pt-2">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={trafficHistory} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                          <defs>
                            <linearGradient id="downloadGrad" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.35} />
                              <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.0} />
                            </linearGradient>
                            <linearGradient id="uploadGrad" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.35} />
                              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0} />
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                          <XAxis dataKey="time" tick={{ fontSize: 10, fill: '#64748b' }} />
                          <YAxis tick={{ fontSize: 10, fill: '#64748b' }} unit="M" />
                          <Tooltip content={<SpeedTooltip />} />
                          <Area
                            type="monotone"
                            dataKey="download"
                            stroke="#f59e0b"
                            strokeWidth={2.5}
                            fillOpacity={1}
                            fill="url(#downloadGrad)"
                          />
                          <Area
                            type="monotone"
                            dataKey="upload"
                            stroke="#3b82f6"
                            strokeWidth={2}
                            fillOpacity={1}
                            fill="url(#uploadGrad)"
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Bottom Row: Quick Wi-Fi Card & Monthly Bundle Meter */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {/* Quick Wi-Fi Card */}
                    <div className="bg-white rounded-3xl p-5 border border-neutral-200 shadow-sm space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Wifi className="w-4 h-4 text-amber-500" />
                          <span className="text-xs font-bold text-neutral-800 uppercase font-mono">
                            Wi-Fi 6 Networks
                          </span>
                        </div>
                        <button
                          onClick={() => setShowQrModal(true)}
                          className="p-1.5 rounded-lg hover:bg-neutral-100 text-neutral-600 transition"
                          title="Show Wi-Fi QR Code"
                        >
                          <QrCode className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="space-y-1.5 text-xs">
                        <div className="p-2.5 rounded-xl bg-neutral-50 border border-neutral-100 flex items-center justify-between">
                          <span className="text-neutral-500 font-medium">5GHz:</span>
                          <span className="font-mono font-bold text-neutral-900">{ssid5G}</span>
                        </div>
                        <div className="p-2.5 rounded-xl bg-neutral-50 border border-neutral-100 flex items-center justify-between">
                          <span className="text-neutral-500 font-medium">2.4GHz:</span>
                          <span className="font-mono text-neutral-800">{ssid24}</span>
                        </div>
                      </div>

                      <button
                        onClick={() => setActiveTab('wifi')}
                        className="w-full py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-semibold transition"
                      >
                        Manage Wi-Fi Settings
                      </button>
                    </div>

                    {/* Monthly Data Bundle Tracker */}
                    <div className="bg-white rounded-3xl p-5 border border-neutral-200 shadow-sm space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-neutral-800 uppercase font-mono">
                          MTN Data Plan Quota
                        </span>
                        <span className="text-[11px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md">
                          Home 5G Uncapped
                        </span>
                      </div>

                      <div className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span className="text-neutral-500">Used This Billing Cycle</span>
                          <span className="font-mono font-bold text-neutral-900">
                            {dataUsedGB} GB / {totalBundleGB} GB
                          </span>
                        </div>
                        <div className="w-full h-2.5 bg-neutral-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-linear-to-r from-amber-400 to-yellow-500 rounded-full"
                            style={{ width: `${(dataUsedGB / totalBundleGB) * 100}%` }}
                          />
                        </div>
                        <div className="flex justify-between text-[10px] text-neutral-400 pt-1 font-mono">
                          <span>Renews in 18 days</span>
                          <span>317.6 GB High-Speed left</span>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setShowUssdModal(true);
                            handleDialUssd('*136#');
                          }}
                          className="flex-1 py-2 rounded-xl bg-amber-400 hover:bg-amber-500 text-neutral-950 text-xs font-bold transition flex items-center justify-center gap-1.5"
                        >
                          <Hash className="w-3.5 h-3.5" />
                          <span>USSD Balance (*136#)</span>
                        </button>
                        <button
                          onClick={() => setActiveTab('sms')}
                          className="px-3 py-2 rounded-xl border border-neutral-200 hover:bg-neutral-50 text-neutral-700 text-xs font-semibold transition"
                          title="Open SMS Inbox"
                        >
                          <MessageSquare className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ─────────────────────────────────────────────────────────────
              TAB 2: MOBILE NETWORK & 5G SETTINGS
          ───────────────────────────────────────────────────────────── */}
          {activeTab === 'network' && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-neutral-200 shadow-sm space-y-6">
              <div className="border-b border-neutral-100 pb-4 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-neutral-900">Mobile Network Configuration</h2>
                  <p className="text-xs text-neutral-500">
                    Control your 5G/4G modes, APN profiles, and carrier frequency band locking.
                  </p>
                </div>
                <button
                  onClick={() => setShowRfModal(true)}
                  className="px-3.5 py-1.5 rounded-xl bg-neutral-900 text-amber-400 hover:bg-neutral-800 text-xs font-mono font-bold flex items-center gap-1.5 transition"
                >
                  <Activity className="w-4 h-4" />
                  <span>5G Cell Diagnostics</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Network Mode Preference */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-neutral-800 uppercase tracking-wide">
                    Network Search Mode
                  </label>
                  <select
                    value={networkType}
                    onChange={(e) => {
                      setNetworkType(e.target.value as any);
                      showToast(`Network mode changed to ${e.target.value}`);
                    }}
                    className="w-full p-3 text-xs rounded-xl border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-amber-400 bg-white"
                  >
                    <option value="Auto">Auto (5G SA / 5G NSA / 4G LTE)</option>
                    <option value="5G">5G Only (Fastest throughput, low latency)</option>
                    <option value="4G">4G LTE Only (Legacy fallback)</option>
                  </select>
                  <p className="text-[11px] text-neutral-500">
                    Auto mode dynamically connects to the strongest MTN 5G carrier channel.
                  </p>
                </div>

                {/* APN Profile Selection */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-neutral-800 uppercase tracking-wide">
                    APN Profile
                  </label>
                  <select
                    value={apnProfile}
                    onChange={(e) => {
                      setApnProfile(e.target.value);
                      showToast(`APN profile set to ${e.target.value}`);
                    }}
                    className="w-full p-3 text-xs rounded-xl border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-amber-400 bg-white"
                  >
                    <option value="myMTN (internet)">myMTN (internet) - Default IPv4v6</option>
                    <option value="MTN Fixed-LTE (ws.mtn.co.za)">MTN Fixed 5G / LTE (ws.mtn.co.za)</option>
                    <option value="Custom Manual APN">Custom Manual APN Profile</option>
                  </select>
                </div>

                {/* 5G Carrier Band Locking */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-neutral-800 uppercase tracking-wide">
                    5G Carrier Aggregation & Band Lock
                  </label>
                  <select
                    value={networkBand}
                    onChange={(e) => {
                      setNetworkBand(e.target.value);
                      showToast(`Band lock set: ${e.target.value}`);
                    }}
                    className="w-full p-3 text-xs rounded-xl border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-amber-400 bg-white"
                  >
                    <option value="n78 (3500MHz) + B3 CA">n78 (3500MHz Mid-band) + B3 CA [Recommended]</option>
                    <option value="n41 (2500MHz) Wide">n41 (2500MHz) High Capacity</option>
                    <option value="n28 (700MHz) Low-Band">n28 (700MHz) Long-Range Coverage</option>
                    <option value="All Bands Auto">All Supported Bands (Automatic Tower Selection)</option>
                  </select>
                </div>

                {/* Data Roaming Toggle */}
                <div className="flex items-center justify-between p-4 rounded-2xl bg-neutral-50 border border-neutral-200">
                  <div>
                    <span className="text-xs font-bold text-neutral-800">Data Roaming</span>
                    <p className="text-[11px] text-neutral-500">Allow data transfer when outside primary MTN area</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={roamingEnabled}
                    onChange={(e) => {
                      setRoamingEnabled(e.target.checked);
                      showToast(e.target.checked ? 'Roaming enabled' : 'Roaming disabled');
                    }}
                    className="w-5 h-5 accent-amber-500 rounded cursor-pointer"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-neutral-100 flex justify-end">
                <button
                  onClick={() => showToast('Mobile network settings applied successfully.')}
                  className="px-6 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-500 text-neutral-950 font-bold text-xs shadow-sm transition"
                >
                  Apply Settings
                </button>
              </div>
            </div>
          )}

          {/* ─────────────────────────────────────────────────────────────
              TAB 3: WI-FI 6 SETTINGS (WLAN)
          ───────────────────────────────────────────────────────────── */}
          {activeTab === 'wifi' && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-neutral-200 shadow-sm space-y-6">
              <div className="flex items-center justify-between border-b border-neutral-100 pb-4">
                <div>
                  <h2 className="text-lg font-bold text-neutral-900">Wi-Fi 6 (802.11ax) Dual-Band WLAN</h2>
                  <p className="text-xs text-neutral-500">
                    Manage your 2.4GHz & 5GHz (160MHz) wireless local networks and WPA3 security.
                  </p>
                </div>
                <button
                  onClick={() => setShowQrModal(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-semibold hover:bg-amber-100 transition"
                >
                  <QrCode className="w-4 h-4" />
                  <span>Wi-Fi QR Code</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* 5GHz Ultra Band */}
                <div className="p-5 rounded-2xl bg-neutral-50 border border-neutral-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-neutral-800">5GHz Ultra High-Speed (160MHz)</span>
                    <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-100 text-emerald-800 font-bold">
                      AX 2400 Mbps
                    </span>
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-neutral-600 uppercase">SSID Name</label>
                    <input
                      type="text"
                      value={ssid5G}
                      onChange={(e) => setSsid5G(e.target.value)}
                      className="w-full p-2.5 text-xs rounded-xl border border-neutral-300 mt-1 focus:outline-none focus:ring-2 focus:ring-amber-400 bg-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-neutral-600 uppercase">Channel Bandwidth</label>
                    <select className="w-full p-2.5 text-xs rounded-xl border border-neutral-300 mt-1 focus:outline-none focus:ring-2 focus:ring-amber-400 bg-white">
                      <option>160 MHz (Ultra Low-Latency)</option>
                      <option>80 MHz</option>
                      <option>40 MHz</option>
                    </select>
                  </div>
                </div>

                {/* 2.4GHz Long-Range Band */}
                <div className="p-5 rounded-2xl bg-neutral-50 border border-neutral-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-neutral-800">2.4GHz Long-Range Wi-Fi</span>
                    <span className="px-2 py-0.5 rounded text-[10px] bg-blue-100 text-blue-800 font-bold">
                      AX 574 Mbps
                    </span>
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-neutral-600 uppercase">SSID Name</label>
                    <input
                      type="text"
                      value={ssid24}
                      onChange={(e) => setSsid24(e.target.value)}
                      className="w-full p-2.5 text-xs rounded-xl border border-neutral-300 mt-1 focus:outline-none focus:ring-2 focus:ring-amber-400 bg-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-neutral-600 uppercase">Channel Selection</label>
                    <select className="w-full p-2.5 text-xs rounded-xl border border-neutral-300 mt-1 focus:outline-none focus:ring-2 focus:ring-amber-400 bg-white">
                      <option>Auto (Best interference avoidance)</option>
                      <option>Channel 1</option>
                      <option>Channel 6</option>
                      <option>Channel 11</option>
                    </select>
                  </div>
                </div>

                {/* Security & Password */}
                <div className="md:col-span-2 p-5 rounded-2xl bg-neutral-50 border border-neutral-200 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[11px] font-bold text-neutral-600 uppercase">Security Encryption</label>
                    <select
                      value={wpaMode}
                      onChange={(e) => setWpaMode(e.target.value)}
                      className="w-full p-2.5 text-xs rounded-xl border border-neutral-300 mt-1 focus:outline-none focus:ring-2 focus:ring-amber-400 bg-white"
                    >
                      <option value="WPA2/WPA3-Personal">WPA2/WPA3-Personal (Recommended)</option>
                      <option value="WPA3-SAE Only">WPA3-SAE Only (Maximum Security)</option>
                      <option value="WPA2-PSK (AES)">WPA2-PSK (AES)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-neutral-600 uppercase">Wi-Fi Password</label>
                    <div className="relative mt-1">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={wifiPassword}
                        onChange={(e) => setWifiPassword(e.target.value)}
                        className="w-full p-2.5 pr-10 text-xs rounded-xl border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-amber-400 bg-white font-mono"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => showToast('Wi-Fi credentials updated. Devices reconnecting.')}
                  className="px-6 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-500 text-neutral-950 font-bold text-xs shadow-sm transition"
                >
                  Save Wi-Fi Configuration
                </button>
              </div>
            </div>
          )}

          {/* ─────────────────────────────────────────────────────────────
              TAB 4: CONNECTED CLIENT DEVICES
          ───────────────────────────────────────────────────────────── */}
          {activeTab === 'devices' && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-neutral-200 shadow-sm space-y-6">
              <div className="flex items-center justify-between border-b border-neutral-100 pb-4">
                <div>
                  <h2 className="text-lg font-bold text-neutral-900">Connected Devices Management</h2>
                  <p className="text-xs text-neutral-500">
                    View and manage all clients active on your ZTE MTN G5TS local area network.
                  </p>
                </div>
                <span className="px-3 py-1 bg-neutral-100 text-neutral-700 font-mono text-xs font-bold rounded-lg">
                  {devices.length} Total Devices
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead className="bg-neutral-50 text-neutral-600 font-semibold border-b border-neutral-200">
                    <tr>
                      <th className="p-3 text-left">Device</th>
                      <th className="p-3 text-left">IP Address</th>
                      <th className="p-3 text-left">MAC Address</th>
                      <th className="p-3 text-left">Connection</th>
                      <th className="p-3 text-left">Live Bandwidth</th>
                      <th className="p-3 text-right">Access Control</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100">
                    {devices.map((dev) => (
                      <tr key={dev.id} className="hover:bg-neutral-50/60 transition">
                        <td className="p-3">
                          <div className="flex items-center gap-2">
                            {dev.type === 'phone' && <Smartphone className="w-4 h-4 text-neutral-500" />}
                            {dev.type === 'laptop' && <Laptop className="w-4 h-4 text-neutral-500" />}
                            {dev.type === 'tv' && <Tv className="w-4 h-4 text-neutral-500" />}
                            {dev.type === 'console' && <HardDrive className="w-4 h-4 text-neutral-500" />}
                            {dev.type === 'iot' && <Radio className="w-4 h-4 text-neutral-500" />}
                            <span className="font-bold text-neutral-800">{dev.name}</span>
                          </div>
                        </td>
                        <td className="p-3 font-mono text-neutral-600">{dev.ip}</td>
                        <td className="p-3 font-mono text-neutral-500">{dev.mac}</td>
                        <td className="p-3 font-mono">
                          <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-medium text-[11px]">
                            {dev.band}
                          </span>
                        </td>
                        <td className="p-3 font-mono text-neutral-700">
                          ↓ {dev.rx} / ↑ {dev.tx}
                        </td>
                        <td className="p-3 text-right">
                          <button
                            onClick={() => handleToggleBlockDevice(dev.id)}
                            className={`px-3 py-1 rounded-lg text-[11px] font-bold transition ${
                              dev.blocked
                                ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                                : 'bg-red-50 text-red-600 hover:bg-red-100'
                            }`}
                          >
                            {dev.blocked ? 'Unblock Device' : 'Block Access'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ─────────────────────────────────────────────────────────────
              TAB 5: SMS & MTN USSD BUNDLES
          ───────────────────────────────────────────────────────────── */}
          {activeTab === 'sms' && (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
              {/* Inbox List (7 cols) */}
              <div className="md:col-span-7 bg-white rounded-3xl p-6 border border-neutral-200 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-amber-500" />
                    <h2 className="text-base font-bold text-neutral-900">SIM Card SMS Inbox</h2>
                  </div>
                  <span className="text-xs text-neutral-400 font-mono">{messages.length} Messages</span>
                </div>

                <div className="space-y-3 max-h-[460px] overflow-y-auto pr-1">
                  {messages.map((m) => (
                    <div
                      key={m.id}
                      className={`p-4 rounded-2xl border transition ${
                        m.read ? 'bg-neutral-50/60 border-neutral-200/80' : 'bg-amber-50/40 border-amber-200'
                      }`}
                    >
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="font-bold text-neutral-900">{m.sender}</span>
                        <span className="text-neutral-400 text-[10px] font-mono">{m.time}</span>
                      </div>
                      <p className="text-xs text-neutral-700 leading-relaxed whitespace-pre-line">{m.text}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Compose SMS & USSD Commands (5 cols) */}
              <div className="md:col-span-5 space-y-6">
                {/* USSD Quick Launcher Card */}
                <div className="bg-neutral-950 text-white rounded-3xl p-6 border border-neutral-800 shadow-md space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Hash className="w-4 h-4 text-amber-400" />
                      <h3 className="text-sm font-bold">Interactive MTN USSD Dialer</h3>
                    </div>
                    <span className="text-[10px] bg-amber-400/20 text-amber-300 px-2 py-0.5 rounded font-mono font-bold">
                      Live SIM
                    </span>
                  </div>

                  <p className="text-xs text-neutral-400 leading-relaxed">
                    Dial telecom shortcodes directly to inspect data balances, buy 5G boosters, and view Made4U specials.
                  </p>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => {
                        setShowUssdModal(true);
                        handleDialUssd('*136#');
                      }}
                      className="p-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-xs font-mono text-amber-400 font-bold transition text-left flex items-center justify-between"
                    >
                      <span>*136#</span>
                      <span className="text-[10px] text-neutral-400 font-sans">Balances</span>
                    </button>
                    <button
                      onClick={() => {
                        setShowUssdModal(true);
                        handleDialUssd('*142#');
                      }}
                      className="p-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-xs font-mono text-amber-400 font-bold transition text-left flex items-center justify-between"
                    >
                      <span>*142#</span>
                      <span className="text-[10px] text-neutral-400 font-sans">Made4U</span>
                    </button>
                    <button
                      onClick={() => {
                        setShowUssdModal(true);
                        handleDialUssd('*131#');
                      }}
                      className="p-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-xs font-mono text-neutral-200 transition text-left flex items-center justify-between"
                    >
                      <span>*131#</span>
                      <span className="text-[10px] text-neutral-400 font-sans">Buy Data</span>
                    </button>
                    <button
                      onClick={() => {
                        setShowUssdModal(true);
                        handleDialUssd('*123#');
                      }}
                      className="p-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-xs font-mono text-neutral-200 transition text-left flex items-center justify-between"
                    >
                      <span>*123#</span>
                      <span className="text-[10px] text-neutral-400 font-sans">Menu</span>
                    </button>
                  </div>

                  <button
                    onClick={() => {
                      setShowUssdModal(true);
                      handleDialUssd('*136#');
                    }}
                    className="w-full py-2.5 rounded-xl bg-amber-400 hover:bg-amber-500 text-neutral-950 font-bold text-xs shadow-xs transition flex items-center justify-center gap-2"
                  >
                    <PhoneCall className="w-3.5 h-3.5" />
                    <span>Open USSD Terminal (*136#)</span>
                  </button>
                </div>

                {/* Compose SMS Form */}
                <div className="bg-white rounded-3xl p-6 border border-neutral-200 shadow-sm space-y-4">
                  <h3 className="text-sm font-bold text-neutral-900">Compose SMS Message</h3>

                  <form onSubmit={handleSendSms} className="space-y-3">
                    <div>
                      <label className="text-[11px] font-bold text-neutral-600 uppercase">Recipient / Shortcode</label>
                      <input
                        type="text"
                        placeholder="e.g. 136 or phone number"
                        value={newSmsRecipient}
                        onChange={(e) => setNewSmsRecipient(e.target.value)}
                        className="w-full p-2.5 text-xs rounded-xl border border-neutral-300 mt-1 focus:outline-none focus:ring-2 focus:ring-amber-400 font-mono"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-neutral-600 uppercase">Message Text</label>
                      <textarea
                        rows={3}
                        placeholder="Type message or 'BAL' to check MTN bundle balance..."
                        value={newSmsText}
                        onChange={(e) => setNewSmsText(e.target.value)}
                        className="w-full p-2.5 text-xs rounded-xl border border-neutral-300 mt-1 focus:outline-none focus:ring-2 focus:ring-amber-400 resize-none"
                      />
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setNewSmsRecipient('136');
                          setNewSmsText('BAL');
                        }}
                        className="px-3 py-2 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-xs font-semibold text-neutral-700"
                      >
                        Quick: BAL to 136
                      </button>
                      <button
                        type="submit"
                        disabled={smsSending || !newSmsRecipient || !newSmsText}
                        className="flex-1 py-2 rounded-xl bg-amber-400 hover:bg-amber-500 disabled:bg-neutral-200 text-neutral-950 font-bold text-xs shadow-xs transition flex items-center justify-center gap-1.5"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>{smsSending ? 'Sending...' : 'Send SMS'}</span>
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          )}

          {/* ─────────────────────────────────────────────────────────────
              TAB 6: 5G SPEED TEST
          ───────────────────────────────────────────────────────────── */}
          {activeTab === 'speedtest' && (
            <div className="bg-white rounded-3xl p-8 border border-neutral-200 shadow-sm flex flex-col items-center justify-center text-center space-y-6 max-w-2xl mx-auto">
              <div>
                <h2 className="text-xl font-bold text-neutral-900">MTN 5G Broadband Speed Test</h2>
                <p className="text-xs text-neutral-500 mt-1">
                  Test latency, jitter, and peak throughput through the ZTE G5TS antenna array.
                </p>
              </div>

              {/* Speed Dial Visualizer */}
              <div className="relative w-64 h-64 rounded-full border-8 border-neutral-100 flex flex-col items-center justify-center shadow-inner bg-neutral-50/50">
                <span className="text-[11px] font-mono text-neutral-400 uppercase tracking-widest">
                  {testStage === 'idle' ? 'READY' : testStage.toUpperCase()}
                </span>
                <div className="text-4xl font-extrabold text-neutral-900 font-mono tracking-tight my-1">
                  {testStage === 'upload' ? testUpload : testDownload || '0.0'}
                </div>
                <span className="text-xs font-bold text-amber-500 font-mono">Mbps</span>
              </div>

              {/* Test Metrics Bento */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 w-full">
                <div className="p-3 bg-neutral-50 rounded-2xl border border-neutral-100">
                  <span className="text-[10px] text-neutral-500 uppercase font-bold">Latency</span>
                  <div className="text-base font-bold text-neutral-800 font-mono">{testPing} ms</div>
                </div>
                <div className="p-3 bg-neutral-50 rounded-2xl border border-neutral-100">
                  <span className="text-[10px] text-neutral-500 uppercase font-bold">Jitter</span>
                  <div className="text-base font-bold text-neutral-800 font-mono">{testJitter} ms</div>
                </div>
                <div className="p-3 bg-neutral-50 rounded-2xl border border-neutral-100">
                  <span className="text-[10px] text-neutral-500 uppercase font-bold">Peak Download</span>
                  <div className="text-base font-bold text-amber-600 font-mono">{testDownload} Mbps</div>
                </div>
                <div className="p-3 bg-neutral-50 rounded-2xl border border-neutral-100">
                  <span className="text-[10px] text-neutral-500 uppercase font-bold">Peak Upload</span>
                  <div className="text-base font-bold text-blue-600 font-mono">{testUpload} Mbps</div>
                </div>
              </div>

              <button
                onClick={handleStartSpeedTest}
                disabled={speedTestRunning}
                className="px-8 py-3 rounded-2xl bg-amber-400 hover:bg-amber-500 disabled:bg-neutral-200 text-neutral-950 font-bold text-sm shadow-md transition flex items-center gap-2"
              >
                <Play className="w-4 h-4 fill-neutral-950" />
                <span>{speedTestRunning ? 'Testing 5G Speed...' : 'Start Speed Test'}</span>
              </button>
            </div>
          )}

          {/* ─────────────────────────────────────────────────────────────
              TAB 7: ROUTER SYSTEM & DIAGNOSTICS
          ───────────────────────────────────────────────────────────── */}
          {activeTab === 'system' && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-neutral-200 shadow-sm space-y-6">
              <div className="border-b border-neutral-100 pb-4">
                <h2 className="text-lg font-bold text-neutral-900">ZTE G5TS System Management</h2>
                <p className="text-xs text-neutral-500">
                  Device information, firmware updates, diagnostics, and reboot controls.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
                {/* Device Info */}
                <div className="p-5 rounded-2xl bg-neutral-50 border border-neutral-200 space-y-3 font-mono">
                  <h3 className="font-sans font-bold text-sm text-neutral-900 mb-2">Device Information</h3>
                  <div className="flex justify-between">
                    <span className="text-neutral-500">Device Model:</span>
                    <span className="font-bold text-neutral-800">ZTE G5TS (MC888 / Snapdragon X62)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-500">IMEI:</span>
                    <span className="text-neutral-800">864290059124810</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-500">Hardware Version:</span>
                    <span className="text-neutral-800">G5TS_HW_V2.0</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-500">Software / Firmware:</span>
                    <span className="text-neutral-800">ZTE_G5TS_MTN_V1.0.0B08</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-500">Uptime:</span>
                    <span className="text-neutral-800">14 days, 6 hours, 28 mins</span>
                  </div>
                </div>

                {/* Maintenance & Updates */}
                <div className="p-5 rounded-2xl bg-neutral-50 border border-neutral-200 space-y-4">
                  <h3 className="font-sans font-bold text-sm text-neutral-900 mb-2">Maintenance Actions</h3>
                  
                  <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-neutral-200">
                    <div>
                      <div className="font-bold text-neutral-800">Over-the-Air Firmware Update</div>
                      <div className="text-[11px] text-neutral-500">Firmware is up to date (V1.0.0B08)</div>
                    </div>
                    <button
                      onClick={() => showToast('Checking ZTE OTA servers... Firmware is up to date.')}
                      className="px-3 py-1.5 rounded-lg border border-neutral-300 hover:bg-neutral-100 text-xs font-semibold text-neutral-700"
                    >
                      Check Updates
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-neutral-200">
                    <div>
                      <div className="font-bold text-neutral-800">Reboot CPE Router</div>
                      <div className="text-[11px] text-neutral-500">Soft restart the ZTE G5TS modem engine</div>
                    </div>
                    <button
                      onClick={handleReboot}
                      className="px-3 py-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-xs font-semibold text-white"
                    >
                      Reboot Now
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* ─────────────────────────────────────────────────────────────
          MODAL 1: 5G ADVANCED RF ENGINEERING & CELL DIAGNOSTICS
      ───────────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {showRfModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-neutral-950 text-white rounded-3xl p-6 max-w-2xl w-full border border-neutral-800 shadow-2xl space-y-6"
            >
              <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
                <div className="flex items-center gap-2.5">
                  <Activity className="w-5 h-5 text-amber-400" />
                  <div>
                    <h3 className="text-base font-bold">5G Advanced RF Cell Diagnostics</h3>
                    <p className="text-[11px] text-neutral-400 font-mono">Qualcomm Snapdragon X62 5G Baseband Telemetry</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowRfModal(false)}
                  className="text-neutral-400 hover:text-white text-xl font-bold px-2 py-1"
                >
                  &times;
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs font-mono">
                <div className="p-3 rounded-2xl bg-neutral-900 border border-neutral-800">
                  <span className="text-[10px] text-neutral-400">PRIMARY NR BAND</span>
                  <div className="font-bold text-amber-400 text-sm mt-0.5">n78 (3500 MHz TDD)</div>
                  <span className="text-[10px] text-neutral-500">Channel BW: 100 MHz</span>
                </div>

                <div className="p-3 rounded-2xl bg-neutral-900 border border-neutral-800">
                  <span className="text-[10px] text-neutral-400">ANCHOR LTE CARRIER</span>
                  <div className="font-bold text-blue-400 text-sm mt-0.5">Band 3 (1800 MHz FDD)</div>
                  <span className="text-[10px] text-neutral-500">Channel BW: 20 MHz</span>
                </div>

                <div className="p-3 rounded-2xl bg-neutral-900 border border-neutral-800">
                  <span className="text-[10px] text-neutral-400">SIGNAL POWER (RSRP)</span>
                  <div className="font-bold text-emerald-400 text-sm mt-0.5">{rsrp} dBm</div>
                  <span className="text-[10px] text-neutral-500">Signal Rating: Excellent</span>
                </div>

                <div className="p-3 rounded-2xl bg-neutral-900 border border-neutral-800">
                  <span className="text-[10px] text-neutral-400">CARRIER SINR</span>
                  <div className="font-bold text-amber-400 text-sm mt-0.5">+{sinr} dB</div>
                  <span className="text-[10px] text-neutral-500">Interference: Minimal</span>
                </div>

                <div className="p-3 rounded-2xl bg-neutral-900 border border-neutral-800">
                  <span className="text-[10px] text-neutral-400">SIGNAL QUALITY (RSRQ)</span>
                  <div className="font-bold text-white text-sm mt-0.5">-11.0 dB</div>
                  <span className="text-[10px] text-neutral-500">Threshold: Optimal</span>
                </div>

                <div className="p-3 rounded-2xl bg-neutral-900 border border-neutral-800">
                  <span className="text-[10px] text-neutral-400">CQI (CHANNEL QUALITY)</span>
                  <div className="font-bold text-emerald-400 text-sm mt-0.5">15 / 15</div>
                  <span className="text-[10px] text-neutral-500">Modulation: 256-QAM</span>
                </div>

                <div className="p-3 rounded-2xl bg-neutral-900 border border-neutral-800">
                  <span className="text-[10px] text-neutral-400">PHYSICAL CELL ID (PCI)</span>
                  <div className="font-bold text-neutral-200 mt-0.5">382</div>
                  <span className="text-[10px] text-neutral-500">Sector: Alpha</span>
                </div>

                <div className="p-3 rounded-2xl bg-neutral-900 border border-neutral-800">
                  <span className="text-[10px] text-neutral-400">eNB / gNB ID</span>
                  <div className="font-bold text-neutral-200 mt-0.5">4059281 (0x3DF651)</div>
                  <span className="text-[10px] text-neutral-500">MTN Sandton Main</span>
                </div>

                <div className="p-3 rounded-2xl bg-neutral-900 border border-neutral-800">
                  <span className="text-[10px] text-neutral-400">MIMO & DIVERSITY</span>
                  <div className="font-bold text-emerald-400 mt-0.5">4x4 MIMO (Rank 4)</div>
                  <span className="text-[10px] text-neutral-500">4 Internal Antennas</span>
                </div>
              </div>

              {/* Antenna Port Levels */}
              <div className="p-4 rounded-2xl bg-neutral-900/60 border border-neutral-800 text-xs font-mono space-y-2">
                <span className="text-neutral-400 text-[10px] uppercase font-bold">4-Port Smart Antenna Vector:</span>
                <div className="grid grid-cols-4 gap-2 text-center">
                  <div className="p-2 rounded bg-neutral-950 border border-neutral-800">
                    <span className="text-[9px] text-neutral-500">ANT 0</span>
                    <div className="text-amber-400 font-bold">-74 dBm</div>
                  </div>
                  <div className="p-2 rounded bg-neutral-950 border border-neutral-800">
                    <span className="text-[9px] text-neutral-500">ANT 1</span>
                    <div className="text-amber-400 font-bold">-72 dBm</div>
                  </div>
                  <div className="p-2 rounded bg-neutral-950 border border-neutral-800">
                    <span className="text-[9px] text-neutral-500">ANT 2</span>
                    <div className="text-amber-400 font-bold">-75 dBm</div>
                  </div>
                  <div className="p-2 rounded bg-neutral-950 border border-neutral-800">
                    <span className="text-[9px] text-neutral-500">ANT 3</span>
                    <div className="text-amber-400 font-bold">-73 dBm</div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  onClick={() => setShowRfModal(false)}
                  className="px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-500 text-neutral-950 font-bold text-xs shadow-md transition"
                >
                  Close Diagnostics
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ─────────────────────────────────────────────────────────────
          MODAL 2: INTERACTIVE MTN USSD SESSION MODAL
      ───────────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {showUssdModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-neutral-950 text-white rounded-3xl p-6 max-w-lg w-full border border-neutral-800 shadow-2xl space-y-4 font-mono text-xs"
            >
              <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
                <div className="flex items-center gap-2">
                  <Hash className="w-4 h-4 text-amber-400" />
                  <span className="font-bold text-sm">MTN USSD Terminal</span>
                </div>
                <button
                  onClick={() => {
                    setShowUssdModal(false);
                    setUssdSessionActive(false);
                    setUssdResultText(null);
                  }}
                  className="text-neutral-400 hover:text-white text-lg font-bold"
                >
                  &times;
                </button>
              </div>

              {/* USSD Input Bar */}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={ussdInput}
                  onChange={(e) => setUssdInput(e.target.value)}
                  placeholder="e.g. *136# or *142#"
                  className="flex-1 p-2.5 rounded-xl bg-neutral-900 border border-neutral-700 text-amber-400 font-bold focus:outline-none focus:ring-2 focus:ring-amber-400"
                />
                <button
                  onClick={() => handleDialUssd()}
                  disabled={ussdLoading}
                  className="px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-500 text-neutral-950 font-bold transition flex items-center gap-1.5"
                >
                  <PhoneCall className="w-3.5 h-3.5" />
                  <span>{ussdLoading ? 'Dialing...' : 'Dial'}</span>
                </button>
              </div>

              {/* Interactive Session Display Box */}
              <div className="p-4 rounded-2xl bg-neutral-900/90 border border-neutral-800 min-h-[160px] flex flex-col justify-between">
                {ussdLoading && (
                  <div className="flex flex-col items-center justify-center py-8 text-neutral-400 gap-2">
                    <div className="w-6 h-6 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
                    <span>Communicating with MTN HLR Gateway...</span>
                  </div>
                )}

                {!ussdLoading && ussdSessionActive && (
                  <div className="space-y-3">
                    <div className="text-amber-400 font-bold text-sm">{ussdSessionTitle}</div>
                    <div className="space-y-1.5 text-neutral-300">
                      {ussdSessionMenu.map((item, idx) => (
                        <div
                          key={idx}
                          onClick={() => {
                            const choiceKey = item.trim().charAt(0);
                            handleUssdReply(choiceKey);
                          }}
                          className="hover:text-amber-300 hover:bg-neutral-800/60 p-1.5 rounded-lg cursor-pointer transition flex items-center justify-between"
                        >
                          <span>{item}</span>
                          <span className="text-[10px] text-neutral-500">Select</span>
                        </div>
                      ))}
                    </div>

                    {/* Reply Input */}
                    <div className="pt-2 border-t border-neutral-800 flex gap-2">
                      <input
                        type="text"
                        placeholder="Reply (e.g. 1)"
                        value={ussdReplyInput}
                        onChange={(e) => setUssdReplyInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleUssdReply();
                        }}
                        className="flex-1 p-2 rounded-xl bg-neutral-950 border border-neutral-700 text-white focus:outline-none focus:ring-1 focus:ring-amber-400 text-xs"
                      />
                      <button
                        onClick={() => handleUssdReply()}
                        className="px-4 py-2 rounded-xl bg-amber-400 text-neutral-950 font-bold text-xs"
                      >
                        Send
                      </button>
                    </div>
                  </div>
                )}

                {!ussdLoading && !ussdSessionActive && ussdResultText && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
                      <Check className="w-4 h-4" />
                      <span>Response from MTN Network:</span>
                    </div>
                    <p className="whitespace-pre-line text-neutral-200 leading-relaxed bg-neutral-950 p-3 rounded-xl border border-neutral-800">
                      {ussdResultText}
                    </p>
                  </div>
                )}

                {!ussdLoading && !ussdSessionActive && !ussdResultText && (
                  <div className="text-neutral-500 py-6 text-center">
                    Enter a USSD string like <span className="text-amber-400 font-bold">*136#</span> or <span className="text-amber-400 font-bold">*142#</span> and click Dial.
                  </div>
                )}
              </div>

              <div className="flex justify-between items-center text-[11px] text-neutral-400 pt-1">
                <span>Tip: Click option 1 or type 1 to check instant balance</span>
                <button
                  onClick={() => {
                    setShowUssdModal(false);
                    setUssdSessionActive(false);
                    setUssdResultText(null);
                  }}
                  className="px-3 py-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-300"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ─────────────────────────────────────────────────────────────
          MODAL 3: WI-FI QR CODE MODAL
      ───────────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {showQrModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-3xl p-6 max-w-sm w-full text-center space-y-4 border border-neutral-200 shadow-2xl"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold font-mono uppercase text-amber-600">Scan to Connect</span>
                <button
                  onClick={() => setShowQrModal(false)}
                  className="text-neutral-400 hover:text-neutral-700 text-lg font-bold"
                >
                  &times;
                </button>
              </div>

              <div className="p-4 bg-neutral-900 rounded-2xl flex flex-col items-center justify-center text-white">
                <div className="w-48 h-48 bg-white p-3 rounded-xl flex items-center justify-center shadow-md">
                  {/* Stylized QR Code SVG */}
                  <svg viewBox="0 0 100 100" className="w-full h-full">
                    <rect width="100" height="100" fill="white" />
                    <rect x="10" y="10" width="25" height="25" fill="#000" />
                    <rect x="15" y="15" width="15" height="15" fill="#fff" />
                    <rect x="18" y="18" width="9" height="9" fill="#000" />

                    <rect x="65" y="10" width="25" height="25" fill="#000" />
                    <rect x="70" y="15" width="15" height="15" fill="#fff" />
                    <rect x="73" y="18" width="9" height="9" fill="#000" />

                    <rect x="10" y="65" width="25" height="25" fill="#000" />
                    <rect x="15" y="70" width="15" height="15" fill="#fff" />
                    <rect x="18" y="73" width="9" height="9" fill="#000" />

                    <rect x="40" y="15" width="10" height="10" fill="#000" />
                    <rect x="45" y="35" width="15" height="15" fill="#000" />
                    <rect x="25" y="45" width="12" height="12" fill="#000" />
                    <rect x="55" y="55" width="15" height="15" fill="#000" />
                    <rect x="75" y="45" width="15" height="10" fill="#000" />
                    <rect x="40" y="75" width="20" height="15" fill="#000" />
                  </svg>
                </div>
                <div className="mt-3 text-xs font-mono font-bold text-amber-400">{ssid5G}</div>
                <div className="text-[11px] text-neutral-400 font-mono">Key: {wifiPassword}</div>
              </div>

              <p className="text-xs text-neutral-500">
                Scan with any smartphone camera to connect to the MTN 5G Wi-Fi network instantly without entering credentials.
              </p>

              <button
                onClick={() => setShowQrModal(false)}
                className="w-full py-2.5 rounded-xl bg-neutral-900 text-white text-xs font-bold"
              >
                Close
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
