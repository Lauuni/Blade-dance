// 프로토타입 모드: 시작 화면 → 안내 → 연습 3번 → 본 스테이지 → 등급 → 보상 → 다음 판, 보스 실패, 시작 화면 복귀. 스크린샷 /tmp/run_*.png
const {chromium}=require('playwright');(async()=>{const b=await chromium.launch();const pg=await b.newPage({viewport:{width:1280,height:720}});
let errs=0;pg.on('pageerror',e=>{if(e.message){errs++;console.log('ERR',e.message,e.stack&&e.stack.split('\n')[1]);}});pg.on('console',m=>{if(m.type()==='error'){errs++;console.log('CONSOLE',m.text());}});
await pg.goto('file://'+process.cwd()+'/index.html');await pg.evaluate(()=>{localStorage.clear();localStorage.setItem('bd_loadout',JSON.stringify(['gale','rise','thunder']));});await pg.reload();await pg.waitForTimeout(400);
const shot=n=>pg.screenshot({path:'/tmp/run_'+n+'.png'});const R={};
const st=()=>pg.evaluate(()=>{const B=__bd,r=B.RUN;return{ph:r.phase,fl:r.floor,idx:r.idx,tries:r.tries,pts:Math.round(r.sc.pts),mult:+r.sc.mult.toFixed(2),lo:B.loadout.join(),panel:document.getElementById('mRun').classList.contains('on'),mods:r.mods.join()};});
// a simple bot combo: mash attack, use every skill, jump now and then
const fight=(sec)=>pg.evaluate((sec)=>{const B=__bd;B.p.x=B.dummy.x-80;B.p.f=1;for(let i=0;i<sec*10;i++){B.p.f=B.dummy.x>=B.p.x?1:-1;if(Math.abs(B.dummy.x-B.p.x)>150)B.p.x=B.dummy.x-B.p.f*80;
  if(i%9===4)B.press('s0');else if(i%9===7)B.press('s1');else if(i%13===10)B.press('s2');else if(i%11===6)B.press('jump');else B.press('attack');B.adv(.1);if(B.RUN.phase!=='practice'&&B.RUN.phase!=='stage')break;}},sec);
const idle=(sec)=>pg.evaluate((sec)=>{for(let i=0;i<sec*10;i++)__bd.adv(.1);},sec);
await shot('title');
await pg.keyboard.press('ArrowRight');R.titleToggle=await pg.evaluate(()=>document.querySelector('#modes .sel').dataset.mode);
await pg.keyboard.press('Enter');await pg.evaluate(()=>__bd.hold(true));await pg.waitForTimeout(200);
R.intro=await st();await shot('intro');
await pg.keyboard.press('Enter');R.practice=await st();
await fight(6);await idle(3);R.afterTry1=await st();await pg.evaluate(()=>__bd.adv(.02));await shot('practice');
await fight(3);await shot('playing');await idle(4);R.afterTry2=await st();
await pg.keyboard.press('Enter');R.skip=await st();await pg.evaluate(()=>__bd.adv(.3));await shot('ready');await idle(2);R.stage=await st();
R.locked=await pg.evaluate(()=>__bd.RUN.lock);
await fight(8);await idle(4);R.result=await st();R.score1=await pg.evaluate(()=>[__bd.RUN.lastScore,__bd.RUN.lastGrade]);await pg.waitForTimeout(450);await shot('result');
await pg.keyboard.press('Enter');R.pick=await st();await pg.waitForTimeout(100);await shot('pick');
R.cards=await pg.evaluate(()=>__bd.RUN.cards.map(c=>c.t+':'+c.id).join());
await pg.keyboard.press('Digit1');R.next=await st();await shot('intro2');
// stage 2 (timed): run it straight through
await pg.keyboard.press('Enter');await pg.keyboard.press('Enter');await idle(2);await fight(4);await shot('timed');await fight(30);await idle(4);R.result2=await st();
await pg.keyboard.press('Enter');await pg.keyboard.press('ArrowRight');await pg.keyboard.press('Enter');R.boss=await st();await pg.waitForTimeout(100);await shot('boss_intro');
// boss: do nothing useful -> one hit -> fail
await pg.keyboard.press('Enter');await pg.keyboard.press('Enter');await idle(2);await pg.evaluate(()=>{const B=__bd;B.p.x=B.dummy.x-70;B.p.f=1;B.press('attack');B.adv(.3);});await shot('boss');await idle(4);R.bossRes=await st();await pg.waitForTimeout(450);await shot('boss_fail');
await pg.keyboard.press('Enter');R.over=await st();await pg.waitForTimeout(100);await shot('over');
// full bag: swap flow
R.swap=await pg.evaluate(()=>{const B=__bd,r=B.RUN;B.loadout[0]='rise';B.loadout[1]='gale';B.loadout[2]='thunder';r.phase='pick';r.cards=[{t:'sk',id:'iai'}];r.ci=0;B.runPick(0);const ph=r.phase,n=r.cards.length;B.runPick(1);return{ph,n,lo:B.loadout.join(),after:r.phase};});
// back to the title: practice loadout is restored and nothing was saved
R.title=await pg.evaluate(()=>{const B=__bd;B.toTitle();return{on:B.RUN.on,lo:B.loadout.join(),saved:localStorage.getItem('bd_loadout'),start:!document.getElementById('start').classList.contains('hide'),run:document.body.classList.contains('run')};});
await pg.keyboard.press('ArrowRight');await pg.keyboard.press('Enter');R.practiceMode=await pg.evaluate(()=>({on:__bd.RUN.on,raid:__bd.RAID.on,hud:getComputedStyle(document.getElementById('runHud')).display,lo:__bd.loadout.join()}));
console.log(JSON.stringify(R));
const m=await b.newPage({viewport:{width:740,height:360},hasTouch:true,isMobile:true});m.on('pageerror',e=>{if(e.message){errs++;console.log('ERR mobile',e.message);}});
await m.goto('file://'+process.cwd()+'/index.html');await m.waitForTimeout(300);await m.screenshot({path:'/tmp/run_m_title.png'});await m.tap('#modes .mode[data-mode=run]');await m.waitForTimeout(300);await m.screenshot({path:'/tmp/run_m_intro.png'});
await m.tap('#runPanel .btn');await m.waitForTimeout(1600);await m.screenshot({path:'/tmp/run_m_play.png'});
console.log('errors',errs);await b.close();})();
