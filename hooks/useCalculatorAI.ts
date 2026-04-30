import { useState, useCallback, useRef } from 'react';
import { analyzeCalculator, AIAnalysis, AnalyzeRequest } from '../lib/api/calculators';

interface UseCalculatorAIResult {
  data: AIAnalysis | null;
  loading: boolean;
  error: string | null;
  analyze: () => void;
}

function hasNonZeroInputs(inputs: Record<string, unknown>): boolean {
  const numericValues = Object.values(inputs).filter(
    (v) => typeof v === 'number'
  ) as number[];
  // If there are no numeric inputs at all, allow through (no data to validate)
  if (numericValues.length === 0) return true;
  // Block only when every numeric input is zero
  return numericValues.some((v) => v > 0);
}

export function useCalculatorAI(params: AnalyzeRequest): UseCalculatorAIResult {
  const [data, setData] = useState<AIAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const inputsKey = JSON.stringify(params.inputs);
  const resultsKey = JSON.stringify(params.results);

  const analyze = useCallback(() => {
    if (!hasNonZeroInputs(params.inputs)) {
      setError('Enter values before requesting AI analysis.');
      return;
    }

    // Cancel any in-flight request
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setLoading(true);
    setError(null);

    analyzeCalculator(params, controller.signal)
      .then((result) => {
        setData(result);
        setLoading(false);
      })
      .catch((err: Error) => {
        if (err.name === 'AbortError') return;
        setError(err.message ?? 'AI analysis failed.');
        setLoading(false);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps -- inputs/results are compared by serialized value via inputsKey/resultsKey instead of identity.
  }, [params.calculatorType, params.location, params.propertyType, inputsKey, resultsKey]);

  return { data, loading, error, analyze };
}
