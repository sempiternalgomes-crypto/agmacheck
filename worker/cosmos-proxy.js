/**
 * Proxy do Cosmos (Bluesoft) para o app de precificação — Cloudflare Workers.
 *
 * Variáveis do Worker (Settings > Variables and Secrets):
 *   COSMOS_TOKEN     (Secret)  token da sua conta Cosmos
 *   ALLOWED_ORIGINS  (texto, opcional)  origens permitidas, separadas por vírgula.
 *                    Padrão: https://sempiternalgomes-crypto.github.io
 *
 * Rotas:
 *   GET /ping        -> {ok:true, tokenConfigured:boolean}
 *   GET /gtin/<GTIN> -> resposta do Cosmos (cache de 30 dias para achados, 1 dia para "não encontrado")
 */
const DEFAULT_ORIGINS = ['https://sempiternalgomes-crypto.github.io'];
const DAY = 86400;

export default {
  async fetch(request, env, ctx) {
    const origin = request.headers.get('Origin') || '';
    const allowed = (env.ALLOWED_ORIGINS ? env.ALLOWED_ORIGINS.split(',').map(s => s.trim()).filter(Boolean) : DEFAULT_ORIGINS);
    const cors = {
      'Access-Control-Allow-Origin': allowed.includes(origin) ? origin : allowed[0],
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Max-Age': '86400',
      'Vary': 'Origin',
    };
    const json = (body, status = 200, extra = {}) =>
      new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json; charset=utf-8', ...cors, ...extra } });

    if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: cors });
    if (request.method !== 'GET') return json({ error: 'method_not_allowed' }, 405);
    if (origin && !allowed.includes(origin)) return json({ error: 'origin_not_allowed' }, 403);

    const url = new URL(request.url);
    if (url.pathname === '/ping') return json({ ok: true, tokenConfigured: Boolean(env.COSMOS_TOKEN) });

    const m = url.pathname.match(/^\/gtin\/(\d{8,14})$/);
    if (!m) return json({ error: 'not_found' }, 404);
    if (!env.COSMOS_TOKEN) return json({ error: 'token_not_configured' }, 500);
    const code = m[1];

    const cache = caches.default;
    const cacheKey = new Request(`https://cosmos-cache.invalid/gtin/${code}`);
    const hit = await cache.match(cacheKey);
    if (hit) return new Response(hit.body, { status: hit.status, headers: { 'Content-Type': 'application/json; charset=utf-8', 'X-Cache': 'HIT', ...cors } });

    let upstream;
    try {
      upstream = await fetch(`https://api.cosmos.bluesoft.com.br/gtins/${code}.json`, {
        headers: { 'X-Cosmos-Token': env.COSMOS_TOKEN, 'Content-Type': 'application/json', 'User-Agent': 'Cosmos-API-Request' },
      });
    } catch (e) {
      return json({ error: 'upstream_unreachable' }, 502);
    }

    const text = await upstream.text();
    const status = upstream.status;
    const ttl = status === 200 ? 30 * DAY : status === 404 ? DAY : 0;
    if (ttl > 0) {
      ctx.waitUntil(cache.put(cacheKey, new Response(text, { status, headers: { 'Content-Type': 'application/json', 'Cache-Control': `public, max-age=${ttl}` } })));
    }
    return new Response(text, { status, headers: { 'Content-Type': 'application/json; charset=utf-8', 'X-Cache': 'MISS', ...cors } });
  },
};
