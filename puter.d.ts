// Type declarations for Puter.js - Free, Unlimited Gemini API
// See: https://docs.puter.com/

declare global {
  const puter: PuterInstance;
}

interface PuterAIChatOptions {
  model?: string;
  stream?: boolean;
  [key: string]: any;
}

interface PuterAI {
  chat(message: string, options?: PuterAIChatOptions): Promise<any>;
}

interface PuterInstance {
  ai: PuterAI;
  print(...args: any[]): void;
  // Add other Puter.js methods as needed
}

export {};

