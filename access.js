/* access.js — Autorisation/refus d'accès des tiers par l'admin (Firebase optionnel).
   Sans configuration Firebase, l'app reste en mode OUVERT (aucun blocage). */
(function(){
'use strict';
/* ⬇️ COLLEZ ICI votre config Firebase Web (console.firebase.google.com → Paramètres projet → Vos applications → Web).
   Activez Firestore. Pour les notifications push admin, ajoutez vapidKey + serverKey (facultatif). */
const FIREBASE_CONFIG={apiKey:"",authDomain:"",projectId:"",storageBucket:"",messagingSenderId:"",appId:"",vapidKey:"",serverKey:""};
const ENABLED=!!(FIREBASE_CONFIG&&FIREBASE_CONFIG.projectId);
let fb=null,fdb=null;
function did(){let id=localStorage.getItem('mrt_device_id');if(!id){id='dev-'+Math.random().toString(36).slice(2)+Date.now().toString(36);localStorage.setItem('mrt_device_id',id);}return id;}
function loadScript(s){return new Promise((res,rej)=>{const e=document.createElement('script');e.src=s;e.onload=res;e.onerror=rej;document.head.appendChild(e);});}
async function loadFB(){
 if(fb)return fdb;
 await loadScript('https://www.gstatic.com/firebasejs/10.12.5/firebase-app-compat.js');
 await loadScript('https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore-compat.js');
 try{await loadScript('https://www.gstatic.com/firebasejs/10.12.5/firebase-messaging-compat.js');}catch(e){}
 fb=window.firebase;fb.initializeApp(FIREBASE_CONFIG);fdb=fb.firestore();return fdb;
}
function screen(html){
 let el=document.getElementById('accessScreen');
 if(!el){el=document.createElement('div');el.id='accessScreen';el.className='modal show';el.style.zIndex=200;el.innerHTML='<div class="sheetModal"></div>';document.body.appendChild(el);}
 el.querySelector('.sheetModal').innerHTML=html;el.classList.add('show');
}
const clean=s=>String(s||'').replace(/['"<>]/g,'');
function requestHTML(err){return '<h3>🔐 Accès contrôlé</h3><p class="muted">Cette application est protégée par l\u2019administrateur. Envoyez une demande d\u2019accès : l\u2019admin recevra une notification sur son téléphone et pourra autoriser ou refuser.</p>'+(err||'')+'<input id="arName" placeholder="Votre nom / garage"><div class="actions"><button class="primary" onclick="__sendRequest()">📨 Demander l\u2019accès</button></div>';}
function pendingHTML(d){return '<h3>⏳ Demande en attente</h3><p class="muted">Bonjour '+(clean(d&&d.name)||'')+', votre demande a été envoyée. L\u2019application se déverrouillera automatiquement dès que l\u2019admin autorisera l\u2019accès.</p><div class="actions"><button onclick="__recheck()">🔄 Vérifier maintenant</button></div>';}
function deniedHTML(){return '<h3>🚫 Accès refusé</h3><p class="muted">L\u2019administrateur a coupé ou refusé votre accès.</p><div class="actions"><button onclick="__reask()">📨 Redemander</button></div>';}
let polling=null;
function poll(){if(polling)return;polling=setInterval(async()=>{const ok=await window.checkAccess(true);if(ok)location.reload();},15000);}
window.__recheck=async()=>{const ok=await window.checkAccess(true);if(ok)location.reload();else toast('Toujours en attente…');};
window.__reask=async()=>{localStorage.removeItem('mrt_access');screen(requestHTML());};
window.__sendRequest=async function(){
 const name=clean((document.getElementById('arName')||{}).value)||('Utilisateur '+did().slice(-4));
 try{
  const db=await loadFB();const id=did();
  await db.collection('accessRequests').doc(id).set({name:name,deviceId:id,ts:Date.now(),status:'pending'});
  await notifyAdmin(name);
  screen(pendingHTML({name:name}));poll();
 }catch(e){screen(requestHTML('<p style="color:var(--danger)">Erreur réseau — réessayez.</p>'));}
};
async function notifyAdmin(name){
 try{
  const db=await loadFB();
  const meta=await db.collection('meta').doc('adminFcm').get();
  const token=meta.exists&&meta.data().token;
  if(token&&FIREBASE_CONFIG.serverKey){
   await fetch('https://fcm.googleapis.com/fcm/send',{method:'POST',headers:{'Content-Type':'application/json','Authorization':'key='+FIREBASE_CONFIG.serverKey},body:JSON.stringify({to:token,notification:{title:'Mes réponses technique — demande d\u2019accès',body:name+' demande l\u2019accès à l\u2019application'}})});
  }
 }catch(e){}
}
window.checkAccess=async function(silent){
 if(!ENABLED)return true; /* mode ouvert si Firebase non configuré */
 if(localStorage.getItem('mrt_access')==='granted')return true;
 try{
  const db=await loadFB();const id=did();
  const doc=await db.collection('authorizedUsers').doc(id).get();
  if(doc.exists){const d=doc.data();
   if(d.active!==false){localStorage.setItem('mrt_access','granted');return true;}
   screen(deniedHTML());return false;}
  const req=await db.collection('accessRequests').doc(id).get();
  if(req.exists){screen(pendingHTML(req.data()));poll();return false;}
  screen(requestHTML());return false;
 }catch(e){return localStorage.getItem('mrt_access')==='granted';}
};
/* ===== Côté ADMIN ===== */
let knownReq={};
window.onAdminUnlocked=async function(){
 if(!ENABLED)return;
 try{
  const db=await loadFB();
  if(fb.messaging&&FIREBASE_CONFIG.vapidKey&&('Notification'in window)){
   const perm=await Notification.requestPermission();
   if(perm==='granted'){
    const msg=fb.messaging();
    const token=await msg.getToken({vapidKey:FIREBASE_CONFIG.vapidKey});
    if(token)await db.collection('meta').doc('adminFcm').set({token:token,ts:Date.now()});
    msg.onMessage(p=>{try{new Notification((p.notification&&p.notification.title)||'Notification',{body:p.notification&&p.notification.body});}catch(e){}});
   }
  }
  listenRequests();
  renderAccessAdmin();
 }catch(e){}
};
function listenRequests(){
 if(listenRequests.on)return;listenRequests.on=1;
 fdb.collection('accessRequests').onSnapshot(snap=>{
  snap.forEach(ch=>{
   const d=ch.data();
   if(!knownReq[ch.id]&&d&&d.status==='pending'){knownReq[ch.id]=1;toast('🔔 Demande d\u2019accès : '+d.name);try{if(Notification.permission==='granted')new Notification('Demande d\u2019accès',{body:d.name});}catch(e){}}
  });
  renderAccessAdmin();
 });
}
window.renderAccessAdmin=async function(){
 const box=document.getElementById('accessAdminBox');if(!box)return;
 if(!ENABLED){box.innerHTML='<p class="muted"><b>Contrôle d\u2019accès tiers désactivé.</b><br>Pour l\u2019activer : 1) créez un projet sur console.firebase.google.com ; 2) activez <b>Firestore</b> ; 3) copiez la config Web dans <b>access.js</b> (FIREBASE_CONFIG) et <b>firebase-messaging-sw.js</b> ; 4) (optionnel) ajoutez vapidKey + serverKey pour les notifications push. Tant que rien n\u2019est configuré, l\u2019app reste ouverte à tous.</p>';return;}
 try{
  const db=await loadFB();
  const reqs=await db.collection('accessRequests').where('status','==','pending').get();
  const users=await db.collection('authorizedUsers').get();
  let html='<h3>👥 Demandes d\u2019accès en attente</h3>';
  if(reqs.empty)html+='<p class="muted">Aucune demande en attente.</p>';
  reqs.forEach(r=>{const d=r.data();const n=clean(d.name);html+='<div class="rowItem"><b>'+esc(n)+'</b><span>'+(d.ts?new Date(d.ts).toLocaleDateString('fr-FR'):'')+'</span><span><button class="primary" onclick="accessApprove(\''+r.id+'\',\''+n+'\')">✅ Autoriser</button> <button onclick="accessDeny(\''+r.id+'\',\''+n+'\')">❌ Refuser</button></span></div>';});
  html+='<h3>👥 Tableau des tiers (autoriser / couper l\u2019accès à tout moment)</h3>';
  if(users.empty)html+='<p class="muted">Aucun tiers enregistré.</p>';
  users.forEach(u=>{const d=u.data();const n=clean(d.name||u.id);const on=d.active!==false;html+='<div class="rowItem"><b>'+esc(n)+'</b><span>'+(on?'✅ autorisé':'🚫 révoqué')+(d.since?' • depuis '+new Date(d.since).toLocaleDateString('fr-FR'):'')+'</span><span>'+(on?'<button onclick="accessRevoke(\''+u.id+'\')">🔒 Couper l\u2019accès</button>':'<button onclick="accessRestore(\''+u.id+'\')">♻️ Réautoriser</button>')+' <button onclick="accessDelete(\''+u.id+'\')">🗑</button></span></div>';});
  box.innerHTML=html;
 }catch(e){box.innerHTML='<p class="muted">Erreur Firebase : '+esc(e.message)+'</p>';}
};
window.accessApprove=async(id,name)=>{const db=await loadFB();await db.collection('authorizedUsers').doc(id).set({name:name,active:true,since:Date.now()});await db.collection('accessRequests').doc(id).delete();toast('✅ Accès autorisé : '+name);renderAccessAdmin();};
window.accessDeny=async(id,name)=>{const db=await loadFB();await db.collection('authorizedUsers').doc(id).set({name:name,active:false,since:Date.now()});await db.collection('accessRequests').doc(id).delete();toast('❌ Accès refusé : '+name);renderAccessAdmin();};
window.accessRevoke=async(id)=>{const db=await loadFB();await db.collection('authorizedUsers').doc(id).update({active:false});toast('🔒 Accès coupé');renderAccessAdmin();};
window.accessRestore=async(id)=>{const db=await loadFB();await db.collection('authorizedUsers').doc(id).update({active:true});toast('♻️ Accès rétabli');renderAccessAdmin();};
window.accessDelete=async(id)=>{const db=await loadFB();await db.collection('authorizedUsers').doc(id).delete();toast('🗑 Tiers supprimé');renderAccessAdmin();};
})();
