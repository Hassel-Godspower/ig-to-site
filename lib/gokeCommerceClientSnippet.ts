/** Inject into live site script.js when commerce_tier or booking_tier is pro */
export function commerceProSnippet(jobId: string, baseUrl: string): string {
  const base = baseUrl.replace(/\/$/, "");
  const id = JSON.stringify(jobId);
  const api = JSON.stringify(base);
  return `
/* goke pro bridges — used by staticCommerceRuntime when present */
(function(){
  var JOB=${id}, API=${api};
  window.GokeCommerce={
    jobId: JOB,
    loadCatalog: function(){
      return fetch(API+"/api/commerce/public/"+JOB+"/catalog").then(function(r){ return r.json(); });
    },
    placeOrder: function(payload){
      return fetch(API+"/api/commerce/public/"+JOB+"/orders",{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body: JSON.stringify(payload||{})
      }).then(function(r){ return r.json(); });
    }
  };
  window.GokeBooking={
    jobId: JOB,
    submit: function(payload){
      return fetch(API+"/api/booking/public/"+JOB+"/request",{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body: JSON.stringify(payload||{})
      }).then(function(r){ return r.json(); });
    }
  };
})();
`;
}
