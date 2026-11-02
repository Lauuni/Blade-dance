const {chromium}=require('playwright');(async()=>{const b=await chromium.launch();
const pg=await b.newPage({viewport:{width:844,height:390},isMobile:true,hasTouch:true,deviceScaleFactor:2});const errs=[];pg.on('pageerror',e=>errs.push(e.message));
await pg.goto('file://'+process.cwd()+'/index.html');await pg.evaluate(()=>{localStorage.clear()});await pg.reload();await pg.evaluate(()=>{__bd.begin();});await pg.waitForTimeout(500);
await pg.screenshot({path:'/tmp/mob1.png'});await pg.tap('#bMenu');await pg.waitForTimeout(300);await pg.screenshot({path:'/tmp/mob0.png'});await pg.tap('#bZoom');await pg.waitForTimeout(700);await pg.screenshot({path:'/tmp/mob2.png'});
await pg.tap('#bMenu');await pg.waitForTimeout(200);await pg.tap('#bSet');await pg.waitForTimeout(300);await pg.screenshot({path:'/tmp/mob3.png'});
console.log('ERR',errs.join());await b.close();})();
