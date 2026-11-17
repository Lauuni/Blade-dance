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
// 1. armor: hitting the boss does 25% damage, no launch, fills nothing but the break gauge
R.armor=await pg.evaluate(()=>{const B=__bd,R=B.RAID;R.ai='idle';R.pat=null;R.cd=99;B.p.x=B.dummy.x-70;B.p.f=1;const h0=R.hp,b0=R.brk;B.startAct('A4');B.adv(.5);return{dmg:Math.round(h0-R.hp),brk:+(b0-R.brk).toFixed(1),state:B.dummy.state,air:B.dummy.air};});
// 2. counter: hit during a blue wind-up -> short groggy, the hit itself launches
R.counter=await pg.evaluate(()=>{const B=__bd,R=B.RAID;B.adv(.5);R.ai='idle';B.p.x=B.dummy.x-80;B.p.f=1;B.startPat('spin');B.adv(.3);B.startAct('S_RISE');B.adv(.25);return{grog:R.grog,gk:R.gk,air:B.dummy.air};});
await pg.evaluate(()=>__bd.adv(.1));await shot('counter');
R.counterEnd=await pg.evaluate(()=>{const B=__bd,R=B.RAID;for(let i=0;i<60&&R.grog;i++)B.adv(.1);return{grog:R.grog,state:B.dummy.state};});
// 3. just guard: V right before the gold hit lands
R.guard=await pg.evaluate(()=>{const B=__bd,R=B.RAID;R.cd=99;B.adv(.6);B.p.x=B.dummy.x-120;B.p.f=1;B.p.invT=0;const b0=R.brk;B.startPat('cleave');B.adv(.88);
  window.dispatchEvent(new KeyboardEvent('keydown',{code:'KeyV',key:'v'}));B.adv(.12);return{hp:B.p.hp,brk:+(b0-R.brk).toFixed(1),stag:R.stag>0};});
await pg.evaluate(()=>__bd.adv(.03));await shot('guard');
R.guardLate=await pg.evaluate(()=>{const B=__bd,R=B.RAID;B.adv(1.5);B.p.x=B.dummy.x-120;B.p.invT=0;B.p.hp=100;B.p.guardCD=0;B.startPat('cleave');B.adv(1.2);return{hp:B.p.hp};});
// 4. just evade: dash into the gray sweep -> world slows, the player does not
R.just=await pg.evaluate(()=>{const B=__bd,R=B.RAID;B.adv(1.6);B.p.x=B.dummy.x-150;B.p.f=1;B.p.invT=0;B.p.hp=100;B.p.hurtT=0;B.startPat('sweep');B.adv(1.02);B.startAct('DASH');B.adv(.06);
  const wt=R.wt,hp=B.p.hp,t0=R.t;B.adv(.5);return{wt:+wt.toFixed(2),hp,bossT:+(R.t-t0).toFixed(3)};});
await shot('just');
R.justDmg=await pg.evaluate(()=>{const B=__bd,R=B.RAID,h0=R.hp;B.p.x=B.dummy.x-70;B.p.f=1;B.startAct('S_RISE');B.adv(.5);return Math.round(h0-R.hp);});
// 5. break: empty the gauge -> long groggy, combos land, ending the combo does not end it
R.brk=await pg.evaluate(()=>{const B=__bd,R=B.RAID;B.adv(3);R.wt=0;document.body.classList.remove('wt');R.ai='idle';R.pat=null;R.cd=99;R.brk=.5;B.p.x=B.dummy.x-70;B.p.f=1;B.press('attack');B.adv(.2);return{grog:R.grog,gk:R.gk,gT:+R.gT.toFixed(1)};});
await pg.evaluate(()=>__bd.adv(.6));await shot('break');
// bot combo inside the break window, measure damage
R.brkCombo=await pg.evaluate(()=>{const B=__bd,R=B.RAID,h0=R.hp;let maxc=0,ends=0,last=0;
  for(let i=0;i<120&&R.grog;i++){B.p.f=B.dummy.x>=B.p.x?1:-1;if(Math.abs(B.dummy.x-B.p.x)>120)B.p.x=B.dummy.x-B.p.f*70;
    if(i%10===2)B.press('s1');else if(i%10===6)B.press('s0');else if(i%13===9)B.press('s2');else if(i%7===3)B.press('jump');else B.press('attack');B.adv(.1);maxc=Math.max(maxc,B.combo.n);}
  return{dmg:Math.round(h0-R.hp),maxCombo:maxc,grogAfter:R.grog,brkRefill:R.brk};});
await shot('after_break');
// 6. armored DPS for tuning: 20 s of plain attacking with i-frames on
R.armorDps=await pg.evaluate(()=>{const B=__bd,R=B.RAID;R.cd=99;R.ai='idle';R.pat=null;const h0=R.hp,b0=R.brk;let n=0;
  for(let i=0;i<200;i++){B.p.invT=9;B.p.f=B.dummy.x>=B.p.x?1:-1;if(Math.abs(B.dummy.x-B.p.x)>110)B.p.x=B.dummy.x-B.p.f*70;if(i%10===2)B.press('s1');else B.press('attack');B.adv(.1);if(R.grog){n++;break;}}
  return{dmg:Math.round(h0-R.hp),brkUsed:+(b0-R.brk).toFixed(1),broke:n};});
// 7. a real unattended fight: boss AI on, bot attacks and dashes, checks no errors and the boss uses every pattern
R.soak=await pg.evaluate(()=>{const B=__bd,R=B.RAID;B.raidBegin();B.adv(1.7);const seen={};let hits=0;
  for(let i=0;i<1200&&!B.p.dead;i++){B.p.f=B.dummy.x>=B.p.x?1:-1;if(R.pat)seen[R.pat]=1;if(i%3===0)B.press('attack');if(i%37===0)B.press('dash');if(i%29===5)B.press('s0');B.p.hp=Math.max(B.p.hp,40);B.adv(.1);}
  return{seen:Object.keys(seen).sort().join(),hp:Math.round(R.hp),t:Math.round(R.time)};});
// 8. boss defeat and player death panels
R.win=await pg.evaluate(()=>{const B=__bd,R=B.RAID;R.grog=1;R.gk='break';R.gT=5;R.hp=5;B.p.x=B.dummy.x-70;B.p.f=1;B.p.invT=9;B.press('attack');B.adv(.3);const dead=R.dead;for(let i=0;i<40;i++)B.adv(.1);return{dead,phase:R.phase,panel:document.getElementById('mRun').classList.contains('on')};});
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
