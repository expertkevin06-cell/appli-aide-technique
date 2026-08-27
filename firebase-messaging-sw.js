/* firebase-messaging-sw.js — push admin (optionnel) */
importScripts('https://www.gstatic.com/firebasejs/10.12.5/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.5/firebase-messaging-compat.js');
firebase.initializeApp({apiKey:"AIzaSyCt40beykvP6N_rSY20EjNbo-2Q7jPzMSk",authDomain:"mondiagauto-a4d7a.firebaseapp.com",projectId:"mondiagauto-a4d7a",storageBucket:"mondiagauto-a4d7a.firebasestorage.app",messagingSenderId:"79906378742",appId:"1:79906378742:web:dac91c4a647d52a56e6dd7"});
try{
 const messaging=firebase.messaging();
 messaging.onBackgroundMessage(p=>{
  self.showNotification((p.notification&&p.notification.title)||'Mes réponses technique',{body:(p.notification&&p.notification.body)||'Nouvelle notification',icon:'icon-192.png'});
 });
}catch(e){}
