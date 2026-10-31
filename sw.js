// ネット優先・オフライン時はキャッシュ。更新が自動で反映されるようにする。
const CACHE="ny-english-v2";
const ASSETS=["./","./index.html","./styles.css","./data.js","./app.js","./manifest.json","./icon-192.png","./icon-512.png"];
self.addEventListener("install",e=>{ self.skipWaiting(); e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS))); });
self.addEventListener("activate",e=>e.waitUntil(
  caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())
));
self.addEventListener("fetch",e=>{
  if(e.request.method!=="GET") return;
  e.respondWith(
    fetch(e.request).then(res=>{
      if(res.ok && new URL(e.request.url).origin===location.origin){
        const copy=res.clone(); caches.open(CACHE).then(c=>c.put(e.request,copy));
      }
      return res;
    }).catch(()=>caches.match(e.request,{ignoreSearch:true}))
  );
});
