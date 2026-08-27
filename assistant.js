/* assistant.js — Réponse automatisée : codes défaut (DTC), mots-clés techniques, marque/modèle */
(function(){
'use strict';
/* Base de connaissance DTC (signification, causes probables, action conseillée) */
const DTC_DB={
'P0016':['Corrélation vilebrequin/arbre à cames (admission)','Distribution décalée : chaîne/courroie détendue, capteur AAC, phasage VVT','Contrôler calage et tension distribution, capteurs et phasers ; limiter l\u2019usage'],
'P0017':['Corrélation vilebrequin/arbre à cames (échappement)','Idem P0016 côté échappement','Idem P0016'],
'P0008':['Calage distribution décalé','Chaîne/courroie détendue, tendeurs usés','Contrôle complet distribution + remplacement kit'],
'P0087':['Pression rail carburant trop basse','Pompe HP fatiguée, filtre bouché, fuite, limaille','Contrôler pression rail, pompe HP, filtre ; rinçage si limaille'],
'P0088':['Pression rail trop haute','Régulateur/capteur défectueux','Contrôler régulateur et capteur de rail'],
'P0101':['Débitmètre d\u2019air (MAF) hors plage','MAF encrassé/HS, prise d\u2019air admission','Nettoyer ou remplacer MAF, contrôler étanchéité admission'],
'P0102':['Débitmètre d\u2019air signal bas','MAF HS ou câblage coupé','Contrôler câblage, remplacer MAF'],
'P0171':['Mélange trop pauvre','Prise d\u2019air, pompe à carburant faible, sonde O2, MAF','Recherche fuite d\u2019air, pression carburant, sonde lambda'],
'P0172':['Mélange trop riche','Injecteur fuyard, sonde O2 HS, régulation','Contrôler injecteurs, sonde lambda, pression'],
'P0191':['Capteur pression rail hors plage','Capteur/câblage','Contrôler capteur rail et faisceau'],
'P0201':['Circuit injecteur n°1','Injecteur ou câblage','Test injecteur, contrôle faisceau'],
'P0299':['Pression turbo basse','Fuite durites, wastegate, turbo fatigué, EGR','Contrôler durites/wastegate/turbo/EGR'],
'P00AF':['Commande turbo (actuateur)','Actuateur électronique HS/carbonisé','Contrôler actuateur turbo et câblage'],
'P0300':['Ratés d\u2019allumage multiples','Bobines, bougies, injecteurs, compressions','Bobines/bougies, injecteurs, test compressions'],
'P0301':['Ratés cylindre 1','Bobine/bougie/injecteur cyl. 1','Permuter bobine, contrôler bougie/injecteur'],
'P0340':['Capteur arbre à cames défaillant','Capteur AAC, câblage, calage','Contrôler capteur AAC et calage distribution'],
'P0401':['Recirculation EGR insuffisante','Vanne EGR encrassée/grippée, durites','Nettoyer ou remplacer vanne EGR, contrôle dépression'],
'P0402':['EGR débit excessif','Vanne EGR bloquée ouverte','Nettoyer/remplacer vanne EGR'],
'P0420':['Catalyseur efficacité basse','Catalyseur usé, sondes lambda','Contrôler sondes lambda puis catalyseur'],
'P0455':['Grosse fuite vapeurs carburant','Bouchon réservoir, canister','Contrôler bouchon, canister, durites EVAP'],
'P0441':['Débit purge canister incorrect','Électrovanne purge HS','Remplacer électrovanne de purge'],
'P0504':['Contacteur pédale de frein','Contacteur double piste HS','Remplacer contacteur pédale'],
'P0562':['Tension système basse','Batterie/alternateur/câblage','Test batterie, charge alternateur, masses'],
'P0563':['Tension système haute','Régulateur alternateur','Contrôler alternateur/régulateur'],
'P0620':['Commande alternateur','Alternateur/câblage','Contrôler alternateur et commande'],
'P0670':['Boîtier bougies de préchauffage','Boîtier/câblage','Contrôler boîtier de préchauffage'],
'P0671':['Bougie de préchauffage cyl.1','Bougie HS','Remplacer bougie de préchauffage'],
'P0700':['Défaut calculateur boîte','Mécatronique/électrique boîte','Diagnostic boîte, MAJ logiciel constructeur'],
'P0715':['Capteur régime entrée boîte','Capteur/mécatronique','Contrôler capteur, mécatronique'],
'P0776':['Électrovanne pression boîte','Mécatronique DSG/EAT','Vidange boîte, diagnostic mécatronique'],
'P0711':['Température huile boîte élevée','Surchauffe/huile dégradée','Contrôler refroidissement boîte, vidange'],
'P0841':['Capteur pression boîte','Mécatronique','Diagnostic mécatronique'],
'P1326':['Capteur cliquetis KSDS (Hyundai/Kia)','Risque coussinets de bielle','Contrôle KSDS, campagne constructeur'],
'P17BF':['Mécatronique DSG (VAG)','Embrayages/mécatronique DQ200','MAJ logiciel, mécatronique'],
'P2002':['FAP efficacité basse','FAP colmaté/encrassé','Régénération forcée, contrôle FAP'],
'P242F':['FAP restriction suie','FAP colmaté','Régénération ou remplacement FAP'],
'P2463':['Suie FAP excessive','Régénérations incomplètes','Régénération, adapter parcours, contrôle'],
'P2459':['Fréquence régénérations anormale','Parcours trop courts','Régénération, contrôle capteurs'],
'P2563':['Position wastegate','Wastegate/actuateur','Contrôler wastegate'],
'P0217':['Surchauffe moteur','Refroidissement défaillant','Arrêter le moteur, contrôler circuit refroidissement'],
'P0118':['Température liquide haute','Sonde/circuit/pompe','Contrôler sonde, pompe, radiateur'],
'P0128':['Thermostat bloqué ouvert','Thermostat HS','Remplacer thermostat'],
'P0532':['Capteur pression clim bas','Manque de gaz/capteur','Contrôler charge de gaz, capteur'],
'P0645':['Relais embrayage clim','Relais/embrayage compresseur','Contrôler relais et embrayage'],
'P0AA6':['Isolement batterie haute tension','Défaut isolement HV (câbles, pack)','Diagnostic HV en atelier agréé uniquement'],
'P0A80':['Batterie hybride/HT à remplacer','Modules déséquilibrés/vieillissement','Diagnostic modules, équilibrage, campagne éventuelle'],
'P0A78':['Onduleur/électronique de puissance','Refroidissement onduleur, pompe','Contrôler pompe/liquide onduleur'],
'P0A93':['Refroidissement onduleur','Pompe liquide onduleur HS','Remplacer pompe onduleur'],
'P3024':['Module batterie hybride faible','Cellules/basse tension module','Diagnostic modules batterie'],
'P0C78':['Convertisseur DC/DC défaillant','DC-DC HS, charge 12V','Contrôler/remplacer DC-DC'],
'P0C73':['Défaut sortie DC/DC','DC-DC','Contrôler DC-DC'],
'P1E00':['Défaut de charge VE (OBC/prise)','OBC, câble, borne','Contrôler OBC/prise/câble, autre borne'],
'P0217x':['',''],
'U0100':['Perte communication calculateur moteur','Réseau CAN','Contrôler CAN, connectiques'],
'U0155':['Perte communication multimédia','Head unit','MAJ ou remplacement head unit'],
'U10300':['Défaut communication unité centrale','Multimédia','MAJ firmware'],
'U1233':['Défaut communication écran','Multimédia','MAJ/reset usine'],
'B1000':['Calculateur airbag/SRS','Clockspring, calculateur','Diagnostic SRS, remplacement si nécessaire'],
'C0035':['Capteur vitesse roue AV G','Capteur/câblage/cible','Remplacer capteur de roue'],
'C0040':['Capteur vitesse roue AV D','Capteur/câblage','Remplacer capteur de roue'],
'C0045':['Capteur vitesse roue AR G','Capteur/câblage','Remplacer capteur de roue'],
'C0050':['Capteur vitesse roue AR D','Capteur/câblage','Remplacer capteur de roue']
};
function dtcInfo(code){
 code=(code||'').toUpperCase();
 if(DTC_DB[code]&&DTC_DB[code][0])return DTC_DB[code];
 if(/^P030[1-4]$/.test(code))return DTC_DB['P0301'];
 if(/^P067[1-4]$/.test(code))return DTC_DB['P0671'];
 if(/^P020[1-4]$/.test(code))return DTC_DB['P0201'];
 if(/^C00[3-5]\d$/.test(code))return['Capteur de vitesse de roue (ABS)','Capteur/câblage/cible','Contrôler capteur roue et câblage, remplacer'];
 return null;
}
/* Mots-clés techniques */
const KEYWORD_DB=[
{re:/courroie|belt/i,label:'Courroie (distribution/accessoires)',info:'Usure/dégradation prématurée, notamment courroies immergées dans l\u2019huile (PureTech, EcoBoost). Risque de casse moteur.',act:'Contrôle visuel + remplacement préventif selon campagnes constructeur (courroie, crépine, pompe à huile).'},
{re:/cha[iî]ne|chain/i,label:'Chaîne de distribution',info:'Allongement/tendeurs usés (N47, DV5, K9K…). Bruit à froid, risque de rupture.',act:'Contrôle bruit/tension, remplacement kit chaîne si nécessaire.'},
{re:/egr/i,label:'Vanne EGR',info:'Encrassement/grippage (diesels) : perte puissance, voyant moteur.',act:'Nettoyage ou remplacement vanne EGR + refroidisseur.'},
{re:/fap|dpf|particule/i,label:'FAP / filtre à particules',info:'Colmatage, régénérations incomplètes : mode dégradé.',act:'Régénération forcée, contrôle capteurs, remplacement si céramique HS.'},
{re:/turbo/i,label:'Turbo',info:'Géométrie variable grippée, actuateur, fuites : pression basse (P0299).',act:'Contrôle durites/wastegate/actuateur, remplacement turbo si jeu.'},
{re:/\babs\b/i,label:'ABS',info:'Capteurs de roue défaillants : voyant ABS/ESP, perte assistance.',act:'Contrôle capteurs + câblage, remplacement capteur roue.'},
{re:/ceinture|pretension|prétension/i,label:'Ceintures / prétensionneurs',info:'Prétensionneur inactif après choc ou défaut : voyant ceinture/SRS.',act:'Contrôle faisceau sous siège, remplacement enrouleur/prétensionneur.'},
{re:/frein|brake|plaquette|disque/i,label:'Freinage',info:'Plaquettes/disques usés, étriers grippés : vibrations, distance allongée.',act:'Contrôle épaisseurs, remplacement, purge circuit si nécessaire.'},
{re:/airbag/i,label:'Airbag',info:'Clockspring, calculateur, gonfleurs (Takata) : voyant airbag.',act:'Diagnostic SRS, remplacement gonfleurs selon campagne.'},
{re:/batterie|battery/i,label:'Batterie (12V / HT)',info:'12V faible (VE/hybrides) ou pack HT déséquilibré : autonomie/charge dégradées.',act:'Test 12V/DC-DC ; rapport SOH pack HT, équilibrage modules.'},
{re:/charge|charging/i,label:'Charge (VE/hybride)',info:'Coupures, puissance plafonnée : OBC, prise CCS, BMS.',act:'Contrôle prise/câble/borne, MAJ BMS, préconditionnement.'},
{re:/écran|multimédia|tablette|carplay/i,label:'Multimédia / écran',info:'Reboots, écran noir (OpenR, DiLink, MIB…).',act:'MAJ firmware, reset usine, remplacement head unit.'},
{re:/caméra|camera/i,label:'Caméras',info:'Recul/360° figées ou absentes ; calibration après choc.',act:'Contrôle faisceau, calibration, remplacement caméra.'},
{re:/adas|régulateur|autopilot|pilot/i,label:'ADAS',info:'Capteurs LiDAR/radar décalibrés : alertes intempestives.',act:'Calibration statique/dynamique, MAJ logicielle.'},
{re:/direction/i,label:'Direction assistée',info:'Assistance électrique défaillante : alerte, dureté.',act:'Contrôle capteur couple, MAJ colonne, remplacement groupe.'},
{re:/clim/i,label:'Climatisation',info:'Gaz faible, compresseur/embrayage : froid insuffisant.',act:'Contrôle charge gaz, compresseur, capteur pression.'},
{re:/injecteur/i,label:'Injecteurs',info:'Fuite retour (diesel) ou encrassement (essence) : ratés, fumée.',act:'Test retour/débits, remplacement injecteurs défectueux.'},
{re:/bobine|allumage/i,label:'Bobines d\u2019allumage',info:'Ratés (P030x), voyant clignotant.',act:'Remplacement bobines/bougies, contrôle compressions.'},
{re:/bougie/i,label:'Bougies',info:'Usure (essence) ou préchauffage (diesel) : démarrages difficiles.',act:'Remplacement bougies au couple constructeur.'},
{re:/vanne/i,label:'Vannes (EGR/purge)',info:'EGR ou électrovanne de purge défaillantes.',act:'Nettoyage/remplacement, contrôle dépression.'},
{re:/pompe/i,label:'Pompes',info:'HP (diesel), onduleur (hybride), batterie HT : limitations.',act:'Contrôle pression/liquide, remplacement pompe concernée.'},
{re:/alternateur|démarrage faible/i,label:'Circuit de charge',info:'Batterie/alternateur : voyant, démarrage faible.',act:'Test batterie + charge alternateur, masses.'},
{re:/embrayage|boîte|dsg|edc|cvt/i,label:'Transmission',info:'Mécatronique DSG/EDC, crabots E-Tech : à-coups, patinage.',act:'MAJ logiciel, vidange, mécatronique/kit si nécessaire.'},
{re:/surchauffe|température/i,label:'Surchauffe',info:'Refroidissement défaillant : risque moteur.',act:'Contrôle circuit, pompe, radiateur, thermostat.'},
{re:/huile|consommation/i,label:'Consommation d\u2019huile',info:'H5Ft, PureTech : consommation élevée, ratés.',act:'Suivi constructeur, bougies/bobines, intervention réseau.'},
{re:/soc|autonomie/i,label:'Autonomie / SOH',info:'Pack HT déséquilibré : autonomie en baisse.',act:'Rapport SOH, équilibrage, contrôle thermique.'}
];
/* Détection marque/modèle dans la requête */
function escRe(s){return s.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');}
async function detectVehicle(q){
 const brands=await dbAll('brands');const models=await dbAll('models');
 let b=null,m=null;
 for(const x of brands){if(x.name.length>=3&&q.includes(x.name.toLowerCase())){b=x.name;break;}}
 for(const x of models){if(x.m.length>=2){try{if(new RegExp('(^|[^a-z0-9])'+escRe(x.m.toLowerCase())+'($|[^a-z0-9])').test(q)){if(!m||x.b===b){m=x.m;if(!b)b=x.b;}}}catch(e){}}}
 return{b,m};
}
/* Construit la réponse automatisée */
window.buildAssistant=async function(q){
 const codes=(q.match(/\b[pcbu]\d{4,5}\b/gi)||[]).map(c=>c.toUpperCase());
 const veh=await detectVehicle(q);
 let html='',found=false;
 if(codes.length||KEYWORD_DB.some(k=>k.re.test(q))||veh.b||veh.m){
  html='<div class="detail" style="border-left:4px solid var(--acc2)">';
  codes.forEach(c=>{const i=dtcInfo(c);if(i){found=true;html+='<b>🤖 Code '+c+'</b> : '+i[0]+'<br><small>Causes probables</small>'+i[1]+'<br><small>Action conseillée</small>'+i[2]+'<hr>';}});
  KEYWORD_DB.forEach(k=>{if(k.re.test(q)){found=true;html+='<b>🤖 '+k.label+'</b> : '+k.info+'<br><small>Action</small>'+k.act+'<hr>';}});
  if(veh.b||veh.m){found=true;html+='<b>🚗 Véhicule détecté :</b> '+esc(veh.b||'')+' '+esc(veh.m||'')+' — fiches ciblées ci-dessous.';}
  html+='</div>';
 }
 return{html:found?html:'',b:veh.b,m:veh.m};
};
})();
