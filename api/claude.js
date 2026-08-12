export const maxDuration = 120;

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: { message: 'Method not allowed' } });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: { message: 'ANTHROPIC_API_KEY not configured.' } });
  }

  let body;
  try {
    body = await new Promise((resolve, reject) => {
      let data = '';
      req.on('data', chunk => data += chunk);
      req.on('end', () => resolve(JSON.parse(data)));
      req.on('error', reject);
    });
  } catch {
    return res.status(400).json({ error: { message: 'Invalid JSON in request body.' } });
  }

  const isStreaming = body.stream === true;
  const hasWebSearch = Array.isArray(body.tools) && body.tools.some(t => t.type === 'web_search_20250305');

  const headers = {
    'Content-Type':      'application/json',
    'x-api-key':         apiKey,
    'anthropic-version': '2023-06-01',
  };

  if (hasWebSearch) {
    headers['anthropic-beta'] = 'web-search-2025-03-05';
  }

  let upstream;
  try {
    upstream = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
    });
  } catch (err) {
    return res.status(502).json({ error: { message: 'Upstream fetch failed: ' + err.message } });
  }

  if (!upstream.ok) {
    const errorText = await upstream.text();
    return res.status(upstream.status).json({ error: { message: errorText } });
  }

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Content-Type', upstream.headers.get('Content-Type') || (isStreaming ? 'text/event-stream' : 'application/json'));
  res.status(upstream.status);

  const reader = upstream.body.getReader();
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    res.write(value);
  }
  res.end();
}
