(function(){var $=U.$,h=U.h,head=[],body=[],name='cleaned.csv';
function err(m){$('err').textContent=m;$('err').hidden=!m}
function load(text,fname){err('');var rows=U.parseCSV(text);if(rows.length<2){err('Need a header row and at least one data row.');$('tools').hidden=true;$('prev').hidden=true;return}
 if(rows.length>200000){err('File too large for this tool (over 200,000 rows).');return}
 head=rows[0].map(function(x){return x.trim()});body=rows.slice(1);name=(fname||'data.csv').replace(/\.csv$/i,'')+'-cleaned.csv';
 ['dkey','skey'].forEach(function(id){var s=$(id);s.textContent='';if(id==='dkey')s.appendChild(h('option',{value:'-1',text:'All columns'}));else s.appendChild(h('option',{value:'-1',text:'(no sorting)'}));head.forEach(function(c,i){s.appendChild(h('option',{value:i,text:c||('Column '+(i+1))}))})});
 $('tools').hidden=false;$('prev').hidden=false;run()}
function isNum(v){return v!==''&&isFinite(Number(String(v).replace(/,/g,'')))}
function process(){var out=body.map(function(r){var x=r.slice();while(x.length<head.length)x.push('');return x});var st={in:body.length,blank:0,dup:0,filtered:0};
 if($('trim').checked)out=out.map(function(r){return r.map(function(c){return c.trim()})});
 if($('blank').checked){var n=out.length;out=out.filter(function(r){return r.some(function(c){return String(c).trim()!==''})});st.blank=n-out.length}
 if($('dedupe').checked){var k=+$('dkey').value,seen={},n2=out.length;out=out.filter(function(r){var key=k<0?JSON.stringify(r):String(r[k]).toLowerCase();if(seen[key])return false;seen[key]=1;return true});st.dup=n2-out.length}
 var f=$('filter').value.trim().toLowerCase();if(f){var n3=out.length;out=out.filter(function(r){return r.some(function(c){return String(c).toLowerCase().indexOf(f)>=0})});st.filtered=n3-out.length}
 var s=+$('skey').value;if(s>=0){var dir=$('sdir').value==='desc'?-1:1;out=out.slice().sort(function(a,b){var x=a[s],y=b[s];if(isNum(x)&&isNum(y))return (Number(String(x).replace(/,/g,''))-Number(String(y).replace(/,/g,'')))*dir;return String(x).localeCompare(String(y))*dir})}
 st.out=out.length;return {rows:out,st:st}}
function run(){var r=process();$('stats').textContent=r.st.in+' rows in, '+r.st.out+' out ('+r.st.blank+' blank removed, '+r.st.dup+' duplicates removed, '+r.st.filtered+' removed by filter).';
 var th=$('th');th.textContent='';th.appendChild(h('tr',{},head.map(function(c){return h('th',{text:c})})));
 var tb=$('tb');tb.textContent='';r.rows.slice(0,50).forEach(function(row){tb.appendChild(h('tr',{},row.map(function(c){return h('td',{text:c})})))})}
['trim','blank','dedupe','dkey','filter','skey','sdir'].forEach(function(id){$(id).addEventListener('input',run)});
$('file').addEventListener('change',function(e){var f=e.target.files[0];if(!f)return;if(f.size>20*1024*1024){err('File over 20 MB.');return}var r=new FileReader();r.onload=function(){load(r.result,f.name)};r.readAsText(f)});
$('load').addEventListener('click',function(){load($('paste').value,'pasted.csv')});
$('dl').addEventListener('click',function(){var r=process();U.download(name,U.toCSV([head].concat(r.rows)))});
window.__csv={process:process,load:load};
})();
