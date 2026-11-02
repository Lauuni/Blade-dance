const {chromium}=require('playwright');(async()=>{const b=await chromium.launch();const pg=await b.newPage({viewport:{width:1280,height:720}});
const errs=[];pg.on('pageerror',e=>errs.push(e.message+' '+(e.stack||'').split('\n')[1]));
await pg.goto('file://'+process.cwd()+'/index.html');await pg.evaluate(()=>localStorage.clear());await pg.reload();await pg.waitForTimeout(300);
await pg.evaluate(()=>__bd.begin());const ev=(f,a)=>pg.evaluate(f,a);
const res=await ev(()=>{__bd.hold(true);const out=[];const bad=o=>{for(const k in __bd.p.J){const v=__bd.p.J[k];if(!isFinite(v[0])||!isFinite(v[1]))return k;}return null;};
 for(const map of['dojo','field']){__bd.setMap(map);
 for(const a of Object.keys(__bd.ACT)){const p=__bd.p,d=__bd.dummy;p.x=0;p.y=a.startsWith('AA')?-200:0;p.ground=!a.startsWith('AA');p.vx=0;Object.assign(d,{x:120,y:0,vx:0,vy:0,air:false,state:'stand',rot:0,rv:0,frozen:false,iceT:0,heldT:0});
   if(a.startsWith('IDLE'))__bd.playFx(a);else __bd.startAct(a);
   for(let i=0;i<8;i++){__bd.adv(.45);const k=bad();if(k){out.push(map+":"+a+" NaN "+k);break;}}}
 __bd.playFx('!gust');__bd.adv(4);__bd.playFx('!birds');__bd.playFx('!swarm');__bd.adv(3);}
 return out;});
console.log(res.join('\n')||'all finite');console.log('ERR',errs.join('\n'));await b.close();})();
