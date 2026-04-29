import { NextResponse } from 'next/server';

const rateLimitMap = new Map<string, { count: number; lastReset: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const windowMs = 60 * 1000; // 1 minuto
  const limit = 3; // 3 requisições por minuto por IP

  const record = rateLimitMap.get(ip) || { count: 0, lastReset: now };

  if (now - record.lastReset > windowMs) {
    record.count = 1;
    record.lastReset = now;
  } else {
    record.count++;
  }

  rateLimitMap.set(ip, record);

  return record.count <= limit;
}

export async function POST(request: Request) {
  try {
    const ip = request.headers.get('x-forwarded-for') ?? 'unknown';
    
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: 'Muitas requisições. Por favor, aguarde um minuto antes de tentar novamente.' },
        { status: 429 }
      );
    }
    const body = await request.json();
    const { nomeEstadio, nomeTime, cidade, estado, capacidade, anoInauguracao } = body;

    if (!nomeEstadio || !nomeTime) {
      return NextResponse.json(
        { error: 'Os campos nomeEstadio e nomeTime são obrigatórios.' },
        { status: 400 }
      );
    }

    const apiKey = process.env.GOOGLE_GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: 'A chave de API do Gemini não está configurada.' },
        { status: 500 }
      );
    }

    const infoExtras = [
      cidade && estado ? `Localização: ${cidade}, ${estado}` : '',
      cidade && !estado ? `Localização: ${cidade}` : '',
      capacidade ? `Capacidade: aprox. ${capacidade} pessoas` : '',
      anoInauguracao ? `Inauguração: ano ${anoInauguracao}` : '',
    ].filter(Boolean).join('. ');

    const promptText = `
Você é um especialista em futebol. Escreva uma descrição para o estádio "${nomeEstadio}", que é a casa do time "${nomeTime}".
${infoExtras ? `Informações adicionais fornecidas: ${infoExtras}` : ''}
EXEMPLO DO TOM E TAMANHO ESPERADO:
"A Arena Fonte Nova é um dos principais estádios de futebol do Brasil, localizada em Salvador. Inaugurada em 2013 no lugar da antiga Fonte Nova, possui capacidade para cerca de 48 mil pessoas e é conhecida por sua arquitetura moderna e sustentável. O estádio recebe jogos de futebol — especialmente do Esporte Clube Bahia — além de shows, eventos culturais e competições internacionais, tendo sido uma das sedes da Copa do Mundo FIFA de 2014."

REGRAS:
- Escreva um parágrafo denso, rico em detalhes e direto, contendo no mínimo de 4 a 5 frases longas (semelhante ao tamanho do exemplo acima).
- O tom deve ser profissional, porém acessível e empolgante para fãs de futebol.
- Estrutura: abertura impactante, contexto histórico, características principais e significado para a torcida.
- Inclua curiosidades apenas se forem amplamente conhecidas sobre este estádio.
- NÃO invente dados técnicos (como capacidade exata ou ano de fundação) se não foram fornecidos nas informações adicionais ou se você não tiver certeza absoluta.
- Foque em ser factual e envolvente.
- Retorne apenas o texto da descrição, em um único parágrafo e sem marcações Markdown.
`;

    let response;
    let retries = 3;
    let delay = 1000; // Começa com 1 segundo

    while (retries > 0) {
      response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [{ text: promptText }],
              },
            ],
            generationConfig: {
              temperature: 0.7,
              maxOutputTokens: 1000,
            },
          }),
        }
      );

      if (response.ok) {
        break;
      }

      const errorData = await response.json().catch(() => ({}));
      
      // Se for erro 503 (High Demand), tenta novamente com backoff
      if (response.status === 503 && retries > 1) {
        retries--;
        await new Promise(resolve => setTimeout(resolve, delay));
        delay *= 2; // Exponential backoff (1s, 2s)
        continue;
      }

      console.error('Gemini API Error:', errorData);
      return NextResponse.json(
        { error: errorData.error?.message || 'Falha ao se comunicar com o serviço de IA.' },
        { status: response.status }
      );
    }

    if (!response || !response.ok) {
      return NextResponse.json(
        { error: 'Falha ao se comunicar com o serviço de IA após várias tentativas.' },
        { status: 500 }
      );
    }

    const data = await response.json();
    const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!generatedText) {
      return NextResponse.json(
        { error: 'Nenhuma descrição foi gerada pela IA.' },
        { status: 500 }
      );
    }

    return NextResponse.json({ description: generatedText.trim() });
  } catch (error) {
    console.error('Error generating description:', error);
    return NextResponse.json(
      { error: 'Ocorreu um erro inesperado ao gerar a descrição.' },
      { status: 500 }
    );
  }
}
