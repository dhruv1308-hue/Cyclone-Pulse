import React, { useState } from 'react';
import { EvaluatedSimulation } from '../utils/simulationEngine';
import { CycloneScenario } from '../types/cyclone';
import { Radio, Volume2, VolumeX, Copy, Check, Share2, AlertOctagon, MessageSquare } from 'lucide-react';

interface MultilingualAlertsProps {
  scenario: CycloneScenario;
  evaluated: EvaluatedSimulation;
}

type SupportedLang = 'en' | 'or' | 'bn' | 'te' | 'ta' | 'hi';

interface AlertTemplate {
  lang: SupportedLang;
  label: string;
  nativeLabel: string;
  speechCode: string;
  title: string;
  body: string;
  actionItems: string[];
}

export const MultilingualAlerts: React.FC<MultilingualAlertsProps> = ({ scenario, evaluated }) => {
  const [selectedLang, setSelectedLang] = useState<SupportedLang>('en');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [copied, setCopied] = useState(false);

  const { activePoint, evaluatedWards, peakSurgeWaterLevelM } = evaluated;
  const criticalWards = evaluatedWards.filter(w => w.evacuationStatus === 'Urgent Evacuate').map(w => w.name);
  const targetAreaText = criticalWards.length > 0 ? criticalWards.join(', ') : 'All Coastal Low-Lying Wards';

  // Dynamic alert messages in 6 regional languages
  const alerts: Record<SupportedLang, AlertTemplate> = {
    en: {
      lang: 'en',
      label: 'English',
      nativeLabel: 'English',
      speechCode: 'en-IN',
      title: `IMD/SDMA EMERGENCY RED ALERT: ${activePoint.category.toUpperCase()}`,
      body: `Cyclone approaching ${scenario.region}. Max sustained winds ${activePoint.windSpeedKmh} km/h with destructive storm surge up to +${peakSurgeWaterLevelM}m. Mandatory evacuation order issued for: ${targetAreaText}.`,
      actionItems: [
        'Move immediately to designated Multi-Purpose Cyclone Shelters (MPCS).',
        'Store 72 hours of drinking water and dry food in waterproof bags.',
        'Turn off main electrical breaker and LPG cylinders before departing.',
        'Do not venture near beaches, sea embankments, or flooded roads.'
      ]
    },
    or: {
      lang: 'or',
      label: 'Odia',
      nativeLabel: 'ଓଡ଼ିଆ',
      speechCode: 'hi-IN', // Browser fallback voice
      title: `ଜରୁରୀକାଳୀନ ସତର୍କ ସୂଚନା: ମହାବାତ୍ୟା ସତର୍କତା (${activePoint.windSpeedKmh} କି.ମି/ଘଣ୍ଟା)`,
      body: `ବାତ୍ୟା ଉପକୂଳ ନିକଟତର ହେଉଛି। ପବନର ବେଗ ${activePoint.windSpeedKmh} କି.ମି/ଘଣ୍ଟା ଏବଂ ଜୁଆର ଉଚ୍ଚତା +${peakSurgeWaterLevelM} ମିଟର ପର୍ଯ୍ୟନ୍ତ ବୃଦ୍ଧି ପାଇବ। ନିମ୍ନଲିଖିତ ଅଞ୍ଚଳ ତୁରନ୍ତ ଖାଲି କରନ୍ତୁ: ${targetAreaText}।`,
      actionItems: [
        'ସମସ୍ତ ଲୋକ ତୁରନ୍ତ ନିକଟସ୍ଥ ବାତ୍ୟା ଆଶ୍ରୟସ୍ଥଳୀକୁ ଯାଆନ୍ତୁ।',
        'ଶୁଖିଲା ଖାଦ୍ୟ, ପିଇବା ପାଣି ଓ ଜରୁରୀ କାଗଜପତ୍ର ପଲିଥିନରେ ବାନ୍ଧି ରଖନ୍ତୁ।',
        'ଘର ଛାଡିବା ପୂର୍ବରୁ ବିଦ୍ୟୁତ ମୁଖ୍ୟ ସୁଇଚ୍ ବନ୍ଦ କରନ୍ତୁ।',
        'ସମୁଦ୍ର କୂଳ କିମ୍ବା ନଦୀ ବନ୍ଧ ନିକଟକୁ ଆଦୌ ଯାଆନ୍ତୁ ନାହିଁ।'
      ]
    },
    bn: {
      lang: 'bn',
      label: 'Bengali',
      nativeLabel: 'বাংলা',
      speechCode: 'bn-IN',
      title: `জরুরি লাল সতর্কতা: বিধ্বংসী ঘূর্ণিঝড় মোকাবিলা (${activePoint.windSpeedKmh} কিমি/ঘণ্টা)`,
      body: `উপকূলের দিকে দ্রুত ধেয়ে আসছে ঘূর্ণিঝড়। বাতাসের গতিবেগ ${activePoint.windSpeedKmh} কিমি/ঘণ্টা এবং জলোচ্ছ্বাসের উচ্চতা +${peakSurgeWaterLevelM} মিটার হতে পারে। অবিলম্বে খালি করার নির্দেশ: ${targetAreaText}।`,
      actionItems: [
        'অবিলম্বে পাকা বহুমুখী সাইক্লোন শেল্টারে আশ্রয় নিন।',
        'শুকনো খাবার, পানীয় জল ও ওষুধ প্লাস্টিক ব্যাগে সংরক্ষণ করুন।',
        'বিদ্যুৎ ও রান্নার গ্যাস সিলিন্ডার অবিলম্বে বন্ধ করুন।',
        'বাঁধ বা নদী সংলগ্ন এলাকায় যাবেন না।'
      ]
    },
    te: {
      lang: 'te',
      label: 'Telugu',
      nativeLabel: 'తెలుగు',
      speechCode: 'te-IN',
      title: `అత్యవసర హెచ్చరిక: తీవ్ర తుఫాను తీరం దాటే అవకాశం (${activePoint.windSpeedKmh} కి.మీ/గం)`,
      body: `తీరం దిశగా తుఫాను దూసుకువస్తోంది. గాలుల వేగం ${activePoint.windSpeedKmh} కి.మీ/గం మరియు సముద్రపు అలల ఉద్ధృతి +${peakSurgeWaterLevelM} మీటర్లు. అత్యవసరంగా ఖాళీ చేయవలసిన ప్రాంతాలు: ${targetAreaText}.`,
      actionItems: [
        'వెంటనే సమీపంలోని తుఫాను సహాయ పునరావాస కేంద్రాలకు చేరుకోండి.',
        'మంచినీరు, పొడి ఆహారం మరియు మందులు భద్రపరుచుకోండి.',
        'కరెంట్ మెయిన్ స్విచ్ ఆఫ్ చేయండి.',
        'తీరప్రాంతాలు మరియు లోతట్టు రోడ్లపై ప్రయాణం చేయకండి.'
      ]
    },
    ta: {
      lang: 'ta',
      label: 'Tamil',
      nativeLabel: 'தமிழ்',
      speechCode: 'ta-IN',
      title: `அதிதீவிர புயல் எச்சரிக்கை: சிவப்பு எச்சரிக்கை (${activePoint.windSpeedKmh} கி.மீ/மணி)`,
      body: `கரையை நோக்கி நகரும் தீவிர புயல். காற்றின் வேகம் ${activePoint.windSpeedKmh} கி.மீ/மணி மற்றும் கடல் அலைகளின் சீற்றம் +${peakSurgeWaterLevelM} மீட்டர். உடனடியாக வெளியேற்றப்பட வேண்டிய பகுதிகள்: ${targetAreaText}.`,
      actionItems: [
        'உடனடியாக அரசு புயல் பாதுகாப்பு மையங்களுக்கு செல்லுங்கள்.',
        'குடிநீர் மற்றும் உலர் உணவுகளை பாதுகாப்பாக வையுங்கள்.',
        'மின் இணைப்பை துண்டியுங்கள்.',
        'கடற்கரைக்கு செல்ல வேண்டாம்.'
      ]
    },
    hi: {
      lang: 'hi',
      label: 'Hindi',
      nativeLabel: 'हिन्दी',
      speechCode: 'hi-IN',
      title: `आपदा चेतावनी: अति गंभीर चक्रवाती तूफ़ान का अलर्ट (${activePoint.windSpeedKmh} किमी/घंटा)`,
      body: `तटीय क्षेत्रों की ओर बढ़ रहा है प्रचंड चक्रवात। हवा की गति ${activePoint.windSpeedKmh} किमी/घंटा और समुद्र में +${peakSurgeWaterLevelM} मीटर ऊँची तूफानी लहरें उठेंगी। तत्काल निकासी क्षेत्र: ${targetAreaText}।`,
      actionItems: [
        'सभी नागरिक तुरंत निकटतम पक्के चक्रवात राहत आश्रयों में पहुंचे।',
        'पीने का पानी, सूखा भोजन और दवाइयां वाटरप्रूफ बैग में सुरक्षित रखें।',
        'घर से निकलने से पूर्व बिजली का मेन स्विच बंद करें।',
        'बाढ़ वाले रास्तों और तटवर्ती क्षेत्रों से दूर रहें।'
      ]
    }
  };

  const currentAlert = alerts[selectedLang];

  // Text to Speech playback
  const handlePlayAudio = () => {
    if (!('speechSynthesis' in window)) {
      alert('Text-to-speech is not supported on this browser.');
      return;
    }

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const fullText = `${currentAlert.title}. ${currentAlert.body}. निर्देश: ${currentAlert.actionItems.join('. ')}`;
    const utterance = new SpeechSynthesisUtterance(fullText);
    utterance.lang = currentAlert.speechCode;
    utterance.rate = 0.95;

    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
    setIsSpeaking(true);
  };

  const handleCopyAlert = () => {
    const fullText = `🚨 ${currentAlert.title}\n\n${currentAlert.body}\n\nACTION CHECKLIST:\n${currentAlert.actionItems.map(a => `• ${a}`).join('\n')}\n\n- Issued via CyclonePulse Disaster Operations Platform`;
    navigator.clipboard.writeText(fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 shadow-xl space-y-4">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Radio className="w-4 h-4 text-rose-400 animate-pulse" />
          <h3 className="text-sm font-bold text-white tracking-wide">
            Multilingual Emergency Siren & Common Alerting Protocol (CAP)
          </h3>
        </div>

        {/* Language Switcher Tabs */}
        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs">
          {(Object.keys(alerts) as SupportedLang[]).map(langKey => (
            <button
              key={langKey}
              onClick={() => {
                if (isSpeaking) window.speechSynthesis.cancel();
                setIsSpeaking(false);
                setSelectedLang(langKey);
              }}
              className={`px-2.5 py-1 rounded font-medium transition-all ${
                selectedLang === langKey
                  ? 'bg-cyan-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {alerts[langKey].nativeLabel}
            </button>
          ))}
        </div>
      </div>

      {/* Broadcast Message Card */}
      <div className="bg-red-950/20 border border-red-900/60 rounded-xl p-4 space-y-3 relative overflow-hidden">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2 text-rose-400 font-bold text-xs">
            <AlertOctagon className="w-4 h-4 animate-bounce" />
            <span>{currentAlert.title}</span>
          </div>
          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-red-950 text-red-300 border border-red-800">
            CAP v1.2 PROTOCOL
          </span>
        </div>

        <p className="text-sm text-slate-200 font-medium leading-relaxed">
          {currentAlert.body}
        </p>

        {/* Action checklist */}
        <div className="bg-slate-950/60 rounded-lg p-3 border border-red-900/30 space-y-1.5">
          <div className="text-xs font-semibold text-rose-300 flex items-center gap-1.5">
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Community Lifesaving Directive:</span>
          </div>
          <ul className="text-xs text-slate-300 space-y-1">
            {currentAlert.actionItems.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-rose-400 font-bold">›</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Broadcast Action Buttons */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-red-900/40">
          <div className="flex items-center gap-2">
            <button
              onClick={handlePlayAudio}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                isSpeaking
                  ? 'bg-rose-600 text-white animate-pulse'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
              }`}
            >
              {isSpeaking ? (
                <>
                  <VolumeX className="w-4 h-4" />
                  <span>STOP BROADCAST</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-4 h-4 text-cyan-400" />
                  <span>VOICE & SIREN PLAYBACK</span>
                </>
              )}
            </button>

            <button
              onClick={handleCopyAlert}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'COPIED TO CLIPBOARD' : 'COPY BROADCAST SMS'}</span>
            </button>
          </div>

          <div className="text-[11px] text-slate-400 font-mono">
            Audience: <b className="text-slate-200">All Cell Towers in Sector</b> (Cell Broadcast Service Ready)
          </div>
        </div>
      </div>
    </div>
  );
};
