import { supabase } from "./supabase-client.js";
const $=id=>document.getElementById(id);
function dashboardText(key){const lang=document.documentElement.lang||"ar";const words={shareStore:{ar:"شاهد متجري على Mini Store DZ: ",fr:"Découvrez ma boutique sur Mini Store DZ : ",en:"View my store on Mini Store DZ: ",es:"Visita mi tienda en Mini Store DZ: ",de:"Besuche meinen Shop auf Mini Store DZ: ",tr:"Mini Store DZ mağazamı ziyaret et: "},confirmDelete:{ar:"هل تريد حذف المنتج: ",fr:"Voulez-vous supprimer le produit : ",en:"Do you want to delete product: ",es:"¿Quieres eliminar el producto: ",de:"Möchtest du das Produkt löschen: ",tr:"Ürünü silmek istiyor musunuz: "},logoutError:{ar:"تعذر تسجيل الخروج. تحقق من الاتصال ثم حاول مجدداً.",fr:"Déconnexion impossible. Vérifiez votre connexion puis réessayez.",en:"Could not log out. Check your connection and try again.",es:"No se pudo cerrar la sesión. Comprueba tu conexión e inténtalo de nuevo.",de:"Abmeldung fehlgeschlagen. Prüfe deine Verbindung und versuche es erneut.",tr:"Çıkış yapılamadı. Bağlantınızı kontrol edip tekrar deneyin."}};return words[key]?.[lang]||words[key]?.ar||"";}
function dashboardLocale(){const lang=document.documentElement.lang;return lang==="fr"?"fr-FR":lang==="en"?"en-GB":lang==="es"?"es-ES":lang==="de"?"de-DE":lang==="tr"?"tr-TR":"ar-DZ";}
function applyDashboardTheme(mode){
 const selected=mode||"system";document.documentElement.dataset.theme=selected;
 const icon=$("themeToggleIcon"),label=$("themeToggleLabel"),button=$("themeToggle");
 if(icon)icon.textContent=selected==="dark"?"☾":selected==="light"?"☀":"◐";
 if(label)label.textContent=selected==="dark"?"داكن":selected==="light"?"فاتح":"تلقائي";
 if(button){button.title="المظهر الحالي: "+(label?.textContent||"تلقائي")+" — اضغط للتغيير";button.setAttribute("aria-label",button.title);}
}
function initDashboardTheme(){
 let mode="system";try{mode=localStorage.getItem("msdz-theme-merchant")||"system";}catch(error){}
 applyDashboardTheme(mode);
 $("themeToggle")?.addEventListener("click",()=>{
  const current=document.documentElement.dataset.theme||"system",next=current==="system"?"light":current==="light"?"dark":"system";
  try{localStorage.setItem("msdz-theme-merchant",next);}catch(error){}
  applyDashboardTheme(next);
 });
}
const featuredUiTranslations={
 ar:{menu:"تمييز المتجر",title:"اجعل متجرك مميزاً",description:"اعرض متجرك في قسم المتاجر المميزة أعلى الصفحة الرئيسية ليحظى بظهور أكبر أمام الزوار.",price:"500 دج / 7 أيام",benefit1:"✨ ظهور بارز في الصفحة الرئيسية",benefit2:"🏅 شارة متجر مميز",benefit3:"📅 مدة التمييز 7 أيام",paymentTitle:"بيانات التحويل",paymentDescription:"حوّل 500 دج إلى إحدى وسائل الاستلام التالية، ثم أرفق وصل التحويل لإرسال طلب المراجعة.",methodLabel:"طريقة التحويل",senderLabel:"اسم صاحب التحويل",referenceLabel:"رقم العملية / المرجع",receiptLabel:"إرفاق وصل التحويل",receiptHint:"JPG أو PNG أو WebP أو PDF، بحد أقصى 5 ميغابايت. الوصل خاص ولا يراه إلا أنت والإدارة.",amountLabel:"المبلغ المطلوب:",submitLabel:"إرسال طلب تمييز المتجر",historyTitle:"طلبات التمييز السابقة",senderPlaceholder:"الاسم الظاهر في عملية التحويل",referencePlaceholder:"رقم العملية كما يظهر في الإيصال"},
 fr:{menu:"Mettre en avant",title:"Mettez votre boutique en avant",description:"Affichez votre boutique dans la section des boutiques à la une sur la page d’accueil.",price:"500 DZD / 7 jours",benefit1:"✨ Visibilité sur la page d’accueil",benefit2:"🏅 Badge boutique à la une",benefit3:"📅 Mise en avant pendant 7 jours",paymentTitle:"Informations de paiement",paymentDescription:"Transférez 500 DZD puis joignez le reçu pour envoyer votre demande.",methodLabel:"Mode de paiement",senderLabel:"Nom de l’expéditeur",referenceLabel:"Référence de transaction",receiptLabel:"Joindre le reçu",receiptHint:"JPG, PNG, WebP ou PDF, 5 Mo maximum. Le reçu reste privé.",amountLabel:"Montant à payer :",submitLabel:"Envoyer la demande",historyTitle:"Demandes précédentes",senderPlaceholder:"Nom indiqué sur le transfert",referencePlaceholder:"Référence figurant sur le reçu"},
 en:{menu:"Feature store",title:"Feature your store",description:"Show your store in the featured stores section at the top of the homepage for greater visibility.",price:"500 DZD / 7 days",benefit1:"✨ Prominent homepage placement",benefit2:"🏅 Featured store badge",benefit3:"📅 Featured for 7 days",paymentTitle:"Payment details",paymentDescription:"Transfer 500 DZD and attach the receipt to submit your request.",methodLabel:"Payment method",senderLabel:"Sender name",referenceLabel:"Transaction reference",receiptLabel:"Attach payment receipt",receiptHint:"JPG, PNG, WebP or PDF, up to 5 MB. Your receipt is private.",amountLabel:"Amount due:",submitLabel:"Submit feature request",historyTitle:"Previous requests",senderPlaceholder:"Name shown on the transfer",referencePlaceholder:"Reference shown on the receipt"},
 es:{menu:"Destacar tienda",title:"Destaca tu tienda",description:"Muestra tu tienda en la sección de tiendas destacadas en la parte superior de la página principal.",price:"500 DZD / 7 días",benefit1:"✨ Mayor visibilidad en inicio",benefit2:"🏅 Insignia de tienda destacada",benefit3:"📅 Destacada durante 7 días",paymentTitle:"Datos de pago",paymentDescription:"Transfiere 500 DZD y adjunta el comprobante para enviar tu solicitud.",methodLabel:"Método de pago",senderLabel:"Nombre del remitente",referenceLabel:"Referencia de la operación",receiptLabel:"Adjuntar comprobante",receiptHint:"JPG, PNG, WebP o PDF, máximo 5 MB. El comprobante es privado.",amountLabel:"Importe:",submitLabel:"Enviar solicitud",historyTitle:"Solicitudes anteriores",senderPlaceholder:"Nombre que aparece en la transferencia",referencePlaceholder:"Referencia del comprobante"},
 de:{menu:"Shop hervorheben",title:"Hebe deinen Shop hervor",description:"Zeige deinen Shop im Bereich der hervorgehobenen Shops oben auf der Startseite.",price:"500 DZD / 7 Tage",benefit1:"✨ Prominente Platzierung auf der Startseite",benefit2:"🏅 Abzeichen für hervorgehobene Shops",benefit3:"📅 7 Tage hervorgehoben",paymentTitle:"Zahlungsdaten",paymentDescription:"Überweise 500 DZD und füge den Beleg deiner Anfrage bei.",methodLabel:"Zahlungsmethode",senderLabel:"Name des Absenders",referenceLabel:"Transaktionsreferenz",receiptLabel:"Zahlungsbeleg anhängen",receiptHint:"JPG, PNG, WebP oder PDF, maximal 5 MB. Der Beleg bleibt privat.",amountLabel:"Zu zahlender Betrag:",submitLabel:"Anfrage senden",historyTitle:"Frühere Anfragen",senderPlaceholder:"Name auf der Überweisung",referencePlaceholder:"Referenz auf dem Beleg"},
 tr:{menu:"Mağazayı öne çıkar",title:"Mağazanızı öne çıkarın",description:"Mağazanızı ana sayfanın üst kısmındaki öne çıkan mağazalar bölümünde gösterin.",price:"500 DZD / 7 gün",benefit1:"✨ Ana sayfada belirgin görünürlük",benefit2:"🏅 Öne çıkan mağaza rozeti",benefit3:"📅 7 gün boyunca öne çıkarılır",paymentTitle:"Ödeme bilgileri",paymentDescription:"500 DZD gönderin ve talebinizi iletmek için dekontu ekleyin.",methodLabel:"Ödeme yöntemi",senderLabel:"Gönderen adı",referenceLabel:"İşlem referansı",receiptLabel:"Ödeme dekontunu ekle",receiptHint:"JPG, PNG, WebP veya PDF, en fazla 5 MB. Dekontunuz gizlidir.",amountLabel:"Ödenecek tutar:",submitLabel:"Öne çıkarma talebi gönder",historyTitle:"Önceki talepler",senderPlaceholder:"Transferde görünen ad",referencePlaceholder:"Dekontta görünen referans"}
};
function applyFeaturedPromotionLanguage(){
 const lang=document.documentElement.lang||"ar",words=featuredUiTranslations[lang]||featuredUiTranslations.ar;
 document.querySelectorAll("[data-featured-i18n]").forEach(node=>{const key=node.dataset.featuredI18n;if(words[key])node.textContent=words[key];});
 document.querySelectorAll("[data-featured-placeholder]").forEach(node=>{const key=node.dataset.featuredPlaceholder+"Placeholder";if(words[key])node.placeholder=words[key];});
}


const referralUiTranslations={
 ar:{menu:"ادعُ أصدقاءك",title:"ادعُ أصدقاءك واكسب مكافآت",description:"شارك رابطك الخاص. تُحتسب الدعوة بعد تأكيد الحساب بالبريد الإلكتروني.",confirmed:"دعوة مؤكدة",remaining:"دعوة مؤكدة إضافية",yourLink:"رابط دعوتك الخاص",copy:"نسخ الرابط",share:"مشاركة",badge1:"10 دعوات — Pro مجاناً 7 أيام",badge2:"20 دعوة — Pro مجاناً 15 يوماً",badge3:"30 دعوة — Pro مجاناً 30 يوماً",progress:"تبقى للوصول إلى المكافأة التالية:",allRewards:"🎉 وصلت إلى جميع مكافآت الإحالة!",achieved:"تم فتحها",locked:"مقفلة",rewardGranted:"مفعّلة",rewardPending:"بانتظار إنشاء متجرك",featuredReward:"إبراز مجاني للمتجر",proReward:"اشتراك Pro مجاني",eliteReward:"اشتراك Premium مجاني",until:"حتى",starts:"تبدأ في",note:"تُحتسب الحسابات الجديدة المؤكدة فقط. لا تُمنح مكافأة عند النقر أو إنشاء حسابات مكررة أو ذاتية.",copied:"تم نسخ رابط الدعوة.",failed:"تعذر نسخ الرابط. حاول مرة أخرى.",shareText:"انضم إلى Mini Store DZ عبر رابط دعوتي:"},
 fr:{menu:"Inviter des amis",title:"Invitez des amis et gagnez des récompenses",description:"Une invitation compte après confirmation de l’e-mail.",confirmed:"inscriptions confirmées",remaining:"invitations confirmées restantes",yourLink:"Votre lien d’invitation",copy:"Copier le lien",share:"Partager",badge1:"10 invitations — Pro gratuit 7 jours",badge2:"20 invitations — Pro gratuit 15 jours",badge3:"30 invitations — Pro gratuit 30 jours",progress:"Encore avant la prochaine récompense :",allRewards:"🎉 Toutes les récompenses sont débloquées !",achieved:"Débloquée",locked:"Verrouillée",rewardGranted:"Activée",rewardPending:"En attente de votre boutique",featuredReward:"Mise en avant gratuite",proReward:"Abonnement Pro gratuit",eliteReward:"Abonnement Premium gratuit",until:"Jusqu’au",starts:"Commence le",note:"Seuls les nouveaux comptes avec e-mail confirmé comptent. Les clics, doublons et auto-invitations ne comptent pas.",copied:"Lien copié.",failed:"Impossible de copier le lien.",shareText:"Rejoignez Mini Store DZ avec mon lien :"},
 en:{menu:"Invite friends",title:"Invite friends and earn rewards",description:"An invite counts after the new account confirms its email.",confirmed:"confirmed invites",remaining:"more confirmed invites",yourLink:"Your personal invite link",copy:"Copy link",share:"Share",badge1:"10 invites — 7 days of free Pro",badge2:"20 invites — 15 days of free Pro",badge3:"30 invites — 30 days of free Pro",progress:"More needed for the next reward:",allRewards:"🎉 All referral rewards unlocked!",achieved:"Unlocked",locked:"Locked",rewardGranted:"Activated",rewardPending:"Waiting for your store",featuredReward:"Free featured placement",proReward:"Free Pro subscription",eliteReward:"Free Premium subscription",until:"Until",starts:"Starts",note:"Only new accounts with confirmed email count. Clicks, duplicate accounts and self-referrals do not count.",copied:"Referral link copied.",failed:"Could not copy the link.",shareText:"Join Mini Store DZ using my invite link:"},
 es:{menu:"Invitar amigos",title:"Invita amigos y gana recompensas",description:"La invitación cuenta cuando se confirma el correo.",confirmed:"invitaciones confirmadas",remaining:"invitaciones confirmadas más",yourLink:"Tu enlace personal",copy:"Copiar enlace",share:"Compartir",badge1:"10 invitaciones — 7 días de Pro gratis",badge2:"20 invitaciones — 15 días de Pro gratis",badge3:"30 invitaciones — 30 días de Pro gratis",progress:"Faltan para la siguiente recompensa:",allRewards:"🎉 ¡Todas las recompensas desbloqueadas!",achieved:"Desbloqueada",locked:"Bloqueada",rewardGranted:"Activada",rewardPending:"Esperando tu tienda",featuredReward:"Promoción gratuita",proReward:"Suscripción Pro gratuita",eliteReward:"Suscripción Premium gratuita",until:"Hasta",starts:"Comienza",note:"Solo cuentan cuentas nuevas con correo confirmado. No cuentan clics, duplicados ni auto-invitaciones.",copied:"Enlace copiado.",failed:"No se pudo copiar el enlace.",shareText:"Únete a Mini Store DZ con mi enlace:"},
 de:{menu:"Freunde einladen",title:"Freunde einladen und Prämien erhalten",description:"Eine Einladung zählt nach bestätigter E-Mail-Adresse.",confirmed:"bestätigte Einladungen",remaining:"weitere bestätigte Einladungen",yourLink:"Dein persönlicher Einladungslink",copy:"Link kopieren",share:"Teilen",badge1:"10 Einladungen — 7 Tage Pro gratis",badge2:"20 Einladungen — 15 Tage Pro gratis",badge3:"30 Einladungen — 30 Tage Pro gratis",progress:"Noch bis zur nächsten Prämie:",allRewards:"🎉 Alle Empfehlungsprämien freigeschaltet!",achieved:"Freigeschaltet",locked:"Gesperrt",rewardGranted:"Aktiviert",rewardPending:"Wartet auf deinen Shop",featuredReward:"Kostenlose Hervorhebung",proReward:"Kostenloses Pro-Abo",eliteReward:"Kostenloses Premium-Abo",until:"Bis",starts:"Beginnt",note:"Nur neue Konten mit bestätigter E-Mail zählen. Klicks, Duplikate und Selbsteinladungen zählen nicht.",copied:"Einladungslink kopiert.",failed:"Link konnte nicht kopiert werden.",shareText:"Tritt Mini Store DZ über meinen Einladungslink bei:"},
 tr:{menu:"Arkadaşlarını davet et",title:"Arkadaşlarını davet et, ödül kazan",description:"Davet, yeni hesap e-postasını doğruladığında sayılır.",confirmed:"onaylı davet",remaining:"onaylı davet daha",yourLink:"Kişisel davet bağlantın",copy:"Bağlantıyı kopyala",share:"Paylaş",badge1:"10 davet — 7 gün ücretsiz Pro",badge2:"20 davet — 15 gün ücretsiz Pro",badge3:"30 davet — 30 gün ücretsiz Pro",progress:"Sonraki ödül için gereken:",allRewards:"🎉 Tüm davet ödülleri açıldı!",achieved:"Açıldı",locked:"Kilitli",rewardGranted:"Etkin",rewardPending:"Mağazanız bekleniyor",featuredReward:"Ücretsiz öne çıkarma",proReward:"Ücretsiz Pro aboneliği",eliteReward:"Ücretsiz Premium aboneliği",until:"Bitiş",starts:"Başlangıç",note:"Yalnızca e-postası doğrulanmış yeni hesaplar sayılır. Tıklamalar, yinelenen hesaplar ve kendini davet etme sayılmaz.",copied:"Davet bağlantısı kopyalandı.",failed:"Bağlantı kopyalanamadı.",shareText:"Davet bağlantımla Mini Store DZ'ye katıl:"}
};
function applyReferralLanguage(){
 const lang=document.documentElement.lang||"ar",words=referralUiTranslations[lang]||referralUiTranslations.ar;
 document.querySelectorAll("[data-referral-i18n]").forEach(node=>{const key=node.dataset.referralI18n;if(words[key])node.textContent=words[key];});
}
async function copyReferralUrl(){
 const field=$("referralLink");if(!field?.value)return false;
 try{if(navigator.clipboard?.writeText)await navigator.clipboard.writeText(field.value);else{field.focus();field.select();if(!document.execCommand("copy"))throw new Error("Copy unavailable");}}
 catch(error){console.error("Referral link copy failed:",error);return false;}
 const words=referralUiTranslations[document.documentElement.lang]||referralUiTranslations.ar;
 $("referralFeedback").textContent=words.copied;return true;
}
async function loadReferralStats(){
 const panel=$("referrals");if(!panel||!user)return;
 const {data,error}=await supabase.rpc("get_my_referral_stats");if(error)throw error;
 const row=Array.isArray(data)?data[0]:data;if(!row?.referral_code)throw new Error("Referral code unavailable");
 const count=Number(row.invited_count||0),code=String(row.referral_code);
 const inviteUrl=new URL("auth.html",location.href);inviteUrl.searchParams.set("next","dashboard.html");inviteUrl.searchParams.set("ref",code);
 $("referralLink").value=inviteUrl.toString();$("referralCount").textContent=String(count);
 const words=referralUiTranslations[document.documentElement.lang]||referralUiTranslations.ar;
 const milestones=[10,20,30],next=milestones.find(n=>count<n);
 $("referralProgress").textContent=next?words.progress+" "+(next-count)+" "+words.remaining:words.allRewards;
 const {data:rewardRows,error:rewardError}=await supabase.rpc("get_my_referral_rewards");
 if(rewardError)console.warn("Referral reward history unavailable:",rewardError);
 renderReferralRewards(count,rewardRows||[]);
}
function renderReferralRewards(count,rewards){
 const panel=$("referralRewardStatus");if(!panel)return;
 const lang=document.documentElement.lang||"ar",words=referralUiTranslations[lang]||referralUiTranslations.ar;
 const labels={10:words.badge1,20:words.badge2,30:words.badge3};
 document.querySelectorAll("[data-referral-milestone]").forEach(card=>{
  const milestone=Number(card.dataset.referralMilestone),earned=count>=milestone;
  card.classList.toggle("earned",earned);
  const state=card.querySelector("small");if(state)state.textContent=earned?words.achieved:words.locked;
  const label=card.querySelector("span");if(label)label.textContent=labels[milestone];
 });
 panel.replaceChildren();
 rewards.forEach(reward=>{
  const line=document.createElement("p");
  const name=reward.reward_type==="featured"?words.featuredReward:reward.reward_type==="premium"?words.eliteReward:words.proReward;
  const state=reward.status==="applied"?words.rewardGranted:words.rewardPending;
  line.textContent=reward.milestone+" — "+name+" · "+state+(reward.starts_at?" · "+words.starts+" "+subscriptionDate(reward.starts_at):"")+(reward.expires_at?" · "+words.until+" "+subscriptionDate(reward.expires_at):"");
  panel.appendChild(line);
 });
}
function initReferralControls(){
 $("copyReferralLink")?.addEventListener("click",copyReferralUrl);
 $("shareReferralLink")?.addEventListener("click",async()=>{
  const url=$("referralLink")?.value;if(!url)return;
  const words=referralUiTranslations[document.documentElement.lang]||referralUiTranslations.ar;
  try{if(navigator.share){await navigator.share({title:"Mini Store DZ",text:words.shareText,url});return;}}
  catch(error){if(error?.name==="AbortError")return;console.warn("Native referral share unavailable:",error);}
  await copyReferralUrl();
 });
 applyReferralLanguage();
}

let user=null,store=null,products=[],orders=[],reviews=[],productFilterTerm="",orderFilterTerm="";
let subscription=null,billingCycle="monthly";
const planConfig={free:{limit:10},pro:{limit:100},premium:{limit:Infinity}};
function subscriptionDate(value){return value?new Date(value).toLocaleDateString(dashboardLocale(),{year:"numeric",month:"long",day:"numeric"}):"";}
function updateBillingPrices(){
 const yearly=billingCycle==="yearly";
 $("proPrice").textContent=yearly?"15,000":"1,500";
 $("premiumPrice").textContent=yearly?"30,000":"3,000";
 $("pricePeriodPro").textContent=yearly?"سنوياً":"شهرياً";
 $("pricePeriodPremium").textContent=yearly?"سنوياً":"شهرياً";
 $("billingMonthly").classList.toggle("active",!yearly);
 $("billingYearly").classList.toggle("active",yearly);
}
function renderSubscription(){
 if(!subscription)return;
 const now=Date.now(),trialActive=subscription.status==="trialing"&&subscription.trial_ends_at&&new Date(subscription.trial_ends_at).getTime()>now;
 const referralProActive=subscription.referral_pro_starts_at&&new Date(subscription.referral_pro_starts_at).getTime()<=now&&subscription.referral_pro_until&&new Date(subscription.referral_pro_until).getTime()>now;
 const referralEliteActive=subscription.referral_premium_starts_at&&new Date(subscription.referral_premium_starts_at).getTime()<=now&&subscription.referral_premium_until&&new Date(subscription.referral_premium_until).getTime()>now;
 const paidPlanActive=trialActive||subscription.status==="active";
 const paidPlan=paidPlanActive?subscription.plan:"free";
 const plan=paidPlan==="premium"||referralEliteActive?"premium":paidPlan==="pro"||referralProActive?"pro":"free";
 const referralRewardActive=!!referralProActive||!!referralEliteActive;
 const used=!!subscription.trial_used_at;
 const status=$("subscriptionStatus"),current=$("subscriptionCurrent");
 if(referralRewardActive&&!paidPlanActive){
  const expiry=referralEliteActive?subscription.referral_premium_until:subscription.referral_pro_until;
  status.textContent="مكافأة دعوات نشطة";
  current.textContent="خطتك الحالية: "+(plan==="pro"?"Pro — احترافي":"Elite / Premium — مميز")+" مجاناً عبر الدعوات · تنتهي في "+subscriptionDate(expiry)+".";
 }else if(trialActive){
  status.textContent="تجربة مجانية نشطة";
  current.textContent="خطتك الحالية: "+(plan==="pro"?"Pro — احترافي":"Premium — مميز")+" · تنتهي التجربة في "+subscriptionDate(subscription.trial_ends_at)+". لن يتم تحصيل أي مبلغ تلقائياً.";
 }else if(subscription.status==="active"){
  status.textContent="اشتراك نشط";
  current.textContent="خطتك الحالية: "+(plan==="pro"?"Pro — احترافي":"Premium — مميز")+".";
 }else if(used){
  status.textContent="الخطة المجانية";
  current.textContent="انتهت الفترة التجريبية أو تم إيقافها. يمكنك الاستمرار بالخطة المجانية حتى تفعيل الدفع الإلكتروني.";
 }else{
  status.textContent="الخطة المجانية";
  current.textContent="أنت على الخطة المجانية. يمكنك تجربة Pro أو Premium لمدة 7 أيام دون إدخال بيانات دفع.";
 }
 $("freePlanStatus").textContent=plan==="free"?"خطتك الحالية":"متاح دائماً";
 const hasPaid=paidPlanActive||referralRewardActive;
 $("startProTrial").disabled=hasPaid||used;
 $("startPremiumTrial").disabled=hasPaid||used;
 $("startProTrial").textContent=used?"تم استخدام التجربة المجانية":hasPaid?"لديك خطة مدفوعة":"ابدأ تجربة Pro المجانية";
 $("startPremiumTrial").textContent=used?"تم استخدام التجربة المجانية":hasPaid?"لديك خطة مدفوعة":"ابدأ تجربة Premium المجانية";
}
async function loadSubscription(){
 const {data,error}=await supabase.from("user_subscriptions").select("*").eq("user_id",user.id).maybeSingle();
 if(error)throw error;
 if(!data)throw new Error("تعذر العثور على بيانات الاشتراك.");
 subscription=data;renderSubscription();
}
async function startPlanTrial(plan){
 const button=$(plan==="pro"?"startProTrial":"startPremiumTrial");
 if(!subscription||button.disabled)return;
 button.disabled=true;button.textContent="جارٍ تفعيل التجربة...";
 try{
  const {data,error}=await supabase.rpc("start_subscription_trial",{p_plan:plan,p_billing_cycle:billingCycle});
  if(error)throw error;
  subscription=data;renderSubscription();
  message("profileFeedback","تم تفعيل تجربتك المجانية لمدة 7 أيام لخطة "+(plan==="pro"?"Pro":"Premium")+".");
 }catch(error){
  console.error("Trial activation failed:",error);
  message("profileFeedback",error.message||"تعذر تفعيل التجربة المجانية.");
  button.disabled=false;renderSubscription();
 }
}

const message=(id,text)=>$(id).textContent=text;
const escapeHtml=value=>String(value??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
function makeSlug(name,id){const base=String(name||"store").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"").slice(0,25)||"store";return base+"-"+id.slice(0,7);}
async function ensureStore(){
 const {data:existing,error}=await supabase.from("stores").select("*").eq("owner_id",user.id).maybeSingle();
 if(error)throw error;if(existing)return existing;
 const fullName=user.user_metadata?.full_name||user.email?.split("@")[0]||"Store Owner";
 const {data,error:createError}=await supabase.from("stores").insert({owner_id:user.id,slug:makeSlug(fullName,user.id),store_name:"متجري",seller_name:fullName,is_published:false}).select("*").single();
 if(createError)throw createError;return data;
}

function renderDailyCharts(){
 const ordersChart=$("ordersChart"),salesChart=$("salesChart");
 if(!ordersChart||!salesChart)return;
 try{
  const days=[];
  const now=new Date();
  for(let offset=6;offset>=0;offset--){
   const day=new Date(now);day.setHours(0,0,0,0);day.setDate(day.getDate()-offset);
   const key=day.getFullYear()+"-"+String(day.getMonth()+1).padStart(2,"0")+"-"+String(day.getDate()).padStart(2,"0");
   days.push({key,label:day.toLocaleDateString(dashboardLocale(),{weekday:"short",day:"numeric"}),orders:0,sales:0});
  }
  const byDate=new Map(days.map(day=>[day.key,day]));
  orders.forEach(order=>{
   const date=new Date(order.created_at);
   if(Number.isNaN(date.getTime()))return;
   const key=date.getFullYear()+"-"+String(date.getMonth()+1).padStart(2,"0")+"-"+String(date.getDate()).padStart(2,"0");
   const day=byDate.get(key);if(!day)return;
   day.orders++;
   if(order.status==="completed")day.sales+=Number(order.total||0);
  });
  const maxOrders=Math.max(1,...days.map(day=>day.orders));
  const maxSales=Math.max(1,...days.map(day=>day.sales));
  const render=(target,field,max,format,kind)=>{
   target.innerHTML=days.map(day=>{
    const value=day[field],height=value?Math.max(4,Math.round(value/max*100)):0;
    return '<div class="daily-chart-item" title="'+escapeHtml(day.label)+': '+escapeHtml(format(value))+'"><span class="daily-chart-value">'+escapeHtml(format(value))+'</span><div class="daily-chart-track"><div class="daily-chart-bar '+kind+'" style="height:'+height+'%"></div></div><span class="daily-chart-day">'+escapeHtml(day.label)+'</span></div>';
   }).join("");
  };
  render(ordersChart,"orders",maxOrders,value=>String(value),"");
  render(salesChart,"sales",maxSales,value=>Number(value).toLocaleString(dashboardLocale())+" دج","sales");
 }catch(error){
  console.error("Dashboard chart rendering failed:",error);
  ordersChart.innerHTML='<p class="chart-empty">تعذر عرض الرسم البياني حالياً.</p>';
  salesChart.innerHTML='<p class="chart-empty">تعذر عرض الرسم البياني حالياً.</p>';
 }
}
function renderStats(){
 $("statOrders").textContent=orders.length.toLocaleString(dashboardLocale());
 $("statNewOrders").textContent=orders.filter(o=>o.status==="new").length.toLocaleString(dashboardLocale());
 const completed=orders.filter(o=>o.status==="completed");
 $("statCompletedOrders").textContent=completed.length.toLocaleString(dashboardLocale());
 const completedSales=completed.reduce((sum,o)=>sum+Number(o.total||0),0);
 $("statSales").textContent=completedSales.toLocaleString(dashboardLocale())+" دج";
 $("statProducts").textContent=products.length.toLocaleString(dashboardLocale());
 renderDailyCharts();
}
async function loadOrders(){
 const {data,error}=await supabase.from("orders").select("*").eq("store_id",store.id).order("created_at",{ascending:false});if(error)throw error;orders=data||[];renderOrders();
}
function renderOrders(){
 renderStats();$("ordersTotal").textContent=orders.length+" طلب";
 const term=normalizeDashboardSearch(orderFilterTerm),visibleOrders=orders.filter(o=>normalizeDashboardSearch([o.customer_name,o.customer_phone,o.notes,o.status,...(Array.isArray(o.items)?o.items.map(i=>i.name):[])].join(" ")).includes(term));
 if(!visibleOrders.length){$("managedOrders").innerHTML='<p class="empty-products">'+(orders.length?'لا توجد نتائج مطابقة.':'لا توجد طلبات حتى الآن. ستظهر هنا طلبات الزبائن من متجرك.')+'</p>';return;}
 const labels={new:"جديد",confirmed:"مؤكد",shipped:"تم الشحن",completed:"مكتمل",cancelled:"ملغى"},states=["new","confirmed","shipped","completed","cancelled"];
 $("managedOrders").innerHTML=visibleOrders.map(o=>{
  const items=Array.isArray(o.items)?o.items:[],detail=items.map(i=>'<span class="order-product-name">'+escapeHtml(i.name)+'</span> × '+Number(i.quantity||1)).join("، ");
  const opts=states.map(s=>'<option value="'+s+'" '+(o.status===s?"selected":"")+'>'+labels[s]+'</option>').join("");
  return '<article class="managed-order"><div class="managed-order-main"><strong>'+escapeHtml(o.customer_name)+'</strong><span>'+escapeHtml(o.customer_phone)+'</span><p>'+detail+'</p><small>'+new Date(o.created_at).toLocaleString(dashboardLocale())+' · '+Number(o.total||0).toLocaleString(dashboardLocale())+' دج</small>'+(o.notes?'<p class="order-note">ملاحظات: '+escapeHtml(o.notes)+'</p>':"")+'</div><div class="managed-order-controls"><span class="order-status order-status-'+o.status+'">'+(labels[o.status]||o.status)+'</span><select data-order-status="'+o.id+'" aria-label="تغيير حالة الطلب">'+opts+'</select></div></article>';
 }).join("");
}
async function updateOrderStatus(event){
 const select=event.target.closest("[data-order-status]");if(!select)return;
 const {data,error}=await supabase.rpc("set_order_status_with_stock",{p_order_id:select.dataset.orderStatus,p_store_id:store.id,p_status:select.value});
 if(error){message("profileFeedback","تعذر تحديث حالة الطلب: "+error.message);select.value=orders.find(o=>o.id===select.dataset.orderStatus)?.status||"new";return;}
 const index=orders.findIndex(o=>o.id===data.id);if(index>=0)orders[index]=data;renderOrders();
}


async function loadReviews(){
 const {data,error}=await supabase.from("store_reviews").select("*").eq("store_id",store.id).order("created_at",{ascending:false});
 if(error)throw error;reviews=data||[];renderReviews();
}
function renderReviews(){
 const approved=reviews.filter(r=>r.status==="approved"),average=approved.length?approved.reduce((s,r)=>s+Number(r.rating),0)/approved.length:0;
 $("reviewsAdminAverage").textContent=approved.length?average.toFixed(1)+"/5":"—";
 $("reviewsAdminStars").textContent=approved.length?"★".repeat(Math.round(average))+"☆".repeat(5-Math.round(average)):"☆☆☆☆☆";
 $("reviewsAdminCount").textContent=approved.length+" تقييم منشور · "+reviews.length+" إجمالي";
 const labels={pending:"بانتظار المراجعة",approved:"منشور",rejected:"مرفوض"};
 if(!reviews.length){$("managedReviews").innerHTML='<p class="empty-products">لا توجد تقييمات بعد. ستظهر هنا آراء الزبائن عندما يرسلونها من صفحة متجرك.</p>';return;}
 $("managedReviews").innerHTML=reviews.map(r=>'<article class="managed-review"><div class="managed-review-body"><div class="managed-review-head"><strong>'+escapeHtml(r.customer_name)+'</strong><span class="review-stars">'+("★".repeat(Number(r.rating))+"☆".repeat(5-Number(r.rating)))+'</span></div><p>'+escapeHtml(r.comment)+'</p><small>'+new Date(r.created_at).toLocaleString(dashboardLocale())+'</small><span class="review-state review-state-'+r.status+'">'+(labels[r.status]||r.status)+'</span></div><div class="managed-review-actions">'+(r.status!=="approved"?'<button type="button" data-review-action="approved" data-review-id="'+r.id+'">نشر</button>':"")+(r.status!=="rejected"?'<button type="button" data-review-action="rejected" data-review-id="'+r.id+'">رفض</button>':"")+'</div></article>').join("");
}
async function moderateReview(event){
 const button=event.target.closest("[data-review-action]");if(!button)return;
 button.disabled=true;
 const {data,error}=await supabase.from("store_reviews").update({status:button.dataset.reviewAction}).eq("id",button.dataset.reviewId).eq("store_id",store.id).select("*").single();
 if(error){message("profileFeedback","تعذر تحديث التقييم: "+error.message);button.disabled=false;return;}
 const i=reviews.findIndex(r=>r.id===data.id);if(i>=0)reviews[i]=data;renderReviews();
}

async function loadProducts(){
 const {data,error}=await supabase.from("products").select("*").eq("store_id",store.id).order("created_at",{ascending:false});
 if(error)throw error;products=data||[];renderProducts();
}
function fillSettings(){
 $("sellerNameInput").value=store.seller_name||"";
 $("sellerBioInput").value=store.seller_bio||"";
 $("storeNameInput").value=store.store_name||"";
 $("storeIdentityName").textContent=store.store_name||"متجري";
 $("storeIdentitySeller").textContent=store.seller_name||"صاحب المتجر";
 $("storeIdentityBio").textContent=store.seller_bio||"أضف نبذة قصيرة لتعريف الزبائن بمتجرك.";
 $("identityPublishStatus").textContent=store.is_published?"متجرك منشور للعامة":"متجرك غير منشور بعد";
 $("identityPublishStatus").classList.toggle("is-published",!!store.is_published);
 $("whatsappInput").value=store.whatsapp||"";
 $("accountEmail").textContent=user.email||"حساب التاجر";
 const publicUrl=new URL("store.html?store="+encodeURIComponent(store.slug),location.href).href;
 $("storeLink").href=publicUrl;
 const openPublicStore=$("openPublicStore");if(openPublicStore)openPublicStore.href=publicUrl;
 $("publicStoreSidebarLink").href=publicUrl;
 $("shareWhatsApp").href="https://wa.me/?text="+encodeURIComponent(dashboardText("shareStore")+publicUrl);
 $("shareFacebook").href="https://www.facebook.com/sharer/sharer.php?u="+encodeURIComponent(publicUrl);
 $("publishStore").textContent=store.is_published?"إلغاء نشر المتجر":"نشر المتجر";
 $("storeStatus").textContent=store.is_published?"متجرك منشور للعامة":"متجرك خاص حتى تنشره";
 showAvatar();
}
function showAvatar(){
 const src=store.avatar_url||"";
 $("avatarFallback").textContent=(store.seller_name||"S").trim().charAt(0).toUpperCase();
 $("avatarImage").src=src;$("avatarImage").hidden=!src;$("avatarFallback").hidden=!!src;
 $("identityAvatarFallback").textContent=(store.store_name||store.seller_name||"S").trim().charAt(0).toUpperCase();
 $("identityAvatarImage").src=src;$("identityAvatarImage").hidden=!src;$("identityAvatarFallback").hidden=!!src;
}
async function saveProfile(){
 if(!store?.id){message("profileFeedback","لم تكتمل تهيئة بيانات المتجر بعد. انتظر لحظة ثم حاول مجدداً.");return;}
 const whatsapp=$("whatsappInput").value.trim().replace(/[\s+()-]/g,"");
 if(store.is_published&&!whatsapp){message("profileFeedback","أضف رقم WhatsApp قبل نشر متجرك حتى يتمكن الزبائن من إرسال الطلبات.");return;}
 if(whatsapp&&!/^\d{8,15}$/.test(whatsapp)){message("profileFeedback","تحقق من رقم WhatsApp ورمز الدولة.");return;}
 const updates={seller_name:$("sellerNameInput").value.trim()||"Store Owner",seller_bio:$("sellerBioInput").value.trim(),store_name:$("storeNameInput").value.trim()||"متجري",whatsapp:whatsapp||null,updated_at:new Date().toISOString()};
 const {data,error}=await supabase.from("stores").update(updates).eq("id",store.id).select("*").single();
 if(error){message("profileFeedback",error.message);return;}
 store=data;fillSettings();message("profileFeedback","تم حفظ بيانات متجرك على السحابة.");
 const {error:profileError}=await supabase.from("profiles").update({full_name:store.seller_name,updated_at:new Date().toISOString()}).eq("id",user.id);
 if(profileError)console.warn("Profile sync:",profileError.message);
}
function extOf(file){const ext=(file.name.split(".").pop()||"jpg").toLowerCase();return ["jpg","jpeg","png","webp"].includes(ext)?ext:"jpg";}
async function uploadImage(file,bucket,folder,maxBytes){
 if(!file)return null;
 if(!["image/jpeg","image/png","image/webp"].includes(file.type))throw new Error("اختر صورة JPEG أو PNG أو WebP.");
 if(file.size>maxBytes)throw new Error("حجم الصورة أكبر من الحد المسموح.");
 const path=user.id+"/"+store.id+"/"+folder+"/"+crypto.randomUUID()+"."+extOf(file);
 const {error}=await supabase.storage.from(bucket).upload(path,file,{upsert:false,contentType:file.type});
 if(error)throw error;
 return supabase.storage.from(bucket).getPublicUrl(path).data.publicUrl;
}
async function uploadAvatar(event){
 const file=event.target.files?.[0];if(!file)return;
 message("profileFeedback","جارٍ رفع الصورة...");
 try{
  const avatar_url=await uploadImage(file,"store-avatars","avatar",2*1024*1024);
  const {data,error}=await supabase.from("stores").update({avatar_url}).eq("id",store.id).select("*").single();
  if(error)throw error;store=data;showAvatar();
  const {error:profileError}=await supabase.from("profiles").update({avatar_url,updated_at:new Date().toISOString()}).eq("id",user.id);
  if(profileError)console.warn(profileError.message);
  message("profileFeedback","تم رفع صورة التاجر وحفظها على السحابة.");
 }catch(error){message("profileFeedback",error.message||"تعذر رفع الصورة.");}
 event.target.value="";
}
async function removeAvatar(){
 const {data,error}=await supabase.from("stores").update({avatar_url:null}).eq("id",store.id).select("*").single();
 if(error){message("profileFeedback",error.message);return;}
 store=data;showAvatar();await supabase.from("profiles").update({avatar_url:null}).eq("id",user.id);message("profileFeedback","تمت إزالة الصورة.");
}
function resetProductForm(){
 $("productForm").reset();$("editingProductId").value="";$("productEmoji").value="📦";$("productSubmit").textContent="＋ إضافة المنتج";$("cancelEdit").hidden=true;$("customProductCategory").hidden=true;$("customProductCategory").required=false;$("customProductCategory").value="";
}
function syncCustomCategory(){
 const custom=$("productCategory").value==="أخرى";$("customProductCategory").hidden=!custom;$("customProductCategory").required=custom;
 if(custom)$("customProductCategory").focus();
}
function normalizeDashboardSearch(value){return String(value??"").normalize("NFD").replace(/[\\u0300-\\u036f]/g,"").toLocaleLowerCase().trim();}
function renderProducts(){
 renderStats();
 $("productsTotal").textContent=products.length+" منتج";
 const term=normalizeDashboardSearch(productFilterTerm);
 const visibleProducts=products.filter(p=>normalizeDashboardSearch([p.name,p.category,p.description].join(" ")).includes(term));
 if(!visibleProducts.length){
  $("managedProducts").innerHTML='<p class="empty-products">'+(products.length?'لا توجد نتائج مطابقة.':'لا توجد منتجات بعد. أضف أول منتجك من النموذج أعلاه.')+'</p>';
  return;
 }
 $("managedProducts").innerHTML=visibleProducts.map(p=>{
  const tracked=p.stock_quantity!==null&&p.stock_quantity!==undefined;
  const qty=tracked?Number(p.stock_quantity):null;
  const stockLabel=!tracked?"مخزون غير محدود":qty===0?"نفد المخزون":qty<=5?"مخزون منخفض: "+qty+" قطعة":"المتوفر: "+qty+" قطعة";
  const stockClass=tracked&&qty<=5?"stock-low":"";
  const imageMarkup=p.image_url
   ?'<img src="'+escapeHtml(p.image_url)+'" alt="" loading="lazy">'
   :escapeHtml(p.emoji||"📦");
  return `<article class="managed-product">
   <div class="managed-product-emoji">${imageMarkup}</div>
   <div class="managed-product-info">
    <strong>${escapeHtml(p.name)}</strong>
    <span><span class="product-category-label">${escapeHtml(p.category||"عام")}</span> · ${Number(p.price||0).toLocaleString(dashboardLocale())} دج · <b class="${stockClass}">${stockLabel}</b></span>
   </div>
   <div class="managed-product-actions">
    <button type="button" data-edit="${p.id}">تعديل</button>
    <button type="button" class="delete-product" data-delete="${p.id}">حذف</button>
   </div>
  </article>`;
 }).join("");
}
async function saveProduct(event){
 event.preventDefault();
 // Never attempt to build an insert payload until the authenticated store is ready.
 if(!store?.id){message("productFeedback","لم يكتمل تحميل بيانات المتجر بعد. انتظر لحظة ثم حاول الحفظ.");return;}
 const id=$("editingProductId").value;
 const files=Array.from($("productImage").files||[]);
 const selectedCategory=$("productCategory").value;
 const category=selectedCategory==="أخرى"?$("customProductCategory").value.trim():selectedCategory;
 const stockValue=$("productStock").value.trim();
 const item={store_id:store.id,name:$("productName").value.trim(),category,price:Number($("productPrice").value),description:$("productDescription").value.trim(),currency:"DZD",is_active:true,stock_quantity:stockValue===""?null:Number(stockValue)};
 if(!item.name||!item.category||!Number.isFinite(item.price)||item.price<0){message("productFeedback","يرجى إدخال اسم المنتج والتصنيف والسعر بشكل صحيح.");return;}
 if(stockValue!==""&&(!Number.isInteger(Number(stockValue))||Number(stockValue)<0)){message("productFeedback","الكمية يجب أن تكون رقماً صحيحاً يساوي صفراً أو أكثر.");return;}
 $("productSubmit").disabled=true;
 message("productFeedback","جارٍ حفظ المنتج...");
 try{
  if(!id){
   const {data:allowed,error:limitError}=await supabase.rpc("can_add_store_product",{p_store_id:store.id});
   if(limitError)throw limitError;
   if(!allowed)throw new Error("وصلت إلى الحد الأقصى لمنتجات خطتك. اختر Pro أو Premium من قسم الاشتراكات لإضافة المزيد.");
  }
  const existingProduct=id?products.find(p=>p.id===id):null;
  const existingImages=existingProduct?(Array.isArray(existingProduct.image_urls)&&existingProduct.image_urls.length?existingProduct.image_urls:[existingProduct.image_url].filter(Boolean)):[];
  if(existingImages.length+files.length>5)throw new Error("يمكن إضافة 5 صور كحد أقصى للمنتج الواحد.");
  const uploadedImages=[];
  for(const file of files)uploadedImages.push(await uploadImage(file,"product-images","products",5*1024*1024));
  item.image_urls=[...existingImages,...uploadedImages];
  item.image_url=item.image_urls[0]||null;
  if(id){
   const {error}=await supabase.from("products").update(item).eq("id",id).eq("store_id",store.id);if(error)throw error;
   message("productFeedback","تم تحديث المنتج على السحابة.");
  }else{
   const {error}=await supabase.from("products").insert(item);if(error)throw error;
   message("productFeedback","تمت إضافة المنتج إلى متجرك.");
  }
  await loadProducts();resetProductForm();
 }catch(error){message("productFeedback",error.message||"تعذر حفظ المنتج.");}
 finally{$("productSubmit").disabled=false;}
}
async function manageProductClick(event){
 const edit=event.target.closest("[data-edit]"),del=event.target.closest("[data-delete]");
 if(edit){
  const p=products.find(x=>x.id===edit.dataset.edit);if(!p)return;
  $("editingProductId").value=p.id;$("productName").value=p.name;const knownCategory=Array.from($("productCategory").options).some(o=>o.value===p.category);$("productCategory").value=knownCategory?(p.category||""):"أخرى";$("customProductCategory").value=knownCategory?"":(p.category||"");syncCustomCategory();$("productPrice").value=p.price;$("productStock").value=p.stock_quantity??"";$("productDescription").value=p.description||"";$("productImage").value="";$("productEmoji").value="📦";$("productSubmit").textContent="حفظ التعديلات";$("cancelEdit").hidden=false;$("productForm").scrollIntoView({behavior:"smooth",block:"center"});
 }
 if(del){
  const p=products.find(x=>x.id===del.dataset.delete);if(!p||!confirm(dashboardText("confirmDelete")+p.name+"?"))return;
  const {error}=await supabase.from("products").delete().eq("id",p.id).eq("store_id",store.id);
  if(error){message("productFeedback",error.message);return;}
  products=products.filter(x=>x.id!==p.id);renderProducts();message("productFeedback","تم حذف المنتج.");
 }
}
async function copyStoreLink(){
 const publicUrl=new URL("store.html?store="+encodeURIComponent(store.slug),location.href).href;
 try{await navigator.clipboard.writeText(publicUrl);message("profileFeedback","تم نسخ رابط متجرك. "+(store.is_published?"يمكنك مشاركته الآن.":"انشر المتجر أولاً ليتمكن الزوار من مشاهدة المنتجات."));}
 catch(error){message("profileFeedback","تعذر النسخ تلقائياً. استخدم زر عرض المتجر لفتح الرابط ونسخه من شريط العنوان.");}
}
async function togglePublish(){
 const next=!store.is_published;
 if(next&&!String(store.whatsapp||"").replace(/\D/g,"")){message("profileFeedback","أضف رقم WhatsApp قبل نشر متجرك حتى يتمكن الزبائن من إرسال الطلبات.");return;}
 const {data,error}=await supabase.from("stores").update({is_published:next,updated_at:new Date().toISOString()}).eq("id",store.id).select("*").single();
 if(error){message("profileFeedback",error.message);return;}
 store=data;fillSettings();message("profileFeedback",next?"تم نشر متجرك. يمكنك مشاركة رابط المتجر.":"تم إلغاء نشر المتجر.");
}


let merchantPaymentSettings=null;
function updatePaymentAmount(){
 const plan=$("paymentPlan").value,cycle=$("paymentCycle").value;
 const amount=plan==="pro"?(cycle==="yearly"?15000:1500):(cycle==="yearly"?30000:3000);
 $("paymentAmount").textContent=amount.toLocaleString("en-US")+" دج";
}
async function loadMerchantPaymentSettings(){
 const {data,error}=await supabase.from("platform_payment_settings").select("*").eq("id",true).maybeSingle();
 if(error)throw error;merchantPaymentSettings=data;renderFeaturedPaymentDetails();
 const box=$("merchantPaymentDetails");
 if(!data||(!data.baridimob_number&&!data.ccp_number)){box.textContent="لم يتم إعداد بيانات الاستلام بعد. يرجى التواصل مع الدعم قبل إجراء أي تحويل.";return;}
 box.innerHTML=`<div><strong>صاحب الحساب:</strong> ${escapeHtml(data.beneficiary_name||"—")}</div>${data.baridimob_number?`<div><strong>BaridiMob:</strong> ${escapeHtml(data.baridimob_number)}</div>`:""}${data.ccp_number?`<div><strong>CCP:</strong> ${escapeHtml(data.ccp_number)}</div>`:""}${data.instructions?`<p>${escapeHtml(data.instructions)}</p>`:""}`;
}
function renderFeaturedPaymentDetails(){
 const box=$("featuredPaymentDetails"),data=merchantPaymentSettings;if(!box)return;
 if(!data||(!data.baridimob_number&&!data.ccp_number)){box.textContent="لم يتم إعداد بيانات الاستلام بعد. يرجى التواصل مع الدعم قبل إجراء أي تحويل.";return;}
 box.innerHTML=`<div><strong>صاحب الحساب:</strong> ${escapeHtml(data.beneficiary_name||"—")}</div>${data.baridimob_number?`<div><strong>BaridiMob:</strong> ${escapeHtml(data.baridimob_number)}</div>`:""}${data.ccp_number?`<div><strong>CCP:</strong> ${escapeHtml(data.ccp_number)}</div>`:""}${data.instructions?`<p>${escapeHtml(data.instructions)}</p>`:""}`;
}
async function loadFeaturedRequestHistory(){
 if(!store)return;
 const {data,error}=await supabase.from("featured_store_requests").select("id,amount_dzd,duration_days,payment_method,status,admin_note,created_at").eq("store_id",store.id).order("created_at",{ascending:false}).limit(20);
 if(error)throw error;
 const box=$("featuredRequestHistory"),labels={pending:"بانتظار المراجعة",approved:"تمت الموافقة",rejected:"مرفوض"};
 if(!data?.length){box.innerHTML='<p class="empty-products">لا توجد طلبات تمييز بعد.</p>';return;}
 box.innerHTML=data.map(x=>`<article class="managed-review"><strong>تمييز المتجر · ${Number(x.amount_dzd).toLocaleString()} دج · ${x.duration_days} أيام</strong><p>${x.payment_method==="baridimob"?"BaridiMob":"CCP"} · ${labels[x.status]||x.status}</p><small>${new Date(x.created_at).toLocaleDateString(dashboardLocale())}</small>${x.admin_note?`<p><b>ملاحظة الإدارة:</b> ${escapeHtml(x.admin_note)}</p>`:""}</article>`).join("");
}
async function submitFeaturedStoreRequest(event){
 event.preventDefault();
 const button=$("submitFeaturedRequest"),method=$("featuredPaymentMethod").value;
 const ready=method==="baridimob"?merchantPaymentSettings?.baridimob_number:merchantPaymentSettings?.ccp_number;
 if(!ready){$("featuredRequestFeedback").textContent="بيانات طريقة التحويل غير متاحة حالياً. تواصل مع الدعم.";return;}
 const file=$("featuredPaymentReceipt").files[0];let path=null;
 button.disabled=true;$("featuredRequestFeedback").textContent="جارٍ رفع الوصل وإرسال الطلب...";
 try{
  if(!file)throw new Error("يرجى إرفاق وصل التحويل.");
  const types={"image/jpeg":"jpg","image/png":"png","image/webp":"webp","application/pdf":"pdf"},ext=types[file.type];
  if(!ext)throw new Error("نوع الملف غير مدعوم. استخدم JPG أو PNG أو WebP أو PDF.");
  if(file.size>5*1024*1024)throw new Error("حجم الوصل أكبر من 5 ميغابايت.");
  path=user.id+"/"+crypto.randomUUID()+"."+ext;
  const {error:uploadError}=await supabase.storage.from("subscription-payment-proofs").upload(path,file,{contentType:file.type,upsert:false});
  if(uploadError)throw uploadError;
  const {error}=await supabase.from("featured_store_requests").insert({user_id:user.id,store_id:store.id,amount_dzd:500,duration_days:7,payment_method:method,sender_name:$("featuredSenderName").value.trim(),transaction_reference:$("featuredTransactionReference").value.trim(),proof_path:path});
  if(error)throw error;
  path=null;$("featuredStoreRequestForm").reset();
  $("featuredRequestFeedback").textContent="تم إرسال طلب التمييز بنجاح. ستتم مراجعته من الإدارة قبل إبراز متجرك.";
  await loadFeaturedRequestHistory();
 }catch(error){
  if(path){try{await supabase.storage.from("subscription-payment-proofs").remove([path]);}catch(cleanupError){console.warn(cleanupError);}}
  console.error("Featured store request failed:",error);
  $("featuredRequestFeedback").textContent=error.code==="23505"?"لديك طلب تمييز قيد المراجعة بالفعل.":"تعذر إرسال الطلب: "+(error.message||"تحقق من البيانات وحاول مجدداً.");
 }finally{button.disabled=false;}
}
async function loadMerchantPaymentHistory(){
 const {data,error}=await supabase.from("subscription_payment_requests").select("id,plan,billing_cycle,amount_dzd,payment_method,status,admin_note,created_at").eq("user_id",user.id).order("created_at",{ascending:false}).limit(20);
 if(error)throw error;
 const box=$("merchantPaymentHistory");
 if(!data?.length){box.innerHTML='<p class="empty-products">لا توجد طلبات دفع بعد.</p>';return;}
 const labels={pending:"بانتظار المراجعة",approved:"تمت الموافقة",rejected:"مرفوض"};
 box.innerHTML=data.map(item=>`<article class="managed-review"><strong>${item.plan.toUpperCase()} · ${item.billing_cycle==="yearly"?"سنوي":"شهري"} · ${Number(item.amount_dzd).toLocaleString()} دج</strong><p>${item.payment_method==="baridimob"?"BaridiMob":"CCP"} · ${labels[item.status]||item.status}</p><small>${new Date(item.created_at).toLocaleDateString()}</small>${item.admin_note?`<p><b>ملاحظة الإدارة:</b> ${escapeHtml(item.admin_note)}</p>`:""}</article>`).join("");
}

async function loadMerchantSupportMessages(){
 const {data,error}=await supabase.from("support_messages").select("id,subject,message,status,admin_reply,created_at").eq("user_id",user.id).order("created_at",{ascending:false}).limit(20);
 if(error)throw error;
 const box=$("merchantSupportMessages");
 if(!data?.length){box.innerHTML='<p class="empty-products">لا توجد رسائل دعم بعد.</p>';return;}
 const statusLabels={open:"مفتوحة",in_progress:"قيد المعالجة",resolved:"تم الحل",closed:"مغلقة"};
 box.innerHTML=data.map(item=>`<article class="managed-review"><strong>${escapeHtml(item.subject)}</strong><p>${escapeHtml(item.message)}</p><small>الحالة: ${statusLabels[item.status]||item.status} · ${new Date(item.created_at).toLocaleDateString()}</small>${item.admin_reply?`<p><b>رد الدعم:</b> ${escapeHtml(item.admin_reply)}</p>`:""}</article>`).join("");
}

async function init(){
 initDashboardTheme();
 applyFeaturedPromotionLanguage();
 // Show a clean icon launcher first; each feature opens its own panel.
 const dashboardPanels=[...document.querySelectorAll(".dashboard-content > .dash-panel")];
 dashboardPanels.forEach(panel=>panel.hidden=true);
 const dashboardLinks=[...document.querySelectorAll(".dashboard-sidebar .side-link[href^='#']")];
 dashboardLinks.forEach(link=>link.addEventListener("click",event=>{
  event.preventDefault();
  const target=$(link.getAttribute("href").slice(1));
  if(!target)return;
  dashboardPanels.forEach(panel=>panel.hidden=panel!==target);
  dashboardLinks.forEach(item=>item.classList.toggle("active",item===link));
  history.replaceState(null,"",link.getAttribute("href"));
  target.scrollIntoView({behavior:"smooth",block:"start"});
 }));
 // Opening or refreshing the dashboard always returns to the icon launcher.
 if(location.hash)history.replaceState(null,"",location.pathname+location.search);
 // Register controls before waiting for Supabase; slow requests must not disable the dashboard.
 $("saveProfile").addEventListener("click",saveProfile);
 $("avatarUpload").addEventListener("change",uploadAvatar);
 $("removeAvatar").addEventListener("click",removeAvatar);
 $("productForm").addEventListener("submit",saveProduct);
 $("merchantProductSearch").addEventListener("input",event=>{productFilterTerm=event.target.value;renderProducts();});
 $("merchantOrderSearch").addEventListener("input",event=>{orderFilterTerm=event.target.value;renderOrders();});
 $("billingMonthly").addEventListener("click",()=>{billingCycle="monthly";updateBillingPrices();});
 $("billingYearly").addEventListener("click",()=>{billingCycle="yearly";updateBillingPrices();});
 $("startProTrial").addEventListener("click",()=>startPlanTrial("pro"));
 $("startPremiumTrial").addEventListener("click",()=>startPlanTrial("premium"));
 updateBillingPrices();
 $("productCategory").addEventListener("change",syncCustomCategory);
 $("managedProducts").addEventListener("click",manageProductClick);
 $("managedOrders").addEventListener("change",updateOrderStatus);
 $("managedReviews").addEventListener("click",moderateReview);
 $("featuredStoreRequestForm").addEventListener("submit",submitFeaturedStoreRequest);

  
  $("paymentPlan").addEventListener("change",updatePaymentAmount);
  $("paymentCycle").addEventListener("change",updatePaymentAmount);
  updatePaymentAmount();
  $("subscriptionPaymentForm").addEventListener("submit",async event=>{
   event.preventDefault();
   const method=$("paymentMethod").value;
   const accountReady=method==="baridimob"?merchantPaymentSettings?.baridimob_number:merchantPaymentSettings?.ccp_number;
   if(!accountReady){$("paymentRequestFeedback").textContent="بيانات هذه الطريقة غير متاحة حالياً. تواصل مع الدعم.";return;}
   const button=$("submitSubscriptionPayment"),file=$("paymentReceipt").files[0];button.disabled=true;
   let uploadedPath=null;
   $("paymentRequestFeedback").textContent="جارٍ رفع وصل التحويل وإرسال الطلب...";
   try{
    if(!file)throw new Error("يرجى إرفاق صورة الوصل أو ملف PDF.");
    const allowed={"image/jpeg":"jpg","image/png":"png","image/webp":"webp","application/pdf":"pdf"};
    const extension=allowed[file.type];
    if(!extension)throw new Error("نوع الملف غير مدعوم. استخدم JPG أو PNG أو WebP أو PDF.");
    if(file.size>5*1024*1024)throw new Error("حجم الوصل أكبر من 5 ميغابايت.");
    uploadedPath=user.id+"/"+crypto.randomUUID()+"."+extension;
    const {error:uploadError}=await supabase.storage.from("subscription-payment-proofs").upload(uploadedPath,file,{contentType:file.type,upsert:false});
    if(uploadError)throw uploadError;
    const {error}=await supabase.rpc("create_subscription_payment_request",{
     p_plan:$("paymentPlan").value,p_billing_cycle:$("paymentCycle").value,p_payment_method:method,
     p_sender_name:$("paymentSender").value.trim(),p_transaction_reference:$("paymentReference").value.trim(),
     p_proof_url:uploadedPath
    });
    if(error)throw error;
    uploadedPath=null;
    $("subscriptionPaymentForm").reset();updatePaymentAmount();
    $("paymentRequestFeedback").textContent="تم رفع الوصل وإرسال طلب الدفع بنجاح. ستراجعه الإدارة قبل تفعيل الاشتراك.";
    await loadMerchantPaymentHistory();
   }catch(error){
    if(uploadedPath){try{await supabase.storage.from("subscription-payment-proofs").remove([uploadedPath]);}catch(cleanupError){console.warn("Receipt cleanup failed:",cleanupError);}}
    console.error("Subscription payment request failed:",error);
    $("paymentRequestFeedback").textContent=error.message||"تعذر إرسال الطلب. تحقق من البيانات وحاول مجدداً.";
   }
   finally{button.disabled=false;}
  });

$("merchantSupportForm").addEventListener("submit",async event=>{
   event.preventDefault();
   const button=$("sendSupportMessage");button.disabled=true;$("supportFeedback").textContent="جارٍ إرسال الرسالة...";
   try{
    const {error}=await supabase.from("support_messages").insert({user_id:user.id,email:user.email||"",subject:$("supportSubject").value.trim(),message:$("supportMessage").value.trim()});
    if(error)throw error;
    $("supportSubject").value="";$("supportMessage").value="";
    $("supportFeedback").textContent="تم إرسال رسالتك إلى فريق الدعم.";
    await loadMerchantSupportMessages();
   }catch(error){console.error("Support message failed:",error);$("supportFeedback").textContent="تعذر إرسال الرسالة. حاول مجدداً.";}
   finally{button.disabled=false;}
  });

 $("cancelEdit").addEventListener("click",resetProductForm);
 $("publishStore").addEventListener("click",togglePublish);
 $("copyStoreLink").addEventListener("click",copyStoreLink);
 $("dashYear").textContent=new Date().getFullYear();
 initReferralControls();
 // Bind logout before rendering charts or making any network request.
 const logoutButton=$("logoutButton");
 if(logoutButton)logoutButton.addEventListener("click",async()=>{
  logoutButton.disabled=true;
  logoutButton.textContent="جارٍ تسجيل الخروج...";
  try{
   const {error}=await supabase.auth.signOut({scope:"local"});
   if(error)throw error;
   location.replace(new URL("index.html?logged_out=1",location.href).href);
  }catch(error){
   console.error("Sign out failed:",error);
   logoutButton.disabled=false;
   logoutButton.textContent="تسجيل الخروج";
   alert(dashboardText("logoutError"));
  }
 });
 // A chart rendering problem must never prevent authentication or other dashboard controls.
 renderDailyCharts();
 let session=null;
 try{
  const {data,error}=await supabase.auth.getSession();
  if(error)throw error;
  session=data?.session||null;
 }catch(error){
  console.error("Dashboard session check failed:",error);
  $("storeStatus").textContent="تعذر التحقق من الجلسة";
  message("profileFeedback","تعذر الاتصال بخدمة الحساب. تحقق من الإنترنت ثم أعد المحاولة.");
  return;
 }
 if(!session){location.replace("auth.html?next=dashboard.html");return;}
 user=session.user;
  try{await loadReferralStats();}catch(error){console.error("Referral data unavailable:",error);if($("referralFeedback"))$("referralFeedback").textContent="تعذر تحميل بيانات الدعوات حالياً. حاول تحديث الصفحة.";} 
  try{await loadMerchantSupportMessages();}catch(error){console.error('Support inbox load failed:',error);}
  try{await loadMerchantPaymentSettings();await loadMerchantPaymentHistory();}catch(error){console.error('Payment area load failed:',error);}

  try{
   const {data:verifiedUser}=await supabase.auth.getUser();
   if(verifiedUser?.user?.app_metadata?.role==="admin"&&!$("adminDashboardLink")){
    const link=document.createElement("a");link.id="adminDashboardLink";link.className="dashboard-back";link.href="admin.html";link.textContent="لوحة الإدارة";
    $("storeLink").before(link);
   }
  }catch(error){console.warn("Admin shortcut check skipped:",error);}

 try{
  store=await ensureStore();
  fillSettings();
  try{await loadFeaturedRequestHistory();}catch(error){console.error("Featured request history failed:",error);$("featuredRequestHistory").textContent="تعذر تحميل طلبات التمييز.";}
  await loadSubscription();
  renderDailyCharts();
  const results=await Promise.allSettled([loadProducts(),loadOrders(),loadReviews()]);
  const failures=[];
  if(results[0].status==="rejected"){console.error("Products load failed:",results[0].reason);failures.push("المنتجات");}
  if(results[1].status==="rejected"){console.error("Orders load failed:",results[1].reason);$("managedOrders").innerHTML='<p class="empty-products">تعذر تحميل الطلبات. حدّث الصفحة وحاول مجدداً.</p>';failures.push("الطلبات");}
  if(results[2].status==="rejected"){console.error("Reviews load failed:",results[2].reason);$("managedReviews").innerHTML='<p class="empty-products">تعذر تحميل التقييمات. حدّث الصفحة وحاول مجدداً.</p>';failures.push("التقييمات");}
  renderStats();
  if(failures.length){$("storeStatus").textContent="بعض بيانات المتجر لم تُحمّل";message("profileFeedback","تعذر تحميل: "+failures.join("، ")+" — تحقق من الاتصال ثم حدّث الصفحة.");}
 }catch(error){
  console.error("Dashboard initialization failed:",error);
  $("storeStatus").textContent="تعذر تحميل بيانات المتجر";
  message("profileFeedback",error.message||"تحقق من الاتصال ثم أعد المحاولة.");
 }
 
}
document.addEventListener("msdz-language-changed",()=>{applyFeaturedPromotionLanguage();applyReferralLanguage();if(user)loadReferralStats().catch(error=>console.warn("Referral language refresh failed:",error));if(store)renderDailyCharts();if(subscription)renderSubscription();updateBillingPrices();});
init();
