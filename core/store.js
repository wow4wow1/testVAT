// Demo dataset (sales and purchases) and VAT math
const MONTHS=['styczeń','luty','marzec','kwiecień','maj','czerwiec','lipiec','sierpień','wrzesień','październik','listopad','grudzień'];
const nets=[1200,950,-300,1100,780,640,900,1350,500,820,430,610,700,520];
const mk=(p,i,net,pre,name)=>{const n=i+1;return{c:`${name} ${String(n).padStart(2,'0')}`,d:`2026-10-${String(n).padStart(2,'0')}`,n:`${net<0?'KOR':pre}/${n}/10/2026/DEMO`,k:n%5===0?`5260250274-20261${n}-A1B2C3-${n}F`:null,id:`DEMO-${p}-${n}`,net,rate:n%7===0?'np':'23',jpk:['GTU_06','GTU_12','Brak'][n%3],type:net<0?'KOR':'FV'}};
const DATA={s:nets.map((v,i)=>mk('S',i,v,'FV','Demo Alfa')),p:[410,260,1800,95,720,330,150].map((v,i)=>({...mk('Z',i,v,'ZK','Demo Dostawca'),rate:i%3===1?'8':'23'}))};
const vat=r=>r.rate==='np'?0:Math.round(r.net*Number(r.rate))/100;
const gross=r=>r.net+vat(r);
const COLS=[['date','Data'],['num','Numer dokumentu'],['ksef','Numer KSeF'],['id','Identyfikator'],['gross','Kwota brutto']];

// Single UI state object plus reset / sync helpers
const st={quick:[],sel:new Set(),cur:'',tab:'s',state:'ok',q:'',y:'2026',m:'10',t:'',j:'',ser:['FV','KOR'],day:'',page:1,per:10,sort:['d',-1],cols:{date:0,num:1,ksef:1,id:0,gross:1}};
function syncF(){$('#fy').value=st.y;$('#fm').value=st.m;$('#ft').value=st.t;$('#fj').value=st.j;$$('.ser').forEach(c=>c.checked=st.ser.includes(c.value))}
function reset(){Object.assign(st,{q:'',y:'2026',m:'10',t:'',j:'',day:'',ser:['FV','KOR'],quick:[],page:1});$('#q').value='';syncF()}
