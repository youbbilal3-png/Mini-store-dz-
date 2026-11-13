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
async function loadSupport(){
 const {data,error}=await supabase.from("support_messages").select("*").order("created_at",{ascending:false});if(error)throw error;support=data||[];
 $("supportList").innerHTML=support.length?support.map(s=>`<article class="admin-record-card"><h3>${esc(s.subject)}</h3><p>${esc(s.message)}</p><p class="admin-record-meta">${esc(s.email)} · ${date(s.created_at)} · ${esc(s.status)}</p><textarea id="reply-${s.id}" placeholder="اكتب ردك للتاجر...">${esc(s.admin_reply||"")}</textarea><div class="admin-record-actions"><select id="status-${s.id}"><option value="open">مفتوحة</option><option value="in_progress">قيد المعالجة</option><option value="resolved">تم الحل</option><option value="closed">مغلقة</option></select><button class="admin-action" data-save-support="${s.id}">حفظ الرد والحالة</button></div></article>`).join(""):'<div class="admin-empty">لا توجد رسائل دعم.</div>';
 support.forEach(s=>{const el=$("status-"+s.id);if(el)el.value=s.status;});
}
async function refreshAll(){
 $("refreshAdmin").disabled=true;say("جارٍ تحديث بيانات المنصة...");
 try{await Promise.all([loadStats(),loadMerchants(),loadPayments(),loadSupport(),loadPaymentSettings()]);say("تم تحديث جميع البيانات.");}
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
$("adminLogout").addEventListener("click",async()=>{await supabase.auth.signOut({scope:"local"});location.replace("index.html");});
document.addEventListener("click",async event=>{
 const save=event.target.closest("[data-save-sub]");
 if(save){const id=save.dataset.saveSub,plan=document.querySelector(`[data-plan="${id}"]`).value,days=Number(document.querySelector(`[data-days="${id}"]`).value);save.disabled=true;
  try{const {error}=await supabase.rpc("admin_set_subscription",{p_user_id:id,p_plan:plan,p_billing_cycle:"monthly",p_days:days});if(error)throw error;say("تم تحديث اشتراك التاجر.");await refreshAll();}catch(e){say(e.message,true);}finally{save.disabled=false;}return;}
 const pay=event.target.closest("[data-review-pay]");
 if(pay){const id=pay.dataset.reviewPay,decision=pay.dataset.decision,note=$("paynote-"+id).value;if(decision==="approved"&&!confirm("هل تحققت من التحويل وتريد تفعيل الاشتراك؟"))return;pay.disabled=true;
  try{const {error}=await supabase.rpc("admin_review_payment_request",{p_request_id:id,p_decision:decision,p_admin_note:note||null});if(error)throw error;say(decision==="approved"?"تم تأكيد الدفع وتفعيل الاشتراك.":"تم رفض طلب الدفع.");await refreshAll();}catch(e){say(e.message,true);}finally{pay.disabled=false;}return;}
 const msg=event.target.closest("[data-save-support]");
 if(msg){const id=msg.dataset.saveSupport,reply=$("reply-"+id).value,status=$("status-"+id).value;msg.disabled=true;
  try{const {error}=await supabase.from("support_messages").update({admin_reply:reply,status,updated_at:new Date().toISOString()}).eq("id",id);if(error)throw error;say("تم حفظ رد الدعم وتحديث الحالة.");await refreshAll();}catch(e){say(e.message,true);}finally{msg.disabled=false;}}
});
(async()=>{try{if(await requireAdmin())await refreshAll();}catch(e){console.error(e);say("تعذر التحقق من صلاحيات الإدارة: "+(e.message||"خطأ غير معروف"),true);}})();