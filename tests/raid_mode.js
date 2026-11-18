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
await pg.click('#runPanel [data-go=cfg]');await pg.waitForTimeout(200);await shot('cfg');
R.cfg=await pg.evaluate(()=>{const ins=[...document.querySelectorAll('.rcfg input')];for(const el of ins){el.value=el.dataset.k==='sweep'?'100':'0';el.dispatchEvent(new Event('input'));}return document.querySelector('[data-v=sweep]').textContent;});
await pg.keyboard.press('Escape');R.cfgBack=await pg.evaluate(()=>__bd.RAID.phase);
await pg.keyboard.press('Enter');await pg.evaluate(()=>__bd.hold(true));
R.weights=await pg.evaluate(()=>{const B=__bd,R=B.RAID;B.adv(1.7);const seen={};for(let i=0;i<300;i++){B.p.invT=9;B.p.hp=100;if(R.pat)seen[R.pat]=(seen[R.pat]||0)+1;B.adv(.1);}return Object.keys(seen).join();});
await pg.evaluate(()=>__bd.resetW());
R.begin=await pg.evaluate(()=>{const B=__bd;B.adv(1.7);return{ph:B.RAID.phase,lo:B.loadout.join(),hp:B.RAID.hp};});
// stage a pattern: player stands in range, boss frozen until we start it
const stage=(k,dist,t)=>pg.evaluate(([k,dist,t])=>{const B=__bd,R=B.RAID;R.grog=0;R.stag=0;R.shots.length=0;R.wt=0;document.body.classList.remove('wt');
  B.p.hp=100;B.p.dead=false;B.p.hurtT=0;B.p.invT=0;B.p.vx=0;B.p.x=0;B.p.f=1;B.dummy.x=dist;B.dummy.state='stand';B.dummy.air=false;B.dummy.y=0;R.ai='idle';R.cd=99;
  B.adv(.3);B.startPat(k);B.adv(t);return{ai:R.ai,pat:R.pat};},[k,dist,t]);
const pats={tri:[150,.32],lunge:[330,.45],leap:[330,.3],wave:[500,.4],iai:[300,.7],spin:[150,.6],sweep:[250,.85],gwave:[300,.7]};
for(const k in pats){await stage(k,...pats[k]);await shot('tele_'+k);}
// strikes in motion
await stage('lunge',330,.62);await shot('strike_lunge');
await stage('leap',330,.75);await shot('strike_leap');
await stage('wave',520,.75);await shot('strike_wave');
// 0a. smoke + cue on a red pattern
R.redCue=await pg.evaluate(()=>{const B=__bd,R=B.RAID;R.ai='idle';R.pat=null;R.cd=99;B.p.x=0;B.p.invT=9;B.dummy.x=330;B.startPat('lunge');B.adv(.2);const sm=R.smoke.length;B.adv(.18);return{smoke:sm,cued:R.cued};});
// 0. blink cue: glint fires .24 s before the slash
R.cue=await pg.evaluate(()=>{const B=__bd,R=B.RAID;R.ai='idle';R.pat=null;R.cd=99;B.p.x=0;B.p.invT=9;B.dummy.x=300;B.startPat('sweep');B.adv(.8);const c0=R.cued;B.adv(.04);return{before:c0,after:R.cued,guide:!!R.guide};});
await pg.evaluate(()=>__bd.adv(.03));await shot('cue');
// 1. armor: hitting the armored boss bounces the blade and staggers the player, no damage
R.armor=await pg.evaluate(()=>{const B=__bd,R=B.RAID;R.ai='idle';R.pat=null;R.cd=99;R.stag=0;R.shots.length=0;B.p.hurtT=0;B.p.invT=9;B.p.x=B.dummy.x-70;B.p.f=1;const h0=R.hp,b0=R.brk;B.press('attack');B.adv(.2);return{dmg:Math.round(h0-R.hp),hurt:B.p.hurtT>0,act:!!B.p.act};});
await pg.evaluate(()=>__bd.adv(.02));await shot('bounce');
// 1b. opening: after a big attack's last swing, hits land at 50% and wear the break gauge
R.open=await pg.evaluate(()=>{const B=__bd,R=B.RAID;B.adv(.6);B.p.hurtT=0;B.p.invT=9;B.p.x=B.dummy.x-140;R.cd=99;B.startPat('lunge');B.adv(.8);B.p.x=B.dummy.x-70;B.p.f=1;const ai=R.ai,h0=R.hp,b0=R.brk;B.press('attack');B.adv(.25);return{ai,dmg:Math.round(h0-R.hp),brk:+(b0-R.brk).toFixed(1)};});
await shot('open');
// 2. counter: only a dash attack during a blue wind-up counts; a plain hit bounces
R.counterPlain=await pg.evaluate(()=>{const B=__bd,R=B.RAID;B.adv(1.5);R.ai='idle';R.pat=null;R.cd=99;B.p.hurtT=0;B.p.x=B.dummy.x-80;B.p.f=1;B.startPat('spin');B.adv(.2);B.press('attack');B.adv(.2);return{grog:R.grog,hurt:B.p.hurtT>0};});
R.counter=await pg.evaluate(()=>{const B=__bd,R=B.RAID;B.adv(1.5);R.ai='idle';R.pat=null;R.cd=99;B.p.hurtT=0;B.p.invT=9;B.p.x=B.dummy.x-110;B.p.f=1;B.startPat('iai');B.adv(.3);B.startAct('DA');B.adv(.12);const early=R.grog;B.adv(.6);R.ai='idle';R.pat=null;B.p.hurtT=0;B.p.x=B.dummy.x-110;B.p.f=1;B.startPat('iai');B.adv(.68);B.startAct('DA');B.adv(.14);return{early,grog:R.grog,gk:R.gk,air:B.dummy.air,gT:+R.gT.toFixed(1)};});
await pg.evaluate(()=>__bd.adv(.1));await shot('counter');
R.counterEnd=await pg.evaluate(()=>{const B=__bd,R=B.RAID;for(let i=0;i<60&&R.grog;i++)B.adv(.1);return{grog:R.grog,state:B.dummy.state};});
// 3. gold wave: back-jump, huge wave, V on contact = no damage; miss = big damage; then a long kneeling opening
await pg.evaluate(()=>{const B=__bd,R=B.RAID;R.cd=99;R.ai='idle';R.pat=null;R.grog=0;R.bind=false;R.lock=false;B.adv(.6);B.p.x=B.dummy.x-320;B.p.f=1;B.p.invT=0;B.p.hurtT=0;B.p.hp=100;B.startPat('gwave');B.adv(.6);});await shot('gwave_wind');
await pg.evaluate(()=>__bd.adv(.5));await shot('gwave_fire');
R.gwave=await pg.evaluate(()=>{const B=__bd,R=B.RAID,o={};let vd=0;const V=()=>window.dispatchEvent(new KeyboardEvent('keydown',{code:'KeyV',key:'v'}));
  for(let i=0;i<200;i++){const s=R.shots.find(q=>q.kind==='gwave');if(s&&!vd&&Math.abs(s.x-B.p.x)<Math.abs(s.vx)*.12+34){V();vd=1;}B.adv(.02);if(R.ai==='rec'&&!o.rec){o.rec=1;o.dist=Math.round(Math.abs(B.dummy.x-B.p.x));}if(vd&&!R.shots.some(q=>q.kind==='gwave'))break;}
  return{hp:B.p.hp,guarded:vd,ai:R.ai,open:R.ai==='rec',dist:o.dist};});
await pg.evaluate(()=>__bd.adv(.04));await shot('guard');
R.gwaveOpen=await pg.evaluate(()=>{const B=__bd,R=B.RAID;let t=0;while(R.ai==='rec'&&t<4){B.adv(.1);t+=.1;}return{openFor:+t.toFixed(1)};});
R.gwaveMiss=await pg.evaluate(()=>{const B=__bd,R=B.RAID;R.ai='idle';R.pat=null;R.cd=99;B.p.hp=100;B.p.invT=0;B.p.hurtT=0;B.p.x=B.dummy.x-320;B.startPat('gwave');for(let i=0;i<60&&R.ai!=='rec';i++)B.adv(.05);B.adv(.6);return{hp:B.p.hp};});
await pg.evaluate(()=>{const B=__bd,R=B.RAID;R.ai='idle';R.pat=null;R.cd=99;B.p.hp=100;B.p.hurtT=0;B.p.x=B.dummy.x-200;B.startPat('gwave');for(let i=0;i<60&&R.ai!=='rec';i++)B.adv(.05);B.adv(.6);});await shot('kneel');
R.dashThrough=await pg.evaluate(()=>{const B=__bd,R=B.RAID;R.ai='idle';R.pat=null;R.cd=99;B.p.hp=100;B.p.invT=0;B.p.hurtT=0;B.p.sta=100;B.p.x=B.dummy.x-320;B.startPat('gwave');let d=0;
  for(let i=0;i<200;i++){const s=R.shots.find(q=>q.kind==='gwave');if(s&&!d&&Math.abs(s.x-B.p.x)<60){B.startAct('DASH');d=1;}B.adv(.02);if(d&&!R.shots.some(q=>q.kind==='gwave'))break;}return{hp:B.p.hp};});
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
// 6. big gimmicks
const gimStart=(r)=>pg.evaluate((r)=>{const B=__bd,R=B.RAID;R.wt=0;R.wtM=null;R.grog=0;R.gim=null;R.gdone={};R.ai='idle';R.pat=null;R.cd=99;R.bind=false;R.lock=false;R.hp=R.max*r;B.p.hp=100;B.p.dead=false;B.p.hurtT=0;B.p.invT=0;B.p.x=-150;B.dummy.x=150;
  if(r<.15){R.gdone.clone=1;R.gdone.seal=1;}else if(r<.35)R.gdone.clone=1;B.adv(.05);return R.gim&&R.gim.k;},r);
R.gClone=await gimStart(.59);
await pg.evaluate(()=>__bd.adv(1));await shot('gim_clone');
R.cloneHunt=await pg.evaluate(()=>{const B=__bd,R=B.RAID,G=R.gim,o={ph:G.ph,clones:G.cl.length};const acts=['A1','A4','S_RISE'];
  for(const n of acts){B.p.x=B.dummy.x-70;B.p.f=1;B.p.hurtT=0;B.startAct(n);B.adv(.35);}
  o.after=R.gim?R.gim.ph:'done';o.grog=R.grog;o.gk=R.gk;return o;});
R.cloneFail=await pg.evaluate(()=>{const B=__bd,R=B.RAID;for(let i=0;i<80&&R.grog;i++)B.adv(.1);R.gdone={};R.hp=R.max*.59;R.ai='idle';R.pat=null;B.p.hp=100;B.adv(.05);for(let i=0;i<140&&R.gim;i++)B.adv(.1);return{hp:B.p.hp,gim:!!R.gim,grog:R.grog};});
R.gSeal=await gimStart(.29);
await pg.evaluate(()=>__bd.adv(1.5));await shot('gim_seal');
R.seal=await pg.evaluate(()=>{const B=__bd,R=B.RAID,G=R.gim,o={ph:G.ph,yo:Math.round(R.yo)};const t=G.tal[0];
  B.p.x=t.x-55;B.p.f=1;B.p.y=t.y+70;B.p.vy=-200;B.p.ground=false;B.startAct('AA1');B.adv(.15);o.first=t.alive?'alive':'broken';for(const q of G.tal)q.alive=0;B.adv(.05);o.ph2=G.ph;
  B.p.x=-100;B.p.y=0;B.p.ground=true;B.p.vy=0;B.adv(2);const V=()=>window.dispatchEvent(new KeyboardEvent('keydown',{code:'KeyV',key:'v'}));let n=0;
  for(let i=0;i<300&&R.gim;i++){if(G.ph==='guard'&&G.gt<.1&&G.gt>0&&B.p.guardCD<=0){V();n++;}B.adv(.02);}
  o.v=n;o.hp=B.p.hp;o.grog=R.grog;return o;});
await pg.evaluate(()=>{const B=__bd,R=B.RAID;for(let i=0;i<80&&R.grog;i++)B.adv(.1);});
R.gFlash=await gimStart(.09);
await pg.evaluate(()=>__bd.adv(1.1));await shot('gim_flash');
R.flash=await pg.evaluate(()=>{const B=__bd,R=B.RAID,V=()=>window.dispatchEvent(new KeyboardEvent('keydown',{code:'KeyV',key:'v'}));const log=[];let lastI=-9,did=0,round=0;
  for(let i=0;i<900&&R.gim;i++){const G=R.gim;B.p.hp=Math.max(B.p.hp,50);B.p.sta=100;
    if(G.ph==='dash'&&G.st==='wind'){if(G.i!==lastI||G.round!==round){lastI=G.i;round=G.round;did=0;}const col=G.seq[G.i],rem=.72-G.t;
      if(!did&&col==='gray'&&rem<.03){B.p.hurtT=0;B.startAct('DASH');did=1;log.push('d');}
      if(!did&&col==='gold'&&rem<.1){B.p.guardCD=0;B.p.hurtT=0;V();did=1;log.push('v');}
      if(!did&&col==='blue'&&G.cued){B.p.hurtT=0;B.p.x=B.dummy.x-Math.sign(B.dummy.x-B.p.x||1)*90;B.p.f=Math.sign(B.dummy.x-B.p.x)||1;B.startAct('DA');did=1;log.push('c');}}
    B.adv(.02);}
  return{log:log.join(''),gim:!!R.gim,grog:R.grog,awakeAfter:R.awakeAfter};});
R.awake=await pg.evaluate(()=>{const B=__bd,R=B.RAID;for(let i=0;i<80&&R.grog;i++)B.adv(.1);return{spd:R.spd,awake:R.awake};});
await pg.evaluate(()=>__bd.adv(.3));await shot('awake');
// dash takes damage but keeps going
R.dashHit=await pg.evaluate(()=>{const B=__bd,R=B.RAID;R.spd=1;R.awake=0;B.p.hp=100;B.p.invT=0;B.p.hurtT=0;const ok=B.p.act;B.startAct('DASH');B.adv(.03);const r=B.raidHurt(10,1,300,false,'red');return{r,hp:B.p.hp,still:B.p.act&&B.p.act.def.name,hurt:B.p.hurtT>0};});
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
