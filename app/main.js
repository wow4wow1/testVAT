// App bootstrap
$('#fm').innerHTML='<option value="">Cały rok</option>'+MONTHS.map((m,i)=>`<option value="${String(i+1).padStart(2,'0')}">${m}</option>`).join('');
$('#cList').innerHTML=COLS.map(([k,l])=>`<label class="ck"><input type="checkbox" data-col="${k}" ${st.cols[k]?'checked':''}> ${l}</label>`).join('');
try{const v=JSON.parse(localStorage.getItem('vatview')||'{}');['tab','sort','per','cols'].forEach(k=>v[k]!==undefined&&(st[k]=v[k]))}catch{}
$('#sort').value=st.sort[0]+st.sort[1];$$('[data-col]').forEach(c=>c.checked=!!st.cols[c.dataset.col]);
syncF();render();
applyAuth();
