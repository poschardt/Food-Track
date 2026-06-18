import Anthropic from '@anthropic-ai/sdk';

// Single Anthropic client for the whole app — never create another one
export const claude = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export const MODELS = {
  // Fast and cheap: use for extraction, formatting, structured output
  fast: 'claude-haiku-4-5-20251001',
  // Smarter: use for reasoning, creativity, recipe suggestions
  smart: 'claude-sonnet-4-6',
} as const;
