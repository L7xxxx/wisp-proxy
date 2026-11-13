const BASE = (process.env.WISP_URL || '').replace(/\/$/, '');
const TOKEN = process.env.FLOOD_TOKEN || '';
const H = { 'content-type': 'application/json', 'access-control-allow-origin': '*' };

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return { statusCode: 204, headers: H, body: '' };
  if (!BASE) return { statusCode: 500, headers: H, body: JSON.stringify({ error: 'WISP_URL missing' }) };
  const p = (event.queryStringParameters || {}).path || '/status';
  try {
    const r = await fetch(BASE + p, {
      method: event.httpMethod,
      headers: { 'content-type': 'application/json', 'x-token': TOKEN },
      body: event.httpMethod === 'POST' ? (event.body || '{}') : undefined
    });
    return { statusCode: r.status, headers: H, body: await r.text() };
  } catch (e) {
    return { statusCode: 502, headers: H, body: JSON.stringify({ error: String(e.message || e) }) };
  }
};
