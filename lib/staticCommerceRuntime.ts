/**
 * Static-site commerce + booking runtime.
 * - Lite (default): localStorage cart → WhatsApp; booking form → WhatsApp
 * - Pro: if window.GokeCommerce is injected (platform snippet), orders also POST to Gòke API
 */

export const COMMERCE_BOOKING_RUNTIME = `
/* goke: shop cart + booking (lite WhatsApp; pro API when GokeCommerce present) */
(function(){
  var KEY="goke_cart";
  function read(){ try{ return JSON.parse(localStorage.getItem(KEY)||"[]"); }catch(e){ return []; } }
  function write(items){ localStorage.setItem(KEY, JSON.stringify(items)); updateUI(); }
  function wa(){ return String((document.body&&document.body.getAttribute("data-wa"))||"").replace(/\\D/g,""); }
  function money(n){ return "₦"+Number(n||0).toLocaleString("en-NG"); }
  function updateUI(){
    var items=read();
    var count=items.reduce(function(s,i){ return s+(i.qty||1); },0);
    var total=items.reduce(function(s,i){ return s+(i.price||0)*(i.qty||1); },0);
    document.querySelectorAll(".goke-cart-count").forEach(function(el){
      el.textContent=count+(count===1?" item":" items")+(total?(" · "+money(total)):"");
    });
  }
  function addFromEl(btn){
    var card=btn.closest(".goke-product")||btn.parentElement;
    if(!card) return;
    var id=card.getAttribute("data-product-id")||card.getAttribute("data-id")||String(Date.now());
    var name=card.getAttribute("data-product-name")||(card.querySelector("h3,h2,.goke-product-name")||{}).textContent||"Item";
    var price=parseInt(card.getAttribute("data-product-price")||"0",10)||0;
    var items=read();
    var found=items.find(function(x){ return x.id===id; });
    if(found) found.qty=(found.qty||1)+1;
    else items.push({ id:id, name:String(name).trim(), price:price, priceKobo:price*100, qty:1 });
    write(items);
  }
  function checkout(){
    var items=read();
    if(!items.length){ alert("Your cart is empty."); return; }
    var num=wa();
    var lines=["New order from website:"];
    var total=0;
    items.forEach(function(i){
      lines.push((i.qty||1)+"× "+i.name+" — "+money((i.price||0)*(i.qty||1)));
      total+=(i.price||0)*(i.qty||1);
    });
    lines.push("Total: "+money(total));

    function openWa(){
      if(!num){ alert("WhatsApp number not set (body data-wa)."); return; }
      window.open("https://wa.me/"+num+"?text="+encodeURIComponent(lines.join("\\n")),"_blank","noopener,noreferrer");
    }

    if(window.GokeCommerce && typeof window.GokeCommerce.placeOrder==="function"){
      var payload={
        items: items.map(function(i){ return { id:i.id, name:i.name, priceKobo:(i.priceKobo!=null?i.priceKobo:Math.round((i.price||0)*100)), qty:i.qty||1 }; }),
        notes: "Cart checkout"
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
      btn.addEventListener("click", function(e){ e.preventDefault(); addFromEl(btn); });
    });
    document.querySelectorAll(".goke-cart-checkout").forEach(function(btn){
      if(btn.__gokeChk) return;
      btn.__gokeChk=true;
      btn.addEventListener("click", function(e){ e.preventDefault(); checkout(); });
    });
    updateUI();
  }
  function bindBooking(){
    document.querySelectorAll("form.goke-booking-form, form[data-goke-booking]").forEach(function(form){
      if(form.__gokeBook) return;
      form.__gokeBook=true;
      form.addEventListener("submit", function(e){
        e.preventDefault();
        var fd=new FormData(form);
        var fields={};
        ["name","phone","service","date","time","notes"].forEach(function(k){
          var v=fd.get(k); if(v) fields[k]=String(v);
        });
        var lines=["Booking request:"];
        Object.keys(fields).forEach(function(k){ lines.push(k.charAt(0).toUpperCase()+k.slice(1)+": "+fields[k]); });
        var num=wa();
        function openWa(){
          if(!num){ alert("WhatsApp number not set (body data-wa)."); return; }
          window.open("https://wa.me/"+num+"?text="+encodeURIComponent(lines.join("\\n")),"_blank","noopener,noreferrer");
        }
        if(window.GokeBooking && typeof window.GokeBooking.submit==="function"){
          window.GokeBooking.submit({
            name: fields.name, phone: fields.phone, service: fields.service,
            date: fields.date, time: fields.time, notes: fields.notes
          }).then(function(){ openWa(); }).catch(function(){ openWa(); });
          return;
        }
        openWa();
      });
    });
  }
  function bind(){ bindCart(); bindBooking(); }
  if(document.readyState==="loading") document.addEventListener("DOMContentLoaded", bind);
  else bind();
})();
`;

export function ensureCommerceBookingScript(js: string): string {
  if (js.includes("goke_cart") && js.includes("goke-booking-form")) return js;
  return js.trim() + "\n" + COMMERCE_BOOKING_RUNTIME;
}
