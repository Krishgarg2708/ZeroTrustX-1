import 'dotenv/config';
import express, { Request, Response } from 'express';
import { GoogleGenAI } from '@google/genai';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Google GenAI on the server
const apiKey = process.env.GEMINI_API_KEY || '';
const ai = new GoogleGenAI({
  apiKey,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// System prompt roles
const ROLE_PROMPTS = {
  soc_analyst: `You are ZeroTrustX AI SOC Threat Intelligence Copilot, an elite cybersecurity and Zero Trust Architecture (ZTNA) specialist.
Your responsibilities:
- Evaluate contextual access requests, identity posture, and hardware device health.
- Explain Zero Trust principles: "Never trust, always verify", least-privilege access, continuous authentication, and microsegmentation.
- When Google Search is enabled, provide up-to-date, real-time cyber threat intelligence, latest CVEs, vulnerability disclosures, and security advisories.
- Deliver structured, actionable, professional cybersecurity recommendations.`,
  architecture_advisor: `You are the Lead Zero Trust Systems Architect. You specialize in NIST SP 800-207, CISA Zero Trust Maturity Model, FIDO2/WebAuthn, mutual TLS (mTLS), TPM 2.0 attestation, and Software-Defined Perimeter (SDP).
Explain cryptographic implementations, policy rule design, and network microsegmentation clearly.`,
  incident_responder: `You are an Emergency Incident Responder specializing in SIEM triage, anomalous telemetry correlation, credential stuffing mitigation, and endpoint isolation playbooks.
Focus on containment, forensic investigation, root cause analysis, and remediation steps.`,
};

// POST /api/chat - Multi-turn chat with optional Google Search Grounding
app.post('/api/chat', async (req: Request, res: Response) => {
  try {
    const {
      messages = [],
      model = 'gemini-3.5-flash',
      role = 'soc_analyst',
      enableSearch = false,
    } = req.body;

    if (!apiKey) {
      return res.status(500).json({
        error: 'GEMINI_API_KEY is not configured on the server. Please ensure the secret is set.',
      });
    }

    // Role selection
    const systemInstruction =
      ROLE_PROMPTS[role as keyof typeof ROLE_PROMPTS] || ROLE_PROMPTS.soc_analyst;

    // Model selection validation
    // User requested: gemini-3.5-flash for general and with googleSearch,
    // gemini-3.1-pro-preview for complex tasks, gemini-3.1-flash-lite for fast tasks.
    let selectedModel = model;
    if (enableSearch) {
      // Must use gemini-3.5-flash with googleSearch tool per requirement
      selectedModel = 'gemini-3.5-flash';
    }

    // Format conversation history
    const contents = messages.map((m: { role: string; content: string }) => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }],
    }));

    // Configure tools
    const config: any = {
      systemInstruction,
    };

    if (enableSearch) {
      config.tools = [{ googleSearch: {} }];
    }

    const response = await ai.models.generateContent({
      model: selectedModel,
      contents,
      config,
    });

    const text = response.text || '';

    // Extract Google Search Grounding Metadata
    const candidate = response.candidates?.[0];
    const groundingMetadata = candidate?.groundingMetadata;
    const groundingChunks = groundingMetadata?.groundingChunks || [];
    const webSearchQueries = groundingMetadata?.webSearchQueries || [];

    // Format sources nicely for frontend
    const sources = groundingChunks
      .filter((chunk: any) => chunk.web?.uri)
      .map((chunk: any) => ({
        title: chunk.web?.title || 'Web Reference',
        url: chunk.web?.uri || '',
      }));

    // Deduplicate sources by URL
    const uniqueSources = sources.filter(
      (s: any, idx: number, self: any[]) => idx === self.findIndex((t) => t.url === s.url)
    );

    res.json({
      text,
      sources: uniqueSources,
      webSearchQueries,
      modelUsed: selectedModel,
    });
  } catch (error: any) {
    console.error('Gemini API Error:', error);
    res.status(500).json({
      error: error?.message || 'Failed to communicate with Gemini API',
    });
  }
});

async function startServer() {
  const isDev = process.env.NODE_ENV !== 'production';

  if (isDev) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`ZeroTrustX server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
