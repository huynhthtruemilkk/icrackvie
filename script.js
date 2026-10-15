/* iCrack Vie — script.js v3.0
   Green · Multi-model AI · Terminal · Flowith-inspired */
(function(){
'use strict';

/* ── MODELS ── */
const MODELS=[
  {id:'claude-sonnet-4-6',name:'Claude Sonnet 4.6',p:'anthropic',desc:'Smart · Preview ready',free:true},
  {id:'claude-3-haiku-20240307',name:'Claude 3 Haiku',p:'anthropic',desc:'Fast · Old version',free:false},
  {id:'gpt-4o-mini',name:'GPT-4o Mini',p:'openai',desc:'OpenAI · needs key',free:false},
  {id:'gpt-4.1-mini',name:'GPT-4.1 Mini',p:'openai',desc:'OpenAI latest · needs key',free:false},
  {id:'deepseek-coder',name:'DeepSeek Coder V2',p:'deepseek',desc:'Code expert · needs key',free:false},
  {id:'gemini-1.5-flash',name:'Gemini 1.5 Flash',p:'google',desc:'Google AI · needs key',free:false},
];

/* ── STORAGE ── */
const K={d:'icv_d',s:'icv_s',l:'icv_l',u:'icv_u',ss:'icv_ss',c:'icv_cfg'};
function sv(k,v){try{localStorage.setItem(K[k],JSON.stringify(v))}catch{}}
function ld(k,d){try{const v=localStorage.getItem(K[k]);return v?JSON.parse(v):d}catch{return d}}

/* ── STATE ── */
let devs=ld('d',[]),srv=ld('s',{url:'',path:'/health'}),logs=ld('l',[]);
let users=ld('u',[]),session=ld('ss',null);
let cfg=ld('c',{theme:'dark',lite:false,aiModel:'claude-sonnet-4-6',aiMode:'chat',keys:{}});
let chatHistory=[],aiMode='chat',navOpen=false,authOpen=false;
let me=session?users.find(u=>u.id===session.uid)||null:null;

/* ── UTILS ── */
const $=id=>document.getElementById(id);
function esc(s){return String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':'&quot;',"'":'&#39;'})[c])}
function isIP4(v){const p=v.trim().split('.');return p.length===4&&p.every(x=>/^\d{1,3}$/.test(x)&&+x>=0&&+x<=255)}
function pw(s){return btoa(unescape(encodeURIComponent(s)))}

let tT;
function toast(msg,d){const e=$("toast");e.textContent=msg;e.classList.add("show");clearTimeout(tT);tT=setTimeout(()=>e.classList.remove("show"),d||2600)}
function addLog(msg){logs.unshift({t:new Date().toLocaleString(),m:String(msg)});logs=logs.slice(0,200);sv('l',logs);renderLogs();updateStats()}

/* ── THEME ── */
function applyTheme(){
  document.documentElement.setAttribute('data-theme',cfg.theme);
  document.documentElement.setAttribute('data-lite',String(cfg.lite));
  $("tglDark").classList.toggle('on',cfg.theme==='dark');
  $("tglLite").classList.toggle('on',cfg.lite);
}
$("tglDark").addEventListener('click',()=>{cfg.theme=cfg.theme==='dark'?'light':'dark';sv('c',cfg);applyTheme();toast(cfg.theme==='dark'?'Dark mode':'Light mode')});
$("tglLite").addEventListener('click',()=>{cfg.lite=!cfg.lite;sv('c',cfg);applyTheme();toast(cfg.lite?'Lite mode ON (effects reduced)':' Lite mode OFF')});

/* ── AUTH ── */
function initAuth(){
  if(!users.length){users=[{id:'admin',username:'admin',email:'admin@icrack.local',pw:pw('icrack'),role:'admin',created:Date.now()}];sv('u',users)}
  updateAuthUI();
}
function doLogin(id,pass){const u=users.find(u=>(u.username===id||u.email===id)&&u.pw===pw(pass));if(!u)return false;me=u;session={uid:u.id,username:u.username,role:u.role};sv('ss',session);return true}
function doRegister(name,email,pass){
  if(users.find(u=>u.username===name))return 'Username taken';
  if(users.find(u=>u.email===email))return 'Email registered';
  if(pass.length<6)return 'Password min. 6 chars';
  if(!/^[a-z0-9_]+$/i.test(name))return 'Letters, numbers, underscores only';
  const u={id:'u_'+Date.now().toString(36),username:name,email,pw:pw(pass),role:'user',created:Date.now()};
  users.push(u);sv('u',users);me=u;session={uid:u.id,username:u.username,role:u.role};sv('ss',session);return null;
}
function doLogout(){me=null;session=null;sv('ss',null);updateAuthUI();closeAuth();toast('Signed out.')}

function updateAuthUI(){
  if(me){
    $("avBtn").classList.add('on');$("avLetter").style.display='block';$("avLetter").textContent=me.username[0].toUpperCase();
    document.querySelector('.av-ico').style.display='none';
    showAuth('prof');$("pvAv").textContent=me.username[0].toUpperCase();$("pvName").textContent=me.username;
    $("pvRole").textContent=me.role;$("pvEmail").textContent=me.email;$("setName").value=me.username;
    const admin=me.role==='admin';
    document.querySelectorAll('.admin-only').forEach(el=>{el.style.display=admin?'':'none'});
    if(admin)renderAdminUsers();
  }else{
    $("avBtn").classList.remove('on');$("avLetter").style.display='none';document.querySelector('.av-ico').style.display='';
    showAuth('login');document.querySelectorAll('.admin-only').forEach(el=>el.style.display='none');
  }
}
function showAuth(v){$("loginView").style.display=v==='login'?'':'none';$("regView").style.display=v==='reg'?'':'none';$("profView").style.display=v==='prof'?'':'none'}
function openAuth(){authOpen=true;$("authPanel").classList.add('show');$("apOv").classList.add('show')}
function closeAuth(){authOpen=false;$("authPanel").classList.remove('show');$("apOv").classList.remove('show')}
$("avBtn").addEventListener('click',()=>authOpen?closeAuth():openAuth());
$("apOv").addEventListener('click',closeAuth);
$("toReg").addEventListener('click',()=>showAuth('reg'));
$("toLogin").addEventListener('click',()=>showAuth('login'));
$("logoutBtn").addEventListener('click',doLogout);
$("loginBtn").addEventListener('click',()=>{
  const id=$("liId").value.trim(),p=$("liPw").value;
  if(!id||!p){toast('⚠ Fill all fields');return}
  if(doLogin(id,p)){updateAuthUI();closeAuth();toast('Welcome, '+me.username+'!');addLog('Login: '+me.username)}
  else toast('⚠ Invalid credentials');
});
$("regBtn").addEventListener('click',()=>{
  const n=$("rName").value.trim(),e=$("rEmail").value.trim(),p=$("rPw").value;
  if(!n||!e||!p){toast('⚠ Fill all fields');return}
  const err=doRegister(n,e,p);if(err){toast('⚠ '+err);return}
  updateAuthUI();closeAuth();toast('Welcome, '+n+'!');addLog('New account: '+n);
});

/* ── NAV / PAGES ── */
let curPage='home';
function goPage(name){
  document.querySelectorAll('.page').forEach(p=>p.classList.remove('active'));
  const pg=$('pg-'+name);if(pg)pg.classList.add('active');
  document.querySelectorAll('[data-p]').forEach(b=>b.classList.toggle('on',b.dataset.p===name));
  curPage=name;closeSidebar();
  if(name==='devices')renderDevs();
  if(name==='network')renderShorts();
  if(name==='server')fillSrv();
  if(name==='logs')renderLogs();
  if(name==='admin'&&me?.role==='admin')renderAdminUsers();
  window.scrollTo({top:0,behavior:'smooth'});
}
document.querySelectorAll('[data-p]').forEach(b=>b.addEventListener('click',()=>goPage(b.dataset.p)));

function openSidebar(){navOpen=true;$("sidebar").classList.add('open');$("navOv").classList.add('show');$("navDot").classList.add('open');document.body.style.overflow='hidden'}
function closeSidebar(){navOpen=false;$("sidebar").classList.remove('open');$("navOv").classList.remove('show');$("navDot").classList.remove('open');document.body.style.overflow=''}
$("navDot").addEventListener('click',()=>navOpen?closeSidebar():openSidebar());
$("navOv").addEventListener('click',closeSidebar);

/* ── CONFIRM MODAL ── */
let mRes=null;
function confirm2(t,m){return new Promise(r=>{mRes=r;$("mTit").textContent=t;$("mMsg").textContent=m;$("mbg").classList.add('show')})}
$("mYes").onclick=()=>{$("mbg").classList.remove('show');mRes&&mRes(true);mRes=null};
$("mNo").onclick=()=>{$("mbg").classList.remove('show');mRes&&mRes(false);mRes=null};

/* ── STATS ── */
function updateStats(){
  $("stDev").textContent=devs.length;$("stLog").textContent=logs.length;
  $("stSrv").textContent=srv.url?'ACTIVE':'NOT SET';$("stSrvS").textContent=srv.url||' Unconfigured';
  $("logSub").textContent=logs.length+' events';$("devSub").textContent=devs.length+' devices';
}

/* ── DEVICES ── */
function devHTML(d){return`<article class="dr"><div class="dic">▣</div><div class="di"><b>${esc(d.name)}</b><span class="dip">${esc(d.ip)}:${esc(d.port||'80')}</span>${d.note?`<span class="dnote">${esc(d.note)}</span>`:''}</div><div class="dact"><button class="smbtn" data-a="copy" data-id="${esc(d.id)}">Copy</button><button class="smbtn" data-a="chk" data-id="${esc(d.id)}">Check</button><button class="smbtn del" data-a="del" data-id="${esc(d.id)}">Del</button></div></article>`}
function renderDevs(){const e='<div class="empty">No devices. Add one above.</div>';$("allDevs").innerHTML=devs.length?devs.map(devHTML).join(''):e;$("recentDevs").innerHTML=devs.length?devs.slice(0,3).map(devHTML).join(''):e;renderShorts();updateStats()}

$("addDevBtn").addEventListener('click',()=>{
  const name=$("dName").value.trim(),ip=$("dIP").value.trim(),port=$("dPort").value.trim()||'80',note=$("dNote").value.trim();
  if(!name){toast('⚠ Enter name');return}if(!isIP4(ip)){toast('⚠ Invalid IPv4');return}
  devs.unshift({id:Date.now().toString(36)+Math.random().toString(36).slice(2,5),name,ip,port,note,added:Date.now()});
  sv('d',devs);$("dName").value='';$("dIP").value='';$("dPort").value='';$("dNote").value='';
  renderDevs();addLog('Device added: '+name+' ('+ip+')');toast('✓ Saved!');
});
$("rfBtn").addEventListener('click',()=>{renderDevs();toast('↻ Refreshed')});

document.addEventListener('click',async e=>{
  const b=e.target.closest('[data-a]');if(!b)return;
  const d=devs.find(x=>x.id===b.dataset.id);if(!d)return;
  if(b.dataset.a==='copy'){try{await navigator.clipboard.writeText(d.ip);toast('✓ Copied: '+d.ip)}catch{toast('IP: '+d.ip)};addLog('Copy: '+d.ip)}
  if(b.dataset.a==='chk'){$("chkIP").value=d.ip;$("chkPort").value=d.port||'80';goPage('network');setTimeout(()=>analyzeIP(d.ip),300)}
  if(b.dataset.a==='del'){const ok=await confirm2('Delete','Remove "'+d.name+'"?');if(!ok)return;devs=devs.filter(x=>x.id!==d.id);sv('d',devs);renderDevs();addLog('Deleted: '+d.name);toast('✓ Deleted')}
});

/* ── NETWORK ── */
function analyzeIP(ip){
  const rb=$("ipRes"),dot=rb.querySelector('.rdot'),bl=rb.querySelector('b'),sm=rb.querySelector('small'),det=$("ipDet");
  if(!isIP4(ip)){dot.style.cssText='background:#ef4444;box-shadow:0 0 8px #ef4444';bl.textContent='✗ Invalid IPv4';sm.textContent='4 groups 0–255, dot-separated';det.style.display='none';return}
  const pts=ip.trim().split('.').map(Number),p0=pts[0];
  let type,cls,rfc;
  if(p0===10||(p0===172&&pts[1]>=16&&pts[1]<=31)||(p0===192&&pts[1]===168)){type='Private';rfc='RFC 1918'}
  else if(p0===127){type='Loopback';rfc='RFC 5735'}
  else if(p0===169&&pts[1]===254){type='Link-local';rfc='RFC 3927'}
  else if(p0>=224&&p0<=239){type='Multicast';rfc='RFC 5771'}
  else if(p0>=240){type='Reserved';rfc='RFC 1112'}
  else{type='Public';rfc='RFC 1122'}
  cls=p0<128?'A':p0<192?'B':p0<224?'C':p0<240?'D':'E';
  const scope=['Private','Loopback','Link-local'].includes(type)?'Local':'Global';
  const hex=pts.map(n=>n.toString(16).padStart(2,'0').toUpperCase()).join(':');
  const bin=pts.map(n=>n.toString(2).padStart(8,'0')).join('.');
  const dec=((pts[0]<<24)|(pts[1]<<16)|(pts[2]<<8)|pts[3])>>>0;
  dot.style.cssText='background:#22c55e;box-shadow:0 0 10px #22c55e';bl.textContent='✓ Valid IPv4';sm.textContent=ip+' · OK';
  det.style.display='grid';
  det.innerHTML=[['Address',ip],['Type',type],['Class',cls],['Scope',scope],['Standard',rfc],['Decimal',dec],['Hex',hex],['Binary',bin]]
    .map(([k,v])=>`<div class="nrow"><span>${esc(k)}</span><b>${esc(String(v))}</b></div>`).join('');
  addLog('IP: '+ip+' → '+type);toast('✓ Analyzed!');
}

async function checkReach(ip,port){
  const rb=$("reachRes"),dot=rb.querySelector('.rdot'),bl=rb.querySelector('b'),sm=rb.querySelector('small');
  if(!isIP4(ip)){toast('⚠ Invalid IP');return}
  dot.style.cssText='background:#f59e0b;box-shadow:0 0 8px #f59e0b';bl.textContent='Checking...';sm.textContent=ip+':'+port+'...';
  const url='http://'+ip+':'+port,t0=Date.now();
  try{await fetch(url,{method:'HEAD',mode:'no-cors',signal:AbortSignal.timeout(5000)});const ms=Date.now()-t0;dot.style.cssText='background:#22c55e;box-shadow:0 0 8px #22c55e';bl.textContent='✓ Host responded';sm.textContent=url+' · ~'+ms+'ms';addLog('Reach OK: '+url);toast('✓ Reachable!')}
  catch(err){const to=err.name==='TimeoutError'||err.name==='AbortError';dot.style.cssText='background:#ef4444;box-shadow:0 0 8px #ef4444';bl.textContent=to?'✗ Timeout':'✗ Unreachable';sm.textContent=to?'No response in 5s':'Cannot reach '+url;addLog('Reach fail: '+url)}
}

async function getMyIP(){try{const r=await fetch('https://api.ipify.org?format=json');const d=await r.json();$("chkIP").value=d.ip;toast('Your IP: '+d.ip);analyzeIP(d.ip)}catch{toast('⚠ Cannot get IP')}}

$("analyzeBtn").addEventListener('click',()=>{const ip=$("chkIP").value.trim();if(!ip){toast('⚠ Enter IPv4');return};analyzeIP(ip)});
$("reachBtn").addEventListener('click',()=>{const ip=$("chkIP").value.trim(),p=$("chkPort").value.trim();if(!ip){toast('⚠ Enter IPv4');return};checkReach(ip,p||'80')});
$("myIPBtn").addEventListener('click',getMyIP);
$("chkIP").addEventListener('keydown',e=>{if(e.key==='Enter')$("analyzeBtn").click()});

function renderShorts(){$("ipShorts").innerHTML=devs.length?devs.map(d=>`<button class="scut" data-fip="${esc(d.id)}"><span class="sic">▣</span><span>${esc(d.name)}</span><code>${esc(d.ip)}:${esc(d.port||'80')}</code></button>`).join(''):'<div class="empty">No saved IPs.</div>'}
document.addEventListener('click',e=>{const b=e.target.closest('[data-fip]');if(!b)return;const d=devs.find(x=>x.id===b.dataset.fip);if(!d)return;$("chkIP").value=d.ip;$("chkPort").value=d.port||'80';analyzeIP(d.ip);toast('Selected: '+d.name)});

/* ── SERVER ── */
function fillSrv(){$("sUrl").value=srv.url||'';$("sPth").value=srv.path||'/health'}
$("saveSrvBtn").addEventListener('click',()=>{
  const raw=$("sUrl").value.trim(),path=$("sPth").value.trim();
  let p;try{p=new URL(raw)}catch{toast('⚠ Invalid URL');return}
  if(!['http:','https:'].includes(p.protocol)){toast('⚠ HTTP/HTTPS only');return}
  if(!path.startsWith('/')){toast('⚠ Path needs /');return}
  srv={url:p.origin+p.pathname.replace(/\/+$/,''),path};sv('s',srv);fillSrv();updateStats();addLog('Server: '+srv.url);toast('✓ Saved!');
});
$("testSrvBtn").addEventListener('click',async()=>{
  if(!srv.url){toast('⚠ Save URL first');return}
  const rb=$("srvRes"),dot=rb.querySelector('.rdot'),bl=rb.querySelector('b'),sm=rb.querySelector('small'),pf=$("spf");
  dot.style.cssText='background:#f59e0b;box-shadow:0 0 8px #f59e0b';bl.textContent='Connecting...';sm.textContent='Testing...';
  pf.style.cssText='width:20%;background:linear-gradient(90deg,#16a34a,#22c55e)';
  const url=srv.url+(srv.path.startsWith('/')?srv.path:'/'+srv.path);
  try{pf.style.width='55%';const r=await fetch(url,{method:'GET',cache:'no-store',signal:AbortSignal.timeout(8000),headers:{Accept:'application/json,text/plain,*/*'}});pf.style.width='100%';if(!r.ok)throw new Error('HTTP '+r.status);let body='';try{const ct=r.headers.get('content-type')||'';body=ct.includes('json')?JSON.stringify(await r.json()).slice(0,70):(await r.text()).slice(0,70)}catch{}dot.style.cssText='background:#22c55e;box-shadow:0 0 10px #22c55e';bl.textContent='✓ OK — HTTP '+r.status;sm.textContent=url+(body?' · '+body:'');addLog('Health OK: '+url);toast('✓ Online!')}
  catch(err){pf.style.cssText='width:100%;background:#ef4444';dot.style.cssText='background:#ef4444;box-shadow:0 0 8px #ef4444';bl.textContent='✗ Failed';sm.textContent=(err.name==='AbortError'||err.name==='TimeoutError')?'Timeout 8s':'Network/CORS error';addLog('Health fail: '+url);toast('✗ Failed',3000);setTimeout(()=>{pf.style.background=''},2000)}
  finally{setTimeout(()=>{pf.style.width='0'},3500)}
});

/* ── AI MODEL UI ── */
function renderModels(){
  $("modelGrid").innerHTML=MODELS.map(m=>{
    const hasKey=m.free||(cfg.keys&&cfg.keys[m.p]);
    return`<button class="mc${cfg.aiModel===m.id?' on':''}" data-mid="${m.id}"><b>${m.name}</b><small>${m.desc}</small>${!hasKey?'<span class="lck">🔑</span>':''}</button>`;
  }).join('');
  document.querySelectorAll('[data-mid]').forEach(b=>b.addEventListener('click',()=>{cfg.aiModel=b.dataset.mid;sv('c',cfg);renderModels();toast('Model: '+MODELS.find(m=>m.id===b.dataset.mid)?.name)}));
}

/* ── AI CHAT ── */
const AI_SYS=`You are iCrack AI — the intelligent assistant for iCrack Vie Network Control.
You help with: code (any language), networking, Linux/Windows/Mac commands, debugging, system administration, and general support.
You ALSO support these exclusive slash-commands (handled client-side, not by you):
/help /devices /ping /adddev /status /whoami /clear /logout
For regular messages: be helpful, concise, and technical. Support code blocks with triple backticks.
When helping with code: explain what it does, show the complete solution, mention edge cases.`;

const TERM_SYS=`You are iCrack Terminal AI — a command-line expert.
Given a task, generate terminal commands the user can run.
Format EXACTLY as:
PLATFORM: [Bash/Linux/macOS | PowerShell/Windows | Cross-platform]
COMMANDS:
\`\`\`bash
# Step 1: description
command-here

# Step 2: description
command-here
\`\`\`
EXPLANATION: Brief explanation of what this accomplishes
REQUIREMENTS: Tools/permissions needed (if any)
WARNING: Only include if genuinely dangerous

Be precise, practical, and security-conscious.`;

function mdToHTML(text){
  const escaped=esc(text);
  return escaped
    .replace(/\`\`\`([\w]*)\n([\s\S]*?)\`\`\`/g,'<pre><code>$2</code></pre>')
    .replace(/\`([^\`\n]+)\`/g,'<code>$1</code>')
    .replace(/\*\*(.*?)\*\*/g,'<b>$1</b>')
    .replace(/^[-•] (.+)/gm,'<span style="display:block;margin:2px 0 2px 12px">• $1</span>')
    .replace(/\n/g,'<br>');
}

function addMsg(role,content){
  const win=$("chatMsgs");
  const div=document.createElement('div');
  if(role==='sys'){div.className='msg sys';div.innerHTML=`<div class="msg-bbl">${esc(content)}</div>`}
  else{div.className='msg '+role;const av=role==='ai'?'AI':(me?me.username[0].toUpperCase():'?');div.innerHTML=`<div class="msg-av">${esc(av)}</div><div class="msg-bbl">${role==='ai'?mdToHTML(content):esc(content)}</div>`}
  win.appendChild(div);win.scrollTop=win.scrollHeight;
  if(role!=='sys')chatHistory.push({role:role==='ai'?'assistant':'user',content});
  return div;
}
function addTyping(){const win=$("chatMsgs");const div=document.createElement('div');div.id='typing';div.className='msg ai';div.innerHTML='<div class="msg-av">AI</div><div class="msg-bbl"><div class="tdots"><span></span><span></span><span></span></div></div>';win.appendChild(div);win.scrollTop=win.scrollHeight;return div}

async function callAnthropic(model,messages,sys){
  const key=cfg.keys?.anthropic||'';
  const headers={'Content-Type':'application/json'};
  if(key){headers['x-api-key']=key;headers['anthropic-version']='2023-06-01'}
  const r=await fetch('https://api.anthropic.com/v1/messages',{method:'POST',headers,body:JSON.stringify({model,max_tokens:2000,system:sys,messages:messages.slice(-14)})});
  const d=await r.json();if(d.error)throw new Error(d.error.message);
  return d.content.map(c=>c.text||'').join('');
}
async function callOpenAI(model,messages,sys){
  const key=cfg.keys?.openai;if(!key)throw new Error('OpenAI key required — add it in AI section');
  const r=await fetch('https://api.openai.com/v1/chat/completions',{method:'POST',headers:{'Content-Type':'application/json','Authorization':'Bearer '+key},body:JSON.stringify({model,max_tokens:2000,messages:[{role:'system',content:sys},...messages.slice(-14)]})});
  const d=await r.json();if(d.error)throw new Error(d.error.message);return d.choices[0].message.content;
}
async function callDeepSeek(model,messages,sys){
  const key=cfg.keys?.deepseek;if(!key)throw new Error('DeepSeek key required — add it in AI section');
  const r=await fetch('https://api.deepseek.com/chat/completions',{method:'POST',headers:{'Content-Type':'application/json','Authorization':'Bearer '+key},body:JSON.stringify({model:'deepseek-coder',max_tokens:2000,messages:[{role:'system',content:sys},...messages.slice(-14)]})});
  const d=await r.json();return d.choices[0].message.content;
}
async function callGoogle(model,messages,sys){
  const key=cfg.keys?.google;if(!key)throw new Error('Google AI key required — add it in AI section');
  const msgs=messages.map(m=>({role:m.role==='assistant'?'model':'user',parts:[{text:m.content}]}));
  const r=await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({system_instruction:{parts:[{text:sys}]},contents:msgs,generationConfig:{maxOutputTokens:2000}})});
  const d=await r.json();return d.candidates[0].content.parts[0].text;
}
async function callModel(messages,sys){
  const m=cfg.aiModel,model=MODELS.find(x=>x.id===m);
  if(!model)throw new Error('Model not found');
  if(model.p==='anthropic')return callAnthropic(m,messages,sys);
  if(model.p==='openai')return callOpenAI(m,messages,sys);
  if(model.p==='deepseek')return callDeepSeek(m,messages,sys);
  if(model.p==='google')return callGoogle(m,messages,sys);
  throw new Error('Unknown provider');
}

async function sendChat(){
  const inp=$("chatIn"),text=inp.value.trim();if(!text)return;inp.value='';
  if(text.startsWith('/')){
    addMsg('user',text);
    const parts=text.slice(1).split(' '),cmd=parts[0].toLowerCase(),args=parts.slice(1);
    switch(cmd){
      case'help':addMsg('ai','**iCrack Commands**\n\n• `/devices` — list saved devices\n• `/ping <ip> [port]` — check reachability\n• `/adddev <name> <ip> [port]` — add device\n• `/status` — system status\n• `/whoami` — current user\n• `/clear` — clear chat\n• `/logout` — sign out');break;
      case'devices':addMsg('ai',devs.length?`**Devices (${devs.length})**\n\n`+devs.map(d=>`• **${d.name}** — \`${d.ip}:${d.port}\``).join('\n'):'No devices. Use `/adddev <name> <ip>`');break;
      case'ping':{const[ip,port]=args;if(!ip){addMsg('ai','Usage: `/ping <ip> [port]`');break}addMsg('ai',`Checking \`${ip}:${port||80}\`...`);try{const t0=Date.now();await fetch('http://'+ip+':'+(port||80),{method:'HEAD',mode:'no-cors',signal:AbortSignal.timeout(5000)});addMsg('ai',`✓ **${ip}:${port||80}** responded (~${Date.now()-t0}ms)`);addLog('AI ping OK: '+ip)}catch(e){const to=e.name==='TimeoutError'||e.name==='AbortError';addMsg('ai',`✗ **${to?'Timeout':'Unreachable'}** — \`${ip}:${port||80}\``);addLog('AI ping fail: '+ip)}break}
      case'adddev':{const[name,ip,port]=args;if(!name||!ip){addMsg('ai','Usage: `/adddev <name> <ip> [port]`');break}if(!isIP4(ip)){addMsg('ai','✗ Invalid IPv4');break}devs.unshift({id:Date.now().toString(36),name,ip,port:port||'80',note:'via AI',added:Date.now()});sv('d',devs);renderDevs();addMsg('ai',`✓ **${name}** added \`${ip}:${port||80}\``);addLog('AI add: '+name);break}
      case'status':addMsg('ai',`**System Status**\n\n• Devices: **${devs.length}**\n• Server: **${srv.url||'Not set'}**\n• Events: **${logs.length}**\n• User: **${me?me.username+' ('+me.role+')':'Guest'}**\n• AI: **${MODELS.find(m=>m.id===cfg.aiModel)?.name}**`);break;
      case'whoami':addMsg('ai',me?`**${me.username}** · ${me.role}\n\`${me.email}\``:'Not signed in. Click the avatar (top right).');break;
      case'clear':chatHistory=[];$("chatMsgs").innerHTML='<div class="cwm"><div class="cwm-ic"><svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><circle cx="16" cy="16" r="13" stroke="#22c55e" stroke-width="1.5" fill="none" opacity=".5"/><text x="16" y="21" text-anchor="middle" fill="#22c55e" font-family="Space Grotesk" font-weight="700" font-size="10">iC</text></svg></div><b>iCrack AI</b><p>Chat cleared.</p></div>';break;
      case'logout':doLogout();addMsg('ai','Signed out.');break;
      default:addMsg('ai',`Unknown: \`/${cmd}\` — try \`/help\``);
    }
    return;
  }
  addMsg('user',text);const typing=addTyping();
  const ctx=`User: ${me?me.username+' ('+me.role+')':'Guest'} | Devices: ${devs.length} | Server: ${srv.url||'none'}`;
  try{const reply=await callModel([...chatHistory.slice(-14),{role:'user',content:text}],AI_SYS+'\n\nContext: '+ctx);typing.remove();addMsg('ai',reply)}
  catch(err){typing.remove();addMsg('ai','⚠ '+err.message+'\n\nIn preview, no key needed (proxied). For GitHub Pages, add your API key in the **AI** section.')}
}
$("chatSend").addEventListener('click',sendChat);
$("chatIn").addEventListener('keydown',e=>{if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();sendChat()}});

/* ── TERMINAL ── */
function addTermLine(cls,text){const tb=$("termBody");const span=document.createElement('div');span.className=cls;span.textContent=text;tb.appendChild(span);tb.scrollTop=tb.scrollHeight}
function addTermHTML(html){const tb=$("termBody");const div=document.createElement('div');div.innerHTML=html;tb.appendChild(div);tb.scrollTop=tb.scrollHeight}

async function sendTerminal(){
  const inp=$("termIn"),text=inp.value.trim();if(!text)return;inp.value='';
  const tb=$("termBody");tb.innerHTML='';
  addTermLine('tco','# Task: '+text);addTermLine('tco','# Generating commands...');
  const hr=document.createElement('hr');hr.className='term-sep';tb.appendChild(hr);
  try{const reply=await callModel([{role:'user',content:text}],TERM_SYS);
    // Parse and display the response
    const lines=reply.split('\n');
    lines.forEach(line=>{
      if(line.startsWith('PLATFORM:')){addTermLine('tco',line)}
      else if(line.startsWith('COMMANDS:')){addTermLine('tco','--- Commands ---')}
      else if(line.startsWith('```')){/* skip code fences */}
      else if(line.startsWith('#')){addTermLine('tco',line)}
      else if(line.startsWith('EXPLANATION:')||line.startsWith('REQUIREMENTS:')||line.startsWith('WARNING:')){addTermLine('tco',line)}
      else if(line.trim()&&!line.startsWith('```')){addTermLine('tc',line)}
    });
    const sep2=document.createElement('hr');sep2.className='term-sep';tb.appendChild(sep2);
    addTermLine('tco','# Done. Copy commands above and run on your machine.');
    addLog('Terminal: '+text.slice(0,50));
  }catch(err){addTermLine('te','Error: '+err.message)}
}
$("termSend").addEventListener('click',sendTerminal);
$("termIn").addEventListener('keydown',e=>{if(e.key==='Enter')sendTerminal()});

// Chat/Terminal tabs
$("tabChat").addEventListener('click',()=>{aiMode='chat';$("tabChat").classList.add('on');$("tabTerm").classList.remove('on');$("chatView").style.display='';$("termView").style.display='none'});
$("tabTerm").addEventListener('click',()=>{aiMode='term';$("tabTerm").classList.add('on');$("tabChat").classList.remove('on');$("chatView").style.display='none';$("termView").style.display=''});

// API keys
window.saveKey=function(provider){
  const input=$('k'+provider.charAt(0).toUpperCase()+provider.slice(1));
  if(!cfg.keys)cfg.keys={};cfg.keys[provider]=input.value.trim();
  sv('c',cfg);renderModels();toast('✓ '+provider+' key saved!');addLog('API key: '+provider);
};

/* ── LOGS ── */
function renderLogs(){$("logList").innerHTML=logs.length?logs.map(l=>`<article class="lrow"><time>${esc(l.t)}</time><p>${esc(l.m)}</p></article>`).join(''):'<div class="empty">No events.</div>'}
$("clrBtn").addEventListener('click',async()=>{const ok=await confirm2('Clear','Delete all '+logs.length+' events?');if(!ok)return;logs=[];sv('l',logs);renderLogs();updateStats();toast('✓ Cleared')});

/* ── ADMIN ── */
function renderAdminUsers(){if(!me||me.role!=='admin')return;$("adminUsers").innerHTML=users.map(u=>`<div class="user-row"><div class="uav">${esc(u.username[0].toUpperCase())}</div><div class="uinfo"><b>${esc(u.username)}</b><small>${esc(u.email)}</small></div><span class="rpill ${u.role==='admin'?'admin':''}">${esc(u.role)}</span></div>`).join('')||'<div class="empty">No users.</div>'}
$("resetBtn").addEventListener('click',async()=>{const ok=await confirm2('⚠ Reset All','Delete ALL devices, logs, and non-admin accounts? Cannot undo!');if(!ok)return;devs=[];logs=[];users=users.filter(u=>u.id==='admin');sv('d',devs);sv('l',logs);sv('u',users);renderDevs();renderLogs();updateStats();renderAdminUsers();toast('✓ Reset done');addLog('Admin: reset')});

/* ── SETTINGS ── */
$("openSet").addEventListener('click',()=>{goPage('settings');closeAuth()});
$("saveAccBtn").addEventListener('click',()=>{
  const newName=$("setName").value.trim();
  if(me&&newName&&newName!==me.username){if(users.find(u=>u.username===newName&&u.id!==me.id)){toast('⚠ Username taken');return}me.username=newName;session.username=newName;users=users.map(u=>u.id===me.id?me:u);sv('u',users);sv('ss',session);updateAuthUI();updateStats()}
  toast('✓ Saved!');addLog('Settings updated');
});

/* ── WELCOME ── */
$("wcStart").addEventListener('click',()=>{$("wcBg").classList.remove('show');localStorage.setItem('icv_wc','1')});
function checkWelcome(){if(!localStorage.getItem('icv_wc')){setTimeout(()=>$("wcBg").classList.add('show'),400)}}

/* ── INIT ── */
initAuth();
applyTheme();
renderModels();
fillSrv();
renderDevs();
renderLogs();
updateStats();
checkWelcome();
// Fill saved keys
if(cfg.keys?.anthropic)$("kAnthropic").value=cfg.keys.anthropic;
if(cfg.keys?.openai)$("kOpenai").value=cfg.keys.openai;
if(cfg.keys?.deepseek)$("kDeepseek").value=cfg.keys.deepseek;
if(cfg.keys?.google)$("kGoogle").value=cfg.keys.google;
addLog('iCrack Vie v3 started'+(me?' — '+me.username:''));

})();