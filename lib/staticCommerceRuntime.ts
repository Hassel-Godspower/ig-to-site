/**
 * Static-site cart + booking → WhatsApp.
 * - Commerce: "New order from website"
 * - Booking: "New booking request from website"
 * Reads mode from body[data-goke-cart-mode] or window.__GOKE_CART_MODE__
 */

export const COMMERCE_BOOKING_RUNTIME = `
/* goke: cart / booking → WhatsApp (lite); pro API when GokeCommerce present */
(function(){
  var KEY="goke_cart";
  function mode(){
    try{
      var m=(document.body && document.body.getAttribute("data-goke-cart-mode"))||window.__GOKE_CART_MODE__||"commerce";
      return m==="booking"?"booking":"commerce";
    }catch(e){ return "commerce"; }
  }
  function read(){ try{ return JSON.parse(localStorage.getItem(KEY)||"[]"); }catch(e){ return []; } }
  function write(items){ localStorage.setItem(KEY, JSON.stringify(items)); updateUI(); }
  function wa(){
    var n=(document.body && document.body.getAttribute("data-wa"))||"";
    return String(n).replace(/\\D/g,"");
  }
  function money(n){ try{ return "₦"+Number(n||0).toLocaleString("en-NG"); }catch(e){ return "₦"+n; } }
  function updateUI(){
    var items=read();
    var count=items.reduce(function(s,i){ return s+(i.qty||1); },0);
    var total=items.reduce(function(s,i){ return s+((i.price||0)*(i.qty||1)); },0);
    document.querySelectorAll(".goke-cart-count").forEach(function(el){ el.textContent=String(count); });
    document.querySelectorAll(".goke-cart-total").forEach(function(el){ el.textContent=money(total); });
    document.querySelectorAll(".goke-cart-empty").forEach(function(el){ el.style.display=count? "none":""; });
    document.querySelectorAll(".goke-cart-full").forEach(function(el){ el.style.display=count? "":"none"; });
  }
  function addFromEl(btn){
    var card=btn.closest("[data-product-id],.goke-product-card,.svc-card");
    if(!card) return;
    var id=card.getAttribute("data-product-id")||card.getAttribute("data-id")||String(Date.now());
    var name=card.getAttribute("data-product-name")||(card.querySelector("h3,h2,.goke-product-name")||{}).textContent||"Item";
    var price=parseInt(card.getAttribute("data-product-price")||"0",10)||0;
    var items=read();
    var found=items.find(function(x){ return x.id===id; });
    if(found) found.qty=(found.qty||1)+1;
    else items.push({ id:id, name:String(name).trim(), price:price, priceKobo:price*100, qty:1 });
    write(items);
    try{ btn.textContent=mode()==="booking"?"Added":"Added"; setTimeout(function(){ btn.textContent=btn.getAttribute("data-label")||(mode()==="booking"?"Add to booking":"Add to cart"); }, 900); }catch(e){}
  }
  function checkout(){
    var items=read();
    if(!items.length){
      alert(mode()==="booking"?"Your booking list is empty. Add a service first.":"Your cart is empty.");
      return;
    }
    var num=wa();
    var isBook=mode()==="booking";
    var lines=isBook?["New booking request from website:"]:["New order from website:"];
    var total=0;
    items.forEach(function(i){
      var line=(i.qty||1)+"× "+i.name;
      if(i.price) line+=" — "+money((i.price||0)*(i.qty||1));
      lines.push(line);
      total+=(i.price||0)*(i.qty||1);
    });
    if(total>0) lines.push("Total: "+money(total));
    lines.push(isBook?"Please confirm availability. Thank you.":"Please confirm this order. Thank you.");

    function openWa(){
      if(!num){ alert("WhatsApp number not set on this site (body data-wa)."); return; }
      window.open("https://wa.me/"+num+"?text="+encodeURIComponent(lines.join("\\n")),"_blank","noopener,noreferrer");
    }

    if(window.GokeCommerce && typeof window.GokeCommerce.placeOrder==="function"){
      var payload={
        items: items.map(function(i){ return { id:i.id, name:i.name, priceKobo:(i.priceKobo!=null?i.priceKobo:Math.round((i.price||0)*100)), qty:i.qty||1 }; }),
        notes: isBook?"Booking checkout":"Cart checkout",
        kind: isBook?"booking":"order"
      };
      window.GokeCommerce.placeOrder(payload).then(function(res){
        if(res && res.waUrl){ window.open(res.waUrl,"_blank","noopener,noreferrer"); }
        else openWa();
        if(res && res.order){ try{ localStorage.removeItem(KEY); updateUI(); }catch(e){} }
      }).catch(function(){ openWa(); });
      return;
    }
    openWa();
  }
  function bindCart(){
    document.querySelectorAll(".goke-add-cart").forEach(function(btn){
      if(btn.__gokeCart) return;
      btn.__gokeCart=true;
      if(!btn.getAttribute("data-label")) btn.setAttribute("data-label", btn.textContent||"");
      btn.addEventListener("click", function(e){ e.preventDefault(); addFromEl(btn); });
    });
    document.querySelectorAll(".goke-cart-checkout").forEach(function(btn){
      if(btn.__gokeChk) return;
      btn.__gokeChk=true;
      btn.addEventListener("click", function(e){ e.preventDefault(); checkout(); });
    });
    updateUI();
  }
  function bindBookingForms(){
    document.querySelectorAll("form.goke-booking-form, form[data-goke-booking]").forEach(function(form){
      if(form.__gokeBook) return;
      form.__gokeBook=true;
      form.addEventListener("submit", function(e){
        e.preventDefault();
        var num=wa();
        if(!num){ alert("WhatsApp number not set (body data-wa)."); return; }
        var fd=new FormData(form);
        var lines=["Booking request from website:"];
        fd.forEach(function(v,k){ if(String(v).trim()) lines.push(k+": "+v); });
        window.open("https://wa.me/"+num+"?text="+encodeURIComponent(lines.join("\\n")),"_blank","noopener,noreferrer");
      });
    });
  }
  function init(){ bindCart(); bindBookingForms(); updateUI(); }
  if(document.readyState==="loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
`;

/** Append runtime once into a script.js string */
export function ensureCommerceRuntime(js: string): string {
  if (js.includes("goke_cart") && js.includes("goke-add-cart")) return js;
  return js.trim() + "\n" + COMMERCE_BOOKING_RUNTIME;
}

/** Alias used by generateSite */
export const ensureCommerceBookingScript = ensureCommerceRuntime;
