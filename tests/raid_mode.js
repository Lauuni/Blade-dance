// 레이드 모드(1차): 기술 고르기 → 보스 흑월. 패턴 8개 예고, 카운터·저스트 회피·저스트 가드·무력화 그로기, 버팀, 격파·쓰러짐, 시작 화면 복귀. 스크린샷 /tmp/raid_*.png
const {chromium}=require('playwright');(async()=>{const b=await chromium.launch();const pg=await b.newPage({viewport:{width:1280,height:720}});
let errs=0;pg.on('pageerror',e=>{if(e.message){errs++;console.log('ERR',e.message,(e.stack||'').split('\n')[1]);}});pg.on('console',m=>{if(m.type()==='error'){errs++;console.log('CONSOLE',m.text().slice(0,200));}});
await pg.goto('file://'+process.cwd()+'/index.html');await pg.evaluate(()=>{localStorage.clear();localStorage.setItem('bd_loadout',JSON.stringify(['gale','rise','thunder']));localStorage.setItem('bd_map','field');});await pg.reload();await pg.waitForTimeout(400);
const shot=n=>pg.screenshot({path:'/tmp/raid_'+n+'.png'});const R={};
R.titleDefault=await pg.evaluate(()=>document.querySelector('#modes .sel').dataset.mode);
await pg.keyboard.press('Enter');await pg.waitForTimeout(450);await shot('pick');
// pick: remove 낙뢰추 (slot 3), add 일섬
R.pick=await pg.evaluate(()=>{const B=__bd;return{sel:B.RAID.sel.join(),map:B.map};});
await pg.keyboard.press('ArrowRight');await pg.keyboard.press('ArrowRight');await pg.keyboard.press('Space');await pg.keyboard.press('ArrowRight');await pg.keyboard.press('ArrowRight');await pg.keyboard.press('Space');
R.pick2=await pg.evaluate(()=>__bd.RAID.sel.join());
await pg.keyboard.press('Enter');await pg.evaluate(()=>__bd.hold(true));
R.begin=await pg.evaluate(()=>{const B=__bd;B.adv(1.7);return{ph:B.RAID.phase,lo:B.loadout.join(),hp:B.RAID.hp};});
// stage a pattern: player stands in range, boss frozen until we start it
const stage=(k,dist,t)=>pg.evaluate(([k,dist,t])=>{const B=__bd,R=B.RAID;R.grog=0;R.stag=0;R.shots.length=0;R.wt=0;document.body.classList.remove('wt');
  B.p.hp=100;B.p.dead=false;B.p.hurtT=0;B.p.invT=0;B.p.vx=0;B.p.x=0;B.p.f=1;B.dummy.x=dist;B.dummy.state='stand';B.dummy.air=false;B.dummy.y=0;R.ai='idle';R.cd=99;
  B.adv(.3);B.startPat(k);B.adv(t);return{ai:R.ai,pat:R.pat};},[k,dist,t]);
const pats={tri:[150,.32],lunge:[330,.45],leap:[330,.3],wave:[500,.4],iai:[300,.7],spin:[150,.6],sweep:[180,.85],cleave:[160,.7]};
for(const k in pats){await stage(k,...pats[k]);await shot('tele_'+k);}
// strikes in motion
await stage('lunge',330,.62);await shot('strike_lunge');
await stage('leap',330,.75);await shot('strike_leap');
await stage('wave',520,.75);await shot('strike_wave');
// 1. armor: hitting the armored boss bounces the blade and staggers the player, no damage
R.armor=await pg.evaluate(()=>{const B=__bd,R=B.RAID;R.ai='idle';R.pat=null;R.cd=99;R.stag=0;R.shots.length=0;B.p.hurtT=0;B.p.invT=9;B.p.x=B.dummy.x-70;B.p.f=1;const h0=R.hp,b0=R.brk;B.press('attack');B.adv(.2);return{dmg:Math.round(h0-R.hp),hurt:B.p.hurtT>0,act:!!B.p.act};});
await pg.evaluate(()=>__bd.adv(.02));await shot('bounce');
// 1b. opening: after a big attack's last swing, hits land at 50% and wear the break gauge
R.open=await pg.evaluate(()=>{const B=__bd,R=B.RAID;B.adv(.6);B.p.hurtT=0;B.p.invT=9;B.p.x=B.dummy.x-140;R.cd=99;B.startPat('lunge');B.adv(.8);B.p.x=B.dummy.x-70;B.p.f=1;const ai=R.ai,h0=R.hp,b0=R.brk;B.press('attack');B.adv(.25);return{ai,dmg:Math.round(h0-R.hp),brk:+(b0-R.brk).toFixed(1)};});
await shot('open');
// 2. counter: only a dash attack during a blue wind-up counts; a plain hit bounces
R.counterPlain=await pg.evaluate(()=>{const B=__bd,R=B.RAID;B.adv(1.5);R.ai='idle';R.pat=null;R.cd=99;B.p.hurtT=0;B.p.x=B.dummy.x-80;B.p.f=1;B.startPat('spin');B.adv(.2);B.press('attack');B.adv(.2);return{grog:R.grog,hurt:B.p.hurtT>0};});
R.counter=await pg.evaluate(()=>{const B=__bd,R=B.RAID;B.adv(1.5);R.ai='idle';R.pat=null;R.cd=99;B.p.hurtT=0;B.p.invT=9;B.p.x=B.dummy.x-110;B.p.f=1;B.startPat('iai');B.adv(.3);B.startAct('DA');B.adv(.2);return{grog:R.grog,gk:R.gk,air:B.dummy.air,fall:R.fall,gT:+R.gT.toFixed(1)};});
await pg.evaluate(()=>__bd.adv(.1));await shot('counter');
R.counterEnd=await pg.evaluate(()=>{const B=__bd,R=B.RAID;for(let i=0;i<60&&R.grog;i++)B.adv(.1);return{grog:R.grog,state:B.dummy.state};});
// 3. bind + just guard x3: the boss roots you, steps in, swings three times; V on each ring
R.bind=await pg.evaluate(()=>{const B=__bd,R=B.RAID;R.cd=99;R.ai='idle';R.pat=null;R.grog=0;B.adv(.6);B.p.x=B.dummy.x-300;B.p.f=1;B.p.invT=0;B.p.hurtT=0;B.p.hp=100;B.startPat('cleave');B.adv(.95);
  return{bind:R.bind,lock:R.lock,dist:Math.round(Math.abs(B.dummy.x-B.p.x)),x0:Math.round(B.p.x)};});
await pg.evaluate(()=>__bd.adv(.4));await shot('guard_ring');
await pg.evaluate(()=>__bd.adv(.1));await shot('guard_window');
R.guard=await pg.evaluate(()=>{const B=__bd,R=B.RAID,b0=R.brk,o=[],vd={};const V=()=>window.dispatchEvent(new KeyboardEvent('keydown',{code:'KeyV',key:'v'}));
  for(let i=0;i<300&&R.pat&&!R.grog;i++){if(R.ai==='wind'&&R.mi>0&&!vd[R.mi]&&R.t>=[0,.6,.5,.55][R.mi]-.1){V();vd[R.mi]=1;}B.adv(.02);if(vd[R.mi]&&o[o.length-1]!==R.gs)o.push(R.gs);}
  return{gs:o.join(','),hp:B.p.hp,grog:R.grog,gk:R.gk,bind:R.bind,lock:R.lock,brk:+(b0-R.brk).toFixed(1)};});
await pg.evaluate(()=>__bd.adv(.03));await shot('guard');
R.bindFail=await pg.evaluate(()=>{const B=__bd,R=B.RAID;for(let i=0;i<40&&R.grog;i++)B.adv(.1);R.cd=99;R.ai='idle';R.pat=null;B.p.hp=100;B.p.invT=0;B.p.hurtT=0;B.p.guardCD=0;B.p.x=B.dummy.x-200;B.startPat('cleave');for(let i=0;i<40&&R.pat;i++)B.adv(.1);return{hp:B.p.hp,bind:R.bind,lock:R.lock};});
// 4. just evade: dash in the first 0.12 s against the gray sweep -> slow time, one attack, crits
R.justLate=await pg.evaluate(()=>{const B=__bd,R=B.RAID;B.adv(1.6);R.ai='idle';R.pat=null;B.p.x=B.dummy.x-250;B.p.f=1;B.p.invT=0;B.p.hp=100;B.p.hurtT=0;B.p.sta=100;B.startPat('sweep');B.adv(.86);B.startAct('DASH');B.adv(.17);return{wt:R.wt,hp:B.p.hp};});
R.just=await pg.evaluate(()=>{const B=__bd,R=B.RAID;B.adv(2);R.ai='idle';R.pat=null;R.push=0;B.p.x=B.dummy.x-250;B.p.f=1;B.p.invT=0;B.p.hp=100;B.p.hurtT=0;B.p.sta=100;B.startPat('sweep');B.adv(.99);B.startAct('DASH');B.adv(.06);
  const m0=R.wtM,x0=B.p.x;B.adv(.5);const slowMove=Math.abs(B.p.x-x0);return{wtM:m0,hp:B.p.hp,slowMove:Math.round(slowMove)};});
await shot('just');
R.punish=await pg.evaluate(()=>{const B=__bd,R=B.RAID,h0=R.hp,b0=R.brk,gap=Math.round(Math.abs(B.dummy.x-B.p.x));B.press('attack');B.adv(.02);const snap=Math.round(Math.abs(B.dummy.x-B.p.x));const seq=[];for(let i=0;i<90&&R.wtM;i++){B.adv(.05);const n=B.p.act&&B.p.act.def.name;if(n&&seq[seq.length-1]!==n)seq.push(n);}
  return{gap,snap,seq:seq.join('>'),dmg:Math.round(h0-R.hp),crits:R.wtHits,ended:!R.wtM,push:Math.round(R.push),brk:+(b0-R.brk).toFixed(1)};});
await shot('punish');
// 5. break: empty the gauge in an opening -> long groggy at 200%
R.brk=await pg.evaluate(()=>{const B=__bd,R=B.RAID;B.adv(3);R.ai='idle';R.pat=null;R.cd=99;R.brk=.5;R.stag=1;R.push=0;R.bind=false;R.lock=false;B.p.hurtT=0;B.p.x=B.dummy.x-70;B.p.f=1;B.press('attack');B.adv(.2);return{grog:R.grog,gk:R.gk,gT:+R.gT.toFixed(1)};});
await pg.evaluate(()=>__bd.adv(.6));await shot('break');
R.brkCombo=await pg.evaluate(()=>{const B=__bd,R=B.RAID,h0=R.hp;let maxc=0;
  for(let i=0;i<120&&R.grog;i++){B.p.f=B.dummy.x>=B.p.x?1:-1;if(Math.abs(B.dummy.x-B.p.x)>120)B.p.x=B.dummy.x-B.p.f*70;B.p.sta=100;
    if(i%10===2)B.press('s1');else if(i%10===6)B.press('s0');else if(i%13===9)B.press('s2');else if(i%7===3)B.press('jump');else B.press('attack');B.adv(.1);maxc=Math.max(maxc,B.combo.n);}
  return{dmg:Math.round(h0-R.hp),maxCombo:maxc,grogAfter:R.grog,brkRefill:R.brk};});
await shot('after_break');
// 5b. stamina: dashes and skills spend it, it runs out
R.sta=await pg.evaluate(()=>{const B=__bd,R=B.RAID;R.ai='idle';R.pat=null;R.cd=99;B.p.sta=100;B.p.hurtT=0;let n=0;for(let i=0;i<6;i++){const a=B.p.sta;B.press('dash');B.adv(.3);if(B.p.sta<a)n++;}
  B.adv(4);const s0=B.p.sta;B.press('jump');B.adv(.15);const s1=B.p.sta;B.press('jump');B.adv(.15);const s2=B.p.sta;B.adv(1.5);
  B.cfgSet&&0;return{dashes:n,jump:Math.round(s0-s1),dj:Math.round(s1-s2)};});
// 7. a real unattended fight: boss AI on, bot attacks and dashes, checks no errors and the boss uses every pattern
R.soak=await pg.evaluate(()=>{const B=__bd,R=B.RAID;B.raidBegin();B.adv(1.7);const seen={};let hits=0;
  for(let i=0;i<1200&&!B.p.dead;i++){B.p.f=B.dummy.x>=B.p.x?1:-1;if(R.pat)seen[R.pat]=1;if(i%3===0)B.press('attack');if(i%37===0)B.press('dash');if(i%29===5)B.press('s0');B.p.hp=Math.max(B.p.hp,40);B.p.hurtT=Math.min(B.p.hurtT,.2);B.adv(.1);}
  return{seen:Object.keys(seen).sort().join(),hp:Math.round(R.hp),t:Math.round(R.time)};});
// 8. boss defeat and player death panels
R.win=await pg.evaluate(()=>{const B=__bd,R=B.RAID;B.p.hurtT=0;B.p.dead=false;R.bind=false;R.lock=false;R.pat=null;R.ai='idle';R.grog=1;R.gk='break';R.gT=5;R.hp=5;B.p.x=B.dummy.x-70;B.p.f=1;B.p.invT=9;B.press('attack');B.adv(.3);const dead=R.dead;for(let i=0;i<40;i++)B.adv(.1);return{dead,phase:R.phase,panel:document.getElementById('mRun').classList.contains('on')};});
await pg.waitForTimeout(450);await shot('win');
await pg.keyboard.press('Enter');R.again=await pg.evaluate(()=>{__bd.adv(1.7);return{ph:__bd.RAID.phase,hp:__bd.RAID.hp};});
R.lose=await pg.evaluate(()=>{const B=__bd;B.p.invT=0;B.p.hp=5;B.raidHurt(20,1,300,true,'red');const d=B.p.dead;for(let i=0;i<30;i++)B.adv(.1);return{dead:d,phase:B.RAID.phase};});
await pg.waitForTimeout(450);await shot('lose');
// 9. back to the title: practice loadout and map come back, nothing saved
R.title=await pg.evaluate(()=>{const B=__bd;B.toTitle();return{on:B.RAID.on,lo:B.loadout.join(),map:B.map,saved:localStorage.getItem('bd_loadout'),raid:document.body.classList.contains('raid')};});
console.log(JSON.stringify(R));
const m=await b.newPage({viewport:{width:740,height:360},hasTouch:true,isMobile:true});m.on('pageerror',e=>{if(e.message){errs++;console.log('ERR mobile',e.message);}});
await m.goto('file://'+process.cwd()+'/index.html');await m.waitForTimeout(300);await m.tap('#modes .mode[data-mode=raid]');await m.waitForTimeout(400);await m.screenshot({path:'/tmp/raid_m_pick.png'});
await m.tap('#runPanel .btn[data-go=go]');await m.waitForTimeout(2200);await m.screenshot({path:'/tmp/raid_m_fight.png'});
console.log('errors',errs);await b.close();})();
