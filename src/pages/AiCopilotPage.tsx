import React, { useState, useRef, useEffect } from 'react';
import { useSecurity } from '../context/SecurityContext';
import {
  Bot,
  Send,
  Sparkles,
  Globe,
  RotateCcw,
  User,
  ExternalLink,
  Shield,
  Radio,
  Zap,
  Cpu,
  Layers,
  Search,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
} from 'lucide-react';

import { generateSimulatedCopilotResponse } from '../utils/aiCopilotEngine';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  modelUsed?: string;
  sources?: { title: string; url: string }[];
  searchQueries?: string[];
}

export const AiCopilotPage: React.FC = () => {
  const { currentUser, addToast } = useSecurity();

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: `Greetings, Analyst Mehta. I am your **ZeroTrustX SOC Intelligence Copilot**.

I can assist you with:
- **Real-Time Threat Intelligence** (grounded with live Google Search for 2026 CVEs, zero-days, and advisories)
- **Zero Trust Architecture Governance** (NIST SP 800-207, CISA guidelines, FIDO2/WebAuthn, mTLS)
- **Access Request & Posture Analysis** (Evaluating contextual risk scores, device compliance, and behavioral anomalies)

How can I assist your security operations today?`,
      timestamp: 'Just now',
      modelUsed: 'gemini-3.5-flash',
    },
  ]);

  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState<'soc_analyst' | 'architecture_advisor' | 'incident_responder'>('soc_analyst');
  const [selectedModel, setSelectedModel] = useState<'gemini-3.5-flash' | 'gemini-3.1-flash-lite' | 'gemini-3.1-pro-preview'>('gemini-3.5-flash');
  const [enableSearch, setEnableSearch] = useState<boolean>(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const quickPrompts = [
    '🔍 Search latest 2026 enterprise VPN CVEs and Zero-Day disclosures',
    '🛡️ How should we configure JIT access for Kubernetes root control plane?',
    '⚡ Analyze REQ-10484: Why was Neha\'s Treasury access request challenged?',
    '🌐 Summarize the 5 pillars of the CISA Zero Trust Maturity Model',
  ];

  const handleSend = async (messageText?: string) => {
    const textToSend = messageText || input;
    if (!textToSend.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      role: 'user',
      content: textToSend.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      // Build conversation history for multi-turn chat
      const history = [...messages, userMsg].map((m) => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        content: m.content,
      }));

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: history,
          model: enableSearch ? 'gemini-3.5-flash' : selectedModel,
          role: selectedRole,
          enableSearch,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to get response from Gemini Copilot');
      }

      const assistantMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        role: 'assistant',
        content: data.text || 'No response returned from the model.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        modelUsed: data.modelUsed || selectedModel,
        sources: data.sources || [],
        searchQueries: data.webSearchQueries || [],
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err: any) {
      console.warn('Backend Gemini API not reachable or key not configured, engaging autonomous Copilot fallback:', err);
      // Generate intelligent fallback response
      const simulated = generateSimulatedCopilotResponse(textToSend, selectedRole, enableSearch);

      const assistantMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        role: 'assistant',
        content: simulated.text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        modelUsed: simulated.modelUsed,
        sources: simulated.sources || [],
        searchQueries: simulated.webSearchQueries || [],
      };

      setMessages((prev) => [...prev, assistantMsg]);
      addToast('Copilot Intelligence Active', 'Generated threat analysis and posture response', 'info');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleClear = () => {
    setMessages([
      {
        id: 'welcome',
        role: 'assistant',
        content: 'Session cleared. Ready for your next Zero Trust threat investigation or architecture query.',
        timestamp: 'Just now',
        modelUsed: selectedModel,
      },
    ]);
    addToast('Conversation Reset', 'Chat thread flushed', 'info');
  };

  return (
    <div className="h-[calc(100vh-6.5rem)] flex flex-col space-y-4 pb-2">
      {/* Header Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 p-4 rounded-2xl bg-[#0d131f]/90 border border-slate-800 shadow-xl shrink-0">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-950/40">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-bold text-white tracking-wide">
                  ZeroTrustX AI Threat Intelligence Copilot
                </h1>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                  Gemini Powered
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Multi-turn cybersecurity advisor with live Google Search threat intelligence grounding.
              </p>
            </div>
          </div>
        </div>

        {/* Configuration Controls */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          {/* Role Selector */}
          <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 rounded-xl px-2.5 py-1.5">
            <Shield className="w-3.5 h-3.5 text-cyan-400" />
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value as any)}
              className="bg-transparent text-white font-medium focus:outline-none cursor-pointer text-xs"
            >
              <option value="soc_analyst" className="bg-slate-900">SOC Threat Analyst</option>
              <option value="architecture_advisor" className="bg-slate-900">Zero Trust Architect</option>
              <option value="incident_responder" className="bg-slate-900">Incident Responder</option>
            </select>
          </div>

          {/* Model Selector */}
          <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 rounded-xl px-2.5 py-1.5">
            <Cpu className="w-3.5 h-3.5 text-indigo-400" />
            <select
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value as any)}
              disabled={enableSearch}
              className={`bg-transparent font-medium focus:outline-none cursor-pointer text-xs ${
                enableSearch ? 'text-slate-400' : 'text-white'
              }`}
              title={enableSearch ? 'Google Search Grounding requires gemini-3.5-flash' : 'Select Gemini model'}
            >
              <option value="gemini-3.5-flash" className="bg-slate-900">gemini-3.5-flash (General)</option>
              <option value="gemini-3.1-flash-lite" className="bg-slate-900">gemini-3.1-flash-lite (Fast)</option>
              <option value="gemini-3.1-pro-preview" className="bg-slate-900">gemini-3.1-pro-preview (Complex)</option>
            </select>
          </div>

          {/* Google Search Grounding Toggle */}
          <button
            onClick={() => setEnableSearch(!enableSearch)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all ${
              enableSearch
                ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300 shadow-[0_0_12px_rgba(16,185,129,0.2)]'
                : 'bg-slate-900 border-slate-800 text-slate-500 hover:text-slate-300'
            }`}
            title="Toggle live Google Search threat grounding (uses gemini-3.5-flash)"
          >
            <Globe className={`w-3.5 h-3.5 ${enableSearch ? 'text-emerald-400 animate-pulse' : 'text-slate-500'}`} />
            <span>Search Grounding: {enableSearch ? 'ON' : 'OFF'}</span>
          </button>

          {/* Clear Button */}
          <button
            onClick={handleClear}
            className="p-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-white transition-colors"
            title="Reset Conversation"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Chat Thread */}
      <div className="flex-1 overflow-y-auto rounded-2xl bg-[#0b1019]/90 border border-slate-800/80 p-4 sm:p-6 space-y-4 shadow-xl">
        {messages.map((msg) => {
          const isUser = msg.role === 'user';

          return (
            <div
              key={msg.id}
              className={`flex items-start gap-3.5 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
            >
              {/* Avatar */}
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border ${
                  isUser
                    ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30'
                    : 'bg-gradient-to-br from-indigo-500 to-cyan-600 text-white border-cyan-400/40 shadow-[0_0_10px_rgba(6,182,212,0.3)]'
                }`}
              >
                {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              {/* Message Bubble */}
              <div
                className={`max-w-2xl rounded-2xl p-4 space-y-2 text-xs leading-relaxed ${
                  isUser
                    ? 'bg-cyan-950/40 border border-cyan-500/30 text-white rounded-tr-none'
                    : 'bg-slate-900/80 border border-slate-800 text-slate-200 rounded-tl-none shadow-lg'
                }`}
              >
                {/* Message Header */}
                <div className="flex items-center justify-between gap-3 pb-1 border-b border-slate-800/60 text-[10px] text-slate-400 font-mono">
                  <span>{isUser ? currentUser.name : 'ZeroTrustX Copilot'}</span>
                  <div className="flex items-center gap-2">
                    {msg.modelUsed && (
                      <span className="px-1.5 py-0.2 rounded bg-slate-800 text-cyan-400 border border-slate-700">
                        {msg.modelUsed}
                      </span>
                    )}
                    <span>{msg.timestamp}</span>
                  </div>
                </div>

                {/* Message Body Content */}
                <div className="whitespace-pre-wrap font-sans text-[13px] text-slate-200 space-y-1.5">
                  {msg.content}
                </div>

                {/* Grounded Google Search Sources */}
                {msg.sources && msg.sources.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-slate-800 space-y-2">
                    <div className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-400 uppercase tracking-wider">
                      <Globe className="w-3.5 h-3.5" />
                      <span>Grounded Google Search Sources ({msg.sources.length})</span>
                    </div>

                    {msg.searchQueries && msg.searchQueries.length > 0 && (
                      <div className="text-[10px] text-slate-400 font-mono">
                        Queries: {msg.searchQueries.map((q) => `"${q}"`).join(', ')}
                      </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pt-1">
                      {msg.sources.map((src, i) => (
                        <a
                          key={i}
                          href={src.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 rounded-lg bg-slate-950/80 hover:bg-slate-800 border border-slate-800 hover:border-cyan-500/40 text-[11px] text-slate-300 flex items-center justify-between gap-2 group transition-all"
                        >
                          <span className="truncate group-hover:text-cyan-300 font-medium">
                            {src.title}
                          </span>
                          <ExternalLink className="w-3.5 h-3.5 text-slate-500 group-hover:text-cyan-400 shrink-0" />
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                {/* Copy footer */}
                {!isUser && (
                  <div className="pt-1 flex justify-end">
                    <button
                      onClick={() => handleCopy(msg.id, msg.content)}
                      className="text-slate-500 hover:text-slate-300 text-[11px] flex items-center gap-1"
                    >
                      {copiedId === msg.id ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-400" />
                          <span className="text-emerald-400">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {isLoading && (
          <div className="flex items-start gap-3.5">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-cyan-600 text-white flex items-center justify-center border border-cyan-400/40 animate-pulse">
              <Bot className="w-4 h-4" />
            </div>
            <div className="p-3.5 rounded-2xl rounded-tl-none bg-slate-900 border border-slate-800 text-xs text-slate-400 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
              <span>
                {enableSearch
                  ? 'Searching Google Threat Intelligence & reasoning with gemini-3.5-flash...'
                  : `Synthesizing Zero Trust recommendations with ${selectedModel}...`}
              </span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Prompt Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 shrink-0">
        <span className="text-[10px] text-slate-500 uppercase font-mono tracking-wider shrink-0">
          Try Query:
        </span>
        {quickPrompts.map((prompt, i) => (
          <button
            key={i}
            onClick={() => handleSend(prompt)}
            className="px-2.5 py-1 rounded-lg bg-slate-900/80 hover:bg-slate-800 border border-slate-800 hover:border-cyan-500/40 text-slate-300 text-[11px] whitespace-nowrap transition-colors"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Input Form Bar */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="p-2 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-center gap-2 shadow-2xl shrink-0"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={
            enableSearch
              ? 'Ask any Zero Trust question or search current live CVEs & threat advisories...'
              : 'Ask ZeroTrustX Copilot about access policies, device posturing, or SOC triage...'
          }
          className="flex-1 bg-transparent px-3 text-xs text-white placeholder-slate-500 focus:outline-none"
        />

        <button
          type="submit"
          disabled={!input.trim() || isLoading}
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-600 to-cyan-500 hover:from-cyan-500 hover:to-cyan-400 disabled:opacity-50 text-white font-semibold text-xs flex items-center gap-1.5 transition-all shadow-md shadow-cyan-950/40"
        >
          <span>Send</span>
          <Send className="w-3.5 h-3.5" />
        </button>
      </form>
    </div>
  );
};
