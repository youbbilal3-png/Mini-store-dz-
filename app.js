import { supabase } from "./supabase-client.js";
const DEFAULT_STORE_SETTINGS={whatsapp:"213000000000",sellerName:"Mini Store DZ",sellerDescription:"متجرك، هويتك.",sellerAvatar:""};
let STORE_SETTINGS={...DEFAULT_STORE_SETTINGS};
const defaultProducts=[
{id:"d1",name:"سماعات لاسلكية",fr:"Écouteurs sans fil",en:"Wireless Earbuds",category:"إلكترونيات",categoryFr:"Électronique",categoryEn:"Electronics",price:3500,description:"صوت واضح وتصميم مريح للاستخدام اليومي.",descriptionFr:"Un son clair et un design confortable au quotidien.",descriptionEn:"Clear sound and a comfortable everyday fit.",emoji:"🎧"},
{id:"d2",name:"ساعة ذكية",fr:"Montre connectée",en:"Smart Watch",category:"إلكترونيات",categoryFr:"Électronique",categoryEn:"Electronics",price:6200,description:"تابع نشاطك وإشعاراتك بسهولة.",descriptionFr:"Suivez facilement votre activité et vos notifications.",descriptionEn:"Track your activity and notifications.",emoji:"⌚"},
{id:"d3",name:"حقيبة عصرية",fr:"Sac tendance",en:"Everyday Bag",category:"إكسسوارات",categoryFr:"Accessoires",categoryEn:"Accessories",price:2800,description:"حقيبة عملية بتصميم أنيق.",descriptionFr:"Un sac pratique au design élégant.",descriptionEn:"A practical bag with a modern look.",emoji:"👜"},
{id:"d4",name:"مصباح مكتبي",fr:"Lampe de bureau",en:"Desk Lamp",category:"المنزل",categoryFr:"Maison",categoryEn:"Home",price:1900,description:"إضاءة مريحة لمكتبك أو غرفتك.",descriptionFr:"Un éclairage agréable pour votre bureau ou votre chambre.",descriptionEn:"Comfortable lighting for your desk or room.",emoji:"💡"}];
let products=defaultProducts,language="ar",activeCategory="all",searchTerm="",currentStoreId=null,cartItems=[],publicReviews=[],publicReviewStats=[];
const translations={
ar:{navProducts:"المنتجات",navAbout:"من نحن",navContact:"اتصل بنا",languageLabel:"اللغة",eyebrow:"متجرك يبدأ من هنا",heroTitle:'اكتشف منتجاتك المفضلة<br><em>بسهولة وثقة</em>',heroText:"تصفح منتجاتنا واختر ما يناسبك. اطلب مباشرة عبر واتساب.",browse:"تصفح المنتجات",shareStore:"شارك هذا المتجر",copyStoreLink:"نسخ الرابط",shareWhatsApp:"مشاركة عبر WhatsApp",shareFacebook:"مشاركة عبر Facebook",shareCopied:"تم نسخ رابط المتجر بنجاح!",shareCopyFailed:"تعذر نسخ الرابط. يمكنك مشاركته عبر الأزرار الأخرى.",sellerLabel:"صاحب المتجر",collection:"تشكيلتنا",productsTitle:"منتجات مختارة",searchPlaceholder:"ابحث عن منتج...",clearSearch:"مسح البحث",all:"كل التصنيفات",empty:"لا توجد منتجات مطابقة لبحثك.",whyUs:"لماذا متجرنا؟",aboutTitle:"تجربة شراء سهلة ومباشرة",aboutText:"منتجات مميزة ومعلومات واضحة وطلب سهل عبر واتساب.",needHelp:"هل لديك سؤال؟",contactTitle:"تواصل معنا",contactText:"نحن هنا لمساعدتك في اختيار المنتج المناسب.",whatsappUs:"راسلنا عبر واتساب",rights:"جميع الحقوق محفوظة.",order:"اطلب الآن",orderMessage:"مرحباً، أريد طلب: ",currency:"دج",count:"منتجات",sellerDescription:"متجرك، هويتك.",orderFormTitle:"إتمام الطلب",customerName:"الاسم الكامل",customerPhone:"رقم الهاتف",quantity:"الكمية",inStock:"متوفر",lowStock:"الكمية على وشك النفاد",outOfStock:"نفد المخزون",unlimitedStock:"متوفر",sendOrder:"تأكيد الطلب والمتابعة إلى WhatsApp",orderSaved:"تم تسجيل طلبك. أكمل الإرسال عبر WhatsApp.",orderFailed:"تعذر تسجيل الطلب. حاول مرة أخرى.",cart:"سلة المشتريات",addToCart:"أضف إلى السلة",viewCart:"عرض السلة",cartEmpty:"سلتك فارغة حالياً.",remove:"حذف",increase:"زيادة الكمية",decrease:"تقليل الكمية",cartTotal:"المجموع",continueShopping:"متابعة التسوق",checkout:"إتمام الطلب",cartAdded:"تمت إضافة المنتج إلى السلة.",cartItem:"منتج",cartItems:"منتجات",orderSummary:"ملخص طلبك",reviewsEyebrow:"آراء الزبائن",reviewsTitle:"ماذا يقول زبائننا؟",writeReview:"شاركنا رأيك",reviewName:"اسمك",reviewRating:"تقييمك",reviewComment:"رأيك",sendReview:"إرسال التقييم",reviewModeration:"سيظهر تقييمك بعد مراجعته من صاحب المتجر.",reviewCount:"تقييم",noReviews:"لا توجد تقييمات منشورة بعد.",reviewPending:"شكراً لك! تم إرسال تقييمك وسيظهر بعد موافقة صاحب المتجر.",reviewFailed:"تعذر إرسال التقييم. حاول مرة أخرى."},
fr:{navProducts:"Produits",navAbout:"À propos",navContact:"Contact",languageLabel:"Langue",eyebrow:"Votre boutique commence ici",heroTitle:'Découvrez vos produits préférés<br><em>en toute simplicité</em>',heroText:"Parcourez nos produits et commandez directement sur WhatsApp.",browse:"Voir les produits",shareStore:"Partager cette boutique",copyStoreLink:"Copier le lien",shareWhatsApp:"Partager sur WhatsApp",shareFacebook:"Partager sur Facebook",shareCopied:"Lien de la boutique copié !",shareCopyFailed:"Copie impossible. Utilisez les autres options de partage.",sellerLabel:"Vendeur",collection:"NOTRE COLLECTION",productsTitle:"Produits sélectionnés",searchPlaceholder:"Rechercher un produit...",clearSearch:"Effacer",all:"Toutes les catégories",empty:"Aucun produit ne correspond à votre recherche.",whyUs:"POURQUOI NOUS CHOISIR",aboutTitle:"Une expérience d’achat simple",aboutText:"Des produits sélectionnés, des informations claires et une commande facile sur WhatsApp.",needHelp:"Une question ?",contactTitle:"Contactez-nous",contactText:"Nous sommes là pour vous aider à choisir.",whatsappUs:"Écrire sur WhatsApp",rights:"Tous droits réservés.",order:"Commander",orderMessage:"Bonjour, je souhaite commander : ",currency:"DZD",count:"produits",sellerDescription:"Votre boutique, votre identité.",orderFormTitle:"Finaliser la commande",customerName:"Nom complet",customerPhone:"Téléphone",quantity:"Quantité",inStock:"Disponible",lowStock:"Bientôt épuisé",outOfStock:"Rupture de stock",unlimitedStock:"Disponible",sendOrder:"Confirmer et continuer sur WhatsApp",orderSaved:"Commande enregistrée. Terminez sur WhatsApp.",orderFailed:"Impossible d’enregistrer la commande.",cart:"Panier",addToCart:"Ajouter au panier",viewCart:"Voir le panier",cartEmpty:"Votre panier est vide.",remove:"Supprimer",increase:"Augmenter la quantité",decrease:"Diminuer la quantité",cartTotal:"Total",continueShopping:"Continuer les achats",checkout:"Commander",cartAdded:"Produit ajouté au panier.",cartItem:"article",cartItems:"articles",orderSummary:"Résumé de votre commande",reviewsEyebrow:"Avis clients",reviewsTitle:"Ce que disent nos clients",writeReview:"Donnez votre avis",reviewName:"Votre nom",reviewRating:"Votre note",reviewComment:"Votre commentaire",sendReview:"Envoyer l’avis",reviewModeration:"Votre avis sera visible après validation par le propriétaire.",reviewCount:"avis",noReviews:"Aucun avis publié pour le moment.",reviewPending:"Merci ! Votre avis a été envoyé et sera visible après validation.",reviewFailed:"Impossible d’envoyer votre avis. Réessayez."},
en:{navProducts:"Products",navAbout:"About",navContact:"Contact",languageLabel:"Language",eyebrow:"Your store starts here",heroTitle:'Discover your favorite products<br><em>with ease and confidence</em>',heroText:"Browse our products and order directly through WhatsApp.",browse:"Browse products",shareStore:"Share this store",copyStoreLink:"Copy link",shareWhatsApp:"Share on WhatsApp",shareFacebook:"Share on Facebook",shareCopied:"Store link copied!",shareCopyFailed:"Could not copy the link. Use another sharing option.",sellerLabel:"Store owner",collection:"OUR COLLECTION",productsTitle:"Featured products",searchPlaceholder:"Search products...",clearSearch:"Clear search",all:"All categories",empty:"No products match your search.",whyUs:"WHY SHOP WITH US",aboutTitle:"A simple shopping experience",aboutText:"Selected products, clear information and easy WhatsApp ordering.",needHelp:"Have a question?",contactTitle:"Get in touch",contactText:"We are here to help you choose.",whatsappUs:"Chat on WhatsApp",rights:"All rights reserved.",order:"Order now",orderMessage:"Hello, I'd like to order: ",currency:"DZD",count:"products",sellerDescription:"Your store, your identity.",orderFormTitle:"Complete your order",customerName:"Full name",customerPhone:"Phone number",quantity:"Quantity",inStock:"Available",lowStock:"Low stock",outOfStock:"Out of stock",unlimitedStock:"Available",sendOrder:"Confirm and continue to WhatsApp",orderSaved:"Order saved. Continue on WhatsApp.",orderFailed:"Could not save your order.",cart:"Shopping cart",addToCart:"Add to cart",viewCart:"View cart",cartEmpty:"Your cart is empty.",remove:"Remove",increase:"Increase quantity",decrease:"Decrease quantity",cartTotal:"Total",continueShopping:"Continue shopping",checkout:"Checkout",cartAdded:"Product added to cart.",cartItem:"item",cartItems:"items",orderSummary:"Your order summary",reviewsEyebrow:"CUSTOMER REVIEWS",reviewsTitle:"What our customers say",writeReview:"Share your experience",reviewName:"Your name",reviewRating:"Your rating",reviewComment:"Your comment",sendReview:"Submit review",reviewModeration:"Your review will appear after the store owner approves it.",reviewCount:"reviews",noReviews:"No reviews have been published yet.",reviewPending:"Thank you! Your review was submitted and will appear after approval.",reviewFailed:"Could not submit your review. Please try again."}
};
const el=id=>document.getElementById(id);
const safe=value=>String(value??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
function productText(p,field){if(field==="name")return (language==="fr"?p.fr:language==="en"?p.en:p.name)||p.name;if(language==="fr")return p[field+"Fr"]||p[field];if(language==="en")return p[field+"En"]||p[field];return p[field];}
function categoryOf(p){return (language==="fr"?p.categoryFr:language==="en"?p.categoryEn:p.category)||p.category||"General";}
function whatsappLink(p){return "https://wa.me/"+(STORE_SETTINGS.whatsapp||"")+"?text="+encodeURIComponent(translations[language].orderMessage+productText(p,"name"));}
const standardCategories=[
{value:"إلكترونيات",ar:"إلكترونيات",fr:"Électronique",en:"Electronics"},
{value:"هواتف وإكسسوارات",ar:"هواتف وإكسسوارات",fr:"Téléphones et accessoires",en:"Phones & accessories"},
{value:"ملابس",ar:"ملابس",fr:"Vêtements",en:"Clothing"},
{value:"أحذية",ar:"أحذية",fr:"Chaussures",en:"Shoes"},
{value:"حقائب وإكسسوارات",ar:"حقائب وإكسسوارات",fr:"Sacs et accessoires",en:"Bags & accessories"},
{value:"مستحضرات التجميل",ar:"مستحضرات التجميل",fr:"Cosmétiques",en:"Cosmetics"},
{value:"العناية الشخصية",ar:"العناية الشخصية",fr:"Soins personnels",en:"Personal care"},
{value:"المنزل والمطبخ",ar:"المنزل والمطبخ",fr:"Maison et cuisine",en:"Home & kitchen"},
{value:"الأثاث والديكور",ar:"الأثاث والديكور",fr:"Meubles et décoration",en:"Furniture & decor"},
{value:"الأطفال والألعاب",ar:"الأطفال والألعاب",fr:"Enfants et jouets",en:"Kids & toys"},
{value:"الرياضة واللياقة",ar:"الرياضة واللياقة",fr:"Sport et fitness",en:"Sports & fitness"},
{value:"السيارات",ar:"السيارات",fr:"Automobile",en:"Automotive"},
{value:"الأغذية والمشروبات",ar:"الأغذية والمشروبات",fr:"Alimentation et boissons",en:"Food & drinks"},
{value:"الكتب والقرطاسية",ar:"الكتب والقرطاسية",fr:"Livres et papeterie",en:"Books & stationery"}
];
function renderFilters(){
 const custom=[...new Set(products.map(p=>String(p.category||"").trim()).filter(Boolean))].filter(category=>!standardCategories.some(item=>item.value===category));
 const options=[{value:"all",label:translations[language].all},...standardCategories.map(item=>({value:item.value,label:item[language]})),...custom.map(category=>({value:category,label:category}))];
 el("categorySelect").innerHTML=options.map(x=>'<option value="'+safe(x.value)+'">'+safe(x.label)+'</option>').join("");
 el("categorySelect").value=options.some(x=>x.value===activeCategory)?activeCategory:"all";
 if(el("categorySelect").value!==activeCategory)activeCategory="all";
}
function normalizeSearchText(value){return String(value??"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLocaleLowerCase();}
function renderProducts(){
 const term=normalizeSearchText(searchTerm);
 const list=products.filter(p=>{const cat=categoryOf(p),hay=normalizeSearchText([p.name,p.fr,p.en,p.description,p.descriptionFr,p.descriptionEn,p.category,p.categoryFr,p.categoryEn].join(" "));return(activeCategory==="all"||p.category===activeCategory||cat===activeCategory)&&hay.includes(term);});
 el("clearSearch").hidden=!searchTerm.trim();
 el("productGrid").innerHTML=list.map(p=>{const name=productText(p,"name"),desc=productText(p,"description");const visual=p.image_url?'<img src="'+safe(p.image_url)+'" alt="'+safe(name)+'" loading="lazy">':safe(p.emoji||"📦");const tracked=p.stock_quantity!==null&&p.stock_quantity!==undefined,stock=tracked?Number(p.stock_quantity):null,soldOut=tracked&&stock<=0;const stockText=soldOut?translations[language].outOfStock:tracked&&stock<=5?translations[language].lowStock:translations[language].inStock;return '<article class="product-card"><div class="product-image">'+visual+'</div><div class="product-info"><span class="product-category">'+safe(categoryOf(p))+'</span><h3>'+safe(name)+'</h3><p>'+safe(desc||"")+'</p>'+(currentStoreId?'<span class="product-stock '+(soldOut?'out-of-stock':tracked&&stock<=5?'low-stock':'')+'">'+safe(stockText)+'</span>':'')+'<div class="product-bottom"><span class="price">'+Number(p.price||0).toLocaleString(language==="ar"?"ar-DZ":language==="fr"?"fr-FR":"en-US")+' '+translations[language].currency+'</span>'+(currentStoreId?'<button type="button" class="order-btn add-cart-btn" data-add-cart="'+safe(p.id)+'" '+(soldOut?'disabled':'')+'>'+translations[language].addToCart+'</button>':'<a class="order-btn" href="'+whatsappLink(p)+'" target="_blank" rel="noopener">'+translations[language].order+'</a>')+'</div></div></article>';}).join("");
 el("emptyState").hidden=list.length>0;el("productCount").textContent=list.length+" "+translations[language].count;
}
function renderSellerProfile(){const name=STORE_SETTINGS.sellerName||"Store Owner";el("sellerName").textContent=name;el("sellerDescription").textContent=STORE_SETTINGS.sellerDescription||translations[language].sellerDescription;el("sellerInitials").textContent=name.trim().charAt(0).toUpperCase()||"S";const avatar=el("sellerAvatar");if(STORE_SETTINGS.sellerAvatar){avatar.src=STORE_SETTINGS.sellerAvatar;avatar.hidden=false;el("sellerInitials").hidden=true;avatar.onerror=()=>{avatar.hidden=true;el("sellerInitials").hidden=false;};}else{avatar.hidden=true;el("sellerInitials").hidden=false;}}
function updateStoreShareLinks(){
 const whatsappShare=el("whatsappStoreShare"),facebookShare=el("facebookStoreShare");
 if(!whatsappShare||!facebookShare)return;
 const url=location.href,encodedUrl=encodeURIComponent(url);
 whatsappShare.href="https://wa.me/?text="+encodeURIComponent(translations[language].shareStore+" — "+url);
 facebookShare.href="https://www.facebook.com/sharer/sharer.php?u="+encodedUrl;
}
async function copyStoreLink(){
 const feedback=el("shareFeedback");
 try{
  if(navigator.clipboard&&window.isSecureContext){await navigator.clipboard.writeText(location.href);}
  else{
   const field=document.createElement("textarea");field.value=location.href;field.setAttribute("readonly","");field.style.position="fixed";field.style.opacity="0";document.body.appendChild(field);field.select();
   const copied=document.execCommand("copy");field.remove();if(!copied)throw new Error("Clipboard unavailable");
  }
  feedback.textContent=translations[language].shareCopied;
 }catch(error){console.error("Store link copy failed:",error);feedback.textContent=translations[language].shareCopyFailed;}
}
function applyLanguage(){document.documentElement.lang=language;document.documentElement.dir=language==="ar"?"rtl":"ltr";document.querySelectorAll("[data-i18n]").forEach(n=>{const k=n.dataset.i18n;if(translations[language][k])n.innerHTML=translations[language][k];});document.querySelectorAll("[data-i18n-placeholder]").forEach(n=>n.placeholder=translations[language][n.dataset.i18nPlaceholder]);renderSellerProfile();renderFilters();renderProducts();renderCart();if(currentStoreId&&el("reviews"))renderPublicReviews();el("contactButton").href="https://wa.me/"+(STORE_SETTINGS.whatsapp||"");updateStoreShareLinks();}

function cartQuantity(){return cartItems.reduce((sum,item)=>sum+item.quantity,0);}
function cartTotal(){return cartItems.reduce((sum,item)=>sum+Number(item.product.price||0)*item.quantity,0);}
function updateCartButton(){
 const button=el("viewCartButton");if(!button)return;
 button.hidden=!currentStoreId;
 button.textContent=translations[language].viewCart+" ("+cartQuantity()+")";
}
function addToCart(productId){
 const product=products.find(p=>String(p.id)===String(productId));if(!product)return;
 const existing=cartItems.find(item=>String(item.product.id)===String(product.id));
 const limit=product.stock_quantity===null||product.stock_quantity===undefined?99:Number(product.stock_quantity);if(limit<=0)return;if(existing){if(existing.quantity<Math.min(99,limit))existing.quantity++;}else cartItems.push({product,quantity:1});
 updateCartButton();renderCart();
 const feedback=el("cartFeedback");if(feedback)feedback.textContent=translations[language].cartAdded;
}
function changeCartQuantity(productId,delta){
 const item=cartItems.find(entry=>String(entry.product.id)===String(productId));if(!item)return;
 const limit=item.product.stock_quantity===null||item.product.stock_quantity===undefined?99:Number(item.product.stock_quantity);item.quantity=Math.max(1,Math.min(99,limit,item.quantity+delta));renderCart();updateCartButton();
}
function removeCartItem(productId){
 cartItems=cartItems.filter(item=>String(item.product.id)!==String(productId));renderCart();updateCartButton();
}
function renderCart(){
 const list=el("cartItemsList");if(!list)return;
 if(!cartItems.length){list.innerHTML='<p class="cart-empty">'+translations[language].cartEmpty+'</p>';}
 else list.innerHTML=cartItems.map(({product,quantity})=>'<article class="cart-item"><div class="cart-item-info"><strong>'+safe(productText(product,"name"))+'</strong><small>'+Number(product.price||0).toLocaleString()+' '+translations[language].currency+'</small></div><div class="cart-item-controls"><button type="button" data-cart-minus="'+safe(product.id)+'" aria-label="'+translations[language].decrease+'">−</button><span>'+quantity+'</span><button type="button" data-cart-plus="'+safe(product.id)+'" aria-label="'+translations[language].increase+'">+</button><button type="button" class="cart-remove" data-cart-remove="'+safe(product.id)+'">'+translations[language].remove+'</button></div></article>').join("");
 el("cartDialogTotal").textContent=translations[language].cartTotal+": "+cartTotal().toLocaleString(language==="ar"?"ar-DZ":language==="fr"?"fr-FR":"en-US")+" "+translations[language].currency;
 el("checkoutCartButton").disabled=!cartItems.length;updateCartButton();
}
function openCart(){renderCart();el("cartDialog").showModal();}
function openOrderDialog(){
 if(!cartItems.length)return;
 const t=translations[language];
 el("orderDialogTitle").textContent=t.orderFormTitle;
 el("orderProductSummary").textContent=cartItems.map(({product,quantity})=>productText(product,"name")+" × "+quantity).join("، ");
 el("orderDialogTotal").textContent=t.cartTotal+": "+cartTotal().toLocaleString(language==="ar"?"ar-DZ":language==="fr"?"fr-FR":"en-US")+" "+t.currency;
 el("submitCustomerOrder").textContent=t.sendOrder;el("orderDialogFeedback").textContent="";el("orderDialog").showModal();
}
async function submitCustomerOrder(event){
 event.preventDefault();if(!currentStoreId||!cartItems.length)return;
 const name=el("customerName").value.trim(),phone=el("customerPhone").value.trim(),notes=el("customerNotes").value.trim();
 if(!name||!phone)return;
 const {data:latestProducts,error:stockError}=await supabase.from("products").select("id,stock_quantity,is_active").in("id",cartItems.map(item=>item.product.id));if(stockError){el("orderDialogFeedback").textContent=translations[language].orderFailed;return;}for(const item of cartItems){const latest=latestProducts.find(p=>p.id===item.product.id);if(!latest||!latest.is_active||(latest.stock_quantity!==null&&latest.stock_quantity!==undefined&&Number(latest.stock_quantity)<item.quantity)){el("orderDialogFeedback").textContent="تغير المخزون. حدّث السلة وحاول مجدداً.";return;}}const popup=window.open("about:blank","_blank");
 const items=cartItems.map(({product,quantity})=>({product_id:product.id,name:productText(product,"name"),quantity,unit_price:Number(product.price||0)}));
 const total=cartTotal();
 el("submitCustomerOrder").disabled=true;el("orderDialogFeedback").textContent="جارٍ تسجيل طلبك...";
 try{
  const {error}=await supabase.from("orders").insert({store_id:currentStoreId,customer_name:name,customer_phone:phone,items,total,notes:notes||null});if(error)throw error;
  const details=items.map((item,index)=>(index+1)+". "+item.name+" × "+item.quantity+" = "+(item.unit_price*item.quantity).toLocaleString()+" DZD").join("\n");
  const msg="مرحباً، أرسلت طلباً جديداً عبر Mini Store DZ\n"+details+"\nالمجموع: "+total.toLocaleString()+" DZD\nالاسم: "+name+"\nالهاتف: "+phone+(notes?"\nملاحظات: "+notes:"");
  const target="https://wa.me/"+(STORE_SETTINGS.whatsapp||"")+"?text="+encodeURIComponent(msg);if(popup)popup.location=target;else window.location.href=target;
  cartItems=[];renderCart();el("customerOrderForm").reset();el("orderDialogFeedback").textContent=translations[language].orderSaved;setTimeout(()=>el("orderDialog").close(),900);
 }catch(error){if(popup)popup.close();console.error(error);el("orderDialogFeedback").textContent=translations[language].orderFailed;}finally{el("submitCustomerOrder").disabled=false;}
}


async function loadPublicReviews(){
 const section=el("reviews");if(!section||!currentStoreId)return;
 section.hidden=false;
 const pageSize=1000;let allReviews=[],from=0;
 while(true){
  const {data,error}=await supabase.from("store_reviews").select("id,customer_name,rating,comment,created_at").eq("store_id",currentStoreId).eq("status","approved").order("created_at",{ascending:false}).range(from,from+pageSize-1);
  if(error){console.error("Reviews loading error:",error);return;}
  const batch=data||[];allReviews=allReviews.concat(batch);if(batch.length<pageSize)break;from+=pageSize;
 }
 publicReviewStats=allReviews;publicReviews=allReviews.slice(0,20);renderPublicReviews();
}
function renderPublicReviews(){
 const count=publicReviewStats.length,average=count?publicReviewStats.reduce((sum,r)=>sum+Number(r.rating),0)/count:0;
 el("reviewsAverage").textContent=count?average.toFixed(1)+"/5":"—";
 el("reviewsStars").textContent=count?"★".repeat(Math.round(average))+"☆".repeat(5-Math.round(average)):"☆☆☆☆☆";
 el("reviewsCount").textContent=count+" "+translations[language].reviewCount;
 const distribution=[5,4,3,2,1].map(star=>{const total=publicReviewStats.filter(r=>Number(r.rating)===star).length;const percent=count?total/count*100:0;return '<div class="rating-row"><span class="rating-label">'+star+' ★</span><div class="rating-track"><span style="width:'+percent.toFixed(2)+'%"></span></div><small>'+total+'</small></div>';}).join("");
 el("reviewsBreakdown").innerHTML=distribution;
 el("publicReviews").innerHTML=count?publicReviews.map(r=>'<article class="public-review"><div class="public-review-top"><strong>'+safe(r.customer_name)+'</strong><span class="review-stars">'+("★".repeat(Number(r.rating))+"☆".repeat(5-Number(r.rating)))+'</span></div><p>'+safe(r.comment)+'</p><small>'+new Date(r.created_at).toLocaleDateString(language==="ar"?"ar-DZ":language==="fr"?"fr-FR":"en-US")+'</small></article>').join(""):'<p class="empty-state">'+translations[language].noReviews+'</p>';
}
async function submitCustomerReview(event){
 event.preventDefault();if(!currentStoreId)return;
 const name=el("reviewCustomerName").value.trim(),rating=Number(el("reviewRating").value),comment=el("reviewComment").value.trim();
 if(name.length<2||comment.length<3||!Number.isInteger(rating)||rating<1||rating>5)return;
 const button=el("submitReview");button.disabled=true;el("reviewFeedback").textContent="";
 try{
  const {error}=await supabase.from("store_reviews").insert({store_id:currentStoreId,customer_name:name,rating,comment});
  if(error)throw error;
  el("customerReviewForm").reset();el("reviewFeedback").textContent=translations[language].reviewPending;
 }catch(error){console.error("Review submission error:",error);el("reviewFeedback").textContent=translations[language].reviewFailed;}
 finally{button.disabled=false;}
}

async function loadStore(){
 const slug=new URLSearchParams(location.search).get("store");if(!slug)return;
 try{
  const {data:store,error}=await supabase.from("stores").select("id,store_name,seller_name,seller_bio,avatar_url,whatsapp,description,slug").eq("slug",slug).eq("is_published",true).maybeSingle();
  if(error)throw error;if(!store){products=[];STORE_SETTINGS={...DEFAULT_STORE_SETTINGS,sellerName:"المتجر غير متاح",sellerDescription:"هذا المتجر غير منشور أو أن الرابط غير صحيح.",whatsapp:""};return;}
  currentStoreId=store.id;STORE_SETTINGS={whatsapp:store.whatsapp||"",sellerName:store.seller_name||store.store_name,sellerDescription:[store.store_name,store.seller_bio].filter(Boolean).join(" · "),sellerAvatar:store.avatar_url||""};
  const {data:list,error:productError}=await supabase.from("products").select("id,name,description,category,price,currency,image_url,stock_quantity").eq("store_id",store.id).eq("is_active",true).order("created_at",{ascending:false});
  if(productError)throw productError;products=(list||[]).map(p=>({...p,emoji:"📦"}));
  document.title=store.store_name+" | Mini Store DZ";
  const pageDescription=[store.store_name,store.seller_bio,"تصفح المنتجات والتقييمات واطلب بسهولة عبر WhatsApp."].filter(Boolean).join(" — ");
  const descriptionMeta=document.querySelector('meta[name="description"]');if(descriptionMeta)descriptionMeta.content=pageDescription;
  const ogTitle=document.querySelector('meta[property="og:title"]');if(ogTitle)ogTitle.content=store.store_name+" | Mini Store DZ";
  const ogDescription=document.querySelector('meta[property="og:description"]');if(ogDescription)ogDescription.content=pageDescription;
 }catch(error){console.error("Store loading error:",error);}
}
el("languageSelect").addEventListener("change",e=>{language=e.target.value;activeCategory="all";applyLanguage();});
if(el("copyStoreLink"))el("copyStoreLink").addEventListener("click",copyStoreLink);
el("searchInput").addEventListener("input",e=>{searchTerm=e.target.value;renderProducts();});
el("clearSearch").addEventListener("click",()=>{searchTerm="";el("searchInput").value="";renderProducts();el("searchInput").focus();});
el("categorySelect").addEventListener("change",e=>{activeCategory=e.target.value;renderProducts();});
el("productGrid").addEventListener("click",e=>{const b=e.target.closest("[data-add-cart]");if(b)addToCart(b.dataset.addCart);});
el("viewCartButton").addEventListener("click",openCart);
el("closeCartDialog").addEventListener("click",()=>el("cartDialog").close());
el("cartItemsList").addEventListener("click",e=>{const plus=e.target.closest("[data-cart-plus]"),minus=e.target.closest("[data-cart-minus]"),remove=e.target.closest("[data-cart-remove]");if(plus)changeCartQuantity(plus.dataset.cartPlus,1);if(minus)changeCartQuantity(minus.dataset.cartMinus,-1);if(remove)removeCartItem(remove.dataset.cartRemove);});
el("continueShoppingButton").addEventListener("click",()=>el("cartDialog").close());
el("checkoutCartButton").addEventListener("click",()=>{el("cartDialog").close();openOrderDialog();});
el("customerOrderForm").addEventListener("submit",submitCustomerOrder);el("customerReviewForm").addEventListener("submit",submitCustomerReview);el("closeOrderDialog").addEventListener("click",()=>el("orderDialog").close());

el("year").textContent=new Date().getFullYear();
await loadStore();applyLanguage();updateCartButton();await loadPublicReviews();
