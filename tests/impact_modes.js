const {chromium}=require('playwright');(async()=>{const b=await chromium.launch();const pg=await b.newPage({viewport:{width:1280,height:720}});
const errs=[];pg.on('pageerror',e=>errs.push(e.message));
await pg.goto('file://'+process.cwd()+'/index.html');
for(const m of ['soft','full','off']){
await pg.evaluate(m=>{localStorage.clear();localStorage.setItem('bd_game',JSON.stringify({impact:m}))},m);await pg.reload();await pg.waitForTimeout(300);
await pg.evaluate(()=>__bd.begin());await pg.waitForTimeout(200);
for(const [act,dx] of [['A4',110],['S_IAI',170],['S_THUNDER',140]]){
  await pg.evaluate(([a,dx])=>{__bd.hold(true);__bd.p.x=0;__bd.p.y=0;__bd.dummy.x=dx;__bd.adv(1.2);__bd.startAct(a);},[act,dx]);
  let got=null;for(let i=0;i<400;i++){const r=await pg.evaluate(()=>{__bd.adv(1/120);return [__bd.impT,__bd.hitstop];});if(r[0]>0||(act==='A4'&&r[1]>0.1)){got=r;break;}}
  await pg.evaluate(()=>__bd.adv(1/120));
  await pg.screenshot({path:`/tmp/im_${m}_${act}.png`});console.log(m,act,JSON.stringify(got));}}
console.log('ERR',errs.join());await b.close();})();
