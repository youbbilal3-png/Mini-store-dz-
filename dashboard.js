import { supabase } from "./supabase-client.js";
const $=id=>document.getElementById(id);
let user=null,store=null,products=[];
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
async function loadProducts(){
 const {data,error}=await supabase.from("products").select("*").eq("store_id",store.id).order("created_at",{ascending:false});
 if(error)throw error;products=data||[];renderProducts();
}
function fillSettings(){
 $("sellerNameInput").value=store.seller_name||"";
 $("sellerBioInput").value=store.seller_bio||"";
 $("storeNameInput").value=store.store_name||"";
 $("whatsappInput").value=store.whatsapp||"";
 $("accountEmail").textContent=user.email||"حساب التاجر";
 const publicUrl=new URL("index.html?store="+encodeURIComponent(store.slug),location.href).href;
 $("storeLink").href=publicUrl;
 $("openPublicStore").href=publicUrl;
 $("publicStoreSidebarLink").href=publicUrl;
 $("shareWhatsApp").href="https://wa.me/?text="+encodeURIComponent("شاهد متجري على Mini Store DZ: "+publicUrl);
 $("shareFacebook").href="https://www.facebook.com/sharer/sharer.php?u="+encodeURIComponent(publicUrl);
 $("publishStore").textContent=store.is_published?"إلغاء نشر المتجر":"نشر المتجر";
 $("storeStatus").textContent=store.is_published?"متجرك منشور للعامة":"متجرك خاص حتى تنشره";
 showAvatar();
}
function showAvatar(){
 const src=store.avatar_url||"";
 $("avatarFallback").textContent=(store.seller_name||"S").trim().charAt(0).toUpperCase();
 $("avatarImage").src=src;$("avatarImage").hidden=!src;$("avatarFallback").hidden=!!src;
}
async function saveProfile(){
 const whatsapp=$("whatsappInput").value.trim().replace(/[\s+()-]/g,"");
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
function renderProducts(){
 $("productsTotal").textContent=products.length+" منتج";
 if(!products.length){$("managedProducts").innerHTML='<p class="empty-products">لا توجد منتجات بعد. أضف أول منتجك من النموذج أعلاه.</p>';return;}
 $("managedProducts").innerHTML=products.map(p=>'<article class="managed-product"><div class="managed-product-emoji">'+(p.image_url?'<img src="'+escapeHtml(p.image_url)+'" alt="" loading="lazy">':escapeHtml(p.emoji||"📦"))+'</div><div class="managed-product-info"><strong>'+escapeHtml(p.name)+'</strong><span>'+escapeHtml(p.category||"عام")+' · '+Number(p.price||0).toLocaleString("ar-DZ")+' دج</span></div><div class="managed-product-actions"><button type="button" data-edit="'+p.id+'">تعديل</button><button type="button" class="delete-product" data-delete="'+p.id+'">حذف</button></div></article>').join("");
}
async function saveProduct(event){
 event.preventDefault();const id=$("editingProductId").value;const file=$("productImage").files?.[0];
 const selectedCategory=$("productCategory").value;const category=selectedCategory==="أخرى"?$("customProductCategory").value.trim():selectedCategory;
 const item={store_id:store.id,name:$("productName").value.trim(),category,price:Number($("productPrice").value),description:$("productDescription").value.trim(),currency:"DZD",is_active:true};
 if(!item.name||!item.category||!Number.isFinite(item.price)||item.price<0)return;
 $("productSubmit").disabled=true;message("productFeedback","جارٍ حفظ المنتج...");
 try{
  if(file)item.image_url=await uploadImage(file,"product-images","products",5*1024*1024);
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
  $("editingProductId").value=p.id;$("productName").value=p.name;const knownCategory=Array.from($("productCategory").options).some(o=>o.value===p.category);$("productCategory").value=knownCategory?(p.category||""):"أخرى";$("customProductCategory").value=knownCategory?"":(p.category||"");syncCustomCategory();$("productPrice").value=p.price;$("productDescription").value=p.description||"";$("productEmoji").value="📦";$("productSubmit").textContent="حفظ التعديلات";$("cancelEdit").hidden=false;$("productForm").scrollIntoView({behavior:"smooth",block:"center"});
 }
 if(del){
  const p=products.find(x=>x.id===del.dataset.delete);if(!p||!confirm("هل تريد حذف المنتج: "+p.name+"؟"))return;
  const {error}=await supabase.from("products").delete().eq("id",p.id).eq("store_id",store.id);
  if(error){message("productFeedback",error.message);return;}
  products=products.filter(x=>x.id!==p.id);renderProducts();message("productFeedback","تم حذف المنتج.");
 }
}
async function copyStoreLink(){
 const publicUrl=new URL("index.html?store="+encodeURIComponent(store.slug),location.href).href;
 try{await navigator.clipboard.writeText(publicUrl);message("profileFeedback","تم نسخ رابط متجرك. "+(store.is_published?"يمكنك مشاركته الآن.":"انشر المتجر أولاً ليتمكن الزوار من مشاهدة المنتجات."));}
 catch(error){message("profileFeedback","تعذر النسخ تلقائياً. استخدم زر عرض المتجر لفتح الرابط ونسخه من شريط العنوان.");}
}
async function togglePublish(){
 const next=!store.is_published;
 const {data,error}=await supabase.from("stores").update({is_published:next,updated_at:new Date().toISOString()}).eq("id",store.id).select("*").single();
 if(error){message("profileFeedback",error.message);return;}
 store=data;fillSettings();message("profileFeedback",next?"تم نشر متجرك. يمكنك مشاركة رابط المتجر.":"تم إلغاء نشر المتجر.");
}
async function init(){
 const {data:{session}}=await supabase.auth.getSession();
 if(!session){location.replace("auth.html?next=dashboard.html");return;}
 user=session.user;
 try{
  store=await ensureStore();fillSettings();await loadProducts();
 }catch(error){
  $("storeStatus").textContent="تعذر تحميل بيانات المتجر";message("profileFeedback",error.message||"تحقق من الاتصال ثم أعد المحاولة.");
 }
 $("saveProfile").addEventListener("click",saveProfile);
 $("avatarUpload").addEventListener("change",uploadAvatar);
 $("removeAvatar").addEventListener("click",removeAvatar);
 $("productForm").addEventListener("submit",saveProduct);
 $("productCategory").addEventListener("change",syncCustomCategory);
 $("managedProducts").addEventListener("click",manageProductClick);
 $("cancelEdit").addEventListener("click",resetProductForm);
 $("publishStore").addEventListener("click",togglePublish);
 $("copyStoreLink").addEventListener("click",copyStoreLink);
 $("logoutButton").addEventListener("click",async()=>{await supabase.auth.signOut();location.href="auth.html";});
 $("dashYear").textContent=new Date().getFullYear();
}
init();
