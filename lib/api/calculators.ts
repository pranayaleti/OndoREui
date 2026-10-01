import { backendUrl } from '@/lib/backend';

export interface AIAnalysis {
  dealScore: number;
  scoreLabel: 'Strong Buy' | 'Caution' | 'Pass';
  marketContext: string;
  recommendations: string[];
}

export interface AnalyzeRequest {
  calculatorType: string;
  inputs: Record<string, unknown>;
  results: Record<string, unknown>;
  location?: string;
  propertyType?: string;
}

export async function analyzeCalculator(
  params: AnalyzeRequest,
  signal?: AbortSignal
): Promise<AIAnalysis> {
  const res = await fetch(backendUrl('/api/calculators/analyze'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
    signal,
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message ?? 'AI analysis failed');
  }

  return data as AIAnalysis;
}
