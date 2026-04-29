// Streams an itinerary from the Vercel API route and returns the parsed result.

export async function streamItinerary({ destination, nights, startDate, spots = [], prefs = {} }, onChunk) {
  const response = await fetch('/api/itinerary', {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify({ destination, nights, startDate, spots, prefs }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error || `API error ${response.status}`);
  }

  const reader  = response.body.getReader();
  const decoder = new TextDecoder();
  let   buffer  = '';
  let   fullText = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split('\n');
    buffer = lines.pop() ?? ''; // keep incomplete last line

    for (const line of lines) {
      if (!line.startsWith('data: ')) continue;
      const payload = line.slice(6).trim();
      if (payload === '[DONE]') continue;

      try {
        const { text, error } = JSON.parse(payload);
        if (error) throw new Error(error);
        if (text) {
          fullText += text;
          onChunk?.(fullText);
        }
      } catch (e) {
        if (e.message !== 'Unexpected end of JSON input') throw e;
      }
    }
  }

  // Extract JSON from the accumulated text (Claude sometimes wraps in ```json ... ```)
  const jsonMatch = fullText.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error('No valid JSON in response');
  return JSON.parse(jsonMatch[0]);
}
