const {chromium}=require('playwright');(async()=>{const b=await chromium.launch();const pg=await b.newPage({viewport:{width:1280,height:720}});
const errs=[];pg.on('pageerror',e=>errs.push(e.message));
await pg.goto('file://'+process.cwd()+'/index.html');await pg.evaluate(()=>localStorage.clear());await pg.reload();await pg.waitForTimeout(300);
await pg.keyboard.press('KeyX');await pg.waitForTimeout(300);
const grab=()=>pg.evaluate(()=>[...document.querySelectorAll('canvas.chv')].map(c=>c.toDataURL()));
await pg.keyboard.press('Comma');await pg.waitForTimeout(200);const a=await grab();
await pg.keyboard.press('KeyQ');await pg.waitForTimeout(2500);// wind and time move on
await pg.keyboard.press('Comma');await pg.waitForTimeout(200);const b2=await grab();
console.log('same on reopen',a[0]===b2[0],a[1]===b2[1]);
await pg.keyboard.press('ArrowRight');const t0=Date.now();await pg.keyboard.press('Space');const b3=await grab();
console.log('same right after confirm',b2[0]===b3[0],b2[1]===b3[1],await pg.evaluate(()=>document.querySelector('.chc.sel').dataset.ch+' tag:'+document.querySelector('.chc.sel .tag')?.textContent));
await pg.waitForFunction(()=>!document.querySelector('#mChar.on'));console.log('closed after ms',Date.now()-t0);
console.log('char',await pg.evaluate(()=>localStorage.getItem('bd_char')));
await pg.keyboard.press('Comma');await pg.waitForTimeout(200);const b4=await grab();console.log('same after switching',b2[0]===b4[0],b2[1]===b4[1]);
console.log('ERR',errs.join());await b.close();})();
