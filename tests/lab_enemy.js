// lab.html (적 체험판): 적이 다가와 때리는지, 회피·버팀·격파·쓰러짐·다시 시작이 되는지. 스크린샷 /tmp/lab_*.png
const {chromium}=require('playwright');(async()=>{const b=await chromium.launch();const pg=await b.newPage({viewport:{width:1280,height:720}});
let errs=0;pg.on('pageerror',e=>{errs++;console.log('ERR',e.message,e.stack&&e.stack.split('\n')[1]);});pg.on('console',m=>{if(m.type()==='error'){errs++;console.log('CONSOLE',m.text());}});
await pg.goto('file://'+process.cwd()+'/lab.html');await pg.evaluate(()=>localStorage.clear());await pg.reload();await pg.waitForTimeout(300);
await pg.evaluate(()=>{__bd.begin();__bd.hold(true);__bd.adv(.2);});
const fin=()=>pg.evaluate(()=>{const J=__bd.EN.J;if(!J)return true;for(const k in J)if(!isFinite(J[k][0])||!isFinite(J[k][1]))return k;return true;});
const shot=n=>pg.screenshot({path:'/tmp/lab_'+n+'.png'});
const R={};
// 1. left alone, the enemy walks up and hits
R.approach=await pg.evaluate(()=>{const B=__bd,x0=B.dummy.x;let hit=-1;for(let i=0;i<60&&hit<0;i++){B.adv(.1);if(B.p.hp<100)hit=i/10;}return{moved:Math.abs(B.dummy.x-x0)>50,hitAt:hit,hp:B.p.hp};});
R.finite1=await fin();
// 2. dash i-frames dodge, invulnerable right after a hit
R.dodge=await pg.evaluate(()=>{const B=__bd;B.labReset();B.adv(.7);B.p.invT=0;const h0=B.p.hp;B.startAct('DASH');B.adv(.05);const r=B.labHurt(14,1,300,false);return{blocked:r===false,same:B.p.hp===h0};});
R.inv=await pg.evaluate(()=>{const B=__bd;B.adv(.6);B.p.invT=0;const a=B.labHurt(14,1,300,false),b=B.labHurt(14,1,300,false);return{first:a,second:b,hp:B.p.hp,stag:B.p.hurtT>0};});
await pg.evaluate(()=>__bd.adv(.12));await shot('hurt');
// 3. telegraphs
const stage=async(kind,t)=>pg.evaluate(([kind,t])=>{const B=__bd;B.labReset();B.adv(.8);B.p.x=-60;B.p.vx=0;B.dummy.x=70;B.dummy.vx=0;B.EN.f=-1;B.EN.cd=9;B.adv(.1);B.labAtk(kind);B.adv(t);return{ai:B.EN.ai,armor:B.EN.armor};},[kind,t]);
R.windSlash=await stage('slash',.4);await shot('wind_slash');
await pg.evaluate(()=>__bd.adv(.16));await shot('strike_slash');
R.windLunge=await stage('lunge',.7);await shot('wind_lunge');
// 4. armour: a hit during the lunge wind-up does damage but does not stagger
R.armor=await pg.evaluate(()=>{const B=__bd,h0=B.EN.hp;B.p.invT=9;B.startAct('A1');B.adv(.12);return{dmg:h0-B.EN.hp>0,state:B.dummy.state,ai:B.EN.ai};});
R.finite2=await fin();
await pg.evaluate(()=>__bd.adv(.25));await shot('strike_lunge');
// 5. a hit interrupts the slash wind-up
R.interrupt=await pg.evaluate(()=>{const B=__bd;B.labReset();B.adv(.8);B.p.x=-60;B.p.vx=0;B.dummy.x=40;B.EN.cd=9;B.adv(.1);B.labAtk('slash');B.adv(.2);B.p.invT=9;B.startAct('A1');B.adv(.14);return{state:B.dummy.state,ai:B.EN.ai};});
// 6. launcher: body in the air and on the ground
await pg.evaluate(()=>{const B=__bd;B.adv(1);B.p.x=B.dummy.x-70;B.p.f=1;B.EN.cd=9;B.p.invT=9;B.startAct('A4');B.adv(.5);});await shot('air');R.finite3=await fin();
await pg.evaluate(()=>__bd.adv(1.0));await shot('down');
// 7. kill -> next enemy, stronger; heal
R.kill=await pg.evaluate(()=>{const B=__bd;B.labReset();B.adv(1.2);B.p.hp=50;B.p.x=B.dummy.x-70;B.p.f=1;B.EN.cd=9;B.EN.hp=5;B.p.invT=9;B.startAct('A1');B.adv(.14);const dead=B.EN.dead,hp=B.p.hp;B.adv(.4);const hitDead=B.EN.dead;B.adv(2.6);return{dead,heal:hp,lv:B.EN.lv,max:B.EN.max,alive:!B.EN.dead&&!B.EN.gone,state:B.dummy.state};});
await pg.evaluate(()=>__bd.adv(.4));await shot('next');
// 8. player falls -> the fight restarts from the first enemy
R.death=await pg.evaluate(()=>{const B=__bd;B.p.invT=0;B.p.hp=5;B.labHurt(14,1,300,false);const dead=B.p.dead;B.adv(.5);return{dead};});await shot('dead');
R.restart=await pg.evaluate(()=>{const B=__bd;for(let i=0;i<40;i++)B.adv(.1);return{hp:B.p.hp,dead:B.p.dead,lv:B.EN.lv};});
R.finite4=await fin();
// 9. a long unattended fight never throws
R.soak=await pg.evaluate(()=>{const B=__bd;for(let i=0;i<300;i++){if(i%7===0)B.press('attack');if(i%23===0)B.press('dash');B.adv(.1);}return{hp:B.p.hp,lv:B.EN.lv};});
console.log(JSON.stringify(R,null,1));
// mobile: not broken
const m=await b.newPage({viewport:{width:740,height:360},hasTouch:true,isMobile:true});m.on('pageerror',e=>{errs++;console.log('ERR mobile',e.message);});
await m.goto('file://'+process.cwd()+'/lab.html');await m.evaluate(()=>{__bd.begin();});await m.waitForTimeout(600);await m.screenshot({path:'/tmp/lab_mobile.png'});
console.log('errors',errs);await b.close();})();
