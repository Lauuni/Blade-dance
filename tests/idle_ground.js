const {chromium}=require('playwright');(async()=>{const b=await chromium.launch();const pg=await b.newPage();
await pg.goto('file://'+process.cwd()+'/index.html');await pg.evaluate(()=>localStorage.clear());await pg.reload();await pg.waitForTimeout(300);
await pg.evaluate(()=>__bd.begin());
const r=await pg.evaluate(()=>{__bd.hold(true);const p=__bd.p;p.lastCombat=-99;let mn=1e9,mx=-1e9;for(let i=0;i<300;i++){__bd.adv(1/30);const f=Math.max(p.J.aF[1],p.J.tF[1],p.J.aB[1],p.J.tB[1]);mn=Math.min(mn,f);mx=Math.max(mx,f);}
 p.lastCombat=performance.now()/1e9;let mn2=1e9,mx2=-1e9;return [mn.toFixed(2),mx.toFixed(2)];});
console.log('lowest foot point over 10s idle (0 = ground):',r);await b.close();})();
