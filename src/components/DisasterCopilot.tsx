import React, { useState } from 'react';
import { CycloneScenario, SimulationState } from '../types/cyclone';
import { EvaluatedSimulation } from '../utils/simulationEngine';
import { queryNvidiaCopilot } from '../services/nvidiaAi';
import { Bot, Send, Sparkles, Shield, CheckCircle, Loader2, Cpu } from 'lucide-react';

interface DisasterCopilotProps {
  scenario: CycloneScenario;
  simState: SimulationState;
  evaluated: EvaluatedSimulation;
}

interface Message {
  sender: 'user' | 'assistant';
  text: string;
  time: string;
  actionablePoints?: string[];
  isAiGenerated?: boolean;
}

export const DisasterCopilot: React.FC<DisasterCopilotProps> = ({
  scenario,
  simState: _simState,
  evaluated
}) => {
  const [inputQuery, setInputQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: 'assistant',
      text: `Greetings Incident Commander. I am CyclonePulse AI Copilot. I am actively monitoring ${scenario.name} with real-time storm surge physics, structural vulnerability indices, and shelter occupancy dynamics. How can I assist tactical deployment?`,
      time: 'Just now',
      isAiGenerated: true
    }
  ]);

  const presetQuestions = [
    'Which hospitals or substations are at immediate risk of flooding?',
    'Assess evacuation status and shelter deficit in highest SVI wards.',
    'What happens if storm intensity spikes by 20% during high tide?',
    'Recommend NDRF rescue boat & de-watering pump dispatch distribution.'
  ];

  const handleSend = async (queryText?: string) => {
    const q = queryText || inputQuery;
    if (!q.trim() || isLoading) return;

    const userMsg: Message = {
      sender: 'user',
      text: q,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    if (!queryText) setInputQuery('');
    setIsLoading(true);

    try {
      const copilotResponse = await queryNvidiaCopilot(q, scenario, evaluated);

      const botMsg: Message = {
        sender: 'assistant',
        text: copilotResponse.reply,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        actionablePoints: copilotResponse.actionPoints,
        isAiGenerated: true
      };

      setMessages(prev => [...prev, botMsg]);
    } catch (err) {
      console.error('Copilot error:', err);
      const errorMsg: Message = {
        sender: 'assistant',
        text: 'Error connecting to AI service. Reverting to local simulation heuristics.',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 shadow-xl flex flex-col h-[520px]">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-cyan-950 border border-cyan-700/60 flex items-center justify-center text-cyan-400">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
              Disaster Operations Copilot <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            </h3>
            <p className="text-[11px] text-slate-400">
              Live AI incident decision support & tactical simulation
            </p>
          </div>
        </div>

        {/* Tactical Decision Engine Pill */}
        <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-cyan-950/70 border border-cyan-800/80 text-[10px] font-mono text-cyan-300">
          <Cpu className="w-3 h-3 text-cyan-400 animate-pulse" />
          <span>AI DECISION ENGINE</span>
        </div>
      </div>

      {/* Preset Questions Chips */}
      <div className="flex flex-wrap gap-1.5 mb-3">
        {presetQuestions.map((q, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(q)}
            disabled={isLoading}
            className="text-[11px] bg-slate-950/80 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-cyan-300 px-2.5 py-1 rounded-md transition-colors text-left disabled:opacity-50"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Messages Stream */}
      <div className="flex-1 overflow-y-auto space-y-3 pr-1 text-xs">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div
              className={`max-w-[90%] rounded-xl p-3 ${
                m.sender === 'user'
                  ? 'bg-cyan-600 text-white rounded-br-none shadow-md'
                  : 'bg-slate-950/90 border border-slate-800 text-slate-200 rounded-bl-none shadow-md'
              }`}
            >
              <div className="font-medium leading-relaxed whitespace-pre-line">{m.text}</div>

              {m.actionablePoints && m.actionablePoints.length > 0 && (
                <div className="mt-2.5 pt-2 border-t border-slate-800/80 space-y-1.5">
                  <div className="font-semibold text-cyan-400 text-[11px] flex items-center gap-1">
                    <Shield className="w-3 h-3" />
                    <span>Tactical Directives:</span>
                  </div>
                  <ul className="space-y-1 text-[11px] text-slate-300">
                    {m.actionablePoints.map((pt, pIdx) => (
                      <li key={pIdx} className="flex items-start gap-1.5">
                        <CheckCircle className="w-3 h-3 text-emerald-400 mt-0.5 flex-shrink-0" />
                        <span>{pt}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="flex items-center justify-between text-[9px] mt-2 font-mono text-slate-500">
                <span>{m.time}</span>
                {m.isAiGenerated && (
                  <span className="text-cyan-400/80 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
                    AI Incident Copilot
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex items-center gap-2 p-3 bg-slate-950/90 border border-slate-800 rounded-xl text-slate-300 w-fit">
            <Loader2 className="w-4 h-4 text-cyan-400 animate-spin" />
            <span className="text-xs font-mono">Copilot analyzing live scenario telemetry...</span>
          </div>
        )}
      </div>

      {/* Input Box */}
      <div className="pt-3 border-t border-slate-800 mt-2 flex gap-2">
        <input
          type="text"
          value={inputQuery}
          onChange={(e) => setInputQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Ask Copilot (e.g. Recommend boat dispatch for fishing hamlets)..."
          disabled={isLoading}
          className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 disabled:opacity-50"
        />
        <button
          onClick={() => handleSend()}
          disabled={isLoading || !inputQuery.trim()}
          className="bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white px-3 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
        >
          {isLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
          <span>Send</span>
        </button>
      </div>
    </div>
  );
};
