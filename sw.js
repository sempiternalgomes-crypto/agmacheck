/* Cache para uso offline. Só intercepta pedidos do próprio site; chamadas a APIs externas (GTIN) passam direto. */
const CACHE_NAME='precificacao-shell-v4';
const APP_FILES=['./','./index.html','./manifest.json','./assets/icon.svg','./assets/icon-192.png','./assets/jszip.min.js','./assets/zxing-browser.min.js','./assets/Shopee_mass_upload_2026-11-03_basic_template.xlsx'];
self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE_NAME).then(c=>c.addAll(APP_FILES)).then(()=>self.skipWaiting())));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('precificacao-shell-')&&k!==CACHE_NAME).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>{
  const req=e.request,url=new URL(req.url);
  if(req.method!=='GET'||url.origin!==self.location.origin)return;
  /* Página: tenta a rede primeiro (para receber atualizações) e cai no cache se estiver offline. */
  if(req.mode==='navigate'){
    e.respondWith(fetch(req).then(res=>{if(res.ok){const copy=res.clone();caches.open(CACHE_NAME).then(c=>c.put('./index.html',copy))}return res}).catch(()=>caches.match('./index.html')));
    return;
  }
  /* Demais arquivos: usa o cache e atualiza em segundo plano. */
  e.respondWith(caches.match(req).then(cached=>{
    const net=fetch(req).then(res=>{if(res.ok){const copy=res.clone();caches.open(CACHE_NAME).then(c=>c.put(req,copy))}return res}).catch(()=>cached);
    return cached||net;
  }));
});
