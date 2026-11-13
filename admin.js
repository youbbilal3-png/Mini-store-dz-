import { supabase } from "./supabase-client.js";
const $=id=>document.getElementById(id);
let merchants=[],payments=[],support=[];
const esc=value=>String(value??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const say=(msg,error=false)=>{$("adminNotice").textContent=msg;$("adminNotice").classList.toggle("error",error);};
const safeHttps=value=>{try{const u=new URL(value);return u.protocol==="https:"?u.href:"";}catch{return "";}};
const date=value=>value?new Date(value).toLocaleDateString(document.documentElement.lang||"ar",{year:"numeric",month:"short",day:"numeric"}):"—";
async function requireAdmin(){
 let {data,error}=await supabase.auth.getSession();if(error)throw error;
 if(!data.session){location.replace("auth.html?next=admin.html");return false;}
 const refreshed=await supabase.auth.refreshSession();
 if(refreshed.error)throw refreshed.error;
 const result=await supabase.auth.getUser();if(result.error)throw result.error;
 const user=result.data.user;
 if(!user){location.replace("auth.html?next=admin.html");return false;}
 if(user.app_metadata?.role!=="admin"){say("هذا الحساب لا يملك صلاحية إدارة المنصة.",true);return false;}
 $("adminEmail").textContent=user.email||"";
 $("adminApp").hidden=false;say("تم التحقق من حساب المالك. مرحباً بك.");
 return true;
}
async function loadStats(){
 const {data,error}=await supabase.rpc("admin_dashboard_stats");if(error)throw error;
 const d=data||{};
 for(const [id,key] of [["statMerchants","merchants"],["statStores","stores"],["statProducts","products"],["statOrders","orders"],["statPayments","pending_payments"],["statSupport","open_support"],["statPublished","published_stores"],["statSubscriptions","subscriptions"]])$(id).textContent=Number(d[key]||0).toLocaleString();
 $("paymentBadge").textContent=d.pending_payments||0;$("supportBadge").textContent=d.open_support||0;
}
async function loadMerchants(){
 const {data,error}=await supabase.rpc("admin_list_merchants");if(error)throw error;merchants=data||[];renderMerchants();
}
function renderMerchants(){
 const q=$("merchantSearch").value.trim().toLowerCase();
 const rows=merchants.filter(m=>[m.email,m.full_name,m.store_name].some(v=>String(v||"").toLowerCase().includes(q)));
 $("merchantsBody").innerHTML=rows.length?rows.map(m=>`<tr><td>${esc(m.full_name||"—")}<br><small>${esc(m.email)}</small></td><td>${esc(m.store_name||"لم ينشئ متجراً")}</td><td>${esc(m.plan)}</td><td>${esc(m.subscription_status)}</td><td>${date(m.current_period_ends_at)}</td><td><select data-plan="${m.user_id}"><option value="free">Free</option><option value="pro">Pro</option><option value="premium">Premium</option></select><select data-days="${m.user_id}"><option value="30">30 يوم</option><option value="365">365 يوم</option></select><button class="admin-action" data-save-sub="${m.user_id}">حفظ</button></td></tr>`).join(""):'<tr><td colspan="6">لا توجد نتائج.</td></tr>';
 rows.forEach(m=>{const plan=document.querySelector(`[data-plan="${m.user_id}"]`);if(plan)plan.value=m.plan;});
}

async function loadPaymentSettings(){
 const {data,error}=await supabase.from("platform_payment_settings").select("*").eq("id",true).maybeSingle();
 if(error)throw error;
 if(data){$("payBeneficiary").value=data.beneficiary_name||"";$("payBaridi").value=data.baridimob_number||"";$("payCcp").value=data.ccp_number||"";$("payInstructions").value=data.instructions||"";}
}
async function savePaymentSettings(){
 const button=$("savePaymentSettings");button.disabled=true;$("paymentSettingsFeedback").textContent="جارٍ الحفظ...";
 try{
  const {error}=await supabase.from("platform_payment_settings").update({
   beneficiary_name:$("payBeneficiary").value.trim(),
   baridimob_number:$("payBaridi").value.trim(),
   ccp_number:$("payCcp").value.trim(),
   instructions:$("payInstructions").value.trim(),
   updated_at:new Date().toISOString()
  }).eq("id",true);
  if(error)throw error;
  $("paymentSettingsFeedback").textContent="تم حفظ بيانات الاستلام.";
 }catch(e){$("paymentSettingsFeedback").textContent="تعذر الحفظ: "+e.message;}
 finally{button.disabled=false;}
}

async function loadPayments(){
 const {data,error}=await supabase.rpc("admin_list_payment_requests");if(error)throw error;payments=data||[];
 await Promise.all(payments.map(async p=>{
  p.proofSignedUrl=null;
  if(!p.proof_url)return;
  const {data:signed,error:signedError}=await supabase.storage.from("subscription-payment-proofs").createSignedUrl(p.proof_url,600);
  if(!signedError)p.proofSignedUrl=signed?.signedUrl||null;
 }));
 $("paymentsList").innerHTML=payments.length?payments.map(p=>{
  const receiptUrl=safeHttps(p.proofSignedUrl||"");
  const isPdf=String(p.proof_url||"").toLowerCase().endsWith(".pdf");
  const receipt=receiptUrl?(isPdf?`<p><a href="${esc(receiptUrl)}" target="_blank" rel="noopener">فتح وصل التحويل (PDF)</a></p>`:`<a class="admin-receipt-preview" href="${esc(receiptUrl)}" target="_blank" rel="noopener"><img src="${esc(receiptUrl)}" alt="وصل التحويل المرفق" loading="lazy"></a>`):'<p class="admin-record-meta">لم يتوفر رابط آمن لعرض الوصل.</p>';
  return `<article class="admin-record-card"><h3>${esc(p.plan.toUpperCase())} · ${p.billing_cycle==="yearly"?"سنوي":"شهري"} · ${Number(p.amount_dzd).toLocaleString()} دج</h3><p>التاجر: ${esc(p.email)} · طريقة الدفع: ${p.payment_method==="baridimob"?"BaridiMob":"CCP"}</p><p>اسم المحوّل: ${esc(p.sender_name)} · رقم العملية: <b>${esc(p.transaction_reference)}</b></p><h4>وصل التحويل</h4>${receipt}<p class="admin-record-meta">تاريخ الطلب: ${date(p.created_at)} · الحالة: ${esc(p.status)}</p><textarea id="paynote-${p.id}" placeholder="ملاحظة إدارية (اختياري)">${esc(p.admin_note||"")}</textarea>${p.status==="pending"?`<div class="admin-record-actions"><button class="admin-action" data-review-pay="${p.id}" data-decision="approved">تأكيد الدفع وتفعيل الاشتراك</button><button class="admin-action danger" data-review-pay="${p.id}" data-decision="rejected">رفض الطلب</button></div>`:""}</article>`;
 }).join(""):'<div class="admin-empty">لا توجد طلبات دفع حتى الآن.</div>';
}
async function loadFeaturedStoreRequests(){
 const {data,error}=await supabase.rpc("admin_list_featured_store_requests");if(error)throw error;
 const rows=data||[];
 await Promise.all(rows.map(async x=>{
  x.proofSignedUrl=null;
  if(x.proof_path){const {data:signed,error:signedError}=await supabase.storage.from("subscription-payment-proofs").createSignedUrl(x.proof_path,600);if(!signedError)x.proofSignedUrl=signed?.signedUrl||null;}
 }));
 const box=$("featuredRequestsList");
 box.innerHTML=rows.length?rows.map(x=>{
  const url=safeHttps(x.proofSignedUrl||""),pdf=String(x.proof_path||"").toLowerCase().endsWith(".pdf");
  const proof=url?(pdf?`<p><a href="${esc(url)}" target="_blank" rel="noopener">فتح وصل التحويل (PDF)</a></p>`:`<a class="admin-receipt-preview" href="${esc(url)}" target="_blank" rel="noopener"><img src="${esc(url)}" alt="وصل دفع تمييز المتجر" loading="lazy"></a>`):'<p class="admin-record-meta">تعذر إنشاء رابط آمن للوصل.</p>';
  return `<article class="admin-record-card"><h3>🏆 ${esc(x.store_name)} · ${Number(x.amount_dzd).toLocaleString()} دج / ${x.duration_days} أيام</h3><p>التاجر: ${esc(x.email)} · طريقة الدفع: ${x.payment_method==="baridimob"?"BaridiMob":"CCP"}</p><p>اسم المحوّل: ${esc(x.sender_name)} · رقم العملية: <b>${esc(x.transaction_reference)}</b></p><h4>وصل التحويل</h4>${proof}<p class="admin-record-meta">تاريخ الطلب: ${date(x.created_at)} · الحالة: ${esc(x.status)}</p><textarea id="featured-note-${x.id}" placeholder="ملاحظة إدارية (اختياري)">${esc(x.admin_note||"")}</textarea>${x.status==="pending"?`<div class="admin-record-actions"><button class="admin-action" data-review-featured="${x.id}" data-decision="approved">الموافقة وإبراز المتجر</button><button class="admin-action danger" data-review-featured="${x.id}" data-decision="rejected">رفض الطلب</button></div>`:""}</article>`;
 }).join(""):'<div class="admin-empty">لا توجد طلبات تمييز حتى الآن.</div>';
}

async function loadSponsoredAds(){
 const {data,error}=await supabase.from("sponsored_ads").select("*").order("created_at",{ascending:false});
 if(error)throw error;
 const rows=data||[],box=$("sponsoredAdsAdminList");
 box.innerHTML=rows.length?rows.map(ad=>{
  const state=ad.status==="active"?"نشط":ad.status==="paused"?"متوقف":"مسودة";
  return '<article class="admin-record-card"><h3>'+esc(ad.title)+'</h3><p><a href="'+esc(safeHttps(ad.target_url))+'" target="_blank" rel="noopener">فتح رابط الإعلان</a></p><p class="admin-record-meta">من '+date(ad.starts_at)+' إلى '+date(ad.ends_at)+' · الحالة: '+state+'</p><p class="admin-record-meta">رابط الصورة: '+esc(ad.image_url)+'</p><div class="admin-record-actions"><button class="admin-action" data-toggle-ad="'+ad.id+'" data-next-status="'+(ad.status==="active"?"paused":"active")+'">'+(ad.status==="active"?"إيقاف الإعلان":"تفعيل الإعلان")+'</button><button class="admin-action danger" data-delete-ad="'+ad.id+'">حذف</button></div></article>';
 }).join(""):'<div class="admin-empty">لا توجد إعلانات بعد. أضف أول إعلان من النموذج أعلاه.</div>';
}
async function createSponsoredAd(event){
 event.preventDefault();
 const button=$("saveSponsoredAd"),feedback=$("adFormFeedback");
 const image=safeHttps($("adImageUrl").value.trim()),target=safeHttps($("adTargetUrl").value.trim());
 const start=new Date($("adStartsAt").value),end=new Date($("adEndsAt").value);
 if(!image||!target){feedback.textContent="يجب أن يبدأ رابط الصورة والوجهة بـ HTTPS.";return;}
 if(!Number.isFinite(start.getTime())||!Number.isFinite(end.getTime())||end<=start){feedback.textContent="تحقق من تاريخ البداية والنهاية.";return;}
 button.disabled=true;feedback.textContent="جارٍ حفظ الإعلان...";
 try{
  const {data:userData,error:userError}=await supabase.auth.getUser();if(userError)throw userError;
  const {error}=await supabase.from("sponsored_ads").insert({title:$("adTitle").value.trim(),image_url:image,target_url:target,starts_at:start.toISOString(),ends_at:end.toISOString(),status:"active",created_by:userData.user.id});
  if(error)throw error;
  $("sponsoredAdForm").reset();feedback.textContent="تمت إضافة الإعلان بنجاح.";await loadSponsoredAds();
 }catch(e){feedback.textContent="تعذر حفظ الإعلان: "+e.message;}
 finally{button.disabled=false;}
}
async function loadSupport(){
 const {data,error}=await supabase.from("support_messages").select("*").order("created_at",{ascending:false});if(error)throw error;support=data||[];
 $("supportList").innerHTML=support.length?support.map(s=>`<article class="admin-record-card"><h3>${esc(s.subject)}</h3><p>${esc(s.message)}</p><p class="admin-record-meta">${esc(s.email)} · ${date(s.created_at)} · ${esc(s.status)}</p><textarea id="reply-${s.id}" placeholder="اكتب ردك للتاجر...">${esc(s.admin_reply||"")}</textarea><div class="admin-record-actions"><select id="status-${s.id}"><option value="open">مفتوحة</option><option value="in_progress">قيد المعالجة</option><option value="resolved">تم الحل</option><option value="closed">مغلقة</option></select><button class="admin-action" data-save-support="${s.id}">حفظ الرد والحالة</button></div></article>`).join(""):'<div class="admin-empty">لا توجد رسائل دعم.</div>';
 support.forEach(s=>{const el=$("status-"+s.id);if(el)el.value=s.status;});
}
async function refreshAll(){
 $("refreshAdmin").disabled=true;say("جارٍ تحديث بيانات المنصة...");
 try{await Promise.all([loadStats(),loadMerchants(),loadPayments(),loadFeaturedStoreRequests(),loadSponsoredAds(),loadSupport(),loadPaymentSettings()]);say("تم تحديث جميع البيانات.");}
 catch(e){console.error(e);say("تعذر تحديث بعض البيانات: "+(e.message||"خطأ غير معروف"),true);}
 finally{$("refreshAdmin").disabled=false;}
}
document.querySelectorAll("[data-admin-tab]").forEach(btn=>btn.addEventListener("click",()=>{
 document.querySelectorAll("[data-admin-tab]").forEach(x=>x.classList.toggle("active",x===btn));
 document.querySelectorAll(".admin-panel").forEach(x=>x.classList.toggle("active",x.id==="admin-"+btn.dataset.adminTab));
}));
$("merchantSearch").addEventListener("input",renderMerchants);
$("refreshAdmin").addEventListener("click",refreshAll);
$("savePaymentSettings").addEventListener("click",savePaymentSettings);
$("sponsoredAdForm").addEventListener("submit",createSponsoredAd);
$("adminLogout").addEventListener("click",async()=>{await supabase.auth.signOut({scope:"local"});location.replace("index.html");});
document.addEventListener("click",async event=>{
 const save=event.target.closest("[data-save-sub]");
 if(save){const id=save.dataset.saveSub,plan=document.querySelector(`[data-plan="${id}"]`).value,days=Number(document.querySelector(`[data-days="${id}"]`).value);save.disabled=true;
  try{const {error}=await supabase.rpc("admin_set_subscription",{p_user_id:id,p_plan:plan,p_billing_cycle:"monthly",p_days:days});if(error)throw error;say("تم تحديث اشتراك التاجر.");await refreshAll();}catch(e){say(e.message,true);}finally{save.disabled=false;}return;}
 const pay=event.target.closest("[data-review-pay]");
 if(pay){const id=pay.dataset.reviewPay,decision=pay.dataset.decision,note=$("paynote-"+id).value;if(decision==="approved"&&!confirm("هل تحققت من التحويل وتريد تفعيل الاشتراك؟"))return;pay.disabled=true;
  try{const {error}=await supabase.rpc("admin_review_payment_request",{p_request_id:id,p_decision:decision,p_admin_note:note||null});if(error)throw error;say(decision==="approved"?"تم تأكيد الدفع وتفعيل الاشتراك.":"تم رفض طلب الدفع.");await refreshAll();}catch(e){say(e.message,true);}finally{pay.disabled=false;}return;}
 const featured=event.target.closest("[data-review-featured]");
 if(featured){const id=featured.dataset.reviewFeatured,decision=featured.dataset.decision,note=$("featured-note-"+id).value;if(decision==="approved"&&!confirm("هل تحققت من وصول 500 دج وتريد إبراز هذا المتجر لمدة 7 أيام؟"))return;featured.disabled=true;
  try{const {error}=await supabase.rpc("admin_review_featured_store_request",{p_request_id:id,p_decision:decision,p_admin_note:note||null});if(error)throw error;say(decision==="approved"?"تمت الموافقة وإبراز المتجر لمدة 7 أيام.":"تم رفض طلب التمييز.");await refreshAll();}catch(e){say(e.message,true);}finally{featured.disabled=false;}return;}
 const toggleAd=event.target.closest("[data-toggle-ad]");
 if(toggleAd){toggleAd.disabled=true;try{const {error}=await supabase.from("sponsored_ads").update({status:toggleAd.dataset.nextStatus}).eq("id",toggleAd.dataset.toggleAd);if(error)throw error;say(toggleAd.dataset.nextStatus==="active"?"تم تفعيل الإعلان.":"تم إيقاف الإعلان.");await loadSponsoredAds();}catch(e){say("تعذر تحديث الإعلان: "+e.message,true);}finally{toggleAd.disabled=false;}return;}
 const deleteAd=event.target.closest("[data-delete-ad]");
 if(deleteAd){if(!confirm("هل تريد حذف هذا الإعلان نهائياً؟"))return;deleteAd.disabled=true;try{const {error}=await supabase.from("sponsored_ads").delete().eq("id",deleteAd.dataset.deleteAd);if(error)throw error;say("تم حذف الإعلان.");await loadSponsoredAds();}catch(e){say("تعذر حذف الإعلان: "+e.message,true);}finally{deleteAd.disabled=false;}return;}
 const msg=event.target.closest("[data-save-support]");
 if(msg){const id=msg.dataset.saveSupport,reply=$("reply-"+id).value,status=$("status-"+id).value;msg.disabled=true;
  try{const {error}=await supabase.from("support_messages").update({admin_reply:reply,status,updated_at:new Date().toISOString()}).eq("id",id);if(error)throw error;say("تم حفظ رد الدعم وتحديث الحالة.");await refreshAll();}catch(e){say(e.message,true);}finally{msg.disabled=false;}}
});
(async()=>{try{if(await requireAdmin())await refreshAll();}catch(e){console.error(e);say("تعذر التحقق من صلاحيات الإدارة: "+(e.message||"خطأ غير معروف"),true);}})();