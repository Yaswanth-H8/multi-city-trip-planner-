export function haverDist(a, b) {
  const R=6371, r=Math.PI/180;
  const dLat=(b.lat-a.lat)*r, dLng=(b.lng-a.lng)*r;
  const x=Math.sin(dLat/2)**2 + Math.cos(a.lat*r)*Math.cos(b.lat*r)*Math.sin(dLng/2)**2;
  return 2*R*Math.asin(Math.sqrt(x));
}
export function flightPrice(a,b){ return Math.round((haverDist(a,b)*0.115+75)/10)*10; }
export function flightDur(a,b){ return Math.max(1, Math.round(haverDist(a,b)/820+0.8)); }
export function detectCurrency(country, currencies){
  return currencies.find(c=>c.countries.includes(country))||currencies[0];
}
export function formatMoney(usdAmt, curr){
  const val = usdAmt * curr.rate;
  return curr.sym + (val>=1000 ? Math.round(val).toLocaleString() : Math.round(val));
}
export function fmtDate(d){ return d ? d.toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"}) : "—"; }
export function fmtShort(d){ return d ? d.toLocaleDateString("en-US",{month:"short",day:"numeric"}) : ""; }
export function layoverH(i){ return [2.2,1.1,4.6,1.8,3.3,2.5,1.3,2.1,4.9][i%9]; }
export function geodesicPts(lat1,lng1,lat2,lng2,n=50){
  const R2D=180/Math.PI, D2R=Math.PI/180;
  const p1=lat1*D2R, l1=lng1*D2R, p2=lat2*D2R, l2=lng2*D2R;
  const d=2*Math.asin(Math.sqrt(Math.sin((p2-p1)/2)**2+Math.cos(p1)*Math.cos(p2)*Math.sin((l2-l1)/2)**2));
  if(d===0) return [[lat1,lng1]];
  const pts = Array.from({length:n+1},(_,i)=>{
    const f=i/n, A=Math.sin((1-f)*d)/Math.sin(d), B=Math.sin(f*d)/Math.sin(d);
    const x=A*Math.cos(p1)*Math.cos(l1)+B*Math.cos(p2)*Math.cos(l2);
    const y=A*Math.cos(p1)*Math.sin(l1)+B*Math.cos(p2)*Math.sin(l2);
    const z=A*Math.sin(p1)+B*Math.sin(p2);
    return [Math.atan2(z,Math.sqrt(x**2+y**2))*R2D, Math.atan2(y,x)*R2D];
  });
  // Unwrap longitudes so Leaflet doesn't draw through the ocean when crossing ±180°
  for(let i=1;i<pts.length;i++){
    while(pts[i][1]-pts[i-1][1]>180) pts[i][1]-=360;
    while(pts[i][1]-pts[i-1][1]<-180) pts[i][1]+=360;
  }
  return pts;
}
export function bearing(lat1,lng1,lat2,lng2){
  const D2R=Math.PI/180, dL=(lng2-lng1)*D2R;
  return (Math.atan2(Math.sin(dL)*Math.cos(lat2*D2R), Math.cos(lat1*D2R)*Math.sin(lat2*D2R)-Math.sin(lat1*D2R)*Math.cos(lat2*D2R)*Math.cos(dL))*180/Math.PI+360)%360;
}
export const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
export const DNAMES = ["Su","Mo","Tu","We","Th","Fr","Sa"];
