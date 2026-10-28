// Rendering: summary hero, day chart, document feed, pagination, skeleton
function render(){
  const ok=st.state==='ok',rows=ok?filtered():[],af=activeFilters(),list=$('#list'),foot=$('#foot');
  updateSel();renderQuick();$('#fCnt').hidden=!af.length;$('#fCnt').textContent=af.length;
  $('#act').innerHTML=af.map(([k,l])=>`<button class="chip" data-x="${k}">${l} ✕</button>`).join('');
  const net=rows.reduce((a,r)=>a+r.net,0),v=rows.reduce((a,r)=>a+vat(r),0),rn={};
  rows.forEach(r=>rn[r.rate]=(rn[r.rate]||0)+r.net);
  const col={'23':'#c6f36b','8':'#6fd0b8',np:'#7a9a92'},tot=Object.values(rn).reduce((a,b)=>a+Math.abs(b),0)||1;
  $('#hero').innerHTML=`<div class="seg" role="tablist"><button role="tab" data-t="s" aria-selected="${st.tab==='s'}">Sprzedaż</button><button role="tab" data-t="p" aria-selected="${st.tab==='p'}">Zakupy</button></div>
  <div class="hl">Brutto · ${st.m?MONTHS[+st.m-1]:'cały rok'} ${st.y}</div><div class="big">${money(net+v)}</div>
  <div class="two"><div><span class="hl" style="margin:0">Netto</span><b>${money(net)}</b></div><div><span class="hl" style="margin:0">VAT</span><b>${money(v)}</b></div></div>
  <div class="bar">${Object.keys(rn).map(k=>`<i style="flex:${Math.abs(rn[k])/tot};background:${col[k]}"></i>`).join('')||'<i style="flex:1;background:#ffffff22"></i>'}</div>
  <div class="leg">${Object.keys(rn).map(k=>`<span><span class="dot" style="background:${col[k]}"></span>${k==='np'?'np':k+'%'} · ${money(rows.filter(r=>r.rate===k).reduce((a,r)=>a+vat(r),0))}</span>`).join('')||'<span>Brak danych o stawkach</span>'}<span style="margin-left:auto;opacity:.6">DEMO</span></div>`;
  // day chart
  const all=ok&&st.m?filtered(true):[],dim=st.m?new Date(+st.y,+st.m,0).getDate():0,sums={};
  all.forEach(r=>sums[r.d.slice(8)]=(sums[r.d.slice(8)]||0)+Math.abs(gross(r)));
  const mx=Math.max(1,...Object.values(sums));
  $('#days').innerHTML=st.m?`<div class="t"><span>Dni miesiąca — kliknij, aby zawęzić</span>${st.day?'<span>wszystkie dni ↺</span>':''}</div><div class="chart">${Array.from({length:dim},(_,i)=>{const d=String(i+1).padStart(2,'0'),h=sums[d]?10+sums[d]/mx*90:0;return`<button data-day="${d}" class="${sums[d]?'has':''} ${st.day===d?'on':''}" style="height:${h||6}%" aria-label="${i+1} — ${sums[d]?money(sums[d]):'brak'}" ${sums[d]?'':'tabindex="-1"'}></button>`}).join('')}</div><div class="ax"><span>1</span><span>${Math.round(dim/2)}</span><span>${dim}</span></div>`:'<div class="t"><span>Wybierz miesiąc w filtrach, aby zobaczyć wykres dni</span></div>';
  $('#cnt').textContent=ok?`${rows.length} dokumentów`:'';

  if(st.state==='error'){list.innerHTML=`<div class="msg"><div class="ico">⚠️</div><h2>Nie udało się wczytać rejestru</h2><p>Sprawdź połączenie i spróbuj ponownie. Filtry zostały zachowane.</p><button class="btn pri" id="retry">Spróbuj ponownie</button></div>`;foot.innerHTML='';return}
  if(!rows.length){const f=ok&&(af.length||st.q||st.quick.length);list.innerHTML=`<div class="msg"><div class="ico">🗂️</div><h2>${f?'Brak wyników':'Brak dokumentów w tym okresie'}</h2><p>${f?'Żaden dokument nie pasuje do wybranych filtrów.':'Gdy pojawią się dokumenty, zobaczysz je tutaj.'}</p>${f?'<button class="btn" id="clr">Wyczyść filtry</button>':''}</div>`;foot.innerHTML='';return}
  const pages=Math.ceil(rows.length/st.per);st.page=Math.min(st.page,pages);
  const from=(st.page-1)*st.per,view=rows.slice(from,from+st.per),byDate=st.sort[0]==='d',groups=[];
  view.forEach(r=>{const key=byDate?r.d:'all';let g=groups.find(x=>x.k===key);if(!g)groups.push(g={k:key,r:[]});g.r.push(r)});
  list.innerHTML=groups.map(g=>`${byDate?`<div class="gh"><span class="dn">${g.k.slice(8)}</span><span class="dw">${new Date(g.k+'T12:00').toLocaleDateString('pl-PL',{weekday:'long',month:'long'})}</span><span class="ds">${money(g.r.reduce((a,r)=>a+gross(r),0))}</span></div>`:''}`+g.r.map(r=>`<button class="it${st.sel.has(r.id)?' sel':''}" data-id="${r.id}"><div class="av" title="Zaznacz" style="background:hsl(${hue(r.c)} 55% 85%)">${st.sel.has(r.id)?'✓':r.c.split(' ').pop()}</div>
    <div><div class="nm">${r.c}</div><div class="meta">${st.cols.date?`<span>${r.d}</span>`:''}${st.cols.num?`<span>${r.n}</span>`:''}${st.cols.id?`<span>${r.id}</span>`:''}${st.cols.ksef?`<span class="ks ${r.k?'ok':''}"><i></i>${r.k?'KSeF potwierdzony':'Brak potwierdzenia'}</span>`:''}</div></div>
    ${st.cols.gross?`<div class="amt">${money(gross(r))}<small>${r.rate==='np'?'np':'VAT '+r.rate+'%'}</small></div>`:'<span></span>'}</button>`).join('')).join('');
  foot.innerHTML=`<span>${from+1}–${from+view.length} z ${rows.length} zapisów</span><div><button class="btn" id="prev" ${st.page<2?'disabled':''} aria-label="Poprzednia">‹</button><span>${st.page} / ${pages}</span><button class="btn" id="next" ${st.page>=pages?'disabled':''} aria-label="Następna">›</button><select id="per" aria-label="Na stronie" style="width:auto">${[10,25,50].map(n=>`<option value="${n}" ${n===st.per?'selected':''}>${n} na stronie</option>`).join('')}</select></div>`;
}
function renderQuick(){$('#quick').innerHTML=Object.entries(QK).map(([k,o])=>{const n=DATA[st.tab].filter(x=>x.d.slice(0,4)===st.y&&(!st.m||x.d.slice(5,7)===st.m)&&o.f(x)).length;return`<button class="qk" data-q="${k}" aria-pressed="${st.quick.includes(k)}">${o.l} <span>${n}</span></button>`}).join('')}
function load(then){$('#list').innerHTML='<div class="sk"></div>'.repeat(5);$('#foot').innerHTML='';setTimeout(then,450)}
