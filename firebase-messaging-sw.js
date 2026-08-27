/* firebase-messaging-sw.js — notifications push pour le téléphone admin (optionnel).
   Collez la MÊME config que access.js (sans serverKey). */
importScripts('https://www.gstatic.com/firebasejs/10.12.5/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.5/firebase-messaging-compat.js');
firebase.initializeApp({apiKey:"",authDomain:"",projectId:"",storageBucket:"",messagingSenderId:"",appId:""});
try{
 const messaging=firebase.messaging();
 messaging.onBackgroundMessage(p=>{
  self.showNotification((p.notification&&p.notification.title)||'Mes réponses technique',{body:(p.notification&&p.notification.body)||'Nouvelle notification',icon:'icon-192.png'});
 });
}catch(e){}
