// Filtering: filter pipeline, quick filters and smart-search tokens
function filtered(skipDay){
  const P=parseQ(st.q);
  const r=DATA[st.tab].filter(x=>x.d.slice(0,4)===st.y&&quickOk(x)&&(!st.m||x.d.slice(5,7)===st.m)&&(skipDay||!st.day||x.d.slice(8)===st.day)&&(!st.t||x.type===st.t)&&(!st.j||x.jpk===st.j)&&st.ser.includes(x.type)&&P.p.every(f=>f(x))&&(!P.t||[x.c,x.n,x.id,x.k||''].join(' ').toLowerCase().includes(P.t)));
  const [k,dir]=st.sort;
  return r.sort((a,b)=>(a[k]>b[k]?1:a[k]<b[k]?-1:0)*dir);
}
function activeFilters(){
  const a=[];
  if(st.y!=='2026')a.push(['y','Rok '+st.y]);
  if(st.m!=='10')a.push(['m',st.m?MONTHS[+st.m-1]:'Cały rok']);
  if(st.day)a.push(['day',`${+st.day} ${MONTHS[+st.m-1]||''}`]);
  if(st.t)a.push(['t',st.t==='FV'?'Faktura':'Korekta']);
  if(st.j)a.push(['j',st.j]);
  if(st.ser.length<2)a.push(['ser','Seria '+(st.ser[0]||'brak')]);
  return a;
}
const QK={noksef:{l:'Bez KSeF',f:x=>!x.k},kor:{l:'Korekty',f:x=>x.type==='KOR'},big:{l:'Powyżej 1 000 zł',f:x=>Math.abs(gross(x))>1000}};
const quickOk=x=>st.quick.every(k=>QK[k].f(x));
function parseQ(q){const p=[],t=[];q.toLowerCase().split(/\s+/).filter(Boolean).forEach(w=>{let m;
  if(w==='ksef:brak')p.push(x=>!x.k);else if(w==='ksef:tak')p.push(x=>!!x.k);
  else if(m=w.match(/^([<>])(\d+)$/)){const n=+m[2],gt=m[1]==='>';p.push(x=>gt?Math.abs(gross(x))>n:Math.abs(gross(x))<n)}
  else if(/^(23|8)%$/.test(w))p.push(x=>x.rate===w.slice(0,-1));
  else if(w==='np')p.push(x=>x.rate==='np');else if(w==='kor')p.push(x=>x.type==='KOR');
  else if(w.startsWith('jpk:'))p.push(x=>x.jpk.toLowerCase()===w.slice(4));else t.push(w)});return{p,t:t.join(' ')}}
