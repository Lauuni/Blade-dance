const {chromium}=require('playwright');(async()=>{const b=await chromium.launch();const pg=await b.newPage({viewport:{width:1280,height:720}});
const errs=[];pg.on('pageerror',e=>errs.push(e.message));pg.on('console',m=>{if(m.type()==='error')errs.push('console: '+m.text())});
await pg.goto('file://'+process.cwd()+'/index.html');await pg.evaluate(()=>localStorage.clear());await pg.reload();await pg.waitForTimeout(300);
await pg.keyboard.press('KeyX');await pg.waitForTimeout(300);
const st=()=>pg.evaluate(()=>({char:localStorage.getItem('bd_char'),map:localStorage.getItem('bd_map'),open:[...document.querySelectorAll('.modal.on')].map(e=>e.id),kf:[...document.querySelectorAll('.kf')].map(e=>e.dataset.ch||e.dataset.mp),x:__bd.p.x}));
await pg.keyboard.press('Comma');await pg.waitForTimeout(200);console.log('open char',await st());
await pg.screenshot({path:'/tmp/p_char.png'});
await pg.keyboard.press('ArrowRight');await pg.waitForTimeout(100);console.log('after →',await st());
await pg.keyboard.press('Space');await pg.waitForTimeout(500);console.log('after Space',await st());
await pg.keyboard.press('Comma');await pg.waitForTimeout(200);await pg.keyboard.press('ArrowLeft');await pg.keyboard.press('Enter');await pg.waitForTimeout(500);console.log('← Enter',await st());
await pg.keyboard.press('Comma');await pg.waitForTimeout(200);await pg.keyboard.press('ArrowRight');await pg.keyboard.press('KeyX');await pg.waitForTimeout(500);console.log('→ X',await st());
await pg.keyboard.press('KeyM');await pg.waitForTimeout(200);console.log('map open',await st());await pg.screenshot({path:'/tmp/p_map.png'});
await pg.keyboard.press('ArrowRight');await pg.keyboard.press('Space');await pg.waitForTimeout(500);console.log('map → Space',await st());
await pg.keyboard.press('Comma');await pg.waitForTimeout(150);await pg.keyboard.press('KeyQ');await pg.waitForTimeout(150);console.log('Q closes',await st());
// player did not move while choosing
const z=[];for(const k of ['KeyB','KeyB','KeyB','KeyV','KeyV']){await pg.keyboard.press(k);await pg.waitForTimeout(700);z.push(await pg.evaluate(()=>document.querySelector('#bZoom .zm').textContent));}
console.log('zoom cycle',z.join(' '));
await pg.keyboard.press('KeyB');await pg.keyboard.press('KeyB');await pg.waitForTimeout(800);await pg.screenshot({path:'/tmp/p_zin.png'});
console.log('ERR',errs.join('\n'));await b.close();})();
