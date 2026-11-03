/* Cache simples para disponibilizar o aplicativo offline depois do primeiro acesso. */
const CACHE_NAME='precificacao-shell-v3';
const APP_FILES=['./','./index.html','./manifest.json','./assets/jszip.min.js','./assets/zxing-browser.min.js','./assets/Shopee_mass_upload_2026-11-03_basic_template.xlsx'];
self.addEventListener('install',event=>event.waitUntil(caches.open(CACHE_NAME).then(cache=>cache.addAll(APP_FILES)).then(()=>self.skipWaiting())));
self.addEventListener('activate',event=>event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key.startsWith('precificacao-shell-')&&key!==CACHE_NAME).map(key=>caches.delete(key)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',event=>{if(event.request.method!=='GET')return;event.respondWith(caches.match(event.request).then(cached=>cached||fetch(event.request).then(response=>{if(response.ok&&new URL(event.request.url).origin===self.location.origin){const copy=response.clone();caches.open(CACHE_NAME).then(cache=>cache.put(event.request,copy))}return response}).catch(()=>caches.match('./index.html'))))});
