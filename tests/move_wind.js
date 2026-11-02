const {chromium}=require('playwright');(async()=>{const b=await chromium.launch();const pg=await b.newPage();
const errs=[];pg.on('pageerror',e=>errs.push(e.message));
await pg.goto('file://'+process.cwd()+'/index.html');await pg.evaluate(()=>localStorage.clear());await pg.reload();await pg.waitForTimeout(300);
await pg.evaluate(()=>__bd.begin());
const r=await pg.evaluate(()=>{__bd.hold(true);const p=__bd.p,o=[];__bd.dummy.x=5000;
 // sprint then release -> brake slide; attack during it should be eaten
 p.x=-800;p.vx=0;__bd.setAx(1);__bd.dirPress(1);__bd.adv(.05);__bd.dirPress(1);__bd.adv(1.0);o.push('sprinting: '+p.sprint+' vx '+Math.round(p.vx));
 __bd.setAx(0);__bd.adv(1/60);__bd.adv(1/60);o.push('stopT '+(p.stopT||0).toFixed(2));__bd.press('attack');__bd.adv(.05);o.push('act during brake: '+(p.act?p.act.def.name:'none'));
 __bd.adv(.4);__bd.press('attack');__bd.adv(.05);o.push('act after brake: '+(p.act?p.act.def.name:'none'));__bd.adv(1);
 // walk then release -> no brake
 __bd.setAx(1);__bd.adv(.8);__bd.setAx(0);__bd.adv(1/60);o.push('walk stop stopT '+(p.stopT||0).toFixed(2));__bd.press('attack');__bd.adv(.05);o.push('walk->attack: '+(p.act?p.act.def.name:'none'));__bd.adv(1);
 // sprint attack then keep holding -> walking speed
 __bd.setAx(1);__bd.dirPress(1);__bd.adv(.05);__bd.dirPress(1);__bd.adv(.8);__bd.press('attack');__bd.adv(.9);o.push('after SA holding dir: sprint '+p.sprint+' vx '+Math.round(p.vx));__bd.setAx(0);
 // wind off
 __bd.CFG();return o;});
console.log(r.join('\n'));
const w=await pg.evaluate(()=>{localStorage.setItem('bd_game',JSON.stringify({wind:0}));return 1});
await pg.reload();await pg.waitForTimeout(300);await pg.evaluate(()=>__bd.begin());
const w2=await pg.evaluate(()=>{__bd.hold(true);let any=0;for(let i=0;i<120;i++){__bd.adv(.5);if(__bd.GUST.a)any++;}return any;});
console.log('wind off: gust active samples over 60s =',w2);console.log('ERR',errs.join('\n'));await b.close();})();
