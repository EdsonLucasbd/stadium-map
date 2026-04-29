import { useState } from 'react';

export interface DadosEstadio {
  nomeEstadio: string;
  nomeTime: string;
  cidade?: string;
  estado?: string;
  capacidade?: number;
  anoInauguracao?: number;
}

export function useGenerateDescription() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateDescription = async (dados: DadosEstadio): Promise<string | null> => {
    setIsLoading(true);
    setError(null);

    try {
      if (!dados.nomeEstadio || !dados.nomeTime) {
        throw new Error('Nome do estádio e do time são obrigatórios para gerar a descrição.');
      }

      const response = await fetch('/api/generate-description', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dados),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Ocorreu um erro ao comunicar com a IA.');
      }

      const data = await response.json();
      return data.description || null;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido ao gerar a descrição.';
      setError(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return { generateDescription, isLoading, error };
}
